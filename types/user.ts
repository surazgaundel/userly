export interface User {
  _id:string
  name:string
  email:string
  role: 'admin' | 'editor' | 'user'
  address:string
  latitude: number
  longitude: number
  createdAt: number
  updatedAt: number
}

export interface CreateUser {
  name:string
  email:string
  password?:string
  role: 'admin' | 'editor' | 'user'
  address:string
  latitude: number
  longitude: number
}

export interface UpdateUser extends CreateUser {
  id:string
  password?:string
}

export interface DeleteUser extends CreateUser {
  id:string
}

export interface PaginationResult {
  total:number
  page:number
  limit:number
  pages:number
}