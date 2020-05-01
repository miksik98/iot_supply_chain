const {
    pool
} = require('./pool');

async function createProduct(request) {
    console.log(request)
    const {
        messageRootID,
        companyName,
        productType,
        description,
        productionLine,
        productionBatch,
        productionTime
    } = request
    try {
        result = await pool.query('INSERT INTO products (messageRootID, companyName, productType, description, productionLine, productionBatch, productionTime) VALUES ($1, $2, $3, $4, $5, $6, $7)', [messageRootID, companyName, productType, description, productionLine, productionBatch, productionTime])
        console.log(`Product added with ID: ${messageRootID}`)
        return result
    } catch (e) {
        throw e
    }
}

async function getProductByMessageRootID(messageRootID) {
    try {
        results = await pool.query('SELECT * FROM products WHERE messageRootID = $1', [messageRootID])
        console.log(results)
        return results.rows
    } catch (e) {
        throw e
    }
}


module.exports = {
    createProduct,
    getProductByMessageRootID
};