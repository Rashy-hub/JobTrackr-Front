console.log('dashboard.js entry point')
import { loadPartial, dropDownHandler } from '../libs/partialHandlers.js'

loadPartial('../../partials/header.html', 'partial-header').then(() => {
    dropDownHandler()
})
