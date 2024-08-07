import {
    infoDialogHandler,
    setupDropdownVisibility,
} from '../libs/modalHandler.js'
import { initParticles } from '../libs/particle-style.js'
import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'

console.log('dashboard.js entry point')

function debounce(func, wait) {
    let timeout
    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this, args), wait)
    }
}

async function initDashboard() {
    const requestURL = getDynamicUrl('GET_JOBS')
    const jobs = await fetchData(requestURL)

    if (jobs && Array.isArray(jobs)) {
        const jobListElement = document.getElementById('job-list')
        jobListElement.innerHTML = jobs
            .map((job) => {
                const formattedDate = new Date(
                    job.createdAt
                ).toLocaleDateString()

                const statusClass = job.userExtraInfo.status

                    .toLowerCase()
                    .replace(/ /g, '-')
                return `
                    <div class="job-card ${statusClass}" data-date="${new Date(
                    job.createdAt
                ).getTime()}" data-id="${job._id}">
                        <div class="job-card-content">
                        <p class="job-status status-${statusClass}">${statusClass}</p>
                            <h2 class="title">${job.title}</h2>

                            <h3 class="job-details contact-name"> ${
                                job.company
                            }</h3>
                       
                            
                            <a href="jobDetails.html?id=${
                                job._id
                            }" class="see-more">See More</a>
                        </div>
                    </div>`
            })
            .join('')

        const iso = new Isotope(jobListElement, {
            itemSelector: '.job-card',
            layoutMode: 'fitRows',
            transitionDuration: '0.4s', // Adjust the duration for smoother animation
            stagger: 30, // Add a slight stagger to the animation
            getSortData: {
                date: '[data-date] parseInt',
            },
            sortBy: 'date',
            sortAscending: false,
        })

        document.getElementById('statusFilter').addEventListener(
            'change',
            debounce(function () {
                const filterValue = this.value
                console.log('Status Filter changed:', filterValue)
                iso.arrange({
                    filter: filterValue === 'all' ? '*' : `${filterValue}`,
                })
            }, 300)
        )

        document.getElementById('dateFilter').addEventListener(
            'change',
            debounce(function () {
                const sortOrder = this.value === 'asc' ? true : false
                console.log('Date Filter changed:', sortOrder)
                iso.arrange({ sortBy: 'date', sortAscending: sortOrder })
            }, 300)
        )
    } else {
        console.error('Failed to load jobs data')
    }
}

const userNameSpan = document.getElementById('currentUsername')
const token = localStorage.getItem('token')
const userId = localStorage.getItem('userID')
const userName = localStorage.getItem('username')
if (!token && !userId && !userName) {
    window.location.href = '/pages/login.html'
}

userNameSpan.textContent =
    userName.split(' ').pop().charAt(0).toUpperCase() +
    userName.split(' ').pop().slice(1).toLowerCase()

const logoutButton = document.getElementById('logoutButton')
logoutButton.addEventListener('click', (event) => {
    localStorage.clear('token')
    localStorage.clear('userID')
    localStorage.clear('username')

    window.location.href = '/pages/login.html'
})
function getAllJobIds() {
    // Select all elements with the class 'job-card' and a 'data-id' attribute
    const jobCards = document.querySelectorAll('.job-card[data-id]')

    // Extract the data-id values from each element and return them in an array
    const jobIds = Array.from(jobCards).map((jobCard) =>
        jobCard.getAttribute('data-id')
    )

    return jobIds
}
function initClearButton() {
    document
        .querySelector('.clearall-job-button')
        .addEventListener('click', (event) => {
            event.preventDefault()

            getAllJobIds().forEach(async (jobid) => {
                const requestURL = getDynamicUrl('DELETE_JOB', { id: jobid })
                console.log('going to delete that job with id ' + jobid)
                const result = await fetchData(requestURL)
                console.log(result)
            })

            window.location.href = '../pages/dashboard.html'
        })
}
function initPopulateButton() {
    document
        .querySelector('.populate-job-button')
        .addEventListener('click', async (event) => {
            event.preventDefault()
            // Afficher une boîte de confirmation

            const requestURL = getDynamicUrl('POPULATE_JOBS')
            const result = await fetchData(requestURL)
            console.log(result)
            window.location.href = '../pages/dashboard.html'
        })
}
window.addEventListener('load', () => {
    initParticles()
    setupDropdownVisibility()
    initDashboard()
    initClearButton()
    initPopulateButton()
})
