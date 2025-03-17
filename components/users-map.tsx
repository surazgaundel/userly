"use client"

import { useState } from "react"
import { User } from "@/types/user"
import { Card, CardContent } from "@/components/ui/card"
import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api"
import { useMap } from "./map-provider"

interface UsersMapProps {
  users: User[]
}

const mapContainerStyle = {
  width: "100%",
  height: "600px",
}

const defaultCenter = {
  lat: 27.723,
  lng: 80.5795,
}

export default function UsersMap({ users }: UsersMapProps) {
  const { isLoaded } = useMap();
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [markerAddress, setMarkerAddress] = useState<string>("")

  if (!isLoaded) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center" style={{ height: "600px" }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading Google Maps...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  //Handle map click to place a custom marker and fetch address
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return
    const newPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    }
    setMarkerPosition(newPosition)
    fetchAddress(newPosition)
  }

  // Geocoding API to get address
  const fetchAddress = async ({ lat, lng }: { lat: number; lng: number }) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
      )
      const data = await response.json()
      if (data.results.length > 0) {
        setMarkerAddress(data.results[0].formatted_address)
      } else {
        setMarkerAddress("Unknown location")
      }
    } catch (error) {
      console.error("Error fetching address:", error)
      setMarkerAddress("Failed to load address")
    }
  }

  return (
    <Card>
      <CardContent className="p-0 overflow-hidden rounded-md">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={5}
          options={{
            fullscreenControl: true,
            mapTypeControl: true,
            streetViewControl: false,
            zoomControl: true,
          }}
          onClick={handleMapClick}
        >
          {users.map((user) =>
            user.latitude && user.longitude ? (
              <MarkerF
                key={user._id}
                position={{ lat: user.latitude, lng: user.longitude }}
                onClick={() => setSelectedUser(user)}
              />
            ) : null
          )}

          {/*InfoWindow for User Markers */}
          {selectedUser && (
            <InfoWindowF
              position={{ lat: selectedUser.latitude, lng: selectedUser.longitude }}
              onCloseClick={() => setSelectedUser(null)}
            >
              <div className="p-3 w-min">
                <h3 className="font-bold text-lg">{selectedUser.name}</h3>
                <p className="text-sm text-gray-600">{selectedUser.email}</p>
                <p className="text-sm mt-2">{selectedUser.address}</p>
              </div>
            </InfoWindowF>
          )}

          {markerPosition && (
            <MarkerF position={markerPosition}>
              <InfoWindowF position={markerPosition} onCloseClick={() => setMarkerPosition(null)}>
                <div className="p-2 text-sm">
                  <p className="font-semibold">Selected Location</p>
                  <p>{markerAddress}</p>
                  <p className="text-gray-500 text-xs">
                    {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
                  </p>
                </div>
              </InfoWindowF>
            </MarkerF>
          )}
        </GoogleMap>
      </CardContent>
    </Card>
  )
}
