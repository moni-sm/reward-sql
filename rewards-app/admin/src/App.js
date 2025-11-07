import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import AdminEmployees from './components/AdminEmployees'; // import the new page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/admin/employees" element={<AdminEmployees />} />
      </Routes>
    </Router>
  );
}

export default App;
