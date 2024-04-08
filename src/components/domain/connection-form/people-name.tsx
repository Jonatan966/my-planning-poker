import { ChangeEvent, useState } from "react";
import { persistedCookieVars } from "../../../configs/persistent-cookie-vars";
import { useDebounce } from "../../../hooks/use-debounce";
import { cookieStorageManager } from "../../../utils/cookie-storage-manager";
import TextInput from "../../ui/text-input";

import styles from "./styles.module.css";

interface PeopleNameProps {
  isLoading?: boolean;
}

export function PeopleName({ isLoading }: PeopleNameProps) {
  const [peopleName, setPeopleName] = useState(
    cookieStorageManager.getItem<string>(persistedCookieVars.PEOPLE_NAME)
  );

  const applyPeopleName = useDebounce(300);

  function onChangeCookie(newPeopleName: string) {
    cookieStorageManager.setItem(
      persistedCookieVars.PEOPLE_NAME,
      newPeopleName
    );
  }

  function handlePeopleNameChange(event: ChangeEvent<HTMLInputElement>) {
    const newPeopleName = event.target.value;

    setPeopleName(newPeopleName);
    applyPeopleName(() => onChangeCookie(newPeopleName));
  }

  return (
    <div className={styles.box}>
      <TextInput
        title="Seu nome"
        placeholder="Informe o seu nome"
        value={peopleName}
        onChange={handlePeopleNameChange}
        onBlur={(event) => onChangeCookie(event.target.value)}
        required
        maxLength={20}
        disabled={isLoading}
        spellCheck={false}
      />
    </div>
  );
}
