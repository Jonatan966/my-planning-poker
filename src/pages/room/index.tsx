import { useParams } from "react-router-dom";

function RoomPage() {
  const { room_id } = useParams();

  return <h1>Room page {room_id}</h1>;
}

export default RoomPage;
