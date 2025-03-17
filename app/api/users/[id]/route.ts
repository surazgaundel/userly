import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from '@/models/User';
import mongoose from "mongoose";

const isValidObjectId =(id:string)=>mongoose.Types.ObjectId.isValid(id);

export async function GET(req:NextRequest, {params}:{params:{id:string}}){
  try{
    await connectMongoDB();
    const {id} = await params;

    if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    const user = await User.findById(id).select('-password');
    
    return user ? NextResponse.json(user) : NextResponse.json({ error: "User not found" }, { status: 404 })
  } catch(error){
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try{
    await connectMongoDB();
    const {id} = await params;
    const body = await req.json();

    if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    if(body.email && await User.exists({email:body.email,_id:{$ne:id}})){
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    if (body.password === "") delete body.password;
    
    const user = await User.findByIdAndUpdate(id, body, { new: true, runValidators: true }).select("-password");
    return user ? NextResponse.json(user) : NextResponse.json({ error: "User not found" }, { status: 404 })
  } catch(error){
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }){
  try{
    await connectMongoDB();
    const {id} = await params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

    return (await User.findByIdAndDelete(id)) ?
      NextResponse.json({success:true}) : NextResponse.json({error: "User not found"}, {status: 404});
  }catch(error){
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}