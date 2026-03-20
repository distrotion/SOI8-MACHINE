const sql = require('mssql');

const config = {
  user: "automation",
  password: "@utomatic",
  database: "",
  server: '172.23.10.39',
  connectionTimeout: 15000,
  requestTimeout: 30000,
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000,
    acquireTimeoutMillis: 30000,
  },
  options: {
    encrypt: false,
    trustServerCertificate: true,
  }
};

let pool = null;
let poolPromise = null;

async function getPool() {
  if (pool && pool.connected) return pool;
  if (!poolPromise) {
    poolPromise = sql.connect(config)
      .then(p => {
        pool = p;
        pool.on('error', err => {
          console.error('[mssql] pool error:', err);
          pool = null;
        });
        poolPromise = null;
        return pool;
      })
      .catch(err => {
        poolPromise = null;
        throw err;
      });
  }
  return poolPromise;
}

exports.qurey = async (input) => {
  try {
    const p = await getPool();
    const result = await p.request().query(input);
    return result;
  } catch (err) {
    console.error('[mssql] qurey error:', err);
    throw err;
  }
};

exports.qureyP = async (queryString, params = {}) => {
  try {
    const p = await getPool();
    const request = p.request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    const result = await request.query(queryString);
    return result;
  } catch (err) {
    console.error('[mssql] qureyP error:', err);
    throw err;
  }
};
