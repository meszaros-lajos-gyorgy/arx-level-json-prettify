#!/usr/bin/env node --experimental-modules

import fs from 'fs'
import minimist from 'minimist'
import { DLF, FTS } from '../src/index.mjs'
import { fileExists, getPackageVersion, streamToBuffer } from './helpers.mjs'

const args = minimist(process.argv.slice(2), {
  string: ['output'],
  boolean: ['version', 'pretty']
})

if (args.version) {
  console.log(getPackageVersion())
  process.exit(0)
}

let filename = args._[0]
let output = args.output

let hasErrors = false

let input
if (filename) {
  if (fileExists(filename)) {
    input = fs.createReadStream(filename)
  } else {
    console.error('error: input file does not exist')
    hasErrors = true
  }
} else {
  input = process.openStdin()
}

if (output) {
  output = fs.createWriteStream(output)
} else {
  output = process.stdout
}

if (hasErrors) {
  process.exit(1)
}

; (async () => {
  const json = JSON.parse(await streamToBuffer(input))

  let uglifiedJSON
  switch (json.meta.type) {
    case 'fts':
      uglifiedJSON = FTS.uglify(json)
      break
    case 'dlf':
      uglifiedJSON = DLF.uglify(json)
      break
  }

  if (args.pretty) {
    output.write(JSON.stringify(uglifiedJSON, 0, 4))
  } else {
    output.write(JSON.stringify(uglifiedJSON))
  }
})()
