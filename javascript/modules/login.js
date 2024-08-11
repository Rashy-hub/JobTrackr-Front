import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'
import { initParticles } from '../libs/particle-style.js'

window.addEventListener('load', () => {
    prefillForm()
    if (!sessionStorage.getItem('pageLoaded')) {
        console.log('login.js entry point')
        console.log('Window loaded for the first time.')

        sessionStorage.setItem('pageLoaded', 'true')
    } else {
        console.log('Window has been loaded before.')
    }
    initParticles()
})

function prefillForm() {
    const myemail = document.getElementById('login_email')
    const mypassword = document.getElementById('login_password')

    myemail.value = 'john-doe@gmail.com'
    mypassword.value = 'Test123+'
}

const myForm = document.forms[0]

myForm.onsubmit = (event) => {
    event.preventDefault()

    const myfields = ['email', 'password']

    const filledFields = {}

    for (const field of myfields) {
        const fieldElement = myForm.elements[field]
        if (fieldElement && fieldElement.value.trim()) {
            filledFields[field] = fieldElement.value.trim()
        }
    }

    fetchData(getDynamicUrl('LOGIN_USER', { body: filledFields }))
        .then((userdata) => {
            const username = userdata.user.firstname
            //in order to stay connected ?
            localStorage.setItem('token', userdata.token)
            localStorage.setItem('userID', userdata.user.id)
            localStorage.setItem('username', username)
            window.location.href = '/pages/dashboard.html'
        })
        .catch((err) => {
            console.log(err)
            myForm.reset()
            //display function custom error
        })

    console.log('submit event fired')
}
const myLogo = document.querySelector('.logo')
myLogo.addEventListener('click', (event) => {
    //refresh when logo is clikk
    location.reload()
})
