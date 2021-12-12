import { isPast } from 'date-fns'
import { fetchCertificateV1, fetchCertificateV2, fetchCertificateV3 } from './EpguApi.js'
import { parseUrl } from './UrlParser.js'
import { IParametersV1, IParametersV2, IParametersV3 } from './utils/EpguApiParameters.js'
import { EpguCertificateType, UnrzFull } from './utils/types.js'

export interface ICertificateFields {
  type?: EpguCertificateType,
  certId: UnrzFull,
  expiration: Date,
  birthdate: Date,
  passport: string,
  status: boolean,
  name: {
    ru: string,
    en: string
  }
}

export class EpguCertificate implements ICertificateFields {
  public type?: EpguCertificateType
  public certId: UnrzFull
  public expiration: Date
  public birthdate: Date
  public passport: string
  public status: boolean
  public name: {
    ru: string,
    en: string
  }

  static async fetch (url: string): Promise<EpguCertificate> {
    const parsed = parseUrl(url)

    switch (parsed.version) {
      case 1: return fetchCertificateV1(parsed.params as IParametersV1)
      case 2: return fetchCertificateV2(parsed.params as IParametersV2)
      case 3: return fetchCertificateV3(parsed.params as IParametersV3)
    }
  }

  constructor (params: ICertificateFields) {
    this.type = params.type
    this.certId = params.certId
    this.expiration = params.expiration
    this.birthdate = params.birthdate
    this.passport = params.passport
    this.status = params.status
    this.name = params.name
  }

  get expired (): boolean {
    return isPast(this.expiration)
  }
}
