const AWS = require('aws-sdk-mock')
const mockData = { businessUnit: 'CRED' }

AWS.mock('DynamoDB', 'listTables', async (_) => {
  return { TableNames: ['serpro'] }
})

AWS.mock('DynamoDB.DocumentClient', 'get', async (params) => {
  const data = params.Key['businessUnit#experience'] === 'CRED#flag' ? mockData : null
  return { Item: data }
})

AWS.mock('DynamoDB.DocumentClient', 'put', async (_) => '')
