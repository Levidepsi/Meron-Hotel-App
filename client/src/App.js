import "./App.css";
import Navbar from "./component/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import BookingScreen from "./screens/BookingScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import AdminScreen from "./screens/AdminScreen";
import LandingScreen from "./screens/LandingScreen";

function App() {
  return (
    <div className="App">
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/home" exact element={<HomeScreen />} />
          <Route
            path="/book/:roomId/:fromDate/:toDate"
            exact
            element={<BookingScreen />}
          />
          <Route path="/login" exact element={<LoginScreen />} />
          <Route path="/register" exact element={<RegisterScreen />} />
          <Route path="/profile" exact element={<ProfileScreen />} />
          <Route path="/admin" exact element={<AdminScreen />} />
          <Route path="/" exact element={<LandingScreen />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
