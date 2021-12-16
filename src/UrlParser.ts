import assert from 'assert'
import { CERT_URL_ORIGIN, V1_PATH_START, V2_PATH_START, V3_PATH_START } from './utils/constants.js'
import { IParametersV1, IParametersV2, IParametersV3, isParamsV1Valid, isParamsV2Valid, isParamsV3Valid } from './utils/EpguApiParameters.js'
import { InvalidUrlError, UrlErrCode } from './utils/errors.js'
import { CertHash } from './utils/types.js'

export interface IParsedUrl {
  version: 1 | 2 | 3,
  params: IParametersV1 | IParametersV2 | IParametersV3
}

export function checkUrl (url: string): boolean {
  try {
    parseUrl(url)
    return true
  } catch (e) {
    return false
  }
}

export function parseUrl (url: string): IParsedUrl {
  let urlObj: URL

  // Check URL validity and parse if valid
  try {
    urlObj = new URL(url)
  } catch (e) {
    throw new InvalidUrlError(UrlErrCode.MalformedUrl)
  }

  // Check URL origin
  assert(
    urlObj.origin === CERT_URL_ORIGIN,
    new InvalidUrlError(UrlErrCode.InvalidOrigin)
  )

  // Check URL version by path
  const pathParts = urlObj.pathname.split('/')
  const filename = pathParts.pop()
  const urlWithoutFilename = pathParts.join('/')

  if (!filename) throw new InvalidUrlError(UrlErrCode.InvalidParameters)

  let version: 1 | 2 | 3
  let params: IParametersV1 | IParametersV2 | IParametersV3
  switch (urlWithoutFilename) {
    case V1_PATH_START: {
      version = 1

      params = { uuid: filename }
      assert(
        isParamsV1Valid(params),
        new InvalidUrlError(UrlErrCode.InvalidParameters)
      )
      break
    }

    case V2_PATH_START: {
      version = 2

      const ckParam = urlObj.searchParams.get('ck')
      if (!ckParam) throw new InvalidUrlError(UrlErrCode.InvalidParameters)

      params = { unrz: filename, hash: ckParam as CertHash }
      assert(
        isParamsV2Valid(params),
        new InvalidUrlError(UrlErrCode.InvalidParameters)
      )
      break
    }

    case V3_PATH_START: {
      version = 3

      params = { uuid: filename }
      assert(
        isParamsV3Valid(params),
        new InvalidUrlError(UrlErrCode.InvalidParameters)
      )
      break
    }

    default: throw new InvalidUrlError(UrlErrCode.InvalidPath)
  }

  return { version, params }
}
