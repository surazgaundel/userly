'use client';
import { useRef, useState } from 'react'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { User } from '@/types/user';
import { UserService } from '@/lib/user-service';
import { useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, StandaloneSearchBox, Marker,Circle } from "@react-google-maps/api"

const mapContainerStyle = {
  width: "100%",
  height: "400px",
}

declare global {
  interface Window {
    google: any
  }
}

interface UserFormProps {
  user?:User
}

export default function UserForm({user}:UserFormProps) {

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email:user?.email || '',
    password:'',
    role: user?.role || 'user',
    address:user?.address || '',
    latitude:user?.latitude || 27.723,
    longitude:user?.longitude || 85.332
  })
  const inputRef = useRef<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  const isEditMode = !!user;

  // determine what fields the current user can edit based on their role
  const canEditBasicInfo = !isEditMode || user?.role === 'admin' || user?.role === 'editor'
  const canEditPassword = !isEditMode || user?.role === "admin"
  const canEditRole = !isEditMode || user?.role === "admin"
  const canEditLocation = true ;

  // initialize google places autocomplete 

  const handleInputForm=(e)=>{
    const {name, value} = e.target;

    if (
      ((name === "name" || name === "email") && canEditBasicInfo) ||
      (name === "password" && canEditPassword) ||
      ((name === "address" || name === "latitude" || name === "longitude") && canEditLocation)
    ) {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSelectRole=(value:string)=>{
    if (canEditRole) {
      setFormData((prev) => ({ ...prev, role: value as "admin" | "editor" | "user" }))
    }
  }

  const handleSubmit = async(e)=>{
    e.preventDefault();
    setIsSubmitting(true);

    try{
      if(isEditMode){

        const updateData = {}

        if (canEditBasicInfo) {
          updateData.name = formData.name
          updateData.email = formData.email
        }

        if (canEditPassword && formData.password) {
          updateData.password = formData.password
        }

        if (canEditRole) {
          updateData.role = formData.role
        }

        if (canEditLocation) {
          updateData.address = formData.address
          updateData.latitude = formData.latitude
          updateData.longitude = formData.longitude
        }
        await UserService.updateUser(user._id, {
          ...formData,
          ...updateData,
          _id: user._id,
          createdAt: user.createdAt,
          updatedAt: Date.now()
        });
      }else{
        if(!formData.password){
          setIsSubmitting(false);
          return
        }

        await UserService.createUser(formData);
      }
      router.push('/users');
    } catch(error){
      console.log(error);
    } finally{
      setIsSubmitting(false);
    }
  }

  const handleOnPlacesChanged=()=>{
    let result = inputRef.current.getPlaces();
    const { formatted_address, geometry } = result[0];
    if (formatted_address && geometry) {
      setFormData((prev) => ({
        ...prev,
        address: formatted_address,
        latitude: geometry.location.lat(),
        longitude: geometry.location.lng(),
      }));
    }
  }
  return (
    <form className='space-y-6 mr-4' onSubmit={handleSubmit}>
      {isEditMode && user.role === "user" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limited permissions</AlertTitle>
          <AlertDescription>As a regular user, you can only edit location information.</AlertDescription>
        </Alert>
      )}

      {isEditMode && user.role === "editor" && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Editor permissions</AlertTitle>
          <AlertDescription>As an editor, you can edit all fields except password.</AlertDescription>
        </Alert>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <Card>
          <CardContent className='p-6 space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                type='text'
                value={formData.name || ''}
                onChange={handleInputForm}
                disabled={!canEditBasicInfo}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                value={formData.email || ''}
                onChange={handleInputForm}
                disabled={!canEditBasicInfo}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password {isEditMode ? "(leave blank to keep current)" : ""}</Label>
              <Input
                id='password'
                name='password'
                type='password'
                value={formData.password || ''}
                onChange={handleInputForm}
                disabled={isEditMode ? !canEditPassword : false}
                required={!isEditMode}
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor="role">Role</Label>
              <Select
              value={formData.role}
              onValueChange={handleSelectRole}
              disabled={!canEditRole}
              >
                <SelectTrigger>
                  <SelectValue placeholder='Select a role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='admin'>Admin</SelectItem>
                  <SelectItem value='editor'>Editor</SelectItem>
                  <SelectItem value='user'>User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        {/* address card */}
        <Card>
          <CardContent className='p-6 space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='address'>Address</Label>
              <div className="relative">
                {isLoaded && (
                  <StandaloneSearchBox
                  onLoad={(ref)=>inputRef.current = ref}
                  onPlacesChanged = {handleOnPlacesChanged}
                  >
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputForm}
                    placeholder="search for an address"
                    disabled={!canEditLocation}
                    required
                    />
                </StandaloneSearchBox>
                )}
              </div>

              {isLoaded ? (
                <div className='rounded-md overflow-hidden border-b'>
                  <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={{
                    lat:formData.latitude,
                    lng:formData.longitude
                  }}
                  zoom={12}
                  options={{
                    fullscreenControl: true,
                    mapTypeControl: true,
                    streetViewControl: false,
                    zoomControl: true,
                  }}
                  >
                    <Marker
                    draggable
                    animation={google.maps.Animation.DROP}
                    // onDragEnd={changeCoordinate}
                    position={{lat:formData.latitude, lng:formData.longitude}}
                    />
                    <Circle
                    options={{
                      fillColor:'#FF0000',
                      strokeOpacity:0.8,
                      strokeColor:'#FF0000',
                      strokeWeight:2,
                      fillOpacity:0.35
                    }}
                    />
                  </GoogleMap>
                </div>
              ) : (
                <div className="h-[400px] flex flex-col items-center justify-center border rounded-md">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p>Loading Google Maps...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button type='button' variant='outline' onClick={()=>router.push('/users')}>Cancel</Button>
        <Button type='submit' disabled={isSubmitting}>{isSubmitting ? 'Saving..' : isEditMode ? "Update User" : 'Create User'}</Button>
      </div>
    </form>
  )
}
