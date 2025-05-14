import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Note: Use Routes instead of Route here
import { AuthProvider } from "./context/AuthContext";
import Home from "./home";
import Register from "./Register"
import Login from "./Login";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
