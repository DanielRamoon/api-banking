import path from 'node:path'

// Password regex pattern
export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

//
export const USER_TYPES = ['User', 'Admin', 'CompanyUser']
export const ALLOWED_USER_TYPES = ['user', 'admin', 'company_user']

// PIX
export const PHONE = 'phone'
export const EMAIL = 'email'
export const MAX_EMAIL_LENGTH = 77
export const POSSIBLE_PIX_TYPES = [PHONE, EMAIL, 'national_registration', 'evp']

//
export const NAME_MIN_LENGTH = 5

//
export const EMAIL_REGEX =
  // eslint-disable-next-line max-len
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

//
export const DATE_REGEX = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/

// Phone regexes
export const PIX_PHONE_REGEX = /^\+\d{13}$/
export const PHONE_PREFIX_REGEX = /^[1-9]{2}$/
export const PHONE_REGEX = /^9?[0-9]{4}-?[0-9]{4}$/

//
export const CURRENCY_LENGTH = 3

//
export const POSTAL_CODE_REGEX = /[0-9]{5}-?[0-9]{3}$/

//
export const RG_REGEX = /(^\d{1,2}).?(\d{3}).?(\d{3})-?(\d{1}|X|x$)/

// JWT
export const JWT_TOKEN_REGEX = /^[\w-]+\.[\w-]+\.[\w-]+$/

//
export const UUID_REGEX =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/

// Image regex patterns
export const BASE64_IMAGE_REGEX = /^data:([A-Za-z-+/]+);base64,(.+)$/

export const TMP_FOLDER_PATH = path.resolve(__dirname, '..', '..', 'tmp')
export const POSSIBLE_IMAGE_FORMATS = ['image/jpeg', 'image/png']
export const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const MIME_EXTENSIONS = [
  { mimeType: 'application/pdf', extension: '.pdf' },
  { mimeType: 'application/msword', extension: '.doc' },
  {
    mimeType:
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: '.docx'
  },
  { mimeType: 'application/vnd.ms-excel', extension: '.xls' },
  {
    mimeType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: '.xlsx'
  },
  { mimeType: 'text/plain', extension: '.txt' },
  { mimeType: 'image/jpeg', extension: '.jpg' },
  { mimeType: 'image/png', extension: '.png' },
  { mimeType: 'image/gif', extension: '.gif' },
  { mimeType: 'image/svg+xml', extension: '.svg' },
  { mimeType: 'audio/mpeg', extension: '.mp3' },
  { mimeType: 'video/mp4', extension: '.mp4' }
]

// Webhooks Events
export const PING = 'ping'
export const HOLDER_EVENTS = [
  'accreditation.holder.approved',
  'accreditation.holder.denied',
  'accreditation.holder.created',
  'accreditation.holder.approval_request',
  'accreditation.holder.updated'
]
export const OPERATION_CONFIRMED_EVENTS = [
  'received_transfer.operation.paid',
  'pix.credit.succeeded'
]
