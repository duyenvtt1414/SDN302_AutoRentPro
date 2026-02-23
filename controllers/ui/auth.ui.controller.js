import bcrypt from 'bcryptjs';
import { UserModel } from '../../models/User.js';

export function renderLogin(req, res) {
  if (req.session?.user) return res.redirect('/ui');
  return res.render('auth/login', { title: 'Login' });
}

export function renderSignUp(req, res) {
  if (req.session?.user) return res.redirect('/ui');
  return res.render('auth/signup', { title: 'Sign Up' });
}

function isBcryptHash(value) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

export async function handleLogin(req, res) {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res
        .status(400)
        .render('auth/login', { title: 'Login', error: 'Vui lòng nhập email và mật khẩu.' });
    }

    const HARD_EMAIL = 'admin@gmail.com';
    const HARD_PASSWORD = '123456';

    if (email === HARD_EMAIL && password === HARD_PASSWORD) {
      req.session.user = {
        email: HARD_EMAIL,
        name: 'Admin',
        role: 'ADMIN',
        type: 'HARDCODE',
      };
      return res.redirect('/ui');
    }

    const user = await UserModel.findOne({ email }).lean();
    if (!user) {
      return res
        .status(400)
        .render('auth/login', { title: 'Login', error: 'Email không tồn tại.' });
    }

    if (!user.password) {
      return res.status(400).render('auth/login', {
        title: 'Login',
        error: 'Tài khoản này chưa có mật khẩu.',
      });
    }

    let ok = false;
    if (isBcryptHash(user.password)) {
      ok = await bcrypt.compare(password, user.password);
    } else {
      ok = user.password === password;
    }

    if (!ok) {
      return res
        .status(400)
        .render('auth/login', { title: 'Login', error: 'Sai mật khẩu.' });
    }

    req.session.user = {
      _id: user._id,
      email: user.email,
      name: user.name || user.fullName || user.email,
      role: user.role,
      type: 'DB',
    };

    return res.redirect('/ui');
  } catch (err) {
    return res.status(500).render('auth/login', {
      title: 'Login',
      error: err.message,
    });
  }
}

export async function handleSignUp(req, res) {
  try {
    const fullName = (req.body.fullName || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const phone = (req.body.phone || '').trim();
    const password = String(req.body.password || '');
    const confirmPassword = String(req.body.confirmPassword || '');

    // Validation
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      return res
        .status(400)
        .render('auth/signup', { title: 'Sign Up', error: 'Vui lòng điền tất cả các trường.', form: req.body });
    }

    if (fullName.length < 2) {
      return res
        .status(400)
        .render('auth/signup', { title: 'Sign Up', error: 'Tên phải có ít nhất 2 ký tự.', form: req.body });
    }

    if (!email.includes('@')) {
      return res
        .status(400)
        .render('auth/signup', { title: 'Sign Up', error: 'Email không hợp lệ.', form: req.body });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .render('auth/signup', { title: 'Sign Up', error: 'Mật khẩu phải có ít nhất 6 ký tự.', form: req.body });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .render('auth/signup', { title: 'Sign Up', error: 'Mật khẩu không khớp.', form: req.body });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email }).lean();
    if (existingUser) {
      return res
        .status(400)
        .render('auth/signup', { title: 'Sign Up', error: 'Email đã tồn tại trong hệ thống.', form: req.body });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: 'CUSTOMER',
    });

    await newUser.save();

    // Auto login after signup
    req.session.user = {
      _id: newUser._id,
      email: newUser.email,
      name: newUser.fullName,
      role: newUser.role,
      type: 'DB',
    };

    return res.redirect('/ui');
  } catch (err) {
    return res.status(500).render('auth/signup', {
      title: 'Sign Up',
      error: err.message,
      form: req.body,
    });
  }
}

export function handleLogout(req, res) {
  req.session.destroy(() => {
    res.redirect('/ui/login');
  });
}
