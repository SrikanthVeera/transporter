
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RideSelection from './pages/RideSelection';
import Drive from './pages/Drive';
import About from './pages/About';
import Login from './pages/Login';
import BookingApp from './pages/BookingApp';
import { getNavigationType } from './utils/helpers';
import { GoogleMap, useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  React.useEffect(() => {
    console.log("Session Navigation Type:", getNavigationType());
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="min-h-screen w-full">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rides" element={<RideSelection />} />
          <Route path="/drive" element={<Drive />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/app" element={<BookingApp />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
