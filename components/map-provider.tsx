'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapContextType {
  isLoaded: boolean
  loader: Loader | null
}

const MapContext = createContext<MapContextType>({
  isLoaded:false,
  loader:null
})

interface MapProviderProps {
  apiKey:string
  children: React.ReactNode
}

export function MapProvider({apiKey,children}:MapProviderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loader, setLoader] = useState<Loader|null>(null);

  useEffect(()=>{
    const newLoader = new Loader({
      apiKey: apiKey,
      version:'weekly',
      libraries:['maps','places', 'marker']
    })

    setLoader(newLoader);
    newLoader.load().then(()=>{
      setIsLoaded(true);
    })
  },[apiKey]);

  return (
    <MapContext.Provider value={{ isLoaded, loader }}>
      {children}
    </MapContext.Provider>
  )
}

export const useMap=()=>useContext(MapContext);