const {Schema, model} = require('mongoose');

const car = new Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    is_available: {
        type: Boolean,
        required: false,
        default: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Users'
    }
});

module.exports = model('Cars', car, "Cars");