import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
    name: {
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: {
      type: String,
      enum: ["admin", "editor", "user"],
      default: "user",
    },
    address: { 
      type: String, 
      required: true 
    },
    latitude: { 
      type: Number, 
      required: true 
    },
    longitude: { 
      type: Number, 
      required: true 
    },
  },
  {
    timestamps: true,
  },
);

//password hashed before saving to db
UserSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();

  try{
    this.password = await bcrypt.hash(this.password,10)
    next()
  } catch(error:any){
    next(error);
  }
})

UserSchema.set('toJSON',{
  transform:(doc,ret)=>{
    delete ret.password
    return ret;
  }
})
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;