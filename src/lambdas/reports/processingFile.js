const csv = require('csv-parser')
const { createReadStream } = require('../../s3bucket')
const repository = require('../../repository')

const processItem = (data) => {
  const { creditor, email, ...parsedBody } = data
  repository.put({ creditor, email, ...parsedBody }).then((result) => {
    console.log('create consumer:', result)
  })
}

const handler = {
  async process(event) {
    const { Records: records } = event
    await Promise.all(
      records.map(async (record) => {
        const Bucket = record.s3.bucket.name
        const Key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '))
        console.log('Starting process file', Key)

        try {
          const inputStream = await createReadStream(Key, Bucket)
          inputStream.pipe(csv()).on('data', processItem)

          console.log(stringFile)
        } catch (err) {
          console.log(err)
        }
      })
    )
  }
}

module.exports = handler
