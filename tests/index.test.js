const test = require('ava')
const axios = require('axios')

test('it should be pass', async t => {
    const data = await axios.get('http://localhost:4000')
    console.log(data)
    t.pass()
})