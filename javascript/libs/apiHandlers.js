export const API_CONFIG = {
    SEARCH_MOVIES_BY_NAME: {
        method: 'GET',
        endpoint: 'search/movie',
        params: {
            query: '',
            page: 0,
            include_adult: false,
            language: 'en-US',
        },
    },

    GET_LATEST_MOVIES: {
        method: 'GET',
        endpoint: 'discover/movie',
        params: {
            include_adult: false,
            language: 'en-US',
            page: 0,
            'primary_release_date.lte': new Date().toISOString().slice(0, 10),
            sort_by: 'primary_release_date.desc',
        },
    },
    GET_GENRES_IDS: {
        method: 'GET',
        endpoint: 'genre/movie/list',
        params: { language: 'en' },
    },

    SEARCH_MOVIES_BY_GENRE: {
        method: 'GET',
        endpoint: 'discover/movie',
        params: {
            include_adult: false,
            include_video: false,
            language: 'en-US',
            page: 0,
            sort_by: 'popularity.desc',
            with_genres: 35,
        },
    },
}

export function getDynamicUrl(action, userParams = {}) {
    // Validate action

    if (!Object.keys(API_CONFIG).includes(action)) {
        throw new Error(`Invalid action: ${action}`)
    }

    const baseUrl = 'https://api.themoviedb.org/3/'

    // Get the configuration for the specified action
    const actionConfig = API_CONFIG[action]
    const params = { ...actionConfig.params, ...userParams }

    // Construct URL with query parameters
    let url = new URL(`${baseUrl}${actionConfig.endpoint}`)
    url.search = new URLSearchParams(params).toString() // Handle encoding automatically
    console.log(url.toString())
    let method = actionConfig.method
    return { url: url.toString(), method: method }
}

export async function fetchData(requestURL) {
    const options = {
        method: requestURL.method,
        headers: {
            accept: 'application/json',
        },
    }

    try {
        let jsonKeysData = { bearer: '' }

        //!uncomment in order to use the correct api key
        // Read bearer token from api.json securely
        /*      fetch('../utils/api.json').then(async (response) => {
            if (response.ok) {
                jsonKeysData = await response.json()
                //console.log('File found!')
            } else {
                console.error(
                    'Error fetching utils/api.json file:',
                    response.status
                )
              
            }
        }) */

        //!for the moment use my local key anyway even if api.json not found , do not forget to adapt when deployed for prod
        jsonKeysData.bearer =
            'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiOTBjOTI1NzdhYjUyZTUxNThmYWU0MGYxMDdkMzBjOCIsInN1YiI6IjY2NzE5MzgzZTA3ZmFmZjAzNTcyZWZhNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ztStLJqy8UtW95RrD6ie8sIpBORWWgbdk32o9Zxx9HQ'
        options.headers.Authorization = `Bearer ${jsonKeysData.bearer}`
        const response = await fetch(requestURL, options)

        const responseJson = await response.json()

        const filtered_response = responseJson.results.filter((movie) => {
            if (movie.hasOwnProperty('poster_path')) {
                return movie.poster_path !== null && movie.poster_path !== ''
            }

            return false
        })

        //pagination handling

        swiperPagination.totalPage = responseJson.total_pages

        //initializing or updating slides
        if (responseJson.page === 1) {
            initSlides(filtered_response, swiper, swiperPagination)
        } else {
            updateSlides(filtered_response, swiper, swiperPagination)
        }

        return responseJson.total_results
    } catch (err) {
        console.error(err)
    }
}
