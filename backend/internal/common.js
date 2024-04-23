const errors = {
    EmptyValueError: 'empty value',
    WrongTypeError: 'wrong type',
    MissingValueError: 'missing value',
};

function checkRequestBody(keysType, body) {
    for (const key of keysType.keys()) {
        let value = body[key];
        if (!(value === undefined)) {
            if (typeof value === keysType.get(key)) {
                if (keysType.get(key) === 'string') {
                    if (value.length > 0) {
                        continue;
                    }
                }
                if (keysType.get(key) === 'number') {
                    if (value > 0) {
                        continue;
                    }
                }
                return errors.EmptyValueError;
            }
            return errors.WrongTypeError;
        }
        return errors.MissingValueError;
    }
    return null;
}

module.exports = {checkRequestBody, errors};