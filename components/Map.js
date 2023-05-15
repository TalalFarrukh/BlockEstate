import "leaflet/dist/leaflet.css"
import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet"
import useGeoLoc from "utils/useGeoLoc"

const Map = ({ userLands, otherUserLands }) => {

  const loc = useGeoLoc()

  const [lat, setLat] = useState(33.6364439)
  const [lng, setLng] = useState(72.9837597)

  useEffect(() => {
    const setCoordinates = () => {
      if(loc.loaded && !loc.error) {
        setLat(loc.coordinates.lat)
        setLng(loc.coordinates.lng)
      }
    }

    loc.loaded && setCoordinates()

  }, [loc.loaded])

  return (
    <div>
        <MapContainer center={[lat, lng]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
            {userLands ? userLands.map(shape => {return shape ? 
                <Polygon pathOptions={{color:'purple'}} positions={shape.geometry.coordinates}>
                    <Popup>{shape.properties.name}</Popup>
                </Polygon>
            : null}) : null}

            {otherUserLands ? otherUserLands.map(shape => {return shape ? 
                <Polygon pathOptions={{color:'red'}} positions={shape.geometry.coordinates}>
                    <Popup>{shape.properties.name}</Popup>
                </Polygon>
            : null}) : null}

        </MapContainer>
    </div>
  )
}

export default Map