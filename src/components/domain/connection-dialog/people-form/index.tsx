import Button from "../../../ui/button";
import { PeopleInput } from "../../connection-form/people-input";

import styles from "./styles.module.css";

interface PeopleFormProps {
  setIsFillPeopleName(value: boolean): void;
  onCancelRoomConnection(): Promise<void>;
}

function PeopleForm({
  setIsFillPeopleName,
  onCancelRoomConnection,
}: PeopleFormProps) {
  async function handleFillPeopleName() {
    setIsFillPeopleName(true);
  }

  return (
    <>
      <h1>Precisamos saber seu nome</h1>
      <form className={styles.form} onSubmit={handleFillPeopleName}>
        <PeopleInput />

        <div className={styles.formButtons}>
          <Button
            type="button"
            colorScheme="danger"
            outlined
            onClick={onCancelRoomConnection}
          >
            Cancelar
          </Button>
          <Button type="submit">Entrar na sala</Button>
        </div>
      </form>
    </>
  );
}

export { PeopleForm };
