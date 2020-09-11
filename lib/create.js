/**
 * 初始化项目
 */
const {prompt} = require('inquirer')
const copy = require('copy-template-dir')
const path = require('path')
const {exec} = require('child_process')
const download = require('download-git-repo')
const templetes = require('../templetes/templete-config.json')
let ora = require('ora')
let fs = require('fs')
let chalk = require('chalk')
module.exports = async () => {
  let defaultName = process.argv.slice(2)[1] || 'vue-demo'
  let question = [
    {
      type: 'input',
      name: 'projectName',
      message: 'project name:',
      default: defaultName,
      filter(val) {
        return val.trim()
      },
      transformer(val) {
        return val
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'description:',
      default: 'new project'
    },
    {
      type: 'list',
      name: 'templeteWay',
      message: 'the way of get templtet:',
      choices: ['remote', 'local'],
      default: 'remote',
    },
    {
      type: 'list',
      name: 'templete',
      message: 'templete:',
      choices: ['vue', 'react'],
      default: 'vue',
      when(val) {
        if (val.templeteWay === 'remote') {
          return true
        }
      }
    }
  ]
  prompt(question).then(({projectName, description, templeteWay, templete}) => {
    let inDir = path.join(__dirname, '../templetes', 'vue-templete')
    let outDir = path.join(process.cwd(), projectName)
    let vars = {
      projectName,
      description
    }
    let spinner = ora('Downloading please wait....')
    spinner.start()
    if (templeteWay === 'local') {
      // 本地拷贝模版
      copy(inDir, outDir, vars, (err, createdFiles) => {
        if (err) {
          process.exit(1)
        } else {
          exec(`cd ${projectName} && yarn`, err => {
            if (err) process.exit(1)
            spinner.stop()
            console.log(chalk.green('project create successfully!'))
            console.log(`
              ${chalk.yellow(`cd ${projectName}`)}
              ${chalk.yellow(templete === 'react' ? 'yarn start' : 'yarn serve')}
            `)
          })
        }
      })
    } else {
      // 远程下载模版
      let repo = templetes[templete].repo
      let branch = templetes[templete].branch
      download(`${repo}${branch}`, outDir, function(err) {
        if (err) {
          console.log('download err', err)
          spinner.stop()
        } else {
          fs.readFile(path.join(outDir, 'package.json'), function(err, res) {
            if (err) {
              console.log('readFile err', err)
              spinner.stop()
            } else {
              let data = JSON.parse(res.toString())
              data.name = projectName
              data.description = description
              fs.writeFile(path.join(outDir, 'package.json'), JSON.stringify(data, null, 2), function(err) {
                if (err) {
                  console.log('writeFile err', err)
                }
                spinner.stop() 
                console.log(chalk.green('project create successfully!'))
                console.log(`
                  ${chalk.yellow(`cd ${projectName}`)}
                  ${chalk.yellow(`yarn`)}
                  ${chalk.yellow(templete === 'react' ? 'yarn start' : 'yarn serve')}
                `)
              })
            }
          })
        }
      })
    }
  })
}