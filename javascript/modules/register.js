import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'
import { initParticles } from '../libs/particle-style.js'

console.log('register.js entry point')

window.addEventListener('load', () => {
    const myForm = document.forms[0]

    myForm.onsubmit = async (event) => {
        event.preventDefault()

        const formData = new FormData(myForm)

        // Construct payload for the API
        const payload = {
            body: {
                firstname: formData.get('firstname'),
                lastname: formData.get('lastname'),
                email: formData.get('email'),
                github: formData.get('github'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword'),
            },
            files: {
                profilePicture:
                    formData.get('profilePicture').size > 0
                        ? formData.get('profilePicture')
                        : new Blob(),
                cv:
                    formData.get('cv').size > 0
                        ? formData.get('cv')
                        : new Blob(),
            },
        }

        // Get the request URL configuration
        const requestURL = getDynamicUrl('REGISTER_USER', payload)

        // Fetch data and handle response
        const userdata = await fetchData(requestURL)
        if (userdata && userdata.user) {
            const username = userdata.user.firstname + userdata.user.lastname
            // In order to stay connected
            localStorage.setItem('token', userdata.token)
            localStorage.setItem('userID', userdata.user.id)
            localStorage.setItem('username', username)
            window.location.href = `/pages/login.html?email=${encodeURIComponent(
                userdata.user.email
            )}&password=${encodeURIComponent(
                myForm.elements['password'].value
            )}`
        } else {
            console.log('Registration failed')
            // Optionally, handle the case when registration fails
        }
    }

    initParticles()
})
