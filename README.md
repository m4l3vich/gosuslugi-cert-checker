# Gosuslugi certificate checker

A module for checking COVID-19 certificates generated by Gosuslugi (EPGU)

![npm](https://img.shields.io/npm/v/gosuslugi-cert-checker) ![Typescript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)

[На русском](README_RU.md)

### Installation

Node.js v12.20.0 or newer is required.

Install using Yarn (recommended):

```
yarn add gosuslugi-cert-checker
```

Install using NPM:

```
npm install --save gosuslugi-cert-checker
```



### Usage

Check certificate URL validity

```javascript
import { checkUrl } from 'gosuslugi-cert-checker'

const someValidUrl = 'https://www.gosuslugi.ru/covid-cert/status/xxxxxx'
checkUrl(someValidUrl) // returns true if URL is valid, otherwise false
```

Get certificate URL info

```javascript
import { parseUrl } from 'gosuslugi-cert-checker'

const someValidUrl = 'https://www.gosuslugi.ru/covid-cert/verify/{{unrz}}?lang=ru&ck={{hash}}'
const { version, params } = parseUrl(someValidUrl) // if URL is invalid, throws InvalidUrlError
// version = 2
/// params = { unrz: "{{unrz}}", hash: "{{hash}}" }
```

Fetch certificate info from Gosuslugi API

```javascript
import { EpguCertificate } from 'gosuslugi-cert-checker'

const someValidUrl = 'https://www.gosuslugi.ru/vaccine/cert/verify/xxxxx'
const certificate = await EpguCertificate.fetch(someValidUrl)

console.log(certificate)
/*
EpguCertificate {
  type: undefined, (Only V2 certificates)
  certId: '1234567890123456',
  expiration: 1970-01-01T00:00:00.000Z,
  birthdate: 1970-01-01T00:00:00.000Z,
  passport: '12** ***345',
  name: {
    ru: 'Б********* И**** З***********',
    en: 'B********* I**** Z***********'
  }
}
*/

console.log(certificate.expired) // true if certificate is expired
```



### Certificate URL versions

_**If you have more info on certificate URL versions, please fill free to [open an issue](https://github.com/m4l3vich/gosuslugi-cert-checker/issues/new)**_

#### Version 1

*Presumably used until summer 2021*

Includes only vaccination certificates

URL format: `https://www.gosuslugi.ru/vaccine/cert/verify/{{uuid}}`

API URL format: `https://www.gosuslugi.ru/api/vaccine/v1/cert/verify/{{uuid}}`

#### Version 2

*Summer 2021 (presumably) - 08.11.2021? (new certificate type introduced)*

Has a "type" field with one of the following values:

- `VACCINE_CERT` - One-year vaccination certificate
- `ILLNESS_FACT` - Previous disease certificate ("attrs" field includes recovery date info)
- `TEMPORARY_CERT` - Temporary vaccination certificate

URL format: `https://www.gosuslugi.ru/covid-cert/verify/{{unrz}}?lang={{lang}}&ck={{hash}}`

API URL format: `https://www.gosuslugi.ru/api/covid-cert/v3/cert/check/{{unrz}}?lang={{lang}}&ck={{hash}}`

#### Version 3

*Current version*

Has no indication of certificate type (vaccination/disease), also doesn't show UNRZ (even in API, as v1 does)

URL format: `https://www.gosuslugi.ru/covid-cert/status/{{uuid}}?lang=ru`

API URL format: `https://www.gosuslugi.ru/api/covid-cert-checker/v3/cert/status/{{uuid}}`
