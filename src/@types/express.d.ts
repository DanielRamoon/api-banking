import ApplicationUser from '../entities/ApplicationUser'

declare global {
  namespace Express {
    interface Request {
      user: ApplicationUser
    }
  }
}
