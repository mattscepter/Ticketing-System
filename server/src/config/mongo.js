import mongoose from 'mongoose'

const connection = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/AgentTicketSystem');
    console.log('DB Connected Successfully');
  } catch (err) {
    console.log('DB Connection Failed');
    console.log(err, 'ERROR');
  }
};

export default connection;