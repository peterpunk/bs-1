import { prompt } from 'enquirer'
import { Coordinate, EXIT_COMMAND, plan, playerShoot } from '../game/battlefield'
import { config } from '../game/config'
import { gameTitle } from './banners'
import { drawBoard, presentResult, board, displayRank, eogScoring, intro, displayExit, displayThanks, startingGame } from './presenters'
import { validateShootCommand } from './validations'

const { Toggle } = require('enquirer')

type PlayerInput = {
  coord: Coordinate
}

async function wantToPlay(): Promise<boolean> {
  const prompt = new Toggle(
    {
      header:  '========================================',
      message:  'Do you want to play now?',
      footer:  '========================================',
      enabled: 'Yes',
      disabled: 'No',   
    }
  )
  return prompt.run()
}

async function gamePrompt(shootCounter: number):Promise<PlayerInput> {
  return prompt([
    {
      name: 'coord',
      message: `Please enter the coordinates of your shoot # ${shootCounter + 1}`,
      type: 'input',
      format: (p) => p.toUpperCase(), 
      validate: validateShootCommand,
      result: (p) => p.toUpperCase(), 
    }
  ])
}

export async function gameLoop() {
  let exited = false
  let endGame = false
  let currentBattleField = plan(config.plan)
  let gameBoard = board(currentBattleField)
  let result
  let shootCounter = 0
  gameTitle()
  intro()
  let startGame = await wantToPlay()
  if (config.cheatMode) {
    drawBoard(gameBoard)
  }
  startingGame()
  while(startGame && !endGame && !exited) {
    const shoot:PlayerInput = await gamePrompt(shootCounter)
    exited = (shoot.coord === EXIT_COMMAND) ? true : false
    if (exited) break
    ({ result, battleField:currentBattleField, endGame } = playerShoot(currentBattleField, shoot.coord))
    shootCounter++
    presentResult(result)
  }
  if (startGame && !exited) {
    gameBoard = board(currentBattleField)
    drawBoard(gameBoard)
    eogScoring(shootCounter)
    displayRank()
    displayThanks()
  } else if (startGame && exited) {
    displayExit()
    displayThanks()
  }
}