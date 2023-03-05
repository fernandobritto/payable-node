const https = require('https')
const http = require('http')
const AWS = require('aws-sdk')

const agentOptions = {
  keepAlive: true,
  maxSockets: Infinity // Infinity == 50
}
const agent = /development|test/.test(process.env.NODE_ENV)
  ? new http.Agent(agentOptions)
  : new https.Agent(agentOptions)

const config = {
  region: process.env.AWS_REGION,
  httpOptions: { agent }
}

if (process.env.DYNAMODB_ENDPOINT) config.endpoint = process.env.DYNAMODB_ENDPOINT

AWS.config.update(config)

const dynamodb = new AWS.DynamoDB()
const documentClient = new AWS.DynamoDB.DocumentClient()

module.exports = {
  dynamodb,
  documentClient
}
