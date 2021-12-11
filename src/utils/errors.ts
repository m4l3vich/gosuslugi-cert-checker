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
