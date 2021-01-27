
export function sendRequest(method, url, body = null, headers = null) {
    const fetchInit = {
        method: method
    }

    if (body !== null) fetchInit.body = JSON.stringify(body)
    if (headers !== null) fetchInit.headers = headers
    return fetch(url, fetchInit).then(response => {
        if (method !== 'DELETE')
           return response.json()
    })
}


export function isValidTitle(title) {
    const NUM = '1234567890'
    const ENG = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const RUS = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
    const char = title.trim()[0]
    return ENG.includes(char) || RUS.includes(char) || NUM.includes(char)
}


export const getIDNum = (strWithID) => +(strWithID.match(/\d+/)[0])
