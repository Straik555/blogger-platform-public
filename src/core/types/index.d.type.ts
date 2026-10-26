declare global {
  namespace Express {
    interface User {}
    interface Request {
      user?: User;
    }
  }
}
