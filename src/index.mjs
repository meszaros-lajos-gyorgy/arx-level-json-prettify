const streamToBuffer = input => new Promise((resolve, reject) => {
  const chunks = []
  input.on('data', chunk => {
    chunks.push(chunk)
  })
  input.on('end', () => {
    resolve(Buffer.concat(chunks))
  })
  input.on('error', e => {
    reject(e)
  })
})

const readPipe = async () => {
  const stdin = process.openStdin()
  const rawInput = await streamToBuffer(stdin)

  return JSON.parse(rawInput)
}

const writePipe = data => {
  console.log(data)
}

  ; (async () => {
    const json = await readPipe()

    writePipe(JSON.stringify(json))
  })()
