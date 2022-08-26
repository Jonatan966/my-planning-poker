import { useRef } from "react";
import { storageManager } from "../../../../utils/storage-manager";
import Button from "../../../ui/button";
import TextInput from "../../../ui/text-input";

import styles from "./styles.module.css";

interface PeopleFormProps {
  setIsFillPeopleName(value: boolean): void;
  onCancelRoomConnection(): Promise<void>;
}

function PeopleForm({
  setIsFillPeopleName,
  onCancelRoomConnection,
}: PeopleFormProps) {
  const peopleNameInputRef = useRef<HTMLInputElement>();

  async function handleFillPeopleName() {
    storageManager.setItem(
      "@planning:people-name",
      peopleNameInputRef.current.value
    );

    setIsFillPeopleName(true);
  }

  return (
    <>
      <h1>Precisamos saber seu nome</h1>
      <form className={styles.form} onSubmit={handleFillPeopleName}>
        <TextInput
          title="Seu nome"
          placeholder="Ex: John Doe"
          ref={peopleNameInputRef}
          required
          maxLength={20}
        />

        <div className={styles.formButtons}>
          <Button
            type="button"
            colorScheme="danger"
            onClick={onCancelRoomConnection}
          >
            Cancelar
          </Button>
          <Button>Entrar na sala</Button>
        </div>
      </form>
    </>
  );
}

export { PeopleForm };
