const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');


const userRoutes = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas:', err);
  });

mongoose.connection.once('open', () => {
  console.log('Database Synced');
});

app.use('/users', userRoutes);
app.use('/admin', adminRoute);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
