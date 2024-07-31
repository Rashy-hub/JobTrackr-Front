import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'

window.addEventListener('load', () => {
    if (!sessionStorage.getItem('pageLoaded')) {
        prefillForm()
        console.log('login.js entry point')
        console.log('Window loaded for the first time.')

        // Set a flag in sessionStorage
        sessionStorage.setItem('pageLoaded', 'true')
    } else {
        // Code to run on subsequent page loads
        console.log('Window has been loaded before.')
    }
})

// Function to get query parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search)
    return {
        email: params.get('email'),
        password: params.get('password'),
    }
}

// Pre-fill form fields with query parameters
function prefillForm() {
    const params = getQueryParams()
    if (params.email) {
        document.getElementById('email').value = params.email
    }
    if (params.password) {
        document.getElementById('password').value = params.password
    }
}

const myForm = document.forms[0]

myForm.onsubmit = (event) => {
    event.preventDefault()
    //firstname , lastname ,email,github,profile-picture,password,confirm-password
    const myfields = ['email', 'password']
    //FROM HERE I DONT KNOW IF IT IS CORRECT
    //I WANT TO BE ABLE TO SEND AN OBJECT LIKE KEY VALUE WITH ONLY THE FIELDS THAT ARE NOT EMPTY

    // Initialize an object to hold the filled fields
    const filledFields = {}

    for (const field of myfields) {
        const fieldElement = myForm.elements[field]
        if (fieldElement && fieldElement.value.trim()) {
            filledFields[field] = fieldElement.value.trim()
        }
    }

    fetchData(getDynamicUrl('LOGIN_USER', { body: filledFields }))
        .then((userdata) => {
            const username =
                userdata.user.firstname + ' ' + userdata.user.lastname
            //in order to stay connected ?
            localStorage.setItem('token', userdata.token)
            localStorage.setItem('userID', userdata.user.id)
            localStorage.setItem('username', username)
            window.location.href = '/pages/dashboard.html'
            console.log(userdata.token)
            // window.location.href = '../pages/login.html'
        })
        .catch((err) => {
            console.log(err)
            //display function custom error
        })

    console.log('submit event fired')
}
