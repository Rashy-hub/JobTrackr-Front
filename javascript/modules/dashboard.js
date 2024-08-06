import { setupDropdownVisibility } from '../libs/modalHandler.js'
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
                const statusClass = job.userExtraInfo.status
                    .toLowerCase()
                    .replace(/ /g, '-')
                return `
                    <div class="job-card ${statusClass}" data-date="${new Date(
                    job.createdAt
                ).getTime()}">
                        <div class="job-card-content">
                            <h2 class="title">${job.title}</h2>
                            <p class="job-details contact-name">Contact Name: ${
                                job.contact.name
                            }</p>
                            <p class="job-details contact-email">Contact Email: ${
                                job.contact.email
                            }</p>
                            <p class="job-details contact-phone">Contact Phone: ${
                                job.contact.phone
                            }</p>
                            <p class="job-details contact-address">Contact Address: ${
                                job.contact.address
                            }</p>
                            <p class="job-status status-${statusClass}">${statusClass}</p>
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

window.addEventListener('load', () => {
    initParticles()
    setupDropdownVisibility()
    initDashboard()
})
