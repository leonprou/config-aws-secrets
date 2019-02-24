const AWS = require('aws-sdk')
const Path = require('path')

function init (config) {
  const secretsClient = new AWS.SecretsManager(config.aws.secrets.manager)
  return secretsClient.getSecretValue({SecretId: config.aws.secrets.secretId}).promise().then(function (data) {
    const secretVariables = JSON.parse(data.SecretString)
    const environmentSubstitutions = config.util.getCustomVars(secretVariables)
    config.util.extendDeep(config, environmentSubstitutions)
  })
}

module.exports = init
