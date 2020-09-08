/**
 * 初始化项目
 */
const {prompt} = require('inquirer')
const copy = require('copy-template-dir')
const path = require('path')
const {exec} = require('child_process')
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
    }
  ]
  prompt(question).then(({projectName, description}) => {
    let inDir = path.join(process.cwd(), 'templetes', 'vue-templete')
    let outDir = path.join(process.cwd(), projectName)
    let vars = {
      projectName,
      description
    }
    copy(inDir, outDir, vars, (err, createdFiles) => {
      if (err) process.exit(1)
      createdFiles.forEach(filePath => {
        console.log(`Created ${filePath}`)
      })
      console.log('done')
      exec(`cd ${projectName} && yarn`, err => {
        if (err) process.exit(1)
        console.log('create project completed')
      })
    })
  })
}