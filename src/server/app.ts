import express from "express";

const app =express();

app.use("/",(req,res,next)=>{
    console.log("Recieved the request");
    res.json({message:"Recieved"});
});

app.listen(3000,()=>{
    console.log("Musistic running on 3000");
});
