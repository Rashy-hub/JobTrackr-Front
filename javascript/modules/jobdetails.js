import { setupDropdownVisibility } from '../libs/modalHandler.js'
import { initParticles } from '../libs/particle-style.js'
import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'

console.log('jobdetails.js entry point')

function getJobId() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('id')
}

async function loadJobDetails() {
    const requestURL = getDynamicUrl('GET_JOB', { id: getJobId() })
    const job = await fetchData(requestURL)

    if (job) {
        const jobListElement = document.getElementById('job-details_container')

        jobListElement.innerHTML = `
            <h2 class="job-details_title">${job.title}</h2>
            <p class="job-details_paragraphe"><strong>Company:</strong> ${job.company}</p>
            <p class="job-details_paragraphe"><strong>Website:</strong> <a href="${job.website}" target="_blank">${job.website}</a></p>
            <hr>
            <p class="job-details_paragraphe"><strong>Contact Name:</strong> ${job.contact.name}</p>
            <p class="job-details_paragraphe"><strong>Email:</strong> <a href="mailto:${job.contact.email}">${job.contact.email}</a></p>
            <p class="job-details_paragraphe"><strong>Phone:</strong> ${job.contact.phone}</p>
            <p class="job-details_paragraphe"><strong>Address:</strong> ${job.contact.address}</p>
            <hr>
            <p class="job-details_paragraphe"><strong>Origin:</strong> ${job.userExtraInfo.origin}</p>
            <p class="job-details_paragraphe"><strong>Status:</strong> ${job.userExtraInfo.status}</p>
            <p class="job-details_paragraphe"><strong>Comments:</strong> ${job.userExtraInfo.comments}</p>
            <button class="clear-job-button">Delete Job</button>
            <button class="edit-job-button">  <a href="updateJob.html?id=${job._id}" class="edit-job" style="color:white;text-decoration:none;width:100%">Edit Job</a></button>
        `
    } else {
        console.error('Failed to load job data')
    }
}

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

const myLogo = document.querySelector('.logo')
myLogo.addEventListener('click', (event) => {
    //refresh when logo is clikk
    location.reload()
})
function initClearButton() {
    document
        .querySelector('.clear-job-button')
        .addEventListener('click', async (event) => {
            event.preventDefault()
            const requestURL = getDynamicUrl('DELETE_JOB', { id: getJobId() })
            console.log('going to delete that job with id ' + getJobId())
            const result = await fetchData(requestURL)

            if (result) {
                window.location.href = '../pages/dashboard.html'
            } else {
                console.error('Failed to delete job')
            }
        })
}

window.addEventListener('load', async () => {
    initParticles()
    setupDropdownVisibility()
    await loadJobDetails()
    initClearButton()
})
