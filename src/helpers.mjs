import { curry } from '../node_modules/ramda/src/index.mjs'

export const roundToNDecimals = curry((decimals, number) => Math.round(number * 10 ** decimals) / 10 ** decimals)
