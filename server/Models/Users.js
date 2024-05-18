import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name: {type: String, required: true,},
    email: {type: String, required: true,unique: true,},
    phone: {type: Number, required: true,},
    password: {type: String, required: true,},
    pic: {type: String,},
});

const UserModel = mongoose.model("UserTable",UserSchema,"UserTable");
export default UserModel; 