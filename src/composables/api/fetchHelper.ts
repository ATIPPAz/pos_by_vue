export function getRequest(path: string) {
  return fetch(path, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'access-control-allow-origin': '*'
    },
    mode: 'cors'
  })
}
export function updateRequest(path = '', data = {}, type = '') {
  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': type == '' ? 'application/json' : type
    },
    body: JSON.stringify(data)
  })
}
export function createRequest(path = '', data = {}, type = '') {
  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': type == '' ? 'application/json' : type
    },
    body: JSON.stringify(data)
  })
}
export function deleteRequest(path = '', id = {}) {
  return fetch(path, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(id)
  })
}
