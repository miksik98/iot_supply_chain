const { pool }  = require('./pool');

const createProduct = (request) => {
  console.log(request)
  const { messageRootID, companyName, productType, description, productionLine, productionBatch, productionTime } = request

  pool.query('INSERT INTO products (messageRootID, companyName, productType, description, productionLine, productionBatch, productionTime) VALUES ($1, $2, $3, $4, $5, $6, $7)', [messageRootID, companyName, productType, description, productionLine, productionBatch, productionTime], (error, results) => {
    if (error) {
      throw error
    }

    console.log(`Product added with ID: ${messageRootID}`)
    return results.insertId
  })
}



module.exports = {
  createProduct
};