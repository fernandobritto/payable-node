const { documentClient } = require('../config/dynamodb')

const customerRepository = {
  TABLE_NAME: 'payable-node-consumer',
  bycreditorAndEmail(creditor, email) {
    const params = {
      Key: { creditor, email },
      TableName: this.TABLE_NAME
    }

    return documentClient
      .get(params)
      .promise()
      .then((result) => result.Item)
  },

  byCreditor(creditor) {
    const params = {
      KeyConditionExpression: '#key = :value',
      ExpressionAttributeNames: {
        '#key': 'creditor'
      },
      ExpressionAttributeValues: {
        ':value': creditor
      },
      TableName: this.TABLE_NAME
    }

    return documentClient
      .query(params)
      .promise()
      .then((result) => result.Items)
  },

  put(data) {
    const { creditor, email, ...othersData } = data

    if (!creditor || !email) {
      throw new Error(`Invalid key for ${this.TABLE_NAME}`)
    }
    const putParams = {
      TableName: this.TABLE_NAME,
      Item: {
        creditor,
        email,
        ...othersData
      },
      ReturnValues: 'ALL_OLD'
    }

    return documentClient
      .put(putParams)
      .promise()
      .then((result) => {
        return this.bycreditorAndEmail(creditor, email)
      })
  }
}
module.exports = customerRepository
