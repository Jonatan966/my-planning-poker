import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RoomContextProvider } from "./contexts/room-context";
import HomePage from "./pages/home";
import RoomPage from "./pages/room";

function App() {
  return (
    <RoomContextProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="rooms/:room_id" element={<RoomPage />} />
        </Routes>
      </BrowserRouter>
    </RoomContextProvider>
  );
}

export default App;
