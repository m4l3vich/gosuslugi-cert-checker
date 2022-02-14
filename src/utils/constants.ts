export const CERT_URL_ORIGIN = 'https://www.gosuslugi.ru'

export const V1_PATH_START = '/vaccine/cert/verify'
export const V2_PATH_START = '/covid-cert/verify'
export const V3_PATH_START = '/covid-cert/status'

export const V1_API_URL = 'https://www.gosuslugi.ru/api/vaccine/v1/cert/verify/'
// v2 URL was changed after UNRZ enumeration attack
// export const V2_API_URL = 'https://www.gosuslugi.ru/api/covid-cert/v3/cert/check/'
export const V2_API_URL = 'https://www.gosuslugi.ru/api/covid-cert/v4/cert/check/'
export const V3_API_URL = 'https://www.gosuslugi.ru/api/covid-cert-checker/v3/cert/status/'
