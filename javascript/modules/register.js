import { fetchData, getDynamicUrl } from '../libs/apiHandlers.js'

console.log('register.js entry point')

const myForm = document.forms[0]

myForm.onsubmit = (event) => {
    event.preventDefault()
    //firstname , lastname ,email,github,profile-picture,password,confirm-password
    const myfields = [
        'firstname',
        'lastname',
        'email',
        'github,profile-picture',
        'password',
        'confirmPassword',
    ]
    //FROM HERE I DONT KNOW IF IT IS CORRECT
    //I WANT TO BE ABLE TO SEND AN OBJECT LIKE KEY VALUE WITH ONLY THE FIELDS THAT ARE NOT EMPTY

    // Initialize an object to hold the filled fields
    const filledFields = {}

    for (const field of myfields) {
        const fieldElement = myForm.elements[field]
        if (fieldElement && fieldElement.value.trim()) {
            filledFields[field] = fieldElement.value.trim()
        }
    }

    fetchData(getDynamicUrl('REGISTER_USER', { body: filledFields })).then(
        (userdata) => {
            const username = userdata.user.firstname + userdata.user.lastname
            //in order to stay connected ?
            localStorage.setItem('token', userdata.token)
            localStorage.setItem('userID', userdata.user.id)
            localStorage.setItem('username', username)
            window.location.href = `/pages/login.html?email=${encodeURIComponent(
                userdata.user.email
            )}&password=${encodeURIComponent(
                myForm.elements['password'].value
            )}`
            // window.location.href = '../pages/login.html'
        }
    )

    console.log('submit event fired')
}
