const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./db'); 
const { User, Singup ,Msg} = require('./user');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Fix port configuration
// const port = 3032;
let port = process.env.PORT  || 3032;
let cors = require('cors');
let { generateToken, verifyToken } = require('./auth');

let app = express();
let server = http.createServer(app);

app.use(cors({

  origin: ["https://jumba-chating.vercel.app" ,"http://localhost:3000"] ,
  methods: ['GET', 'POST','DELETE','PUT'],
  allowedHeaders: ['Content-Type'],
}));
// const io=new Server(server);
app.use(express.json());
let io = new Server(server, {
  cors: {

    origin: [ 'https://jumba-chating.vercel.app','http://localhost:3000'],
    methods: ['GET', 'POST','DELETE','PUT'],
  },
});

connectDB();

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Chatting App Backend is running!' });
});

app.post('/Register',async(req,res)=>{
  console.log(req.body);
  const {name,socketId}=req.body;
  try{
    const newUser=new User({name,socketId});
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  }catch(error){
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Failed to register user' });
  }

})

app.post('/singup',async (req,res)=>{
  const {name ,email ,password } = req.body;

  try{
    const uniqueEmail= await Singup.findOne({email});
    if(uniqueEmail){
      return res.status(400).json({message:"User already exit with this email"})
    }
    else{
      const hashedPassword = await bcrypt.hash(password, 10);
      const newsingup = new Singup({name ,email ,password:hashedPassword ,map_id:[]});
      const savedUser = await newsingup.save();

        res.status(201).json({
        message: 'Signup successful!',
        singup_id: savedUser.singup_id,
        name: savedUser.name,
        email: savedUser.email,
        _id:savedUser._id
        });
    }
  }
  catch(error){
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }

});

app.post('/addUserToMap',async(req,res)=>{
  const {loginUserId,addUserId,singupobject_id}=req.body;
  console.log("loginUserId,addUserID",loginUserId,addUserId,singupobject_id);
  const convertedLoginUserId = loginUserId;
  if (!loginUserId || !addUserId) {
    return res.status(400).json({ message: 'Both loginUserId and addUserId are required' });
  }
  try{

    const session = await mongoose.startSession();
    session.startTransaction();
    const updatedUser = await Singup.findOneAndUpdate(
      { singup_id: convertedLoginUserId },
      { $addToSet: { map_id: { $each: addUserId } } },
      { new: true }
    );

    if (!updatedUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Logged-in user not found' });
    }

    const updatedAddUser = await Singup.findOneAndUpdate(
      { _id: addUserId },
      { $addToSet: { map_id: { $each: [singupobject_id] } } },
      { new: true, session }
    );

    console.log("updatedAddUser",updatedAddUser);
    if (!updatedAddUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Add user not found' });
    }
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: 'Users added to each other\'s map_id successfully', updatedUser, updatedAddUser });


  }catch(error){
    console.error('Error adding user to map_id:', error);
    res.status(500).json({ message: 'Server error' });
  }
})



app.get('/getsingupuser',async(req,res)=>{
  try{
    const getsingupuser= await Singup.find();
    res.status(200).json(getsingupuser);
  }catch(error){
    console.log('Error in fetching users:',error);
    res.status(500).json({message:'Failed to retrieve users'});
  }
})


app.post('/getmappedusers', async (req, res) => {
  const { singup_id } = req.body; 
  if (!singup_id) {
    return res.status(400).json({ message: 'singup_id is required' });
  }
  try {
    const user = await Singup.findOne({ singup_id });
    if (!user) {
      return res.status(404).json({ message: 'User with the provided singup_id not found' });
    }
    const mappedUsers = await Singup.find({ _id: { $in: user.map_id } });
    res.status(200).json(mappedUsers);
  } catch (error) {
    console.error('Error in fetching mapped users:', error);
    res.status(500).json({ message: 'Failed to retrieve mapped users' });
  }
});

app.get('/getusers',async(req,res)=>{
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message:'Failed to retrieve users'});
  }
})

app.post('/sendMessage', async (req, res) => {
  const { sender, receiver, message,  } = req.body.data;

  if (!sender || !receiver || !message ) {
    return res.status(400).json({ message:'All fields are required.'});
  }

  try {
    const sendMessageUser = new Msg({
      sender,
      receiver,
      message,
      
    });

    const savedMessage = await sendMessageUser.save();
    res.status(200).json(savedMessage);
  } catch (error) {
    console.error('Error in Saving Message:', error);
    res.status(500).json({ message: 'Failed to Save Message' });
  }
});

app.get('/getmessage', async (req, res) => {
  const { userId, chatPartnerId } = req.query;

  if (!userId || !chatPartnerId) {
    return res.status(400).json({ message: 'Both userId and chatPartnerId are required.' });
  }

  try {
    const messages = await Msg.find({
      $or: [
        { sender: userId, receiver: chatPartnerId },
        { sender: chatPartnerId, receiver: userId },
      ],
    }).sort({ timestamp: 1 }); 
    return res.status(200).json(messages); 
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ message: 'Error fetching messages.' });
  }
});


app.put('/deletemessage', async (req, res) => {
  const { timestamp } = req.body;
  console.log("timestamp",timestamp);

  if (!timestamp) {
    return res.status(400).json({ message: 'Timestamp is required.' });
  }

  try {
    
    const result = await Msg.findOneAndDelete({ timestamp });

    if (!result) {
      return res.status(404).json({ message: 'No message found with the given timestamp.' });
    }

    return res.status(200).json({ message: 'Message deleted successfully.', deletedMessage: result });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({ message: 'Error deleting message.' });
  }
});







app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Singup.findOne({ email });
    console.log("user",user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
      return res.status(200).json({
        
        message: 'login successful', 
        singup_id: user.singup_id,
        name: user.name,
        email: user.email,
        _id:user._id,
        token });
    
  } catch (error) {
    console.error('error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/profile', verifyToken, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json({ user });
});




io.on('connection', (socket) => {
  socket.on('join room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });
  socket.on('chat message', (messageData) => {
    socket.to(messageData.roomId).emit("receiveMessage", messageData);
  });
  socket.on('deleteMessageServer', (deleteData) => {
    console.log(`Message deleted:`, deleteData);

    socket.to(deleteData.roomId).emit("messageDeleted", deleteData);
});
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});



server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
