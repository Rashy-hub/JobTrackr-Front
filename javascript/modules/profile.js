// profile.js

console.log('profile.js entry point')
import {
    infoDialogHandler,
    setupDropdownVisibility,
} from '../libs/modalHandler.js'
import { initParticles } from '../libs/particle-style.js'
import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'

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

window.addEventListener('load', function () {
    initParticles()
    setupDropdownVisibility()
    getProfilAndLoadDom()
    saveHandler()
    ContentTools.EditorApp.get().init('*[data-editable]')
})

async function getProfilAndLoadDom() {
    const requestURL = getDynamicUrl('GET_PROFIL')
    console.log('Going to get profile for current user')
    const result = await fetchData(requestURL)
    console.log(result)

    if (result) {
        document.getElementById('profil_firstname').innerText =
            result.firstname || ''
        document.getElementById('profil_lastname').innerText =
            result.lastname || ''
        document.getElementById('profil_email').innerText = result.email || ''
        document.getElementById('profil_github').innerText = result.github || ''
        document.getElementById('profil_cv').innerText = result.cv || ''

        const profilePictureElement = document.getElementById(
            'profil_profilePicture'
        )
        console.log(profilePictureElement)
        if (result.profilePicture.url) {
            profilePictureElement.src = result.profilePicture.url
        } else {
            profilePictureElement.src = '../assets/profil.jpg' // Default profile picture
        }
    }
}

function saveHandler() {
    document
        .getElementById('profil_saveButton')
        .addEventListener('click', () => saveChanges())
}

async function saveChanges() {
    const editor = ContentTools.EditorApp.get()
    const regions = editor.regions()

    const data = {}
    for (let name in regions) {
        if (regions.hasOwnProperty(name)) {
            data[name] = regions[name].html()
        }
    }

    // Récupérer les données des éléments éditables
    const firstname = document.getElementById('profil_firstname').innerText
    const lastname = document.getElementById('profil_lastname').innerText
    const email = document.getElementById('profil_email').innerText
    const github = document.getElementById('profil_github').innerText
    const cv = document.getElementById('profil_cv').innerText

    // Construire le payload
    const payload = {
        body: {
            firstname: firstname,
            lastname: lastname,
            email: email,
            github: github,
            password: '', // Si nécessaire, à récupérer ou ajouter autrement
            confirmPassword: '', // Si nécessaire, à récupérer ou ajouter autrement
        },
        files: {
            profilePicture: null, // Récupération à implémenter si nécessaire
            cv: cv || null,
        },
    }

    // Get the request URL configuration
    const requestURL = getDynamicUrl('REGISTER_USER', payload)

    // Fetch data and handle response
    const userdata = await fetchData(requestURL)
}
