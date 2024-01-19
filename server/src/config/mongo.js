import mongoose from 'mongoose'

const connection = async () => {
  try {
    await mongoose.connect('mongodb+srv://myAtlasDBUser:shlokp762@myatlasclusteredu.js7wlsy.mongodb.net/AgentTicketSystem');
    console.log('DB Connected Successfully');
  } catch (err) {
    console.log('DB Connection Failed');
    console.log(err, 'ERROR');
  }
};

export default connection;