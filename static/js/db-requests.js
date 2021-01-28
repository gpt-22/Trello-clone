import {deleteFromDOMbyID} from "./html";
import {getIDNum} from "./helpers";

export function sendRequest(method, url, body = null, headers = null) {
    const fetchInit = {
        method: method
    }
    if (body !== null) fetchInit.body = JSON.stringify(body)
    if (headers !== null) fetchInit.headers = headers

    return fetch(url, fetchInit).then(response => {
        if (method !== 'DELETE') return response.json()
    })
}


export function deleteFromDB(url) {
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1]
    const headers = {
        'X-CSRFToken':  csrfToken,
        'Content-Type': 'application/json; charset=UTF-8'
    }
    sendRequest('DELETE', url, null, headers)
        .catch(err => console.log(err))
}


export function createCardInDB(body) {
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1]
    const headers = {
        'X-CSRFToken':  csrfToken,
        'Content-Type': 'application/json; charset=UTF-8'
    }
    const URL = `http://127.0.0.1:8000/api/boards/1/lists/${ body.list }/cards/`

    return sendRequest('POST', URL, body, headers)
}


export function createListInDB(title) {
    const body = {
        board: 1,
        title: title
    }
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1]
    const headers = {
        'X-CSRFToken':  csrfToken,
        'Content-Type': 'application/json; charset=UTF-8'
    }
    const URL = `http://127.0.0.1:8000/api/boards/1/lists/`

    return sendRequest('POST', URL, body, headers)
}


export function changeCardTitleInDB(newTitle, listID, cardID) {
    const body = {
        title: newTitle
    }
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1]
    const headers = {
        'X-CSRFToken':  csrfToken,
        'Content-Type': 'application/json; charset=UTF-8'
    }
    const URL = `http://127.0.0.1:8000/api/boards/1/lists/${ listID }/cards/${ cardID }/`
    sendRequest('PATCH', URL, body, headers)
        .then(data => console.log(data))
        .catch(err => console.log(err))
}


export async function changeCardDescInDB(oldDesc, newDesc, listID, cardID) {
    const body = {
        description: newDesc
    }
    const csrfToken = document.cookie.match(/csrftoken=([\w-]+)/)[1]
    const headers = {
        'X-CSRFToken':  csrfToken,
        'Content-Type': 'application/json; charset=UTF-8'
    }
    const URL = `http://127.0.0.1:8000/api/boards/1/lists/${ listID }/cards/${ cardID }/`
    await sendRequest('PATCH', URL, body, headers)
        .then(data => console.log(data))
        .catch(err => console.log(err))
}

