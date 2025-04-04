import express from "express";
import cors from "cors";
import morgan from "morgan";
import { PrismaClient } from "@prisma/client";
const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.get("/", (req, res)=>{
    return res.send("Welcome to Edtech server training");
});
app.post("/register", async(req, res)=>{
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        //alternative
        // const {userrname, email, password} = req.body;
        const existusername = await prisma.user.findUnique({
            where:{
                username: username

            }})
            if(existusername){
                return res.status(409).json({message:" user name arleady taken Try another one"})// coflict error or 400 bad request
            }
            const existemail = await prisma.user.findUnique({
                where:{
                    email: email
                }
            })
            if(existemail){
                return res.status(409).json({message:"Email arleady exist  it taken"})
            }
            

        
            const newUser = await prisma.user.create({
                data:{
                username,
                email,
                password,
            }

            })
        return res.status(201).json({
            message:"account created",
            userData: newUser
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "Server error please try again"})
        
        
    }
});
// app.all("*", (req, res)=>{
//     return res.status(404).json({message: "Endpoint Notfound"})// error not found is 404
// });
prisma.$connect()
.then(()=>console.log("Database connected"))
.catch((err)=>{
    console.log(err);
    process.exit(1);
})
app.listen(3000,()=>console.log("Server is Running"));
