import {User, CreateUser} from '../types/user';

export const UserService ={
  //get all users
  getUsers:async(page = 1, limit = 10):Promise<User[]> =>{
    const response = await fetch(`/api/users?page=${page}&limit=${limit}`);
    if(!response.ok) throw new Error('Failed to fetch users');
    console.log(response);
    return response.json();
  },

  // get specific user
  getUserById:async(id:string):Promise<User> =>{
    const response = await fetch(`/api/users/${id}`);
    if(!response.ok) throw new Error('Failed to fetch users');

    return response.json();
  },

  //create a new user
  createUser:async(userData:CreateUser): Promise<User> =>{
    const response = await fetch('/api/users',{
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(userData)
    })

    if(!response.ok) throw new Error('Failed to create new users');

    return response.json();
  },

  // update a user
  updateUser:async(id:string, userData:User):Promise<User> =>{
    const response = await fetch(`/api/users/${id}`,{
      method:'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(userData)
    })

    if(!response.ok) throw new Error('Failed to update users');

    return response.json();
  },

  //delete a user
  deleteUser:async(id:string):Promise<boolean> =>{
    const response = await fetch(`/api/users/${id}`,{
      method:'DELETE',
    })

    if(!response.ok) throw new Error('Failed to delete users');

    return response.json();
  },
  
}