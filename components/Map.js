import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet"
import useGeoLoc from "utils/useGeoLoc"

const Map = ({ userLands, otherUserLands }) => {

  const loc = useGeoLoc()

  return (
    <div>
        <MapContainer center={[loc.coordinates.lng, loc.coordinates.lat]} zoom={13}>
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