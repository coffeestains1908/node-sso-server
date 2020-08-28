const express = require('express');
const {get_db, collections} = require("../db");
const router = express.Router();
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const {saltRounds} = require("../password");

router.post('/register',
    [
        body('username')
            .trim()
            .isLength({min: 6}).withMessage("min-length:6")
            .not().isEmpty().withMessage("required"),
        body('password')
            .trim()
            .not().isEmpty().withMessage("required")
            .isLength({min: 6}).withMessage("min-length:6"),
        body('confirmPassword')
            .trim()
            .not().isEmpty().withMessage("required")
            .isLength({min: 6}).withMessage("min-length:6")
    ],
    body('username').custom(async (input, {req}) => {
        const {client, db} = await get_db();
        const col = db.collection(collections.users);
        const user = await col.findOne({username: input});
        await client.close();
        if (user) {
            return Promise.reject("taken");
        }
    }),
    body('confirmPassword').custom((input, {req}) => {
        if (input !== req.body.password) {
            throw new Error("not-equal");
        }

        return true;
    }),
    body('password').customSanitizer(input => {
       const salt = bcrypt.genSaltSync(saltRounds);
       return bcrypt.hashSync(input, salt);
    }),
    async (req, res, next) => {
        const data = {
            username: req.body.username,
            password: req.body.password
        };
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()});
        }

        try {
            const {client, db} = await get_db();
            const col = db.collection(collections.users);
            const user = await col.insertOne({
                ...data,
                createdAt: new Date()
            });
            await client.close();
            return res.json(user.ops.pop());
        } catch (e) {
            console.error(e);
            return res.status(500).json({error: e});
        }
    }
);

module.exports = router;
