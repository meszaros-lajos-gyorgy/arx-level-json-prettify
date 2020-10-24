#!/usr/bin/env node --experimental-modules

import fs from 'fs'
import minimist from 'minimist'
import { DLF, FTS } from '../src/index.mjs'
import { fileExists, getPackageVersion, streamToBuffer, stringifyJSON } from './helpers.mjs'

const args = minimist(process.argv.slice(2), {
  string: ['output'],
  boolean: ['version', 'pretty']
});

(async () => {
  if (args.version) {
    console.log(await getPackageVersion())
    process.exit(0)
  }

  let filename = args._[0]
  let output = args.output

  let hasErrors = false;

  let input
  if (filename) {
    if (await fileExists(filename)) {
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

  const json = JSON.parse(await streamToBuffer(input))

  let prettifiedJSON
  switch (json.meta.type) {
    case 'fts':
      prettifiedJSON = FTS.prettify(json)
      break
    case 'dlf':
      prettifiedJSON = DLF.prettify(json)
      break
  }

  output.write(stringifyJSON(prettifiedJSON, args.pretty))
})()
