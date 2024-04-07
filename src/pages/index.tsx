import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaGithub } from "react-icons/fa";
import { ConnectionForm } from "../components/domain/connection-form";
import { FeedbackDialog } from "../components/domain/feedback-dialog";
import Button from "../components/ui/button";

import { DevCredits } from "../components/domain/dev-credits";
import { Tooltip } from "../components/ui/tooltip";
import { appConfig } from "../configs/app";
import { errorCodes } from "../configs/error-codes";
import styles from "../styles/pages/home.module.css";

function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    switch (router.query?.error) {
      case errorCodes.ROOM_NOT_EXISTS:
        toast.error("Não existe uma sala com esse código");
        break;

      case errorCodes.INTERNAL_ERROR:
        toast.error("Ocorreu um problema interno ao tentar entrar nessa sala");
        break;
    }
  }, [router.query]);

  useEffect(() => {
    setIsLoading(!router.isReady);
  }, [router.isReady]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.appName}>
          <img src="/favicon.png" alt="Logotipo da aplicação" />
          <h3 translate="no">My Planning Poker</h3>

          <div className={styles.menu}>
            <FeedbackDialog />

            <Tooltip message="Ir para repositório do projeto">
              <a
                href={appConfig.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Repositório do projeto"
              >
                <Button colorScheme="secondary">
                  <FaGithub size={18} />
                </Button>
              </a>
            </Tooltip>
          </div>
        </div>

        <ConnectionForm setIsLoading={setIsLoading} isLoading={isLoading} />
      </div>
      <DevCredits />
    </>
  );
}

export default HomePage;
