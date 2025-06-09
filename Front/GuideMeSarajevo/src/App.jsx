import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Note: Use Routes instead of Route here
import { AuthProvider } from "./context/AuthContext";
import Home from "./components/home";
import Register from "./components/Register"
import Login from "./components/Login";
import Profile from "./components/Profile";
import LocationDetails from "./components/LocationDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Transport from "./components/Transport";
import Tours from "./components/Tours";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {" "}
          {/* Use Routes instead of Route */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Home />} />
          <Route path="/location/:id" element={<LocationDetails />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/tours" element={<Tours />}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
