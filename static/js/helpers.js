
export function sendRequest(method, url, body = null) {
    const fetchInit = {
        method: method,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    }

    if (body !== null) fetchInit.body = JSON.stringify(body)

    return fetch(url, fetchInit).then(response => response.json())
}

export const hasProperty = (object, property) => {
    Object.prototype.hasOwnProperty.call(object, property)
}
