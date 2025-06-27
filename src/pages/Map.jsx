import { useEffect, useContext, useState } from "react";
import { Navbar } from "../components";
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from "@react-google-maps/api";
import { getPoints, postPoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Como pegar a posição atual do usuário?
// Dica: use Geolocation API do navegador
const center = {
  lat: -23.55052,
  lng: -46.633308,
};

export const Map = () => {
  const { token } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  
  // Substitua pela sua chave da API do Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    async function fetchMarkers() {
      try {
        console.log('Fetching markers...');
        const data = await getPoints(token);
        console.log('Markers fetched successfully:', data);
        setMarkers(data);
      } catch (error) {
        console.error('Error fetching markers:', error);
        // Don't show alert for initial load failure
      }
    }
    
    // Test basic connectivity
    async function testConnectivity() {
      try {
        console.log('Testing basic connectivity to API...');
        const response = await fetch('https://clean-rochette-ricardozanandrea-57ed8226.koyeb.app/auth/signin', {
          method: 'OPTIONS'
        });
        console.log('Connectivity test result:', response.status);
      } catch (error) {
        console.error('Basic connectivity test failed:', error);
      }
    }
    
    testConnectivity();
    fetchMarkers();
  }, [token]);

  // Function to handle marker click
  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  // Function to close info window
  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  // Função para adicionar ponto ao clicar no mapa
  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    // Show prompt to get description from user
    const description = prompt("Digite uma descrição para este ponto:", "Novo ponto");
    
    // If user cancelled the prompt or entered empty string, don't create the point
    if (!description || description.trim() === "") {
      return;
    }
    
    const newPoint = {
      latitude: lat,
      longitude: lng,
      description: description.trim(),
    };
    
    console.log('Attempting to create point:', newPoint);
    console.log('Current token:', token ? 'Token exists' : 'No token');
    
    try {
      const savedPoint = await postPoint(token, newPoint);
      
      console.log('Point saved successfully:', savedPoint);
      
      // savedPoint vem com os campos id, latitude, longitude e descricao
      // Precisamos transformar em um objeto com os campos id, title, position
      const savedMarker = {
        id: savedPoint.id,
        title: savedPoint.description || "Novo Ponto",
        position: {
          lat: savedPoint.latitude,
          lng: savedPoint.longitude,
        },
      };
      setMarkers((prev) => [...prev, savedMarker]);
    } catch (error) {
      console.error('Error creating point:', error);
      alert(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ width: "100%", height: "100%" }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onClick={handleMapClick}
          >
            {markers.map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
                onClick={() => handleMarkerClick(marker)}
              />
            ))}
            
            {selectedMarker && (
              <InfoWindow
                position={selectedMarker.position}
                onCloseClick={handleInfoWindowClose}
              >
                <div style={{ padding: '8px', maxWidth: '200px' }}>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold' }}>
                    {selectedMarker.title}
                  </h3>
                  <p style={{ margin: '0', fontSize: '14px', color: '#666' }}>
                    Coordenadas: {selectedMarker.position.lat.toFixed(6)}, {selectedMarker.position.lng.toFixed(6)}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        ) : (
          <div>Carregando mapa...</div>
        )}
      </div>
    </>
  );
};