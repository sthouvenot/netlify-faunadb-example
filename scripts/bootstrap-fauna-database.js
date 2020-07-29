/* bootstrap database in your FaunaDB account */
const faunadb = require('faunadb')
const chalk = require('chalk')
const insideNetlify = insideNetlifyBuildContext()
const q = faunadb.query

console.log(chalk.cyan('Creating your FaunaDB Database...\n'))

// Has var. Do the thing
if (process.env.FAUNADB_SERVER_SECRET) {
  createFaunaDB("fnADx9Xi3PACACiTIjc2Pb7z4cNM2Ij6etRQYktT").then(() => {
    console.log('Fauna Database schema has been created')
    console.log('Claim your fauna database with "netlify addons:auth fauna"')
  })
}

/* idempotent operation */
function createFaunaDB(key) {
  console.log('Create the fauna database schema!')
  const client = new faunadb.Client({
    secret: key
  })

  /* Based on your requirements, change the schema here */
  return client.query(q.Create(q.Ref('classes'), { name: 'todos' }))
    .then(() => {
      return client.query(
        q.Create(q.Ref('indexes'), {
          name: 'all_todos',
          source: q.Ref('classes/todos')
        }))
    }).catch((e) => {
      // Database already exists
      if (e.requestResult.statusCode === 400 && e.message === 'instance not unique') {
        console.log('Fauna already setup! Good to go')
        console.log('Claim your fauna database with "netlify addons:auth fauna"')
        throw e
      }
    })
}

/* util methods */

// Test if inside netlify build context
function insideNetlifyBuildContext() {
  if (process.env.DEPLOY_PRIME_URL) {
    return true
  }
  return false
}
