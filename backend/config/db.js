const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/skillnestDB';
const connectionState = () => mongoose.connection.readyState;

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established.');
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB connection lost. Retrying...');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error event:', err?.message || err);
});

const connectDB = async () => {
  const mongoURI = (process.env.MONGO_URI && process.env.MONGO_URI.trim()) || DEFAULT_URI;

  if (connectionState() === 1) {
    return mongoose.connection;
  }

  try {
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(mongoURI, options);
    console.log(`MongoDB connected at ${mongoURI}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('\nTroubleshooting tips:');
    console.error('- Ensure the MongoDB service is running locally (mongod).');
    console.error('- If you are using a custom connection string, set MONGO_URI in backend/.env.');
    console.error('- For MongoDB Atlas, copy the connection URI and set it in backend/.env.');
    console.error('- Default local connection string used:', DEFAULT_URI);
  }

  return mongoose.connection;
};

module.exports = connectDB;