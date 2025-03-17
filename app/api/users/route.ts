import { NextRequest, NextResponse } from "next/server";
import connectMongoDB from "@/lib/mongodb";
import User from '@/models/User';
export async function GET(req:NextRequest){
  try{
    await connectMongoDB();

    //get query
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page-1) * limit;

    const query = search ? {
      $or:[
        {name:new RegExp(search,'i')},
        {email:new RegExp(search,'i')},
        {address:new RegExp(search,'')}
      ]
    }:{};

    // fetch users
    const users = await User.find(query).sort({createdAt:-1}).skip(skip).limit(limit).select('-password');
    const total = await User.countDocuments(query);

    return NextResponse.json({
      users,
      pagination:{total,page,limit,pages:Math.ceil(total/limit)}
    });
  } catch(error){
    console.log('Error',error);
    return NextResponse.json({error:'Failed to fetch users'},{status:500});
  }
}

export async function POST(req:NextRequest){
  try{
    await connectMongoDB();
    const body = await req.json();

    const existingUser = await User.findOne({email:body.email});
    if(existingUser){
      return NextResponse.json({
        error:'Email already exists'
      },{status:400});
    }

    const user = await User.create(body);
    return NextResponse.json(user,{status:201});  
  }catch(error){
    console.log('Error creating user',error);
    return NextResponse.json({error:'Failed to add new users'},{status:500});
  }
}