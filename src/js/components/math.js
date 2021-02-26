// сумма
export const sum = (...terms) => terms.reduce((sum, term) => sum + term)
// пример входных данных sum(1, 3, 4, 5)
// на выходе: 13

// разность
export const difference = (...nums) => nums.reduce((minuend, subtrahend) => minuend - subtrahend)
// пример входных данных difference(13, 5, 1, 5)
// на выходе: 2

// Наименьший общий делитель(алгоримт Евклида)
// Наибольшим общим делителем чисел a и b называется наибольшее число, на которое a и b делятся без остатка.
export const gcd = (x, y) => x !== 0 ? gcd(y % x, x) : y
// пример входных данных gcd(9, 12)
// на выходе: 3

// Наименьшее общее кратное
export const lcm = (x, y) => x * y / gcd(x, y)
// пример входных данных lcm(9, 12)
// на выходе: 3