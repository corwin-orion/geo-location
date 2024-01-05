import React, { useState, useEffect } from 'react';

const LocationApp = () => {
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
  
          try {
            const _key = 'OPENCAGE_KEY_GOES_HERE';
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${_key}`
            );
  
            const data = await response.json();
            console.log('OpenCage API Response:', data); // Add this line
  
            if (data.results.length > 0) {
              const components = data.results[0].components;
              const nearestCity = components.city || components.county;
              const nearestState = components.state || components.country;
              setCity(nearestCity || '');
              setState(nearestState || '');
              setLocation({ latitude, longitude });
            } else {
              console.error('No results found in the OpenCage API response');
            }
          } catch (error) {
            console.error('Error fetching location:', error);
          }
        },
        () => {
          setPermissionDenied(true);
        }
      );
    } else {
      console.log('Geolocation is not supported by your browser');
    }
  }, []);
  
  

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Do something with the entered city and state
    console.log('City:', city);
    console.log('State:', state);
  };

  return (
    <div>
      {location ? (
        <div>
          <p>Nearest City: {city}</p>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </div>
      ) : permissionDenied ? (
        <form onSubmit={handleFormSubmit}>
          <label>
            City:
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
          <label>
            State:
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <p>Requesting location...</p>
      )}
    </div>
  );
};

export default LocationApp;
