import { setupDropdownVisibility } from '../libs/modalHandler.js'
import { initParticles } from '../libs/particle-style.js'
import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'

console.log('editjob.js entry point')

const userNameSpan = document.getElementById('currentUsername')
const token = localStorage.getItem('token')
const userId = localStorage.getItem('userID')
const userName = localStorage.getItem('username')

if (!token || !userId || !userName) {
    window.location.href = '/pages/login.html'
}

userNameSpan.textContent =
    'Welcome ' +
    userName.split(' ').pop().charAt(0).toUpperCase() +
    userName.split(' ').pop().slice(1).toLowerCase()

const logoutButton = document.getElementById('logoutButton')
logoutButton.addEventListener('click', (event) => {
    localStorage.removeItem('token')
    localStorage.removeItem('userID')
    localStorage.removeItem('username')
    window.location.href = '/pages/login.html'
})

function getJobId() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('id')
}

async function getJobAndLoadDom() {
    const requestURL = getDynamicUrl('GET_JOB', { id: getJobId() })
    const job = await fetchData(requestURL)

    console.log(job)

    if (job) {
        document.getElementById('edit-job_title').value = job.title || ''
        document.getElementById('edit-job_company').value = job.company || ''
        document.getElementById('edit-job_website').value = job.website || ''
        document.getElementById('edit-job_contactName').value =
            job.contact.name || ''
        document.getElementById('edit-job_contactEmail').value =
            job.contact.email || ''
        document.getElementById('edit-job_contactPhone').value =
            job.contact.phone || ''
        document.getElementById('edit-job_contactAddress').value =
            job.contact.address || ''
        document.getElementById('edit-job_origin').value =
            job.userExtraInfo.origin || ''
        document.getElementById('edit-job_status').value =
            job.userExtraInfo.status || ''
        document.getElementById('edit-job_comments').value =
            job.userExtraInfo.comments || ''
    } else {
        console.error('Failed to load job data')
    }
}

async function submitForm(event) {
    event.preventDefault()

    const job = {}
    // Construct payload for the API
    const payload = {
        id: getJobId(),
        body: {
            title: document.getElementById('edit-job_title').value,
            company: document.getElementById('edit-job_company').value,
            website: document.getElementById('edit-job_website').value,
            contact: {
                name: document.getElementById('edit-job_contactName').value,
                email: document.getElementById('edit-job_contactEmail').value,
                phone: document.getElementById('edit-job_contactPhone').value,
                address: document.getElementById('edit-job_contactAddress')
                    .value,
            },
            userExtraInfo: {
                origin: document.getElementById('edit-job_origin').value,
                status: document.getElementById('edit-job_status').value,
                comments: document.getElementById('edit-job_comments').value,
            },
        },
    }

    const requestURL = getDynamicUrl('UPDATE_JOB', payload)
    const result = await fetchData(requestURL)

    if (result) {
        window.location.href = '../pages/dashboard.html'
    } else {
        console.error('Failed to update job')
    }
}

window.addEventListener('load', () => {
    initParticles()
    setupDropdownVisibility()
    getJobAndLoadDom()

    const form = document.getElementById('edit-job_profileForm')
    form.addEventListener('submit', submitForm)
})
