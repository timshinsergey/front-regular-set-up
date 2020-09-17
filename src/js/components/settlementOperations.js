// Возвращает длину самого длинного слова в строке
export const findLongestWordLength = str => Math.max(...str.split(" ").map(word => word.length))
// пример входных данных findLongestWordLength('May the force be with you!')
// на выходе: 5

// Вовзращает массив с самыми большими числами в поддмассивах
export const largestOfAll = arr => arr.map(el => Math.max(...el))
// пример входных данных largestOfAll([[4, 5, 1, 3], [13, 27, 18, 26], [32, 35, 37, 39], [1000, 1001, 857, 1]])
// на выходе: [5, 27, 39, 1001]

// Возвращает булево значение
// оканчивается ли строка на второй аргумент
export const confirmEnding = (str, target) => str.slice(-target.length) === target
// пример входных данных confirmEnding('May the force be with you!', 'you!')
// на выходе: true

// Вовзвращает повторяющуюся входную строку на указанное количество раз,
// если количество раз отрицательное или равно нулю,
// то возвращает ''
export const repeatStringNumTimes = (str, num) => num > 0 ? str + repeatStringNumTimes(str, num - 1) : ''
// пример входных данных repeatStringNumTimes('abc', 3)
// на выходе: 'abcabcabc'

// Возвращает обрезанную строку, если она длиннее указанной длины,
// если указанная длина больше длины строки,
// то возвращает полную строку
export const truncateString = (str, num) => str.length > num ? str.slice(0, num) + '...' : str
// пример входных данных truncateString('May the force be with you', 5)
// на выходе: 'May t...'

// Возвращает первый элемент в массиве, который
// удовлетворил требованию указанной функции,
// в противном случае возвращает undefined
export const findFirstTrueElement = (arr, func) => arr.find(func)
// пример входных данных findFirstTrueElement([1, 2, 3, 4], num => num % 2 === 0)
// на выходе: 2

// Возвращает булево значение
// является ли входное значение булевым
export const isBoolean = val => typeof val === 'boolean'
// пример входных данных isBoolean([1, 2, 3, 4])
// на выходе: false

// Возвращает строку с первыми заглавными буквами в каждом слове,
// остальные буквы если были заглавными, станут прописными
export const titleCase = str => str.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase())
// пример входных данных titleCase('MAY THE FORCE BE WITH YOU!')
// на выходе: 'May The Force Be With You!'

// Возвращает массив без значений приравняемых к false
export const bouncer = arr => arr.filter(Boolean)
// пример входных данных bouncer([7, 'string', '', null, undefined, false, 0, 9])
// на выходе: [7, 'string', 9]

// Возвращает объект с координатам элемента относительно документа(страницы сайта)
export const getCoordsRelativeDocument = elem => {
    let box = elem.getBoundingClientRect()
  
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    }
}

// Возвращает объект с координатам элемента относительно окна браузера
export const getCoordsRelativeScreenBrowser = elem => {
    let box = elem.getBoundingClientRect()
  
    return {
      top: box.top,
      left: box.left
    }
}