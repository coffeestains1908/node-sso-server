const assert = require('assert');

const MongoClient = require('mongodb').MongoClient

const host = process.env.MONGO_HOST || 'localhost';
const port = process.env.MONGO_PORT || '27017';
const dbName = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPwd = process.env.DB_PWD;

/**
 * @return {Promise<MongoClient>}
 */
function get_client() {
    const url = `mongodb://${dbUsername}:${dbPwd}@${host}:${port}`;
    return new Promise(resolve => {
        MongoClient.connect(url, (err, client) => {
            assert.equal(null, err);
            resolve(client);
        });
    });
}

module.exports.get_client = get_client;

/**
 *
 * @return {Promise<{client: MongoClient, db: Db}>}
 */
function get_db() {
    return new Promise(async (resolve, reject) => {
        let client = await get_client();
        let db = client.db(dbName);
        resolve({client, db});
    });
}

module.exports.get_db = get_db;
module.exports.collections = {
    users: 'users',
    sys: 'sys'
};
