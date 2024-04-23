const {Router} = require('express');
const router = Router();
const User = require('../models/users');
const authMiddleware = require("../middlewares/auth");
const errors = require('../errors/users');

router.get('/', authMiddleware, async (req, res) => {
    if (req.session.user.isLogined) {
        return res.status(403).end();
    }
    let users = await User.find();

    return res.status(200).json(users);
})

router.get('/:id', authMiddleware, async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(404).json({error: errors.NoUserError});
    }
    return res.status(200).json(user);
})

router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.session.isLogined) {
        return res.status(403).end();
    }
    try{
        await User.deleteOne({
            _id: req.params.id
        });
        return res.status(200).end();
    } catch(e) {
        return res.status(500).json({error: errors.DeleteError});
    }
})

router.post('/', authMiddleware, async (req, res) => {
    const newUser = new User({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
    });

    try {
        await newUser.save();
        return res.status(200).json(newUser);
    } catch (err) {
        return res.status(500).json({error: errors.CreateError});
    }
})

module.exports = router;