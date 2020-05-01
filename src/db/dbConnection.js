const {
    pool
} = require('./pool');


pool.on('connect', () => {
    console.log('connected to the db');
});

/**
 * Create Product Table
 */
const createProductTable = () => {

    const userProductQuery = `CREATE TABLE IF NOT EXISTS products
  (
  messageRootID VARCHAR(100) UNIQUE NOT NULL,
  companyName VARCHAR(100),
  productType VARCHAR(100),
  description VARCHAR(100),
  productionLine VARCHAR(100),
  productionBatch VARCHAR(100),
  productionTime VARCHAR(100)
 )`;

    pool.query(userProductQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

async function createProducerTable(name) {

  try {
        const sql = 'CREATE TABLE IF NOT EXISTS ' + name + '( messageRootID VARCHAR(100) UNIQUE NOT NULL )'
        console.log(sql)
        results = await  pool.query(sql)
        console.log(results)
        return results.rows
    } catch (e) {
        throw e
    }

};


/**
 * Drop Product Table
 */
const dropProductTable = () => {
    const ProductDropQuery = 'DROP TABLE IF EXISTS products';
    pool.query(ProductDropQuery)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};


/**
 * Create All Tables
 */
const createAllTables = () => {
    createProductTable();
};


/**
 * Drop All Tables
 */
const dropAllTables = () => {
    dropProductTable();
};

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});


module.exports = {
    createProductTable,
    createProducerTable
};
