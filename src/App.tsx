import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home";
import RoomPage from "./pages/room";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="rooms/:room_id" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
