
// Vars
const baseURL = 'http://127.0.0.1:8000/api/'


// Functions
export function sendRequest(method, url, body = null) {
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1]
    const fetchInit = {
        method: method,
        headers: {
            'X-CSRFToken':  csrfToken,
            'Content-Type': 'application/json; charset=UTF-8'
        }
    }
    if (body !== null) fetchInit.body = JSON.stringify(body)

    return fetch(baseURL + url, fetchInit).then(response => {
        if (method !== 'DELETE') return response.json()
    })
}


export const isValidTitle = title => {
    const NUM = '1234567890'
    const ENG = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const RUS = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'
    const char = title.trim()[0]
    return ENG.includes(char) || RUS.includes(char) || NUM.includes(char)
}


export const getIDNum = strWithID => +(strWithID.match(/\d+/)[0])
