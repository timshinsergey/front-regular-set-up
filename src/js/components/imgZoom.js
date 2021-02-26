function imgZoomInit() {
	let containers = document.querySelectorAll('.img-zoom-container')

	if (document.documentElement.clientWidth < 1025 || !containers.length) return
	
	containers.forEach(container => {
		imgZoom(container)
	})
}
function imgZoom(container) {
	let img = container.querySelector('.img-zoom-img')
	// если картинка лениво не загрузилась,
	// то и нет смысла продолжать
	// инициализировать imgZoom(вопрос производительности)
	if (img.classList.contains('lazyload') || document.documentElement.clientWidth < 1025) return

	let lensWrap = container.querySelector('.img-zoom-lens-wrap')
	let lens = lensWrap.querySelector('.img-zoom-lens')

	let cx = 1
	let cy = 1
	let scale = 1.5
	
	lens.style.backgroundImage ='url("' + img.src + '")'
	lens.style.backgroundSize = (img.width * cx) + 'px ' + (img.height * cy) + 'px'

	lensWrap.addEventListener("mousemove", moveLens)
	img.addEventListener("mousemove", moveLens)
	lensWrap.addEventListener("touchmove", moveLens)
	img.addEventListener("touchmove", moveLens)
	lensWrap.addEventListener("wheel", zoom)
	function moveLens(e) {
		e.preventDefault()
	
		let pos = getCursorPos(e)

		let x = pos.x - (lensWrap.offsetWidth / 2)
		let y = pos.y - (lensWrap.offsetHeight / 2)
		
		if (x > img.width - lensWrap.offsetWidth) x = img.width - lensWrap.offsetWidth
		if (x < 0) x = 0
		if (y > img.height - lensWrap.offsetHeight) y = img.height - lensWrap.offsetHeight
		if (y < 0) y = 0
		
		lensWrap.style.left = x + 'px'
		lensWrap.style.top = y + 'px'
		
		lens.style.backgroundPosition = "-" + (x * cx) + 'px -' + (y * cy) + 'px'
	}
	function getCursorPos(e) {
		let x = 0
		let y = 0
	
		e = e || window.event
		
		let position = img.getBoundingClientRect()
		
		x = e.pageX - position.left
		y = e.pageY - position.top
		
		x = x - window.pageXOffset
		y = y - window.pageYOffset
	
		return {x, y}
	}
	function zoom(e) {
		e.preventDefault()

		let min = 1.25
		let max = 2.5
		
		scale += e.deltaY * -0.01

		scale = Math.min(Math.max(.125, scale), 4)

		if (min > scale || scale > max) return

		lens.style.transform = `scale(${scale})`
	}
}
// если подключена ленивая загрузка картинок lazysizes.js
document.addEventListener('lazyloaded', function(e){
	// для лучшей произодительности
	// запускаем imgZoom,
	// когда картинка лениво загрузилась
	if (e.target.closest('.img-zoom-container')) {
		imgZoom(e.target.closest('.img-zoom-container'))
	}
})
// если нужен imgZoom в swiper slider
// конкретно обратить внимание на событие
// lazyImageReady
let textSwiper = new Swiper('.example .swiper-container', {
    preloadImages: false,
    lazy: true,
    slidesPerView: 1,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        type: 'fraction',
    },
    on: {
        // для лучшей произодительности
        // запускаем imgZoom,
        // когда картинка лениво загрузилась
        lazyImageReady: function () {
            imgZoom(this.slides[this.realIndex].querySelector('.img-zoom-container'))
        },
    }
})