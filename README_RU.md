# Gosuslugi certificate checker

Модуль для проверки сертификатов COVID-19, сгенерированных Госуслугами (ЕПГУ)

[![npm](https://img.shields.io/npm/v/gosuslugi-cert-checker)](https://www.npmjs.com/package/gosuslugi-cert-checker) [![Typescript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)



### Установка

Требуется Node.js версии 12.20.0 или новее.

Установка с помощью Yarn (рекомендуется):

```
yarn add gosuslugi-cert-checker
```

Установка с помощью NPM:

```
npm install --save gosuslugi-cert-checker
```



### Использование

Проверка корректности URL сертификата

```javascript
import { checkUrl } from 'gosuslugi-cert-checker'

const someValidUrl = 'https://www.gosuslugi.ru/covid-cert/status/xxxxxx'
checkUrl(someValidUrl) // возвращает true, если ссылка корректная
```

Получение информации из URL сертификата

```javascript
import { parseUrl } from 'gosuslugi-cert-checker'

const someValidUrl = 'https://www.gosuslugi.ru/covid-cert/verify/{{unrz}}?lang=ru&ck={{hash}}'
const { version, params } = parseUrl(someValidUrl) // бросает InvalidUrlError, если ссылка некорректная
// version = 2
// params = { unrz: "{{unrz}}", hash: "{{hash}}" }
```

Получение информации о сертификате по URL

```javascript
import { EpguCertificate } from 'gosuslugi-cert-checker'

const someValidUrl = 'https://www.gosuslugi.ru/vaccine/cert/verify/xxxxx'
const certificate = await EpguCertificate.fetch(someValidUrl)

console.log(certificate)
/*
EpguCertificate {
  type: undefined,  (Только сертификаты 2й версии)
  certId: '1234567890123456',
  expiration: 1970-01-01T00:00:00.000Z,
  birthdate: 1970-01-01T00:00:00.000Z,
  passport: '12** ***345',
  status: true  (У сертификатов ПЦР тестов: true = отрицательный, false = положительный)
  name: {
    ru: 'Б********* И**** З***********',
    en: 'B********* I**** Z***********'
  }
}
*/

console.log(certificate.expired) // Возвращает true, если срок действия сертификата истёк
console.log(certificate.valid) // Возвращает true, если сертификат корректен и просрочен
```

⚠️ Для проверки корректности сертификатов стоит использовать свойство `valid`, а не `status`. Последнее стоит использовать в случае, если необходимо узнать, является ли результат ПЦР-теста положительным или отрицательным.

### Версии URL сертификатов

_**Если у вас есть больше информации о версиях URL, пожалуйста, [напишите об этом в issues](https://github.com/m4l3vich/gosuslugi-cert-checker/issues/new)**_

#### Версия 1

*Предположительно использовалась до лета 2021*

Только сертификаты о вакцинации

Формат URL: `https://www.gosuslugi.ru/vaccine/cert/verify/{{uuid}}`

Формат запроса к API: `https://www.gosuslugi.ru/api/vaccine/v1/cert/verify/{{uuid}}`

#### Версия 2

*С лета 2021 (предположительно) до 08.11.2021 (когда началась выдача сертификатов "нового образца")*

**⚠️ После возможной [атаки перечислением УНРЗ](https://www.bbc.com/russian/news-60130755), с помощью которой была составлена база данных сертификатов, сертификаты 2 версии используются только для результатов ПЦР-тестов. Старые сертификаты о вакцинации 2 версии всегда отображаются как некорректные.**

Всё ещё используется для сертификатов ПЦР тестов (по состоянию на 06.12.2021)

Имеет поле "type" с одним из следующих значений:

- `VACCINE_CERT` - Сертификат о вакцинации, действующий 1 год
- `ILLNESS_FACT` - Сертификат о перенесённой болезни (в поле "attrs" есть информация о дате выздоровления)
- `TEMPORARY_CERT` - Временный сертификат о вакцинации
- `COVID_TEST` - Сертификат результата ПЦР теста

Формат URL: `https://www.gosuslugi.ru/covid-cert/verify/{{unrz}}?lang={{lang}}&ck={{hash}}`

После атаки перечислением УНРЗ ссылка на API была изменена (возможно, были сделаны изменения, предотвращающие такие атаки):

Старый формат запроса к API: `https://www.gosuslugi.ru/api/covid-cert/v3/cert/check/{{unrz}}?lang={{lang}}&ck={{hash}}`

Новый формат запроса к API: `https://www.gosuslugi.ru/api/covid-cert/v4/cert/check/{{unrz}}?lang={{lang}}&ck={{hash}}`

#### Версия 3

*Текущая версия*

В ответе API не указывается тип сертификата (вакцинация/болезнь), а также УНРЗ

Формат URL: `https://www.gosuslugi.ru/covid-cert/status/{{uuid}}?lang=ru`

Формат запроса к API: `https://www.gosuslugi.ru/api/covid-cert-checker/v3/cert/status/{{uuid}}`

