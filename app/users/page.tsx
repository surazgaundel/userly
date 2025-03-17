import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UsersList from '@/components/users-list';
import UsersMap from "@/components/users-map";

import connectMongoDB from '@/lib/mongodb';
import User from '@/models/User';
import { MapProvider } from "@/components/map-provider";

export default async function UsersPage() {
  await connectMongoDB();

  const users = await User.find().sort({createdAt:-1}).select('-password').lean();
  
  const serializedUsers = users.map((user)=>({
    ...user,
    _id: (user._id).toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  }))

  return (
    <div className="mt-5 ml-5">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>
      <MapProvider apiKey={process.env.GOOGLE_MAPS_API_KEY}>
        <Tabs defaultValue="userList" className="w-full">
          <TabsList>
            <TabsTrigger value="userList">Users List</TabsTrigger>
            <TabsTrigger value="userMap">Users Map</TabsTrigger>
          </TabsList>
          <TabsContent value="userList">
            <UsersList users={serializedUsers} />
          </TabsContent>
          <TabsContent value="userMap">
            <UsersMap users={serializedUsers} />
          </TabsContent>
        </Tabs>
      </MapProvider>
    </div>
  )
}
