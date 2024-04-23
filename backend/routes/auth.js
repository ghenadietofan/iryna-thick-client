const {Router} = require('express');
const router = Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const candidate = await User.findOne({email});

        if(candidate){
            console.log()
            const areSame = await bcrypt.compare(password, candidate.password);
            if (areSame) {
                req.session.user = candidate;
                req.session.isAuth = true;
                req.session.save(err => {
                    if(err) {
                        throw err;
                    }
                })
                res.status(200).json({
                    role: req.session.user.role,
                    id: req.session.user._id
                });
            }else{
                res.status(403).end();
            }
        }else{
            res.status(403).end();
        }
    } catch (error) {
        res.status(403).json({error});
    }
})

router.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.status(200).end();
    })
})

router.post('/register', async (req, res) => {
    try {
        const {email, password, firstName, lastName} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({first_name:firstName, last_name:lastName, email:email, password: hashPassword, role: 0});
        await user.save();
        console.log('User Register',user.email);
        res.status(200).end();
    } catch (error) {
        res.status(500).json({error});
    }
})

module.exports = router;