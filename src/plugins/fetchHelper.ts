import type { Api } from '../interface/ResponseInterface.js'

export async function getRequest(path: string): Promise<any> {
  let res
  await fetch(path)
    .then((e) => {
      res = e.json()
    })
    .catch((er) => {
      console.log(er)
      res = { statusCode: 500, data: { massage: 'server error' + er } }
    })
  return res
}

export async function updateRequest(path = '', data = {}, type = '') {
  await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': type == '' ? 'application/json' : type
    },
    body: JSON.stringify(data)
  })
    .then((e) => e.json())
    .catch((e) => (e.statusCode = 500))
    .then((res) => res)
    .catch((er) => {
      return { statusCode: 500, data: { massage: 'server error' + er } }
    })
}

export async function createRequest(path = '', data = {}, type = '') {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': type == '' ? 'application/json' : type
    },
    body: JSON.stringify(data)
  })
    .then((e) => e.json())
    .catch((e) => (e.statusCode = 500))
  return res
}
export async function deleteRequest(path = '', id = {}) {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(id)
  })
    .then((e) => e.json())
    .catch((e) => (e.statusCode = 500))
  return res
}
