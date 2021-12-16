import { UnrzFull, Uuid } from './types.js'

// EPGU API errors
export class CertNotFoundError extends Error {
  constructor (certId: UnrzFull | Uuid) {
    super(`Certificate not found: ${certId}`)
    Object.setPrototypeOf(this, CertNotFoundError.prototype)
  }
}

export class EpguApiInternalError extends Error {
  constructor (status: number, text: string) {
    super(`Gosuslugi API error: ${status} ${text}`)
    Object.setPrototypeOf(this, EpguApiInternalError.prototype)
  }
}

// URL parser errors
export enum UrlErrCode {
  MalformedUrl,
  InvalidOrigin,
  InvalidPath,
  InvalidParameters
}

export const urlErrString = [
  'Malformed URL',
  'Invalid URL origin',
  'Invalid URL path',
  'Invalid certificate parameters'
]

export class InvalidUrlError extends Error {
  constructor (code: UrlErrCode) {
    super(`Error while parsing URL: ${urlErrString[code]}`)
    Object.setPrototypeOf(this, InvalidUrlError.prototype)
  }
}
