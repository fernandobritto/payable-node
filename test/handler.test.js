const handler = require('../src/handler')

it('#write', async () => {
  const result = await handler.write({
    queryStringParameters: { experience: 'flag' },
    headers: { 'x-businessUnit': 'CRED' }
  })
  expect(result.body).toEqual('{"businessUnit":"CRED"}')
  expect(200).toEqual(result.statusCode)
  expect(typeof result.body).toEqual('string')
})

it('#write without businessUnit', async () => {
  const result = await handler.write({
    queryStringParameters: { experience: 'flag' },
    headers: {}
  })
  expect(result.body).toEqual('{"message":"missing param"}')
  expect(422).toEqual(result.statusCode)
  expect(typeof result.body).toEqual('string')
})
