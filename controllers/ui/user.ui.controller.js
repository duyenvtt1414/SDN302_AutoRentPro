import { USER_ROLES } from '../../models/User.js';
import { listUsers, createUser as createUserSvc } from '../../services/userService.js';

export async function renderUserList(req, res) {
  const users = await listUsers();
  res.render('users/list', { title: 'User Management', users });
}

export function renderUserNew(req, res) {
  res.render('users/new', { title: 'Add new user', roles: Object.values(USER_ROLES) });
}

export async function createUser(req, res) {
  try {
    const { fullName, email, phone, role } = req.body;
    await createUserSvc({ fullName, email, phone, role });
    return res.redirect('/ui/users');
  } catch (err) {
    return res.status(400).render('users/new', {
      title: 'Add new user',
      roles: Object.values(USER_ROLES),
      error: err.message,
      form: req.body,
    });
  }
}
