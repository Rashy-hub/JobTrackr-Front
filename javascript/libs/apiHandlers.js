import { infoDialogHandler } from './modalHandler.js'

export const API_CONFIG = {
    REGISTER_USER: {
        method: 'POST',
        endpoint: '/auth/register',
        payload: { body: {}, files: {} }, // Include files in payload
        withBearer: false,
        hasFiles: true,
    },
    LOGIN_USER: {
        method: 'POST',
        endpoint: '/auth/login',
        payload: { body: {} },
        withBearer: false,
        hasFiles: false,
    },
    CREATE_JOB: {
        method: 'POST',
        endpoint: '/jobs',
        payload: { body: {} },
        withBearer: true,
        hasFiles: false,
    },
    GET_JOBS: {
        method: 'GET',
        endpoint: '/jobs',
        payload: {},
        withBearer: true,
        hasFiles: false,
    },
    GET_JOB: {
        method: 'GET',
        endpoint: '/jobs/:id',
        payload: {},
        withBearer: true,
        hasFiles: false,
    },
    DELETE_JOB: {
        method: 'DELETE',
        endpoint: '/jobs/:id',
        payload: {},
        withBearer: true,
        hasFiles: false,
    },
    UPDATE_JOB: {
        method: 'PUT',
        endpoint: '/jobs/:id',
        payload: { body: {} },
        withBearer: true,
        hasFiles: false,
    },
    POPULATE_JOBS: {
        method: 'GET',
        endpoint: '/jobs/populate',
        payload: {},
        withBearer: true,
        hasFiles: false,
    },
    GET_PROFIL: {
        method: 'GET',
        endpoint: '/profile',
        payload: {},
        withBearer: true,
        hasFiles: false,
    },
    UPDATE_PROFIL: {
        method: 'PUT',
        endpoint: '/profile',
        payload: { body: {}, files: {} },
        withBearer: true,
        hasFiles: true,
    },
}

// Function to show or hide the loader
function setLoaderVisibility(isVisible) {
    const loader = document.getElementById('loader')
    if (loader) {
        if (isVisible) {
            loader.classList.remove('hidden')
        } else {
            loader.classList.add('hidden')
        }
    } else {
        console.error('Loader element not found')
    }
}

export function getDynamicUrl(action, payload = {}) {
    // Validate action
    if (!Object.keys(API_CONFIG).includes(action)) {
        throw new Error(`Invalid action: ${action}`)
    }

    const baseUrl = 'https://jobtrackr-backend.onrender.com/api'

    // Get the config and the payload for the specified action
    const actionConfig = API_CONFIG[action]
    const payloadConfig = { ...actionConfig.payload, ...payload }

    // Construct URL with query parameters and replace placeholders
    let url = new URL(`${baseUrl}${actionConfig.endpoint}`)
    for (const [key, value] of Object.entries(payloadConfig)) {
        url.pathname = url.pathname.replace(`:${key}`, value)
    }

    let method = actionConfig.method
    let withAuth = actionConfig.withBearer
    let hasFiles = actionConfig.hasFiles

    return {
        url: url.toString(),
        method: method,
        payload: payloadConfig,
        withBearer: withAuth,
        hasFiles: hasFiles,
    }
}
export async function fetchData(requestURL) {
    const token = localStorage.getItem('token')
    // Show loader
    setLoaderVisibility(true)

    let options = {
        method: requestURL.method,
        headers: {
            Accept: 'application/json',
        },
    }

    if (requestURL.withBearer) {
        options.headers['Authorization'] = `Bearer ${token}`
    }

    if (requestURL.method === 'POST' || requestURL.method === 'PUT') {
        if (requestURL.hasFiles) {
            const formData = new FormData()

            // Append body fields to FormData
            for (let key in requestURL.payload.body) {
                formData.append(key, requestURL.payload.body[key])
            }

            // Append files to FormData
            for (let key in requestURL.payload.files) {
                if (requestURL.payload.files[key]) {
                    formData.append(key, requestURL.payload.files[key])
                } else {
                    formData.append(key, null) // Append null if the file is not provided
                }
            }

            options.body = formData
        } else {
            options.headers['Content-Type'] = 'application/json'
            options.body = JSON.stringify(requestURL.payload.body)
        }
    }

    try {
        const response = await fetch(requestURL.url, options)

        if (!response.ok) {
            let errorMessage = `Error ${response.status}`
            try {
                const errorResponse = await response.json()
                let resultMessage = errorResponse.message
                if (errorResponse.fieldErrors) {
                    resultMessage =
                        errorResponse.message +
                        '\n' +
                        JSON.stringify(errorResponse.fieldErrors, null, 2)
                }

                errorMessage = resultMessage || errorMessage
            } catch (jsonError) {
                console.error('Error parsing JSON response', jsonError)
            }
            infoDialogHandler({
                title: `Error ${response.status}`,
                message: errorMessage,
            })
            console.error('Submission failed')
            return null // Return null on error
        }

        const jsonResponse = await response.json()

        return jsonResponse
    } catch (err) {
        infoDialogHandler({
            title: `Server not responding`,
            message: `Please try again later`,
        })
        console.error('Fetch error:', err)
        return null // Return null on exception
    } finally {
        // Hide loader
        setLoaderVisibility(false)
    }
}
