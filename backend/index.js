import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './db.js';
import { User, Singup, Msg } from './user.js';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
import upload from './middleware/middleware.js';
import multer from 'multer';
import cors from 'cors';
import { generateToken, verifyToken } from './auth.js';

// ranzo

// Fix port configuration
// const port = 3032;
let port = process.env.PORT  || 3032;

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
        singup_id: user?.singup_id,
        name: user?.name,
        email: user?.email,
        _id:user?._id,
        profile:user?.profile,
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


// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.log('Multer error:', error);
    return res.status(400).json({ message: 'File upload error: ' + error.message });
  } else if (error) {
    console.log('Other error:', error);
    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
  next();
});


// post call to update profile detail of user
app.put('/updateProfile',upload.single('image'), async (req,res)=>{
  console.log("Update profile request body:", req.body);
  console.log("Uploaded file:", req.file);
  console.log("Request headers:", req.headers);
  
  // Check if file was uploaded
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const {name, singupobject_id} = req.body;

  if (!singupobject_id) {
    return res.status(400).json({ message: 'singupobject_id is required' });
  }

  try{
    const updateData = {};
    if (name) updateData.name = name;
    if (imagePath) updateData.profile = imagePath; // Changed from image to profile to match schema

    const user = await Singup.findByIdAndUpdate(
      singupobject_id,
      updateData,
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({message:"Profile updated successfully", response:user});

  }
  catch(error){
    console.log("Error in updating profile", error);
    return res.status(500).json({ message: 'Error in updating profile'});
  }
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
