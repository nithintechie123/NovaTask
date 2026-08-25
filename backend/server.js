import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import userRouter from "./routes/userRoute.js"
import taskRouter from "./routes/taskRoute.js"

dotenv.config();

const app=express();
const port=process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

app.get("/api/health",async (req,res)=>{
    try{
        const result=await pool.query("SELECT 1");
        res.status(200).json({status:"ok",message:"TODO API is running",database:"connected"});
    }catch(error){
        res.status(503).json({status:"error",message:error.message})
    }
})

app.use("/api/user",userRouter);
app.use("/api/task",taskRouter);


app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`);
})