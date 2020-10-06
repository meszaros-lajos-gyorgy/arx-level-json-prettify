const readPipe = () => new Promise((resolve, reject) => {
  const stdin = process.openStdin()

  let rawInput = ''

  stdin.on('data', chunk => {
    rawInput += chunk
  })

  stdin.on('end', () => {
    try {
      resolve(JSON.parse(rawInput))
    } catch (error) {
      reject(error)
    }
  })
})

const writePipe = data => {
  console.log(data)
}

  ; (async () => {
    const json = await readPipe()

    writePipe(JSON.stringify(json))
  })()
