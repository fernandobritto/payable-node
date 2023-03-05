const AWS = require('aws-sdk')

const s3 = /development|test/.test(process.env.NODE_ENV)
  ? new AWS.S3({
      s3ForcePathStyle: true,
      accessKeyId: 'S3RVER', // This specific key is required when working offline
      secretAccessKey: 'S3RVER',
      endpoint: new AWS.Endpoint('http://localhost:4569')
    })
  : new AWS.S3({ signatureVersion: 'v4' })

const repository = {
  createReadStream: (Key, Bucket) => {
    const params = { Key, Bucket }

    return s3.getObject(params).createReadStream()
  },

  createPresignedUrl: ({ Key, Bucket, ContentType, Expires = 60 }) => {
    const params = {
      Expires,
      Bucket,
      Key,
      ContentType
    }
    return s3.getSignedUrl('putObject', params)
  }
}

module.exports = repository
