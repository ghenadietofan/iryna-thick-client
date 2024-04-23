const {Router} = require('express');
const router = Router();
const Rent = require('../models/rents');
const Car = require('../models/cars')
const errors = require('../errors/rents');
const carErrors = require('../errors/cars');
const {checkRequestBody} = require('../internal/common')
const authMiddleware = require('../middlewares/auth')

const keysType = new Map();
keysType.set('carId', 'string')
    .set('startDate', 'string')
    .set('endDate', 'string');

router.get('/', authMiddleware, async (req, res) => {
    let rents = [];
    if (req.session.isLogined) {
        rents = await Rent.find();
    } else {
        rents = await Rent.find().where({user_id: req.session.user._id});
    }

    return res.status(200).json(rents);
})

router.get('/:id', authMiddleware, async (req, res) => {
    const rent = await Rent.findById(req.params.id);
    if (!rent) {
        return res.status(404).json({error: errors.NoRentError});
    }
    if (rent._id.toString() !== req.session.user._id.toString()) {
        return res.status(403).end();
    }
    return res.status(200).json(rent);
})

router.delete('/:id', authMiddleware, async (req, res) => {
    if (req.session.isLogined) {
        return res.status(403).end();
    }
    try{
        await Rent.deleteOne({
            _id: req.params.id
        });
        return res.status(200).end();
    } catch(e) {
        return res.status(500).json({error: errors.DeleteError});
    }
})

router.post('/', authMiddleware, async (req, res) => {
    let err = checkRequestBody(keysType, req.body);
    if (err) {
        return res.status(400).json({error: err});
    }

    err = checkDate(req.body.startDate, req.body.endDate);
    if (err) {
        return res.status(400).json({error: err});
    }

    let car = await Car.findById(req.body.carId);
    if (!car) {
        return res.status(404).json({error: carErrors.NoCarError});
    }

    const newRent = new Rent({
        car_id: req.body.carId,
        user_id: req.session.user._id,
        start_date: req.body.startDate,
        end_date: req.body.endDate,
        total_price: await countTotalPrice(req.body.carId, countDays(req.body.startDate, req.body.endDate))
    });

    try {
        await newRent.save();
    } catch (err) {
        console.log("error on save")
        return res.status(500).json({error: errors.CreateError});
    }

    try {
        await Car.updateOne({_id: req.body.carId}, {is_available: 'false'});
        return res.status(200).json(newRent);
    } catch (err) {
        console.log("error on update!")
        return res.status(500).json({error: carErrors.UpdateError});
    }
})

router.patch('/:id', authMiddleware, async (req, res) => {
    if (req.session.isLogined) {
        return res.status(403).end();
    }

    err = checkDate(req.body.startDate, req.body.endDate);
    if (err) {
        return res.status(400).json({error: err});
    }

    let rent = await Rent.findById(req.params.id);
    if (!rent) {
        return res.status(404).json({error: errors.NoRentError});
    }

    try {
        let carId = rent.car_id.toHexString(); 
        await Rent.updateOne({_id: req.params.id},{
            start_date: req.body.startDate,
            end_date: req.body.endDate,
            total_price: await countTotalPrice(carId, countDays(req.body.startDate, req.body.endDate))
        });
        return res.status(200).json(rent);
    } catch (err) {
        return res.status(500).json({error: errors.UpdateError});
    }
})

async function countTotalPrice(carID, totalDays) {
    let sum = 0;
    try{
        const car = await Car.findById(carID);
        sum = car.price * totalDays;
    } catch (err) {
        return sum;
    }
    return sum;
}

function countDays(startDate, endDate) {
    let difference = Date.parse(endDate) - Date.parse(startDate);
    difference = difference / (1000 * 60 * 60 * 24);
    return difference < 1.0 ? Number(1) : Number(difference.toFixed(0));
}

function checkDate(startDate, endDate) {
    if (Date.parse(startDate) < Date.now()) {
        return errors.InvalidDate;
    }
    return Date.parse(startDate) < Date.parse(endDate) ? null : errors.InvalidDate;
}

module.exports = router;