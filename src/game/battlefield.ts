import { randomIntFromInterval } from "../lib"

export const DEFAULT_ROWS = 10
export const DEFAULT_COLUMNS = 10
export const ASCII_ALPHA_START = 65
export const ASCII_NUMBER_START = 48
export const EXIT_COMMAND = 'X0';

export type ShipType = {
  size: number,
  name: string,
}

export enum Results {
  MISS,
  HIT,
  SUNK,
}

export type ShipNode = {
  coord: Coordinate,
  sunk: boolean,
  id: number,
}

export type ShootUpdate = {
  battleField: Battlefield,
  result: Results,
  endGame: boolean,
  exited: boolean,
}

export type Board = Array<string>

export type Coordinate = `${string}${number}${number | ''}`

export type Battlefield = Array<ShipNode>

type Shoot = [number, number]

type Position = [number, number]

type BattlefieldRange = [number, number]

export function northWestCoord(coord: Coordinate): Coordinate {
  return westCoord(northCoord(coord))
}

export function northEastCoord(coord: Coordinate): Coordinate {
  return eastCoord(northCoord(coord))
}

export function southWestCoord(coord: Coordinate): Coordinate {
  return southCoord(westCoord(coord))
}

export function southEastCoord(coord: Coordinate): Coordinate {
  return southCoord(eastCoord(coord))
}

export function westCoord([column, row, row1]: Coordinate): Coordinate {
  const colpos = column.charCodeAt(0) - ASCII_ALPHA_START
  const nextColpos = (colpos === 0) ? colpos : colpos - 1
  const nextRowPos = parseInt(`${row}${row1}`, 10) - 1
  return positionToCoordinates([nextColpos, nextRowPos])
}
export function eastCoord([column, row, row1]: Coordinate): Coordinate {
  const colpos = column.charCodeAt(0) - ASCII_ALPHA_START
  const nextColpos = (colpos === DEFAULT_COLUMNS - 1) ? colpos : colpos + 1
  const nextRowPos = parseInt(`${row}${row1}`, 10) - 1
  return positionToCoordinates([nextColpos, nextRowPos])
}

export function northCoord([column, row, row1]: Coordinate): Coordinate {
  const colpos = column.charCodeAt(0) - ASCII_ALPHA_START
  const rowPos = parseInt(`${row}${row1}`, 10) - 1
  const nextRowPos = (rowPos === 0) ? rowPos : rowPos - 1
  return positionToCoordinates([colpos, nextRowPos])
}

export function southCoord([column, row, row1]: Coordinate): Coordinate {
  const colpos = column.charCodeAt(0) - ASCII_ALPHA_START
  const rowPos = parseInt(`${row}${row1}`, 10) - 1
  const nextRowPos = (rowPos === DEFAULT_ROWS - 1) ? rowPos : rowPos + 1
  return positionToCoordinates([colpos, nextRowPos])
}

export function spreadArea(coord: Coordinate): Coordinate[] {
  const spreaded: Coordinate[] = []
  spreaded.push(northEastCoord(coord))
  spreaded.push(northCoord(coord))
  spreaded.push(northWestCoord(coord))
  spreaded.push(westCoord(coord))
  spreaded.push(southWestCoord(coord))
  spreaded.push(southCoord(coord))
  spreaded.push(southEastCoord(coord))
  spreaded.push(eastCoord(coord))
  spreaded.push(coord)
  return spreaded
}

function checkCell(battleField: Battlefield, coord: Coordinate): ShipNode | void {
  return battleField.find((shipNode: ShipNode) =>
    spreadArea(shipNode.coord).find((c) => c == coord)
  )
}

export function positionToCoordinates([colpos, rowpos]: Position): Coordinate {
  const column = ASCII_ALPHA_START + colpos
  const row = rowpos + 1
  return `${String.fromCharCode(column)}${row}`
}

export function shipLocation(battleField: Battlefield, shipType: ShipType, shipId: number, orientation: 'H' | 'V', startPosition: Shoot): void | ShipNode[] {
  let nextNode = {
    sunk: false,
    coord: positionToCoordinates(startPosition),
    id: shipId,
  }
  let nextPosition = startPosition
  let shipNodes: ShipNode[] = []
  for (let shipCell = 0; shipCell < shipType.size; shipCell++) {
    shipNodes.push(nextNode)
    const occupied = (checkCell(battleField, nextNode.coord))
    if (occupied) return undefined
    nextPosition = (orientation === 'V') ? [nextPosition[0], nextPosition[1] + 1] : [nextPosition[0] + 1, nextPosition[1]];
    nextNode = {
      sunk: false,
      coord: positionToCoordinates(nextPosition),
      id: shipId,
    }
  }
  return battleField.concat(shipNodes)
}

function findPlaceForShip(battleField: Battlefield, shipType: ShipType, shipId: number, orientation: 'H' | 'V', possibleRangeCol: BattlefieldRange, possibleRangeRow: BattlefieldRange): ShipNode[] {
  const row = randomIntFromInterval(...possibleRangeRow)
  const column = randomIntFromInterval(...possibleRangeCol)
  const shipWithValidLocation = shipLocation(battleField, shipType, shipId, orientation, [column, row])
  if (!shipWithValidLocation) {
    return findPlaceForShip(
      battleField,
      shipType,
      shipId,
      orientation,
      possibleRangeCol,
      possibleRangeRow
    )
  }
  return shipWithValidLocation
}

function placeShip(battleField: Battlefield, shipType: ShipType, id: number): Battlefield {
  const orientation = (Math.round(Math.random()) === 0) ? 'H' : 'V';
  const maxInitialRow = (orientation === 'H') ? DEFAULT_ROWS - 1 : DEFAULT_ROWS - 1 - shipType.size;
  const maxInitialColumn = (orientation === 'V') ? DEFAULT_COLUMNS - 1 : DEFAULT_COLUMNS - 1 - shipType.size;
  return findPlaceForShip(
    battleField,
    shipType,
    id,
    orientation,
    [0, maxInitialColumn],
    [0, maxInitialRow],
  )
}

export function plan(shipTypes: ShipType[]): Battlefield {
  let plannedBattleField: ShipNode[] = []
  shipTypes.forEach((shipType: ShipType, index: number) => {
    plannedBattleField = placeShip(plannedBattleField, shipType, index)
  })
  return plannedBattleField
}

export function playerShoot(battleField: Battlefield, coord: Coordinate): ShootUpdate {
  let exited = (coord as string === EXIT_COMMAND)
  let result = Results.MISS;
  let endGame = false;
  const nextBattlefield = battleField.map((shipNode) => {
    if (shipNode.coord === coord) {
      const ship: Array<ShipNode> = battleField.filter((s) => (s.id === shipNode.id && s.coord !== coord))
      const isSunk: boolean = ship.every((n) => n.sunk)
      result = (isSunk) ? Results.SUNK : Results.HIT;
      return {
        ...shipNode,
        sunk: true,
      }
    }
    return shipNode
  })
  endGame = nextBattlefield.every((n) => n.sunk)
  return {
    battleField: nextBattlefield,
    result,
    endGame,
    exited,
  }
}
