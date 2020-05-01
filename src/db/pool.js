const pg = require('pg');
const Pool = pg.Pool

const dotenv = require('dotenv');

dotenv.config();

const databaseConfig = {
    connectionString: process.env.DATABASE_URL
};
const pool = new Pool(databaseConfig);

exports.pool = pool;