import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import UserModel from './Models/Users.js';
import bcrypt from "bcrypt";

var app = express();
app.use(cors());
app.use(express.json());
 
var conn="mongodb+srv://16j19247:1234@cluster0.na8b3ry.mongodb.net/CoffeeDB?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(conn);

//Registration
app.post("/registerUser",async(req,res)=>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        const pic = req.body.pic;

        const hpassword = await bcrypt.hash(password,10); //encrypt password using hash
        const user = new UserModel({
            name: name,
            email: email,
            phone: phone,
            password: hpassword,
            pic: pic,
        });
        await user.save();
        res.send({ user: user, msg: "Added." });
    } 
    catch (error) {
        res.status(500).json({ error: "An error occurred" });
    }
});

//login
app.post("/login",async(req,res)=>{
    try{
        const {remail,rpassword}=req.body;
        const User = await UserModel.findOne({email:remail});
        if(!User){
            return res.status(500).json({msg:"User not found.."});
        }
        else{
            const passwordMatch = await bcrypt.compare(rpassword,User.password); //check if password match with password encrypted in database 
            if(passwordMatch)
                return res.status(200).json({User,msg:"Success.."});
            else
                return res.status(401).json({msg:"Authentication Failed.."});
        }
    }
    catch(error){
        res.status(500).json({msg:error.message});
    }
});

//userProfile
app.get("/getProfiles", async (req, res) => {
    try {
      const profilesUser = await UserModel.aggregate([
        {
          $lookup: {
            from: "UserTable",
            localField: "email",
            foreignField: "email",
            as: "user",
          },
        },
      ]);
      res.json({ user: profilesUser});
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
});

//updateUser
app.post("/updateProfile", async (req, res) => {
  try {
      const Userid = req.body.uid;
      const Pemail = req.body.uemail;
      const profile = await UserModel.findOne({ _id: Userid });
      profile.email = Pemail;
      await profile.save();
      res.send({ user: profile, msg: "Updated." });
  } catch (error) {
      res.status(500).json({ error: "An error occurred" });
  }
});


//deleteUser 
app.delete("/delUser/:uid", async (req, res) => {
    try {
      const Userid = req.params.uid;
      await UserModel.findOneAndDelete({ _id: Userid });
    } catch (error) {
      res.status(500).json({ error: "An error occurred" });
    }
});
  

app.listen(3002,()=>{
    console.log("Server Connected..");
});