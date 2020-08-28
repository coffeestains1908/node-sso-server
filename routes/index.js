const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const {jwtOpts} = require("../jwt");
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const {signKey} = require("../jwt");
const {collections} = require("../db");
const {get_db} = require("../db");

router.get('/verify',
    jwt(jwtOpts),
    (req, res, next) => {
        return res.status(200).end();
    });

router.post('/authenticate',
    [
        body('username')
            .trim()
            .isLength({min: 6}).withMessage("min-length:6")
            .not().isEmpty().withMessage("required"),
        body('password')
            .trim()
            .not().isEmpty().withMessage("required")
            .isLength({min: 6}).withMessage("min-length:6"),
    ],
    async (req, res) => {
        const data = {
            username: req.body.username,
            password: req.body.password
        };

        const {client, db} = await get_db();
        const col = db.collection(collections.users);
        const user = await col.findOne({username: data.username});
        await client.close();

        if (user && bcrypt.compareSync(data.password, user.password)) {
            const token = signKey({
                _id: user._id.toString(),
                username: data.username,
            });
            return res.json({accessToken: token});
        }

        return res.status(403).end();
    });

module.exports = router;
