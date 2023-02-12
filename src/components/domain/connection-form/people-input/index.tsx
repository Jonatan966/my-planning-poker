import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  ComponentProps,
  forwardRef,
  ForwardRefRenderFunction,
  useState,
} from "react";
import { FaGithub, FaPowerOff, FaUser } from "react-icons/fa";
import { persistedCookieVars } from "../../../../configs/persistent-cookie-vars";
import { cookieStorageManager } from "../../../../utils/cookie-storage-manager";
import Button from "../../../ui/button";
import { TextInput } from "../../../ui/text-input";

const PeopleInputComponent: ForwardRefRenderFunction<
  HTMLInputElement,
  ComponentProps<"input">
> = (props, ref) => {
  const [isLoading, setIsLoading] = useState(false);
  const { status, data } = useSession();

  const unauthenticatedPeopleName = cookieStorageManager.getItem(
    persistedCookieVars.PEOPLE_NAME
  );

  const peopleName = data?.user?.name || unauthenticatedPeopleName;

  const isAuthenticated = status === "authenticated";
  const isAuthenticating = status === "loading" || isLoading;

  async function handleSignIn() {
    setIsLoading(true);

    try {
      await signIn("github");
    } catch {
      setIsLoading(false);
    }
  }

  async function handleSignOut() {
    setIsLoading(true);

    try {
      await signOut();
    } catch {
      setIsLoading(false);
    }
  }

  function onNameChange(newName: string) {
    if (status !== "unauthenticated") {
      return;
    }

    cookieStorageManager.setItem(persistedCookieVars.PEOPLE_NAME, newName);
  }

  return (
    <TextInput.Root title="Seu nome">
      <TextInput.InternalContent
        style={{ width: 32, justifyContent: "center" }}
      >
        {data?.user?.image ? (
          <Image
            width={256}
            height={256}
            src={data?.user?.image}
            style={{ borderRadius: "50%" }}
          />
        ) : (
          <FaUser size={18} />
        )}
      </TextInput.InternalContent>
      <TextInput.Input
        placeholder="Informe o seu nome"
        maxLength={20}
        {...props}
        ref={ref}
        onChange={(e) => onNameChange(e.target.value)}
        onBlur={(e) => onNameChange(e.target.value)}
        readOnly={isAuthenticated}
        defaultValue={peopleName}
        required
        disabled={isAuthenticating || props?.disabled}
      />
      <TextInput.InternalContent>
        {isAuthenticated ? (
          <Button
            isShort
            colorScheme="danger"
            outlined
            title="Sair"
            onClick={handleSignOut}
            isLoading={isLoading}
          >
            <FaPowerOff size={18} />
          </Button>
        ) : (
          <Button
            isShort
            colorScheme="secondary"
            title="Fazer login com o Github"
            onClick={handleSignIn}
            isLoading={isAuthenticating}
          >
            <FaGithub size={18} />
          </Button>
        )}
      </TextInput.InternalContent>
    </TextInput.Root>
  );
};

export const PeopleInput = forwardRef(PeopleInputComponent);
