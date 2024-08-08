import { setupDropdownVisibility } from '../libs/modalHandler.js'
import { initParticles } from '../libs/particle-style.js'
import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'

console.log('jobdetails.js entry point')
function getJobId() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('id')
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

window.addEventListener('load', () => {
    initParticles()
    setupDropdownVisibility()
    getProfilAndLoadDom()
    setupForm()
    setupFileUploads()
})
/*{
  "contact": {
    "name": "Liam Harris",
    "email": "liam.harris@hr-specialist.com",
    "phone": "+22012345678",
    "address": "909 HR Lane, Miami, FL"
  },
  "userExtraInfo": {
    "origin": "candidature spontanée",
    "status": "negative",
    "comments": "Experience with recruitment and employee relations is a plus."
  },
  "_id": "66b4c672919d9fda76e95ae0",
  "title": "HR Specialist",
  "website": "https://hr-specialist.com",
  "company": "HR Experts",

} */

async function getJobAndLoadDom() {
    const requestURL = getDynamicUrl('GET_JOB', { id: getJobId() })
    const job = await fetchData(requestURL)

    console.log(job)

    if (job) {
        document.getElementById('profil_firstname').value =
            result.firstname || ''
        document.getElementById('profil_lastname').value = result.lastname || ''
        document.getElementById('profil_email').value = result.email || ''
        document.getElementById('profil_github').value = result.github || ''

        const profilePictureElement = document.getElementById(
            'profil_profilePicture'
        )
        console.log(profilePictureElement)
        if (result.profilePicture && result.profilePicture.url) {
            profilePictureElement.src = result.profilePicture.url
        } else {
            profilePictureElement.src = '../assets/emptyavatar.jpg' // Default profile picture
        }

        const cvLinkElement = document.getElementById('cvLink')
        if (result.cv && result.cv.url) {
            cvLinkElement.href = result.cv.url
            cvLinkElement.style.display = 'block'
        } else {
            cvLinkElement.style.display = 'none'
        }
    }
}
