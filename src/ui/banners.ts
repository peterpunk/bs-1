import figlet from 'figlet'

const log = console.log

export function gameTitle() {
  log(figlet.textSync('Battleship-1', {
    font: 'Block',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 120,
    whitespaceBreak: true
  }))
}

export function gameEnd(rank: string) {
  log(figlet.textSync(rank, {
    font: 'Block',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    width: 120,
    whitespaceBreak: true
  }))
}



