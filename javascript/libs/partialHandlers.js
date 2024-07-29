async function loadPartial(url, elementId) {
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error('Network response was not ok')
        }
        const html = await response.text()
        document.getElementById(elementId).innerHTML = html
    } catch (error) {
        console.error('Error loading partial:', error)
    }
}

function dropDownHandler() {
    const dropDownButton = document.getElementById('dropbtn')
    console.log(dropDownButton)
    dropDownButton.addEventListener('click', (event) => {
        console.log('dropdown menu clicked')
        dropDownButton.classList.toggle('show')
    })
    window.onclick = function (e) {
        if (!e.target.matches('.dropbtn')) {
            let myDropdown = document.getElementById('dropbtn')
            if (myDropdown.classList.contains('show')) {
                myDropdown.classList.remove('show')
            }
        }
    }
}

export { loadPartial, dropDownHandler }

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById('myDropdown').classList.toggle('hide')
    // Close the dropdown if the user clicks outside of it
}
