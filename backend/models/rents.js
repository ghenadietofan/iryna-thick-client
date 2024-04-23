const {Schema, model} = require('mongoose');

const rent = new Schema({
    car_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Cars'
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    start_date: {
        type: Schema.Types.Date,
        required: true
    },
    end_date: {
        type: Schema.Types.Date,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    }
});

module.exports = model('Rents', rent, "Rents");