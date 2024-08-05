export const infoDialogHandler = (jsonResponse) => {
    const { title, message } = jsonResponse
    const dialog = document.querySelector('.dialog')
    const dialogOkButton = document.querySelector('.dialog_button')
    const dialogHeader = document.querySelector('.dialog_header .dialog_title')
    const dialogBody = document.querySelector('.dialog_body .dialog_message')

    dialogHeader.textContent = title
    dialogBody.textContent = message
    dialog.showModal()

    dialogOkButton.addEventListener('click', () => {
        dialog.close()
    })
}

export function setupDropdownVisibility() {
    const dropdown = document.querySelector('.dropdown')
    const dropdownContent = document.querySelector('.dropdown-content')

    let timeout

    dropdown.addEventListener('mouseenter', () => {
        clearTimeout(timeout)
        dropdownContent.style.display = 'block'
    })

    dropdown.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            dropdownContent.style.display = 'none'
        }, 300) // Delay in milliseconds before hiding the menu
    })

    dropdownContent.addEventListener('mouseenter', () => {
        clearTimeout(timeout)
    })

    dropdownContent.addEventListener('mouseleave', () => {
        timeout = setTimeout(() => {
            dropdownContent.style.display = 'none'
        }, 300) // Delay in milliseconds before hiding the menu
    })
}
