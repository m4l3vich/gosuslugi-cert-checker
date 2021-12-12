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

export interface IResponseV2 {
  items: [{
    type: EpguCertificateType,
    unrz: string,
    unrzFull: UnrzFull,
    attrs: AttrV2[],
    title: string,
    entitle: string,
    qr: string,
    status: '1' | '0',
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
