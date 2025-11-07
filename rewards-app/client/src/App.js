import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NominationForm from './components/NominationForm';
import AccessGate from './components/AccessGate';

//import { AuthContext } from './context/AuthContext';


function App() {
  return (
    <BrowserRouter>
      
      <div style={{ marginTop: "70px" }}> {/* Push content below navbar */}
        <Routes>
          {/* <Route path="/auth" element={<AuthContext />} /> */}
          <Route path="/" element={<NominationForm />} />

          <Route path="/access" element={<AccessGate />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

