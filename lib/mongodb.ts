import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if(!MONGODB_URI) {
  throw new Error('MongoDB URI not found');
}

const connectMongoDB = async()=>{
  try{
    await mongoose.connect(MONGODB_URI);
    console.log('>>>>Connected to MongoDB<<<<');
  } catch(error){
    console.log(error);
  }
}

export default connectMongoDB;