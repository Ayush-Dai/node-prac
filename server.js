require('dotenv').config();
const express = require('express');
const conntectToDB = require('./Database/db');
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes');
const adminRoutes = require('./routes/admin-routes');
const uploadImageRoutes = require('./routes/image-routes');

const app = express();


//Database connection
conntectToDB();


//middleware
app.use(express.json());

//routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', uploadImageRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
})