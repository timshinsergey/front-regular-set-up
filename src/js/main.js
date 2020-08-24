window.addEventListener('DOMContentLoaded', function() {
    initHamburger()
    initModalFormWindow()
    initAccordion()
	initValidationForm()
	setTimeout(inputsClassToggle, 100)
})

function initValidationForm() {
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
}

function initAccordion() {
    let acc = document.querySelectorAll('.accordion-btn')
    acc.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.disabled) return

            let alreadyOpened = btn.classList.contains('is-active')

            acc.forEach(el => {
                if (el.classList.contains('is-active')) {
                    el.classList.remove('is-active')
                    el.nextElementSibling.style.height = null
                }
            })

            if (!alreadyOpened) {
                btn.classList.add('is-active')

                let panel = btn.nextElementSibling

                if (panel.style.height) {
                    panel.style.height = null;
                } else {
                    panel.style.height = panel.scrollHeight + "px";
                }
            }

            btn.disabled = true
            setTimeout(() => btn.disabled = false, 100)
        })
    })
}

function initHamburger() {
	let hambs = document.querySelectorAll('.hamburger')

	hambs.forEach(hamb => {
		hamb.addEventListener('click', event => {
			if (hamb.disabled) return
	
			if (document.body.classList.contains('-menu-open')) {
				document.body.classList.remove('-menu-open')
			} else {
				document.body.classList.add('-menu-open')
			}
	
			hamb.disabled = true
			setTimeout(() => hamb.disabled = false, 100)
		})
	})
}

function initModalFormWindow() {
    const btns = document.querySelectorAll('[data-modal]')
    const closeBtns = document.querySelectorAll('.modal-close')
    btns.forEach(btn => {
        btn.addEventListener('click', event => {
			modalOpen(btn.dataset.modal, btn.dataset.video)
			
			event.preventDefault()
        })
    })
    closeBtns.forEach(close => {
        close.addEventListener('click', event => {
			let target = event.currentTarget

			modalClose(`#${target.closest('.modal').id}`)
        })
    })
}

function modalOpen(modalSel, video) {
	let modal = document.querySelector(modalSel)
	let openedModals = document.querySelectorAll('.modal.-is-open')

	if (openedModals.length) {
		openedModals.forEach(openedModal => { modalClose(`#${openedModal.id}`) })
	}

	document.body.classList.add('-modal-open')
	modal.classList.add('-is-open')
	if (video != undefined) {
		if (modal.querySelector('iframe').src.indexOf('youtube')) {
			modal.querySelector('iframe').src = modal.querySelector('iframe').src + '?autoplay=1'
		}
	}

	window.onclick = function(event) {  
		if (event.target == modal) {
			modalClose(`#${modal.id}`)
		}
	}

	inputsClassToggle()
}

function modalClose(modalSel) {
	let modal = document.querySelector(modalSel)

	if (document.body.classList.contains('-modal-open')) {
		document.body.classList.remove('-modal-open')
	}
	
	modal.classList.remove('-is-open')
	if (modal.querySelector('iframe')) {
		if (modal.querySelector('iframe').src.indexOf('youtube')) {
			modal.querySelector('iframe').src = modal.querySelector('iframe').src + '?autoplay=0'
		}
	}
}

function inputsClassToggle() {
	let inputs = document.querySelectorAll('input[type="tel"], input[type="text"], input[type="password"], input[type="email"], textarea')
	inputs.forEach(input => {
		if (input.value) {
			input.classList.add('-not-empty')
		} else {
			input.classList.remove('-not-empty')
		}
		input.addEventListener('change', function() {
			if (this.value) {
				this.classList.add('-not-empty')
			} else {
				this.classList.remove('-not-empty')
			}
		})
	})
}