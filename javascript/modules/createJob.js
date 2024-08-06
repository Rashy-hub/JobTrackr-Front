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

    /*{
      -----------------HERE IS WHAT I SEND FROM POSTMAN THAT WORKS FINE ------------------------------------
    "title": "Front end dev",
    "website": "https://front-company.com",
    "contact": {
        "name": "Alice Johnson",
        "email": "alice.johnson@data-company.com",
        "phone": "+11876543231",
        "address": "456 Data Rd, City, Country"
    },
    "userExtraInfo": {
        "origin": "Candidature spontanée",
        "status": "CV sent",
        "comments": "Looking forward to hearing back."
    }
} 
    -----------------HERE IS WHAT I SEND FROM MY FRONT ------------------------------------
    {
  "title": "My first job from front",
  "website": "https://bullshit.com",
  "contact.name": "apple",
  "contact.email": "apple@gmail.com",
  "contact.phone": "+32499658912",
  "contact.address": "rue de ta maman 72",
  "userExtraInfo.origin": "job offer",
  "userExtraInfo.status": "negative",
  "userExtraInfo.comments": "Test test test"
}

*/
    // Get the request URL configuration
    const requestURL = getDynamicUrl('CREATE_JOB', payload)

    const response = await fetchData(requestURL)
        .then((result) => {
            console.log(result)
            infoDialogHandler({
                title: 'Operation sucessfull',
                message: `Job ${payload.body.title} added`,
            })
            window.location.href = `/pages/dashboard.html`
            // window.location.href = '../pages/login.html'
        })
        .catch((err) => {
            console.log(err)

            //display function custom error
        })
}
window.addEventListener('load', () => {
    initParticles()
    setupDropdownVisibility()
})
