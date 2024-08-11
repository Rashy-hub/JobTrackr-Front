import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'
import {
    infoDialogHandler,
    setupDropdownVisibility,
} from '../libs/modalHandler.js'
import { initParticles } from '../libs/particle-style.js'

console.log('createJob.js entry point')

const userNameSpan = document.getElementById('currentUsername')
const token = localStorage.getItem('token')
const userId = localStorage.getItem('userID')
const userName = localStorage.getItem('username')
if (!token && !userId && !userName) {
    window.location.href = '/pages/login.html'
}

userNameSpan.textContent =
    'Welcome ' +
    userName.split(' ').pop().charAt(0).toUpperCase() +
    userName.split(' ').pop().slice(1).toLowerCase()

const logoutButton = document.getElementById('logoutButton')
logoutButton.addEventListener('click', (event) => {
    localStorage.clear('token')
    localStorage.clear('userID')
    localStorage.clear('username')

    window.location.href = '/pages/login.html'
})

const jobForm = document.getElementById('create_job_form')

jobForm.onsubmit = async (event) => {
    event.preventDefault()

    const formData = new FormData(jobForm)

    // Construct payload for the API
    const payload = {
        body: {
            title: formData.get('jobTitle'),
            company: formData.get('jobCompany'),
            website: formData.get('website'),
            contact: {
                name: formData.get('employerName'),
                email: formData.get('employerEmail'),
                phone: formData.get('employerPhone'),
                address: formData.get('employerAddress'),
            },
            userExtraInfo: {
                origin: formData.get('origin'),
                status: formData.get('status'),
                comments: formData.get('comments'),
            },
        },
    }

    const requestURL = getDynamicUrl('CREATE_JOB', payload)

    const response = await fetchData(requestURL)
        .then((result) => {
            console.log(result)
            infoDialogHandler({
                title: 'Operation sucessfull',
                message: `Job ${payload.body.title} added`,
            })
            window.location.href = `/pages/dashboard.html`
        })
        .catch((err) => {
            console.log(err)
        })
}
const myLogo = document.querySelector('.logo')
myLogo.addEventListener('click', (event) => {
    //refresh when logo is clikk
    location.reload()
})

window.addEventListener('load', () => {
    initParticles()
    setupDropdownVisibility()
})
