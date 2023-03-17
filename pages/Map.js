import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet"

const Map = ({ userLands, otherUserLands }) => {
  return (
    <div>
        <MapContainer center={[33.64498558968215, 72.98832287301876]} zoom={13}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        
            {userLands ? userLands.map(shape => {return shape ? 
                <Polygon pathOptions={{color:'purple'}} positions={shape.geometry.coordinates}>
                    <Popup>Hello</Popup>
                </Polygon>
            : null}) : null}

            {otherUserLands ? otherUserLands.map(shape => {return shape ? 
                <Polygon pathOptions={{color:'red'}} positions={shape.geometry.coordinates}>
                    <Popup>I am someone else's land</Popup>
                </Polygon>
            : null}) : null}

        </MapContainer>

        
    </div>
  )
}

export default Map