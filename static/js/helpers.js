
export function sendRequest(method, url, body = null, headers = null) {
    const fetchInit = {
        method: method,
    }

    if (body !== null) fetchInit.body = JSON.stringify(body)
    if (headers !== null) fetchInit.headers = headers

    return fetch(url, fetchInit).then(response => response.json())
}
