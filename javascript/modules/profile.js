// profile.js

import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'
import { setupDropdownVisibility } from '../libs/modalHandler.js'
import { initParticles } from '../libs/particle-style.js'

console.log('profile.js entry point')

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
logoutButton.addEventListener('click', () => {
    localStorage.clear('token')
    localStorage.clear('userID')
    localStorage.clear('username')

    window.location.href = '/pages/login.html'
})
const myLogo = document.querySelector('.logo')
myLogo.addEventListener('click', (event) => {
    //refresh when logo is clikk
    location.reload()
})

window.addEventListener('load', () => {
    initParticles()
    setupDropdownVisibility()
    getProfilAndLoadDom()
    setupForm()
    setupFileUploads()
})

async function getProfilAndLoadDom() {
    const requestURL = getDynamicUrl('GET_PROFIL')
    console.log('Going to get profile for current user')
    const result = await fetchData(requestURL)
    const cvUpload = document.getElementById('cvUpload')
    cvUpload.style.visibility = 'hidden'
    if (result) {
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

function setupForm() {
    const editButton = document.getElementById('profil_editButton')
    const saveButton = document.getElementById('profil_saveButton')
    const formFields = document.querySelectorAll('#profil_profileForm input')

    editButton.addEventListener('click', () => {
        const cvUpload = document.getElementById('cvUpload')
        cvUpload.style.visibility = 'visible'
        formFields.forEach((field) => (field.disabled = false))
        saveButton.disabled = false
    })

    const form = document.getElementById('profil_profileForm')
    form.addEventListener('submit', async (event) => {
        event.preventDefault()
        if (!document.getElementById('profil_github').checkValidity()) {
            alert('Please enter a valid GitHub URL.')
            return
        }
        await saveChanges()

        formFields.forEach((field) => (field.disabled = true))
        saveButton.disabled = true
    })
}

async function saveChanges() {
    const form = document.getElementById('profil_profileForm')
    const formData = new FormData(form)

    // Construct payload for the API
    const payload = {
        body: {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
            github: formData.get('github'),
        },
        files: {
            profilePicture: formData.get('profilePicture') || null,
            cv: formData.get('cv') || null,
        },
    }
    console.log('Payload : ' + JSON.stringify(payload, null, 2))

    const requestURL = getDynamicUrl('UPDATE_PROFIL', payload)

    const userdata = await fetchData(requestURL)

    if (userdata) {
        console.log('Profile updated successfully:')
        localStorage.setItem('username', formData.get('firstname'))
        window.location.href = '/pages/profile.html'
    } else {
        console.log('Error updating profile')
    }
}

function setupFileUploads() {
    const profilePicture = document.getElementById('profil_profilePicture')
    const profilePictureUpload = document.getElementById('profilePictureUpload')
    profilePicture.addEventListener('click', () => {
        profilePictureUpload.click()
    })

    profilePictureUpload.addEventListener('change', (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = function (e) {
                profilePicture.src = e.target.result
            }
            reader.readAsDataURL(file)
        }
    })

    const cvUpload = document.getElementById('cvUpload')
    cvUpload.addEventListener('change', (event) => {
        const file = event.target.files[0]
        if (file) {
            // Optionally display the file name or do any other required actions
            const cvLinkElement = document.getElementById('cvLink')
            cvLinkElement.href = URL.createObjectURL(file)
            cvLinkElement.style.display = 'block'
        }
    })
}
