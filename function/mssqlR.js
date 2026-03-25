const sql = require('mssql');

const config = {
  user: "sa",
  password: "Automatic",
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

async function getPools() {
  if (pool && pool.connected) return pool;
  if (!poolPromise) {
    poolPromise = sql.connect(config)
      .then(p => {
        pool = p;
        pool.on('error', err => {
          console.error('[mssqlR] pool error:', err);
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

exports.qureyR = async (input) => {
  try {
    const p = await getPools();
    const result = await p.request().query(input);
    return result;
  } catch (err) {
    console.error('[mssqlR] qureyR error:', err);
    throw err;
  }
};

exports.qureyRP = async (queryString, params = {}) => {
  try {
    const p = await getPools();
    const request = p.request();
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    const result = await request.query(queryString);
    return result;
  } catch (err) {
    console.error('[mssqlR] qureyRP error:', err);
    throw err;
  }
};
