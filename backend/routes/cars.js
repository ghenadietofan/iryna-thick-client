const {Router} = require('express');
const router = Router();
const Cars = require('../models/cars');
const errors = require('../errors/cars');
const {checkRequestBody} = require('../internal/common')
const authMiddleware = require('../middlewares/auth')

const keysType = new Map();
keysType.set('brand', 'string')
    .set('model', 'string')
    .set('number', 'string')
    .set('price', 'number')

router.get('/', authMiddleware, async (req, res) => {
    let cars = [];
    if (req.session.user.isLogined) {
        cars = await Cars.find();
    } else {
        cars = await Cars.find().where({'is_available': 'true'});
    }
    return res.status(200).json(cars);
})

router.get('/:id', authMiddleware, async (req, res) => {
    const car = await Cars.findById(req.params.id);
    if (!car) {
        return res.status(404).json({error: errors.NoCarError});
    }
    return res.status(200).json(car);
})

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        console.log('Deleting Car')
        await Cars.deleteOne({
            _id: req.params.id
        }).then(() => {
            return res.redirect('/')
        });

    } catch (e) {
        return res.status(500).json({error: errors.DeleteError});
    }
})

router.post('/', authMiddleware, async (req, res) => {

    let err = checkRequestBody(keysType, req.body);
    if (err) {
        return res.status(400).json({error: err});
    }

    const newCar = new Cars({
        brand: req.body.brand,
        model: req.body.model,
        number: req.body.number,
        price: req.body.price,
    });

    try {
        await newCar.save();
        return res.status(200).json(newCar);
    } catch (err) {
        return res.status(500).json({error: errors.CreateError});
    }
})

router.patch('/:id', authMiddleware, async (req, res) => {
    if (req.session.isLogined) {
        return res.status(403).end();
    }
    let err = checkRequestBody(keysType, req.body);
    if (err) {
        return res.status(400).json({error: err});
    }

    try {
        const car = await Cars.findByIdAndUpdate(req.params.id, req.body);
        if (!car) {
            return res.status(404).json({error: errors.NoCarError});
        }
        return res.status(200).json(car);
    } catch (err) {
        return res.status(500).json({error: errors.UpdateError});
    }
})

module.exports = router;