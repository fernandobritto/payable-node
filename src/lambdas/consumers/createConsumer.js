const axios = require('axios')
const customerRepository = require('../../helpers/customerRepository')

const { formatResponse } = require('../../utils/http')

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

const handleResult = (result) => {
  if (!result) {
    return formatResponse(204, { message: 'No Content' })
  }

  return formatResponse(200, result)
}
const handleError = (err) => formatResponse(400, err)

const handler = {
  async put(event) {
    try {
      const creditor = event.pathParameters?.creditor
      if (!creditor) {
        return formatResponse(422, { message: 'missing creditor param' })
      }

      const body = event.body
      if (!body) {
        return formatResponse(422, { message: 'body is missing' })
      }
      const parsedBody = JSON.parse(event.body)

      const { email } = parsedBody
      if (!email.match(emailRegex)) {
        return formatResponse(422, { message: 'invalid email' })
      }

      return customerRepository
        .put({ creditor, ...parsedBody })
        .then(handleResult)
        .catch(handleError)
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
