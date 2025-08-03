const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  socketId: {
    type: String,
    required: true,
  },
});


const signupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    singup_id: { type: String, required: true, unique: true, default: () => uuidv4() },
    map_id: { type: [String], required: false },
    profile: { 
        type: String, 
        required: false,
        default: null,
        validate: {
            validator: function(v) {
                // Allow null/undefined or a valid file path
                return v === null || v === undefined || (typeof v === 'string' && v.length > 0);
            },
            message: 'Profile must be a valid file path string or null'
        }
    }
});

const messageSchema = new mongoose.Schema({
  sender: { type: String,  required: true }, 
  receiver: { type: String, required: true }, 
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now,require:false }, 
});




const User = mongoose.model('User', userSchema);
const Singup=mongoose.model('Singup',signupSchema);
const Msg=mongoose.model('Msg',messageSchema);

module.exports = {User , Msg,Singup,messageSchema};
