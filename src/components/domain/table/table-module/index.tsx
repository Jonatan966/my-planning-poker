import { People, useRoomStore } from "../../../../stores/room-store";
import PointCard from "../point-card";
import { TableModulePosition } from "../types";

import styles from "./styles.module.css";

interface TableModuleProps {
  position: TableModulePosition;
  peoples: People[];
}

export function TableModule({ peoples = [], position }: TableModuleProps) {
  const { room, myID } = useRoomStore((state) => ({
    room: state.basicInfo,
    peoples: state.peoples,
    myID: state?.basicInfo?.subscription?.members?.myID,
  }));

  return (
    <div className={styles[position]}>
      {peoples.map((roomPeople) => (
        <PointCard
          key={roomPeople.id}
          points={roomPeople.points}
          showPoints={room.showPoints && room.showPointsCountdown === 0}
          isMe={roomPeople.id === myID}
          highlight={roomPeople.highlight}
        >
          {roomPeople.name}
        </PointCard>
      ))}
    </div>
  );
}
