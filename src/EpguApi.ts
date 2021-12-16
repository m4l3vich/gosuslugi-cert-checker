import axios from 'axios'
import { EpguCertificate } from './Certificate.js'
import { V1_API_URL, V2_API_URL, V3_API_URL } from './utils/constants.js'
import { getAttribute, IResponseV1, IResponseV2, IResponseV3 } from './utils/EpguApiFormat.js'
import { IParametersV1, IParametersV2, IParametersV3 } from './utils/EpguApiParameters.js'
import { CertNotFoundError, EpguApiInternalError } from './utils/errors.js'
import { parseEpguDate } from './utils/types.js'

export async function fetchCertificateV1 (params: IParametersV1): Promise<EpguCertificate> {
  const url = new URL(encodeURIComponent(params.uuid), V1_API_URL)

  const resp = await axios(url.toString())
  if (resp.status > 200 && resp.status < 500) throw new CertNotFoundError(params.uuid)
  if (resp.status >= 500) throw new EpguApiInternalError(resp.status, resp.statusText)

  const json = await resp.data as IResponseV1

  return new EpguCertificate({
    certId: json.unrz,
    expiration: parseEpguDate(json.expiredAt),
    birthdate: parseEpguDate(json.birthdate),
    passport: json.doc,
    status: json.status === '1',
    name: {
      ru: json.fio,
      en: json.enFio
    }
  })
}

export async function fetchCertificateV2 (params: IParametersV2): Promise<EpguCertificate> {
  const url = new URL(encodeURIComponent(params.unrz), V2_API_URL)
  url.searchParams.set('ck', encodeURIComponent(params.hash))
  url.searchParams.set('lang', 'ru')

  const resp = await axios(url.toString())
  if (resp.status > 200 && resp.status < 500) throw new CertNotFoundError(params.unrz)
  if (resp.status >= 500) throw new EpguApiInternalError(resp.status, resp.statusText)

  const json = await resp.data as IResponseV2

  const cert = json.items[0]

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const birthdate = getAttribute(cert.attrs, 'birthDate')!.value
  const passport = getAttribute(cert.attrs, 'passport')!.value
  const fio = getAttribute(cert.attrs, 'fio')!
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  return new EpguCertificate({
    type: cert.type,
    certId: cert.unrzFull,
    expiration: parseEpguDate(cert.expiredAt),
    birthdate: parseEpguDate(birthdate),
    passport,
    status: cert.status === '1' || cert.status === 'Отрицательный',
    name: {
      ru: fio.value,
      en: fio.envalue
    }
  })
}

export async function fetchCertificateV3 (params: IParametersV3): Promise<EpguCertificate> {
  const url = new URL(encodeURIComponent(params.uuid), V3_API_URL)

  const resp = await axios(url.toString())
  if (resp.status > 200 && resp.status < 500) throw new CertNotFoundError(params.uuid)
  if (resp.status >= 500) throw new EpguApiInternalError(resp.status, resp.statusText)

  const json = await resp.data as IResponseV3
  if (!json.isCertFound) throw new CertNotFoundError(params.uuid)

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const birthdate = getAttribute(json.attrs, 'birthDate')!.value
  const passport = getAttribute(json.attrs, 'passport')!.value
  const fio = getAttribute(json.attrs, 'fio')!
  /* eslint-enable @typescript-eslint/no-non-null-assertion */

  return new EpguCertificate({
    certId: json.certId,
    expiration: parseEpguDate(json.expiredAt),
    birthdate: parseEpguDate(birthdate),
    passport,
    status: !json.isExpired && !json.isBeforeValidFrom,
    name: {
      ru: fio.value,
      en: fio.envalue
    }
  })
}
