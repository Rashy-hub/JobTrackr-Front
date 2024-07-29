console.log('main entry point - app.js ')
let token = localStorage.getItem('token')
let username = localStorage.getItem('username')
if (token & username) {
    window.location.href = '../pages/dashboard.html'
} else {
    window.location.href = '../pages/login.html'
}
