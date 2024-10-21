const express = require('express');
const mongoose = require('mongoose');

const registerRouter = require('./routers/registerrouter');
const loginrouter = require('./routers/loginrouter');
const protectedRoute = require('./routers/protected');
const courseRouter = require('./routers/courserouter');
const coursedetailRouter = require('./routers/coursedetailrouter');
const AssignmentRouter = require('./routers/assignmentrouter');
const progressRouter = require('./routers/progressrouter');
require('dotenv').config();


const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Use the register router for registration requests
app.use('/api', registerRouter);
app.use('/api', loginrouter);
app.use('/api/protected', protectedRoute);
app.use('/api/course',courseRouter);
app.use('/api/coursedetail',coursedetailRouter);
app.use('/api/assignment',AssignmentRouter)
app.use('/api/progress',progressRouter)
const port = 7000;

app.get('/', (req, res) => {
    res.send(`Hello world this server is connected to port ${port}`);
    console.log("Hello server connected!")
})

//console.log("JWT_SECRET from .env:", process.env.JWT_SECRET);

//used for mongodb atlas 
//const uri="mongodb+srv://ramlath:Shanuja*5@cluster0.w5wg8d4.mongodb.net/TaskPro?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(process.env.uri)
.then(()=>{
    console.log("Database connected!");
    app.listen(port, () => {
    console.log("Server connected !");
});
})
.catch(()=>{
    console.log("connection error!");
});

