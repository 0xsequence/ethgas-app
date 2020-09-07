export const log = (num: number, ...args: any[]) => {
  logConsole(colors[num][0], colors[num][1], ...args)
}

export const logInfo = (...args: any[]) => {
  logConsole('white', 'grey', ...args)
}

export const logNotice = (...args: any[]) => {
  logConsole('white', 'blue', ...args)
}

export const logWarn = (...args: any[]) => {
  logConsole('black', 'yellow', ...args)
}

export const logError = (...args: any[]) => {
  logConsole('white', 'red', ...args)
}

export const logConsole = (color: string, bgColor: string, ...args: any[]) => {
  console.log('%c%s', `color: ${color}; background: ${bgColor};`, ...args)
}

const colors = [
  // [fontColor, bgColor]
  ['black', 'white'], // 0, stock
  ['white', 'grey'], // 1
  ['white', 'blue'], // 2
  ['black', 'yellow'], // 3
  ['white', 'red'], // 4
  ['white', 'green'], // 5
  ['white', 'purple'] // 6
]
