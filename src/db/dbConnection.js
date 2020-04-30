const { pool }  = require('./pool');


pool.on('connect', () => {
  console.log('connected to the db');
});

/**
 * Create Partner Table
 */
const createPartnerTable = () => {
  const userPartnerQuery = `CREATE TABLE IF NOT EXISTS partners
  (messageRootID SERIAL PRIMARY KEY,
  id VARCHAR(100) UNIQUE NOT NULL,
  companyName VARCHAR(100),
  productType VARCHAR(100),
  description VARCHAR(100),
  productionLine VARCHAR(100),
  productionBatch VARCHAR(100),
  productionTime VARCHAR(100),
  created_on DATE NOT NULL)`;

  pool.query(userPartnerQuery)
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
 * Drop Partner Table
 */
const dropPartnerTable = () => {
  const partnerDropQuery = 'DROP TABLE IF EXISTS partners';
  pool.query(partnerDropQuery)
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
  createPartnerTable();
};


/**
 * Drop All Tables
 */
const dropAllTables = () => {
  dropPartnerTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});


module.exports = {
  createPartnerTable
};

createAllTables()