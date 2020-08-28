const {collections} = require("../db");
const {get_db} = require("../db");

(async () => {
    const {client, db} = await get_db();
    const col = db.collection(collections.users);
    await col.createIndex({username: 1}, {unique: true});
    await client.close();
    return;
})();
