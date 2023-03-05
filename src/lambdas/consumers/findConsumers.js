const axios = require('axios')
const customerRepository = require('../../helpers/customerRepository')
const { formatResponse } = require('../../utils/http')

const handleResult = (result) => {
  if (!result) {
    return formatResponse(204, { message: 'No Content' })
  }

  return formatResponse(200, result)
}

const handleError = (err) => formatResponse(400, err)

const handler = {
  async findAll(event) {
    try {
      const creditor = event.pathParameters?.creditor
      if (!creditor) {
        return formatResponse(422, { message: 'missing creditor param' })
      }

      return customerRepository.byCreditor(creditor).then(handleResult).catch(handleError)
    } catch (error) {
      console.error(error)

      return {
        statusCode: 500,
        body: JSON.stringify('Something went wrong. Try again later.')
      }
    }
  }
}

module.exports = handler
