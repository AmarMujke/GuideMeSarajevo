import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Note: Use Routes instead of Route here
import Home from "./home";
import Login from "./Login";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {" "}
        {/* Use Routes instead of Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
