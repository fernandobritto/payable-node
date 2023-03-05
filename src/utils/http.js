const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true
}

const formatResponse = (statusCode, body = {}) => {
  return { statusCode, headers, body: JSON.stringify(body) }
}

module.exports = {
  formatResponse
}
