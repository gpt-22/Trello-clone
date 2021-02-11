
// Vars
const baseURL = 'http://127.0.0.1:8000/api/'


// Functions

export function sendRequest(method, url, body) {
  const fetchInit = {
    method: method,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  }

  let authentication
  const accessToken = localStorage.getItem('accessToken')

  if (body) {
    authentication = 'username' in body && 'password' in body
    fetchInit.body = JSON.stringify(body)
  }
  if (!authentication && accessToken) {
    fetchInit.headers['Authorization'] = 'Bearer ' + accessToken
  }

  return fetch(baseURL + url, fetchInit).then((response) => {
    if (method !== 'DELETE') return response.json()
  })
}


export const isValidTitle = (title) => {
  const NUM = '1234567890'
  const ENG = 'abcdefghijklmnopqrstuvwxyz' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const RUS = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя' +
    'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
  const char = title.trim()[0]
  return ENG.includes(char) || RUS.includes(char) || NUM.includes(char)
}


export const getIDNum = (strWithID) => +(strWithID.match(/\d+/)[0])
