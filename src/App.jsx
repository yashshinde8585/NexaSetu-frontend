import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Navbar from './components/Navbar';
import { Navigate } from 'react-router-dom';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/project/:id" element={token ? <ProjectDetail /> : <Navigate to="/login" />} />
        <Route path="/" element={
          token ? <Navigate to="/dashboard" /> : (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
              <h1 className="text-4xl font-bold text-text">Welcome to NexaSetu</h1>
              <p className="text-text-muted mt-4">Connected and ready for the future.</p>
            </div>
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
