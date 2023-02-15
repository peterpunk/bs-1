import { ASCII_ALPHA_START, Battlefield, Board, DEFAULT_COLUMNS, DEFAULT_ROWS, positionToCoordinates, Results } from '../game/battlefield'
import { config } from '../game/config'
import { gameEnd } from './banners'
const log = console.log

function resultText(result: Results) {
  switch(result) {
    case Results.HIT:
      return `  ~~~\\*/~~~ [ Hit! ]`
    case Results.SUNK:
      return '  ~~.oO~~~ [ SUNK ]'
    default:
      return '  ~~~~.~~~~ [ Miss ]'
  }
}

export function presentResult(result: Results) {
  log('')
  log(resultText(result))
  log('')
}

export function drawBoard(board:Board):void {
  log('')
  board.forEach((row) => {
    log(row)
  })
  log('')
}

export function shoots(shootCounter: number):void {
  log('')
  log('Number of shoots:', shootCounter)
  log('')
}

export function board(battleField: Battlefield):Array<string> {
  let board = []
  let header = Array(10).fill(0).map((elem, index) => {
    return String.fromCharCode(ASCII_ALPHA_START + index)
  }).join('  ')
  board.push(`    ${header}`)  
  for(let i=0; i < 10; i++) {
    let row = `${i+1} `.padStart(3)
    for(let j=0; j < 10; j++) {
      const coord = positionToCoordinates([j, i])
      const ship = battleField.find((shipNode) => shipNode.coord === coord) 
      row+= (ship) ? `[•]` : `[ ]`
    }
    board.push(row)
  }
  return board

}

/*

I added this to make more enjoyable. I know was not on the requirements, but as a game player I added it to make it more funny.

*/

const minShootsToWin = config.plan.reduce((accum, ship) => accum + ship.size, 0)

const RANKS = [
  {
    min: minShootsToWin,
    max: minShootsToWin,
    title: 'Cheater!',
    text: 'I won`t play with you again'
  },
  {
    min: minShootsToWin + 1,
    max: minShootsToWin + 10,
    title: 'Too lucky!',
    text: 'Hmmm. You should play lottery',
  },
  {
    min: minShootsToWin + 11,
    max: minShootsToWin + 20,
    title: 'Wow',
    text: 'I think you are pretty pretty pretty good...',
  },
  {
    min: minShootsToWin + 21,
    max: minShootsToWin + 30,
    title: 'Excellent',
    text: 'Well done. I\'ll arrange my ships better next time',
  },
  {
    min: minShootsToWin + 31,
    max: minShootsToWin + 40,
    title: 'Not Bad',
    text: 'Not bad, but I\'m getting bored',
  },
  {
    min: minShootsToWin + 41,
    max: DEFAULT_ROWS * DEFAULT_COLUMNS,
    title: 'Try Again',
    text: 'Try again, and again, and again.',
  },
  {
    min: DEFAULT_ROWS * DEFAULT_COLUMNS,
    max: 1000,
    title: 'WFT',
    text: 'Are you repeating shoots?',
  },
]

export function getRank(shootCounter: number) {
  return RANKS.find((r) => shootCounter >= r.min && shootCounter <= r.max) || RANKS[0]
}

export function displayRank() {
  const formatNumber = (n: number) => n.toString().padStart(4)
  log('')
  log('')
  log(`        score     [•]     rank      `)
  log('---------------------------------------')
  RANKS.forEach((rank) => {
    log(`   ${formatNumber(rank.min)} - ${formatNumber(rank.max)}    [•]  ${rank.title.padEnd(10)}      `)
    log('---------------------------------------')
  })
  log('')
}

export function eogScoring(shootCounter: number) {
  const rank = RANKS.find((r) => shootCounter >= r.min && shootCounter <= r.max) || RANKS[0]
  log('[•][•][•][•][•][•][•][•][•][•][•]')
  log('[•]                           [•]')
  log('[•]         Game Over         [•]')
  log('[•]                           [•]')
  log('[•][•][•][•][•][•][•][•][•][•][•]')

  log('')
  shoots(shootCounter)
  log('')
  gameEnd(rank.title)
  log(rank.text)
  log('')
}

export function intro() {
  log('Welcome to Battleship-1!')
  log('')
  log('Battleship (also known as Battleships or Sea Battle is a strategy type guessing game for two players.') 
  log('It is played on ruled grids (paper or board) on which each player\'s fleet of warships are marked.')
  log('The locations of the fleets are concealed from the other player.')
  log('Players alternate turns calling "shots" at the other player\'s ships, and the objective of the game is to destroy the opposing player\'s fleet.')
  log('More info at: https://en.wikipedia.org/wiki/Battleship_(game)')
  log('')
  log(`This version is a one-side Battleship game where I, as the computer player, will place ${config.plan.length} ships in total and`)
  config.plan.forEach((ship) => {
    log(`${ship.name} size ${ship.size}`)
  })
  log(`The board size will be ${DEFAULT_COLUMNS} x ${DEFAULT_ROWS}`)
  log(`Where the columns will be indentified by letters from A to J and the rows will be indentified by numbers from 1 to 10`)
  log('')
  log('To play the game you should enter the coordinates of your shoot in the format ColumnNumber like D2')
  log('As a result of your shoot you will get 3 types: Miss, Hit or Sunk.')
  log('Where:' )
  log('  Miss: represents that you just drop the bomb on the water, no damage to any opponent ship.')
  log('  Hit: represents that you hitted one opponent ship but the ship is not sunk yet.')
  log('  Sunk: represents that you hitted the last part of the opponent ship and the ship is sunk.')
  log('')
  log('> Your mission is to sunk my ships with less shoots as possible. <')
  log('')
  log(`The game will end when you sunk all the ${config.plan.length} ships.`)
  log('')
  log('You can exit the game at any time with the command X0')
  log('')
}

export function displayExit() {
  log('')
  log('You quitted the game.')
}

export function displayThanks() {
  log('')
  log('Thanks for playing.')
  log('')
}

export function startingGame() {
  log('')
  log('Start shooting now...')
  log('')
}
