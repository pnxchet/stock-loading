const { Pool } = require('pg');

const pool = new Pool({
  user: 'user-local',
  host: 'localhost',
  database: 'mydb',
  password: 'password',
  port: 5432,
});

module.exports = pool;
