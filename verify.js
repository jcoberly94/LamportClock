const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
})

function question (s) {
  return new Promise((resolve, reject) =>
  rl.question(s, resolve))
}

function print(data) {
  for (let row of data)
    console.log(row.join(' '))
}

function deepDup (data) {
  return JSON.parse(JSON.stringify(data))
}

(async function() {

  let stuff = []

  let i = 0

  let response = ''
  while ((response = await question(`Enter in line P${i++}: `)) != '')
    stuff.push(response.toUpperCase().split(' '))

  console.log("ORIGINAL SET: ")
  print(stuff)

  try {
    let result = processData(stuff)
    console.log("\nRESULT SET: ")
    print(result)
  } catch (e) {
    console.error(e)
  }

  process.exit()


})()

function processData(data) {
  let result = []
  for (let row of data)
    result.push([])

  let i = Math.max(...data.map(r => r[r.length - 1]))

  return processDataStep(data, result, i, [], { r: [], s: [] })
}

function processDataStep(data, result, c, r, rStack) {
  if (c < 1) {
    numberRs(result, rStack)
    beautify(result)
    if (rStack.s.length != rStack.r.length) {
      throw 'Error: invalid input'
    }
    return result
  }

  let nextR = deepDup(r)

  let error = true
  for (let i = 0; i < data.length; i++) {
    let row = data[i]
    let el = row[row.length - 1]

    while (el < 1) {
      row.pop()
      result[i].unshift('NULL')
      el = row[row.length - 1]
    }

    if (el != c) continue
    error = false

    if ((row.length == 1 && el != 1) || (row.length != 1 && row[row.length - 2] != el - 1)) {
      rStack.r.push({ i, c: result[i].length })
      nextR.push('R')
      result[i].unshift('R')
      row.pop()
    } else if (r.length && el != 'x') {
      rStack.s.push({ i, c: result[i].length })
      result[i].unshift('S')
      row.pop()
      nextR.pop()
      r.pop()
    } else {
      result[i].unshift('x')
      row.pop()
    }
  }

  if (error)
    throw 'Error: invalid input'

  return processDataStep(data, result, --c, nextR, rStack)
}

function numberRs (result, rStack) {
  let length = result[0].length - 1
  for (let i = 0; i < rStack.r.length; i++) {
    result[rStack.r[i].i][length - rStack.r[i].c] = 'R' + (length - i)
    result[rStack.s[i].i][length - rStack.s[i].c] = 'S' + (length - i)
  }

  return result
}

function beautify (result) {
  let char = 97;
  for (let i = 0; i < result.length; i++)
    for (let j = 0; j < result[i].length; j++)
      if (result[i][j] == 'x')
        result[i][j] = String.fromCharCode(char++)
}
