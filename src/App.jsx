import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
            <h1 className="text-4xl font-bold text-slate-100">Welcome to NexaSetu</h1>
            <p className="text-slate-400 mt-4">Connected and ready for the future.</p>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;
