import { setupDropdownVisibility } from '../libs/modalHandler.js'
import { initParticles } from '../libs/particle-style.js'
import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'
import { mixitup } from '../libs/apiHandlers.min.js'

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
                    <div class="job-card mix ${statusClass}" data-date="${new Date(
                    job.createdAt
                ).toISOString()}">
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
        console.log(jobListElement)
    } else {
        console.error('Failed to load jobs data')
    }
}
function initMixitUp() {
    var mixer = mixitup('.job-list', {
        selectors: {
            target: '.job-card',
        },
        animation: {
            duration: 300,
            queue: true,
            // queueLimit: 5,
        },
        load: {
            sort: 'date:desc',
            filter: 'all',
        },
        controls: {
            live: true,
            toggleLogic: 'or',
            enable: true,
        },
        callbacks: {
            onMixStart: function (state, futureState) {
                console.log(
                    `${state.activeFilter.selector} and also future is :${futureState.activeFilter.selector} `
                )
            },
            onMixEnd: function (state) {
                console.log('On Mix End ' + state.activeFilter.selector) // Logs the active filter
            },
            onMixFail: function (state) {
                console.error(
                    'Mixing failed, no elements matched the filter: ' +
                        state.activeFilter.selector
                )
            },
            onMixBusy: function (state) {
                console.log('MixItUp is busy')
            },
        },
        debug: {
            enable: true, // Enables debug mode
            showWarnings: true, // Show warnings in the console
            fauxAsync: true, // Helps to debug asynchronous operations
        },
    })

    // Event listener for statusFilter
    document.getElementById('statusFilter').addEventListener(
        'change',
        debounce(function (event) {
            const filterValue = event.target.value
            console.log('Status Filter changed: ' + filterValue)
            mixer
                .filter(filterValue === 'all' ? 'all' : `.${filterValue}`)
                .then((state) =>
                    console.log('Filter applied successfully', state)
                )
                .catch((error) => console.error('Error applying filter', error))
        }, 300)
    )

    // Event listener for dateFilter
    document.getElementById('dateFilter').addEventListener(
        'change',
        debounce(function (event) {
            const sortOrder = event.target.value
            console.log('Date Filter changed: ' + sortOrder)
            mixer
                .sort(sortOrder === 'asc' ? 'date:asc' : 'date:desc')
                .then((state) =>
                    console.log('Sort by date applied successfully', state)
                )
                .catch((error) => console.error('Error applying sort', error))
        }, 300)
    )
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

window.addEventListener('load', async () => {
    initParticles()
    setupDropdownVisibility()
    await initDashboard()
    initMixitUp()
})
