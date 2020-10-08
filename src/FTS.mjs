import { evolve, splitEvery, map } from '../node_modules/ramda/src/index.mjs'
import { roundToNDecimals } from './helpers.mjs'

export default class FTS {
  static prettify(json) {
    const sizeZ = json.sceneHeader.sizeZ

    json.cells = map(evolve({
      polygons: map(evolve({
        type: type => type.toString(2).padStart(28, '0')
      }))
    }), json.cells)

    json.portals = map(evolve({
      polygons: map(evolve({
        type: type => type.toString(2).padStart(28, '0')
      }))
    }), json.portals)

    delete json.sceneHeader.sizeX
    delete json.sceneHeader.sizeZ

    // TODO: make this optional with a flag, because this is a one way transformation
    json = this.roundNumbers(json, 3)

    json.cells = splitEvery(sizeZ, json.cells)

    return json
  }

  static uglify(json) {
    json.sceneHeader.sizeZ = json.cells.length
    json.sceneHeader.sizeX = json.cells[0].length

    json.cells = flatten(json.cells)

    json.cells = map(evolve({
      polygons: map(evolve({
        type: type => parseInt(type, 2)
      }))
    }), json.cells)

    json.portals = map(evolve({
      polygons: map(evolve({
        type: type => parseInt(type, 2)
      }))
    }), json.portals)

    return json
  }

  static roundNumbers(json, decimals) {
    const round = roundToNDecimals(decimals)
    const roundVector3 = evolve({ x: round, y: round, z: round })

    return evolve({
      header: {
        version: round
      },
      sceneHeader: {
        version: round
      },
      cells: map(evolve({
        polygons: map(evolve({
          vertices: map(evolve({
            posX: round,
            posY: round,
            posZ: round,
            texU: round,
            texV: round
          })),
          norm: roundVector3,
          norm2: roundVector3,
          normals: map(roundVector3),
          area: round
        }))
      })),
      anchors: map(evolve({
        data: {
          position: roundVector3
        }
      })),
      roomDistances: map(evolve({
        startPosition: roundVector3
      }))
    }, json)
  }
}
