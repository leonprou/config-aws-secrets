const AWS = require('aws-sdk')
const Path = require('path')

function getConfigDir (config) {
  var CONFIG_DIR = config.util.initParam('NODE_CONFIG_DIR', Path.join(process.cwd(), 'config'))
  if (CONFIG_DIR.indexOf('.') === 0) {
    CONFIG_DIR = Path.join(process.cwd(), CONFIG_DIR)
  }
  return CONFIG_DIR
}

function init (config) {
  const secretsClient = new AWS.SecretsManager(config.aws.secrets.manager)
  return new Promise(function (resolve, reject) {
    secretsClient.getSecretValue({SecretId: config.aws.secrets.secretId}, (err, data) => {
      if (err) {
        reject(err)
        return
      }
      const secretVariables = JSON.parse(data.SecretString)

      const configDir = getConfigDir(config)
      var fullFilename = Path.join(configDir, 'custom-environment-variables' + '.' + 'json')
      const configObject = config.util.parseFile(fullFilename)
      const environmentSubstitutions = config.util.substituteDeep(configObject, secretVariables)
      console.log(environmentSubstitutions)
      config.util.extendDeep(config, environmentSubstitutions)

      resolve()
    })
  })
}

module.exports = init
