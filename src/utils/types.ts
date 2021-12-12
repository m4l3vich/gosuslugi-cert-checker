import { parse, startOfDay } from 'date-fns'

export enum EpguCertificateType {
  VACCINE_CERT = 'VACCINE_CERT',
  ILLNESS_FACT = 'ILLNESS_FACT',
  TEMPORARY_CERT = 'TEMPORARY_CERT',
  COVID_TEST = 'COVID_TEST'
}

// EpguDate (01.01.1970)
export type EpguDate = string
export function isEpguDate (str: string): str is EpguDate {
  const date = parse(str, 'dd.MM.yyyy', new Date())
  return !isNaN(date.getTime())
}

export function parseEpguDate (date: EpguDate): Date {
  return parse(date, 'dd.MM.yyyy', startOfDay(new Date()))
}

// UNRZ (15/16 chars)
export type UnrzFull = string

export function isUnrzFull (str: string): str is UnrzFull {
  if (isNaN(Number(str))) return false
  if (str.length !== 16) return false
  return true
}

// UUID
export type Uuid = string
export function isUuid (str: string): str is Uuid {
  return /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89abAB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}$/.test(str)
}

// Hash (MD5 hex)
export type CertHash = string
export function isCertHash (str: string): str is CertHash {
  return str.length === 32 && /^[0123456789abcdef]{32}$/.test(str)
}
