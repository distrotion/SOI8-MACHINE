const { MongoClient } = require('mongodb');

const url = 'mongodb://172.23.10.34:27017';

const client = new MongoClient(url, {
  maxPoolSize: 10,
  minPoolSize: 2,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 30000,
  serverSelectionTimeoutMS: 15000,
});

let clientPromise = null;

async function getClient() {
  if (client.topology && client.topology.isConnected()) return client;
  if (!clientPromise) {
    clientPromise = client.connect()
      .then(() => {
        clientPromise = null;
        return client;
      })
      .catch(err => {
        clientPromise = null;
        throw err;
      });
  }
  return clientPromise;
}

exports.insertMany = async (db_input, collection_input, input) => {
  try {
    const c = await getClient();
    const res = await c.db(db_input).collection(collection_input).insertMany(input);
    return res;
  } catch (err) {
    console.error('[mongodb] insertMany error:', err);
    throw err;
  }
};

exports.find = async (db_input, collection_input, input) => {
  try {
    const c = await getClient();
    const res = await c.db(db_input).collection(collection_input)
      .find(input).limit(1000).sort({ _id: -1 }).toArray();
    return res;
  } catch (err) {
    console.error('[mongodb] find error:', err);
    throw err;
  }
};

exports.update = async (db_input, collection_input, input1, input2) => {
  try {
    const c = await getClient();
    const res = await c.db(db_input).collection(collection_input).updateOne(input1, input2);
    return res;
  } catch (err) {
    console.error('[mongodb] update error:', err);
    throw err;
  }
};
