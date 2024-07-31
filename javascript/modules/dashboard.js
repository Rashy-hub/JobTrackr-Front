console.log('dashboard.js entry point')

const token = localStorage.getItem('token')
const userId = localStorage.getItem('userID')
const userName = localStorage.getItem('username')
if (!token && !userId && !userName) {
    window.location.href = '/pages/login.html'
}

const logoutButton = document.getElementById('logoutButton')
logoutButton.addEventListener('click', (event) => {
    localStorage.clear('token')
    localStorage.clear('userID')
    localStorage.clear('username')

    window.location.href = '/pages/login.html'
})
