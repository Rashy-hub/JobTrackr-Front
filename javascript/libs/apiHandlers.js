export const API_CONFIG = {
    REGISTER_USER: {
        method: 'POST',
        endpoint: '/auth/register',
        payload: { body: {} },
        withBearer: false,
    },

    LOGIN_USER: {
        method: 'POST',
        endpoint: '/auth/login',
        payload: { body: {} },
        withBearer: false,
    },
}

export function getDynamicUrl(action, payload = {}) {
    // Validate action

    if (!Object.keys(API_CONFIG).includes(action)) {
        throw new Error(`Invalid action: ${action}`)
    }

    const baseUrl = 'http://localhost:8080/api'

    // Get the config and the  payload for the specified action
    const actionConfig = API_CONFIG[action]
    console.log(actionConfig)
    const payloadConfig = { ...actionConfig.payload, ...payload }

    // Construct URL with query parameters
    let url = new URL(`${baseUrl}${actionConfig.endpoint}`)
    // url.search = new URLSearchParams(params).toString()
    console.log(url.toString())
    let method = actionConfig.method
    let withAuth = actionConfig.withBearer
    return {
        url: url.toString(),
        method: method,
        payload: payloadConfig,
        withBearer: withAuth,
    }
}

export async function fetchData(requestURL) {
    /*  const options = {
        method: requestURL.method,
        headers: {
            accept: 'application/json',
        },
    }
 */
    const token = localStorage.getItem('token')
    const myBody = JSON.stringify(requestURL.payload.body)
    const options = {
        method: requestURL.method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        ...(requestURL.withBearer && {
            headers: {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            },
        }),
        ...(requestURL.method === 'POST' && {
            body: myBody,
        }),
    }

    try {
        const response = await fetch(requestURL.url, options)

        const responseJson = await response.json()

        return responseJson
    } catch (err) {
        console.error(err)
    }
}
