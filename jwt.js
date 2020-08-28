const jwt = require('jsonwebtoken');
const {get_db, collections} = require("./db");
const {v4: uuidv4} = require('uuid');

function secretKey(append = '') {
    const providedSecret = process.env.JWT_SECRET_KEY;
    if (append) {
        return providedSecret + '__' + append;
    } else {
        return providedSecret;
    }
}

async function initSecret() {
    const {client, db} = await get_db();
    const col = db.collection(collections.sys);
    const res = await col.findOne();
    if (res) {
        const sx = res.sx;
        if (sx) {
            secretChange(sx);
        }
    } else {
        // create new secret from environment variables for first timer
        secretChange(uuidv4().toString());
        await col.insertOne({
            sx: secretKey()
        });
    }
    await client.close();
}

function secretChange(newSecret) {
    process.env.JWT_SECRET_KEY = newSecret;
}

async function secretRotate(newSecret) {
    const {client, db} = await get_db();
    const col = db.collection(SYSTEM_COLLECTION);
    const res = await col.findOne();
    if (res) {
        await col.updateOne(
            {sx: res.sx},
            {$set: {sx: newSecret}}
        );
        secretChange(newSecret);
    }
    await client.close();
}

function secretCallback(req, payload, done) {
    const randomKey = payload.randomKey;
    const key = secretKey(randomKey);
    done(null, key);
}

function signKey(payload , expiresIn = '1d') {
    const randomKey = uuidv4().toString();
    const signOptions = {
        issuer: 'neuon-sso',
        algorithm: 'HS256'
    };
    if (expiresIn) {
        signOptions['expiresIn'] = expiresIn;
    }
    return jwt.sign(
        {
            ...payload,
            randomKey
        },
        secretKey(randomKey),
        signOptions
    );
}

module.exports = {
    secretCallback,
    secretRotate,
    initSecret,
    signKey,
    jwtOpts: {
        secret: secretCallback,
        algorithms: ['HS256']
    }
};
