window.addEventListener('DOMContentLoaded', function() {
    initModalFormWindow()
    setAccordion()
    
    // кастомный дейтпикер
    flatpickr('[data-date]', { 'locale': 'ru' })
    // маска телефона
    let phoneInputs = document.querySelectorAll('[type="tel"]')
    if (phoneInputs.length) {
        phoneInputs.forEach(phone => {
            IMask(phone, {
                mask: '+{7}(000)000-00-00'
            })
        })
    }
    let forms = document.querySelectorAll('form')
    if (forms.length) {
        forms.forEach(form => {
            let pristine = new Pristine(form)
            form.addEventListener('submit', function (e) {
                e.preventDefault()
                pristine.validate()
            })
        })
    }
})

function initModalFormWindow() {
    const btns = document.querySelectorAll('[data-modal]')
    const closeBtns = document.querySelectorAll('.modal-close')
    btns.forEach(btn => {
        btn.addEventListener('click', event => {
            let target = event.currentTarget
            let modal = document.getElementById(target.dataset.modal)

            document.body.classList.add('-no-scroll')
            modal.style.display = 'block'
            window.onclick = function(event) {  
                if (event.target == modal) {
                    modal.style.display = 'none'
                }
            }
        })
    })
    closeBtns.forEach(close => {
        close.addEventListener('click', event => {
            let target = event.currentTarget

            document.body.classList.remove('-no-scroll')
            target.closest('.modal').style.display = 'none'
        })
    })
}

function setAccordion() {
    let accordionBtns = document.querySelectorAll('.accordion-btn')
    accordionBtns.forEach(btn => {
        let content = btn.previousElementSibling
        let maxHeight = btn.dataset.accordionHeight

        if (content.scrollHeight <= maxHeight) return

        btn.style.display = 'inline-block'

        btn.addEventListener('click', () => {
            let text

            if (content.style.height) {
                content.style.height = null
            } else {
                content.style.height = content.scrollHeight + 'px'
            }

            text = btn.dataset.accordionText
            btn.dataset.text = btn.innerHTML
            btn.innerHTML = text
        })
    })
}