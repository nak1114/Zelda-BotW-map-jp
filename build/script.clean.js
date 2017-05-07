var
  shell = require('shelljs'),
  path = require('path')

shell.rm('-rf', path.resolve(__dirname, '../docs'))
console.log(' Cleaned build artifacts.\n')
