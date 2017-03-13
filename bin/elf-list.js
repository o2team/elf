#!/usr/bin/env node

const request = require('request')

request({
  url: 'https://api.github.com/users/elf-templates/repos',
  headers: {
    'User-Agent': 'elf-cli'
  }
}, function (err, res, body) {
  if (err) return console.error(err)

  const requestBody = JSON.parse(body)
  if (Array.isArray(requestBody)) {
    console.log()
    console.log('  All templates:')
    console.log()
    requestBody.forEach(repo => console.log('      - ' + repo.name + '  ' + repo.description))
    console.log()
    console.log('  You can base on template init project:')
    console.log()
    console.log('      elf init -t ' + requestBody[0].name)
    console.log()
  } else {
    console.error(requestBody.message)
  }
})
