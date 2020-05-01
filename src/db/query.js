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

async function saveMessageInProducer(messageRootID,producer) {
    try {
        const sql = 'INSERT INTO ' + producer + ' (messageRootID) VALUES (\'' + messageRootID + '\')'
        console.log(sql)
        result = await pool.query(sql)
        console.log(`Producer added with ID: ${messageRootID}`)
        return result
    } catch (e) {
        throw e
    }
}


async function removeProduct(messageRootID) {
    try {
        const sql = 'DELETE FROM products WHERE  messageRootID = (\'' + messageRootID + '\')'
        console.log(sql)
        result = await pool.query(sql)
        console.log(`Product remove with ID: ${messageRootID}`)
        return result
    } catch (e) {
        throw e
    }
}



async function checkIfExistsMessageInProducer(messageRootID,producer) {
    try {
        const sql = 'SELECT * FROM ' + producer + ' WHERE messageRootID = \'' + messageRootID + '\''
        console.log(sql)
        result = await pool.query(sql)
        console.log(`Producer added with ID: ${messageRootID}`)
        if ( result.rows.length == 0 ) {
            process.exit(0);
            throw new Error({'Invalid':'messageRootID'});
        }
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
    getProductByMessageRootID,
    saveMessageInProducer,
    checkIfExistsMessageInProducer,
    removeProduct
};