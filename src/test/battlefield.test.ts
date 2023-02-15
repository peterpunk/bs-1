import { Coordinate, eastCoord, southCoord, positionToCoordinates, westCoord, northCoord, shipLocation, spreadArea, ShipNode, playerShoot, Results } from "../game/battlefield";
import { BATTLESHIP, DESTROYER } from "../game/ships";

describe('board coordinates', () => {
  describe('transformation from position to human coordinates', () => {
    it('should transform array positions too coordinates with letters', () => {
      expect(positionToCoordinates([0,0])).toBe('A1');
      expect(positionToCoordinates([9,9])).toBe('J10');
    });
  });  
})
describe('shipLocation', () => {
  describe('when ship orientation is Horizontal', () => {
    it('should place the ship matching the size and Horizontally', () => {
      expect(shipLocation([], DESTROYER, 0, 'H', [0,0])).toMatchObject([
        {
          sunk: false,
          coord: 'A1',
          id: 0,
        },
        {
          sunk: false,
          coord: 'B1',
          id: 0,
        },
        {
          sunk: false,
          coord: 'C1',
          id: 0,
        },
        {
          sunk: false,
          coord: 'D1',
          id: 0,
        },
      ])
    })
  });
  describe('when ship orientation is Vertical', () => {
    it('should place the ship matching the size and Vertically', () => {
      expect(shipLocation([], BATTLESHIP, 0, 'V', [0,0])).toMatchObject([
        {
          sunk: false,
          coord: 'A1',
          id: 0,
        },
        {
          sunk: false,
          coord: 'A2',
          id: 0,
        },
        {
          sunk: false,
          coord: 'A3',
          id: 0,
        },
        {
          sunk: false,
          coord: 'A4',
          id: 0,
        },
        {
          sunk: false,
          coord: 'A5',
          id: 0,
        },
      ])
    })
  });
  describe('when ship location overlaps with other', () => {
    it('placeship should return undefined', () => {
      const currentBattleField = [
        {
          sunk: false,
          coord: 'A1' as Coordinate,
          id: 0,
        },
        {
          sunk: false,
          coord: 'A2' as Coordinate,
          id: 0,
        },
        {
          sunk: false,
          coord: 'A3' as Coordinate,
          id: 0,
        },
        {
          sunk: false,
          coord: 'A4' as Coordinate,
          id: 0,
        },
        {
          sunk: false,
          coord: 'A5' as Coordinate,
          id: 0,
        },
      ]
      expect(shipLocation(currentBattleField, BATTLESHIP, 1, 'H', [0,3])).toBe(undefined)  
    })
  })
  describe('when ship location is touching other ship', () => {
    it('placeship should return undefined', () => {
      const currentBattleField = [
        {
          sunk: false,
          coord: 'A1' as Coordinate,
          id: 0,
        },
        {
          sunk: false,
          coord: 'A2' as Coordinate,
          id: 0,
        },
        {
          sunk: false,
          coord: 'A3' as Coordinate,
          id: 0,
        },
        {
          sunk: false,
          coord: 'A4' as Coordinate,
          id: 0,
        },
        {
          sunk: false,
          coord: 'A5' as Coordinate,
          id: 0,
        },
      ]
      expect(shipLocation(currentBattleField, BATTLESHIP, 1, 'H', [1,3])).toBe(undefined)  
    })
  })
    describe('ships cannot be located together', () => {
      describe('checking ship boundaries for a ship position', () => {
        describe('getting all the positions that should be empty', () => {
          describe('with a position A1', () => {            
            it('should return an Array including ', () => {
              const expected = 'A1 A2 B1 B2'.split(' ')
              expect(spreadArea('A1')).toEqual(expect.arrayContaining(expected))
            })
          })
          describe('with a position E5', () => {
            it('should return an Array including D4 E4 F4 D5 E5 F5 D6 E6 F6', () => {
              const expected = 'D4 E4 F4 D5 E5 F5 D6 E6 F6'.split(' ')
              expect(spreadArea('E5')).toEqual(expect.arrayContaining(expected))
            })
          })
          describe('with a position J10', () => {
            it('should return an Array including J10 J9 I10 I9', () => {
              const expected = 'J10 J9 I10 I9'.split(' ')
              expect(spreadArea('J10')).toEqual(expect.arrayContaining(expected))
            })
          })
        })
    })
  })
  describe('getting valid coordinates for the game', () => {
    describe('columns are letters from A to J and rows are numbers from 1 to 10', () => {
      describe('with coordinate A1', () => {
        describe('next column', () => {
          it('should be B1', () => {
            expect(eastCoord('A1')).toBe('B1')
          })
        })
        describe('prev column', () => {
          it('should be A1', () => {
            expect(westCoord('A1')).toBe('A1')
          })
        })
        describe('next row', () => {
          it('should be A2', () => {
            expect(southCoord('A1')).toBe('A2')
          })
        })
        describe('prev row', () => {
          it('should be A1', () => {
            expect(northCoord('A1')).toBe('A1')
          })
        })
      })
      describe('with coordinate J10', () => {
        describe('next column', () => {
          it('should be J10', () => {
            expect(eastCoord('J10')).toBe('J10')
          })
        })
        describe('prev column', () => {
          it('should be I10', () => {
            expect(westCoord('J10')).toBe('I10')
          })
        })
        describe('next row', () => {
          it('should be J10', () => {
            expect(southCoord('J10')).toBe('J10')
          })
        })
        describe('prev row', () => {
          it('should be J9', () => {
            expect(northCoord('J10')).toBe('J9')
          })
        })
      })
    })
  })
});
describe('shooting the ships', () => {
  let battleField:ShipNode[] = []
  const ship1 = shipLocation(battleField, DESTROYER, 0, 'H', [0,0])
  const ship2 = shipLocation(battleField, DESTROYER, 1, 'H', [0,5])
  battleField = battleField.concat(ship1!).concat(ship2!)
  describe('when shooting an empty location', () => {
    it('should return miss', () => {
      expect(playerShoot(battleField, 'F4')).toHaveProperty('result', Results.MISS)
    })
  })
  describe('when shooting an ship location', () => {
    it('should return miss', () => {
      expect(playerShoot(battleField, 'A1')).toHaveProperty('result', Results.HIT)
    })
  })
  describe('when shooting an ship location and is the last slot of the ship', () => {
    it('should return sunk', () => {
      battleField[0].sunk = true
      battleField[1].sunk = true
      battleField[2].sunk = true
      expect(playerShoot(battleField, 'D1')).toHaveProperty('result', Results.SUNK)
    })
  })

})