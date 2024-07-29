import { loadPartial, dropDownHandler } from '../libs/partialHandlers.js'

console.log('login.js entry point')

loadPartial('../../partials/header.html', 'partial-header').then(() => {
    dropDownHandler()
})
