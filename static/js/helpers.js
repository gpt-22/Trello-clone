
export function sendRequest(method, url, body = null) {
    const headers = {
        'Content-Type': 'application/json; charset=UTF-8'
    }

    return fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: headers
    }).then(response => response.json())
}

export const hasProperty = (object, property) => {
    Object.prototype.hasOwnProperty.call(object, property)
}
