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

// (async function() {
//
//   let stuff = []
//
//   let i = 0
//
//   let response = ''
//   while ((response = await question(`Enter in line P${i++}: `)) != '')
//     stuff.push(response.toUpperCase().split(' '))
//
//   console.log("ORIGINAL SET: ")
//   print(stuff)
//
//   processData(stuff)
//
//   process.exit()
//
//
// })()

processData([[1,2,3,0,0],[1,2,3,0,0],[3,4,5,0,0],[3,4,5,0,0],[1,2,3,4,6]])

function processData(data) {
  let result = []
  for (let row of data)
    result.push([])

  let i = Math.max(...data.map(r => r[r.length - 1]))

  processDataStep(data, result, i, [], { r: [], s: [] }, 0)
}

var branchCount = 0

function processDataStep(data, result, c, r, rStack, depth) {
  // console.log('\nstep', depth)
  // print(data)
  // print(result)
  if (c < 1) {
    if (rStack.s.length != rStack.r.length) {
      console.error('Error: invalid input')
      process.exit()
    }

    numberRs(result, rStack)
    beautify(result)
    console.log("\nRESULT SET: ")
    print(result)
    return [ result ]
  }

  let nextR = deepDup(r)

  let branch = {
    data: deepDup(data),
    result: deepDup(result),
    c,
    r: deepDup(r),
    rStack: deepDup(rStack)
  }

  let error = true
  for (let i = 0; i < data.length; i++) {
    let row = data[i]
    let el = row[row.length - 1]

    while (el < 1) {
      row.pop()
      result[i].unshift('NULL')
      el = row[row.length - 1]
    }

    if (el == 'x') {
      result[i].unshift('x')
      row.pop()
      continue
    }

    if (el != c) continue
    error = false

    if ((row.length == 1 && el != 1) || (row.length != 1 && row[row.length - 2] != el - 1)) {
      rStack.r.push({ i, c: result[i].length })
      nextR.push('R')
      result[i].unshift('R')
      row.pop()
    } else if (r.length) {
      branch.data[i][branch.data[i].length - 1] = 'x'
      branchCount++
      processDataStep(branch.data, branch.result, branch.c, branch.r, branch.rStack, depth + 1)
      // return
      rStack.s.push({ i, c: result[i].length })
      result[i].unshift('S')
      row.pop()
      nextR.pop()
    } else {
      result[i].unshift('x')
      row.pop()
    }
  }

  if (error) {
    if (branchCount == 0) {
      console.log('Error: invalid input')
      process.exit()
    }
    return
  } else {
    processDataStep(data, result, --c, nextR, rStack, depth)
  }
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
