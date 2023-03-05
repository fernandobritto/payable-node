const { createPresignedUrl } = require('../../utils/s3bucket')
const { formatResponse } = require('../../utils/http')

const handler = {
  async getUrl(event) {
    const fileName = event.queryStringParameters?.fileName
    const cleanedName = fileName.replace(/[^a-zA-Z0-9.]/g, '')

    if (!cleanedName) {
      return formatResponse(422, { message: 'Missing fileName param' })
    }

    const presignedURL = await createPresignedUrl({
      Bucket: 'payable-node-image-bucket',
      Key: `uploads/${cleanedName}`,
      ContentType: 'text/csv'
    })

    return formatResponse(200, { url: presignedURL })
  }
}

module.exports = handler
