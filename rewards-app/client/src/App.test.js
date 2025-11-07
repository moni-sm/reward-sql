import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NominationForm from './components/NominationForm';
import AccessGate from './components/AccessGate';
import AccessWrapper from './components/AccessWrapper';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AccessWrapper>
              <NominationForm />
            </AccessWrapper>
          }
        />
        <Route path="/access" element={<AccessGate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
