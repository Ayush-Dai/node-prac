const mongoose = require('mongoose');

const conntectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected Successfully');
    } catch (error) {
        console.error('mongodb connection failed');
        process.exit(1);
    }
}

module.exports = conntectToDB;