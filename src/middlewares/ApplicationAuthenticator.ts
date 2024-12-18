/* eslint-disable no-unused-vars */
import { ApplicationRepository } from '../repositories/ApplicationRepository'

export default interface ApplicationAuthenticator {
  authenticated(): object
  authorize(repositoryInstance: ApplicationRepository): object
}
