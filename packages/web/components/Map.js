import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { useState } from "react";
import { getCenter } from 'geolib';
import { LocationMarkerIcon } from '@heroicons/react/outline'

function Map({ listings }) {

console.log(listings)
const [selectedLocation, setSelectedLocation] = useState({})
const coordinates = listings?.map(result => ({
    latitude: result.latitude,
    longitude: result.longitude
}))

console.log(coordinates)

// Center of the searched results using geoLib
const center = getCenter(coordinates)

const [viewport, setViewport] = useState({
    width: "100%",
    height: "100%",
    latitude: center.latitude,
    longitude: center.longitude,
    zoom: 11
})

    return (
        <ReactMapGL
            mapStyle="mapbox://styles/mapbox/light-v10"
            mapboxApiAccessToken={process.env.mapbox_key}
            {...viewport}
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
        >
            {listings?.map(result => (
                <div key={result.long}>
                    <Marker
                        longitude={latitude}
                        latitude={longitude}
                        offsetLeft={0}
                        offsetTop={0}
                    >
                        <p onClick={() => setSelectedLocation(result)} className="cursor-pointer text-2xl animate-bounce">
                            <LocationMarkerIcon className="h-6 text-indigo-500"/>
                        </p>
                    </Marker>

                    {/* Popup to be shown once we click on the marker */}
                    {selectedLocation.long === result.long ? (
                        <Popup
                            onClose={() => setSelectedLocation({})}
                            closeOnClick={true}
                            latitude={result.lat}
                            longitude={result.long}
                        >
                            <div>
                                {result.title}
                            </div>
                        </Popup>
                    ) : (
                        false
                    )}
                </div>
            ))}
        </ReactMapGL>
    )
}

export default Map
