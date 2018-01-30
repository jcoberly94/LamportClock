const readline = require('readline')
const fs = require('fs')

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

(async function() {

  let stuff = []

  let i = 0

  let response = ''
  while ((response = await question(`Enter in line P${i++}: `)) != '')
    stuff.push(response.toUpperCase().split(' '))

  console.log("ORIGINAL SET: ")
  print(stuff)

  let result = processData(stuff)

  console.log("\nRESULT SET: ")
  print(result)

  fs.writeFile(
     "result.txt",
     result.map(function(v){ return v.join(', ') }).join('\n'),
     function (err) { console.log(err ? 'Error :'+err : 'ok') }
   )

  process.exit()


})()

function processData(data) {
  let result = []

  for (let row of data)
    result.push([])

  let counter = 1
  let tempSet = new Set()
  let mainSet = new Set()


  process: while (true) {
    let error = true
    for (let i = 0; i < data.length; i++) {

      if (data[i].length < 1) continue

      if (data[i][0].charAt(0) == 'S') {
        result[i].push(counter)
        tempSet.add(data[i].shift().charAt(1))
        error = false
      }
      else if (data[i][0].charAt(0) == 'R') {
        if (mainSet.has(data[i][0].charAt(1))) {
          result[i].push(counter)
          mainSet.delete(data[i].shift().charAt(1))
          error = false
        }
      }  else {
        result[i].push(counter)
        data[i].shift()
        error = false
      }
    }
    if (error) {
      console.log('Error, infinite loop, invalid input')
      process.exit()
    }
    tempSet.forEach(mainSet.add, mainSet)
    tempSet.clear()

    counter++
    for (let row of data)
      if (row.length > 0)
        continue process
    break
  }
  return result
}
