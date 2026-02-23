export function requireUiAuth(req, res, next) {
  // Cho phép vào login/signup/logout
  if (req.path === '/login' || req.path === '/signup' || req.path === '/logout') {
    return next();
  }

  if (!req.session?.user) {
    return res.redirect('/ui/login');
  }
  
  // để navbar hiển thị user
  res.locals.currentUser = req.session.user;
  next();
}
