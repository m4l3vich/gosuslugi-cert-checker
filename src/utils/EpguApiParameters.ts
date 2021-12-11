import { Uuid, UnrzFull, CertHash, isUuid, isUnrzFull, isCertHash } from './types.js'

export interface IParametersV1 {
  uuid: Uuid
}
export function isParamsV1Valid (obj: unknown): obj is IParametersV1 {
  return isUuid((obj as IParametersV1).uuid)
}

export interface IParametersV2 {
  unrz: UnrzFull,
  hash: CertHash
}
export function isParamsV2Valid (obj: unknown): obj is IParametersV2 {
  return isUnrzFull((obj as IParametersV2).unrz) && isCertHash((obj as IParametersV2).hash)
}

export interface IParametersV3 {
  uuid: Uuid
}
export function isParamsV3Valid (obj: unknown): obj is IParametersV3 {
  return isUuid((obj as IParametersV3).uuid)
}
