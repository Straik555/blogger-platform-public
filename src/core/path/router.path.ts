export const ROUTER_PATH = {
  common: '/',
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    registration: '/auth/registration',
    registrationConfirmation: '/auth/registration-confirmation',
    registrationEmailResending: '/auth/registration-email-resending',
    refreshToken: '/auth/refresh-token',
    logout: '/auth/logout',
    passwordRecovery: '/auth/password-recovery',
    newPassword: '/auth/new-password',
  },
  users: '/users',
  blogs: '/blogs',
  posts: '/posts',
  comments: '/comments',
  likeStatus: '/like-status',
  sa: '/sa',
  security: {
    devices: '/security/devices',
  },
  testing: '/testing/all-data',
};
