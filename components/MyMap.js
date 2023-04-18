import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer, Polygon } from "react-leaflet"

const MyMap = ({ userLand }) => {

  return (
    <div className="w-full object-cover -z-10">

      <style jsx global>
      {`
        .leaflet-container {
          width: 80wh; 
          height: 40vh;
          z-index: 0;
        }

        @media only screen and (max-width: 767px) {
            .leaflet-container {
                width: 60wh; 
                height: 30vh;
            }
        }
      `}
      </style>

      <MapContainer center={[userLand.geometry.coordinates[0][0][0][0], userLand.geometry.coordinates[0][0][0][1]]} zoom={20} zoomControl={false} scrollWheelZoom={false} dragging={false} doubleClickZoom={false} >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Polygon pathOptions={{color:'purple'}} positions={userLand.geometry.coordinates} />
      </MapContainer>

    </div>
  )
}

export default MyMap