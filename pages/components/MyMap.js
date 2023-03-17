import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet"

const MyMap = ({ userLands }) => {
  return (
    <div>

        <MapContainer center={[33.64498558968215, 72.98832287301876]} zoom={13}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
        </MapContainer>

    </div>
  )
}

export default MyMap