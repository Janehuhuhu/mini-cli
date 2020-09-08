#!/usr/bin/env node
const program = require('commander')
const packageJson = require('../package.json')

program
  .version(packageJson.version)
  .usage('<command> [options]')

program
  .command('create')
  .description('create a new project')
  .action(() => {
    require('../lib/create')()
  })

program.parse(process.argv)
if (program.args.length === 0) {
  program.help();
}