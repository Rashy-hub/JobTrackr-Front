console.log('profile.js entry point')
function enableEdit() {
    const inputs = document.querySelectorAll('#profil_profileForm input')
    inputs.forEach((input) => {
        input.removeAttribute('readonly')
        input.style.backgroundColor = 'white'
    })

    document.getElementById('profil_editButton').style.display = 'none'
    document.getElementById('profil_saveButton').style.display = 'block'
}

function saveChanges() {
    const inputs = document.querySelectorAll('#profil_profileForm input')
    inputs.forEach((input) => {
        input.setAttribute('readonly', 'readonly')
        input.style.backgroundColor = '#e9ecef'
    })

    document.getElementById('profil_editButton').style.display = 'block'
    document.getElementById('profil_saveButton').style.display = 'none'
}
