window.addEventListener("DOMContentLoaded", function () {
	initHamburger();
	initModalFormWindow();
	initPhoneMask();
	initAccordion();
	initValidationForm();
	setTimeout(inputsClassToggle, 100);

	// кастомный дейтпикер
	flatpickr("[data-date]", {
		dateFormat: "d.m.Y",
		locale: "ru",
		defaultDate: "today",
		disable: [
			function (date) {
				return date > new Date();
			},
		],
	});
});

window.onload = function () {
	const forms = document.querySelectorAll("form");
	forms.forEach((form) => {
		const pristine = new Pristine(form);
		form.addEventListener("submit", function (e) {
			e.preventDefault();
			const valid = pristine.validate();
		});
	});
};

function initValidationForm() {
	let forms = document.querySelectorAll("form");
	if (forms.length) {
		forms.forEach((form) => {
			let pristine = new Pristine(form);
			form.addEventListener("submit", function (e) {
				e.preventDefault();
				pristine.validate();
			});
		});
	}
}

function initPhoneMask() {
	document
		.querySelectorAll('[type="tel"]')
		.forEach((phone) => IMask(phone, { mask: "+{7}(000)000-00-00" }));
}

function initAccordion() {
	let acc = document.querySelectorAll(".accordion-btn");
	acc.forEach((btn) => {
		btn.addEventListener("click", () => {
			if (btn.disabled) return;

			let alreadyOpened = btn.classList.contains("is-active");

			acc.forEach((el) => {
				if (el.classList.contains("is-active")) {
					el.classList.remove("is-active");
					el.nextElementSibling.style.height = null;
				}
			});

			if (!alreadyOpened) {
				btn.classList.add("is-active");

				let panel = btn.nextElementSibling;

				if (panel.style.height) {
					panel.style.height = null;
				} else {
					panel.style.height = panel.scrollHeight + "px";
				}
			}

			btn.disabled = true;
			setTimeout(() => (btn.disabled = false), 100);
		});
	});
}

function initHamburger() {
	let hambs = document.querySelectorAll(".hamburger");

	hambs.forEach((hamb) => {
		hamb.addEventListener("click", (event) => {
			if (hamb.disabled) return;

			if (document.body.classList.contains("-menu-open")) {
				document.body.classList.remove("-menu-open");
			} else {
				document.body.classList.add("-menu-open");
			}

			hamb.disabled = true;
			setTimeout(() => (hamb.disabled = false), 100);
		});
	});
}

function inputsClassToggle() {
	let inputs = document.querySelectorAll(
		'input[type="tel"], input[type="text"], input[type="password"], input[type="email"], textarea'
	);
	inputs.forEach((input) => {
		if (input.value) {
			input.classList.add("-not-empty");
		} else {
			input.classList.remove("-not-empty");
		}
		input.addEventListener("change", function () {
			if (this.value) {
				this.classList.add("-not-empty");
			} else {
				this.classList.remove("-not-empty");
			}
		});
	});
}

function loadSvgSpriteSymbol(path) {
	// загрузка свг спрайта
	fetch(`${path}?${new Date().getTime()}`)
		.then((response) => {
			if (!response.ok) {
				throw new Error("Загрузка спрайта прошла неуспешно");
			}
			return response.text();
		})
		.then((text) => {
			let div = document.createElement("div");
			div.style.display = "none";

			div.innerHTML = text;

			document.body.appendChild(div);
		})
		.catch((error) => {
			console.error("Возникла проблема с операцией получения: ", error);
		});
}
