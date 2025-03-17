import UserForm from '@/components/user-form';
import connectMongoDB from '@/lib/mongodb';
import { notFound } from 'next/navigation';
import User from '@/models/User';
export default async function NewUserPage({params}:{params:{id:string}}) {
  await connectMongoDB();
  const {id} = await params;
  const user = await User.findById(id).select('-password').lean();

  if(!user){
    notFound();
  }

  const serializedUser = {
    ...user,
    _id:user._id.toString(),
    createdAt:user.createdAt.toISOString(),
    updatedAt:user.updatedAt.toISOString(),
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add New User</h1>
      <UserForm user={serializedUser}/>
    </div>
  )
}