/* Import faunaDB sdk */
const faunadb = require('faunadb')
const getId = require('./utils/getId')
const q = faunadb.query

exports.handler = (event, context) => {
  /* configure faunaDB Client with our secret */
  const client = new faunadb.Client({
    secret: "fnADx9Xi3PACACiTIjc2Pb7z4cNM2Ij6etRQYktT"
  }) 
  const id = getId(event.path)
  console.log(`Function 'todo-read' invoked. Read id: ${id}`)
  return client.query(q.Get(q.Ref(`classes/todos/${id}`)))
    .then((response) => {
      console.log('success', response)
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
