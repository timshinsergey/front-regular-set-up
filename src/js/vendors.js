// слайдер
import Swiper from 'swiper/bundle'
// ленивая загрузка медиаконтента(картинки, видео с ютуб, карты и тд)
import 'lazysizes'
// лайтбокс
import 'fslightbox'
// валидация формы
import Pristine from 'pristinejs'
// создание масок для инпутов
import IMask from 'imask'
// кастомный дейтпикер
import flatpickr from 'flatpickr'
import { Russian } from 'flatpickr/dist/l10n/ru.js'

window.onload = function() {
    const forms = document.querySelectorAll('form')
    forms.forEach(form => {
        const pristine = new Pristine(form)
        form.addEventListener('submit', function (e) {
           e.preventDefault()
           const valid = pristine.validate()
        })
    })
}

document.querySelectorAll('[type="tel"]').forEach(phone => IMask(phone, { mask: '+{7}(000)000-00-00' }))

flatpickr('[data-date]', {
    dateFormat: 'd.m.Y',
    locale: Russian,
    defaultDate: 'today',
    disable: [
        function(date) {
            return (date > new Date());
        }
    ],
})