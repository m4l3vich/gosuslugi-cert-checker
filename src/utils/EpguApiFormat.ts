import { EpguCertificateType, EpguDate, UnrzFull } from './types.js'

export interface IResponseV1 {
  unrz: UnrzFull,
  fio: string,
  enFio: string,
  birthdate: EpguDate,
  doc: string,
  enDoc: string,
  stuff: string,
  enStuff: string,
  singlePhase: 'N' | 'Y',
  vcSeries: string,
  qr: string,
  lastName: string,
  expiredAt: EpguDate,
  status: '1' | '0',
  en: boolean
}

interface AttrV2 {
  type: 'fio' | 'birthDate' | 'passport' | 'date',
  title: string,
  entitle: string,
  envalue: string,
  value: string,
  order: number
}

export type falsyStatus = '0' | '3' | 'CANCELLED' | 'EXPIRED' | '404' | 'Положительный'
export type truthyStatus = '1' | 'OK' | 'Отрицательный'

export function statusStrToBool (str: string) {
  if (str === '1') return true
  if (str === 'OK') return true
  if (str === 'Отрицательный') return true

  if (str === '0') return false
  if (str === '3') return false
  if (str === 'CANCELLED') return false
  if (str === 'EXPIRED') return false
  if (str === '404') return false
  if (str === 'Положительный') return false

  console.warn(`Unknown cert status: ${str}; assuming status is falsy`)
  return false
}

export interface IResponseV2 {
  items: [{
    type: EpguCertificateType,
    unrz: string,
    unrzFull: UnrzFull,
    attrs: AttrV2[],
    title: string,
    entitle: string,
    qr: string,
    status: falsyStatus | truthyStatus,
    order: number,
    expiredAt: EpguDate,
    serviceUnavailable: boolean
  }],
  hasNext: boolean
}

interface AttrV3 {
  type: 'fio' | 'birthDate' | 'passport',
  title: string,
  entitle: string,
  envalue: string,
  value: string,
  order: number
}

export interface IResponseV3 {
  certId: UnrzFull,
  title: string,
  entitle: string,
  expiredAt: EpguDate,
  validFrom: EpguDate,
  isExpired: boolean,
  isBeforeValidFrom: boolean,
  attrs: AttrV3[],
  isCertFound: boolean,
  serviceUnavailable: boolean
}

export function getAttribute<T extends AttrV2 | AttrV3> (attrs: T[], type: string): T | undefined {
  return attrs.find(attr => attr.type === type)
}
