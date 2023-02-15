import {
  ASCII_ALPHA_START, 
  ASCII_NUMBER_START,
  DEFAULT_ROWS,
  DEFAULT_COLUMNS,
  EXIT_COMMAND,
} from '../game/battlefield'

const parseErrorList = (errors: string[]): boolean|string => {
  if (errors.length === 0) return true
  return errors.join('\n and ')
}

export const validateShootCommand = (command:string):boolean|string => {
  const formattedCommand =  command.toUpperCase()
  if (formattedCommand === EXIT_COMMAND) return true
  const errors:string[] = []
  if (command.length < 2 || command.length > 3 || command.charCodeAt(1) < ASCII_NUMBER_START || command.charCodeAt(1) > ASCII_NUMBER_START + 9) {
    const error = `the command ${command} cannot be recongnized it should have a length of 2 or 3 chars format [ColumnNumber] valid examples B3, A10`
    errors.push(error)
  }
  const [column, ...row] = formattedCommand
  if (formattedCommand.charCodeAt(0) < ASCII_ALPHA_START || formattedCommand.charCodeAt(0) > ASCII_ALPHA_START + DEFAULT_COLUMNS) {
    const firstColumn = String.fromCharCode(ASCII_ALPHA_START).toUpperCase()
    const lastColumn = String.fromCharCode(ASCII_ALPHA_START + DEFAULT_COLUMNS - 1).toUpperCase()
    const error = `the column command "${column.toUpperCase()}" shoud be between ${firstColumn} and ${lastColumn}`
    errors.push(error)
  }
  if (parseInt(row.join(''), 10) < 1 || parseInt(row.join(''), 10) > DEFAULT_ROWS) {
    const error = `the row command "${column}" shoud be between 1 and ${DEFAULT_ROWS}`
    errors.push(error)
  }

  const result = parseErrorList(errors)
  return result
}