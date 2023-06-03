import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MdFeedback } from "react-icons/md";

import { useDialog } from "../../../hooks/use-dialog";
import { api } from "../../../lib/ky";
import Button from "../../ui/button";
import Dialog from "../../ui/dialog";
import { DialogHeader } from "../../ui/dialog/dialog-header";
import { Dropdown } from "../../ui/dropdown";
import { TextArea } from "../../ui/text-area";
import { Tooltip } from "../../ui/tooltip";
import { SuccessMessage } from "./success-message";

import styles from "./styles.module.css";

export type FeedbackType = "problem" | "suggestion";

export function FeedbackDialog() {
  const router = useRouter();

  const { isOpen, openDialog, closeDialog } = useDialog();
  const [selectedFeedbackType, setSelectedFeedbackType] =
    useState<FeedbackType>();

  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [hasSentFeedback, setHasSentFeedback] = useState(false);

  const descriptionRef = useRef<HTMLTextAreaElement>();

  const isFilledFeedbackType = !!selectedFeedbackType;

  useEffect(() => {
    if (!isOpen) {
      setSelectedFeedbackType(undefined);
    }
  }, [isOpen]);

  function handleSelectFeedbackType(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedFeedbackType(event.target.value as FeedbackType);
  }

  function onRecreateFeedback() {
    setHasSentFeedback(false);
    setSelectedFeedbackType(undefined);
  }

  function handleCloseFeedbackDialog() {
    closeDialog();
    onRecreateFeedback();
  }

  async function handleSendFeedback(event: FormEvent) {
    event.preventDefault();

    setIsSendingFeedback(true);

    try {
      await api.post("feedbacks", {
        json: {
          description: descriptionRef.current.value,
          roomId: router.query?.room_id,
          type: selectedFeedbackType,
        },
      });

      setHasSentFeedback(true);
    } catch {
      setIsSendingFeedback(false);
      toast.error(
        "Não foi possível enviar o feedback no momento. Tente novamente mais tarde"
      );
    }

    setIsSendingFeedback(false);
  }

  return (
    <>
      <Dialog
        isOpen={isOpen}
        onRequestClose={handleCloseFeedbackDialog}
        className={styles.dialogContainer}
      >
        <DialogHeader
          title={
            <>
              <MdFeedback size={24} /> Enviar um feedback
            </>
          }
        >
          <Button
            colorScheme="danger"
            outlined
            onClick={handleCloseFeedbackDialog}
            disabled={isSendingFeedback}
          >
            Fechar
          </Button>
        </DialogHeader>
        {hasSentFeedback ? (
          <SuccessMessage onRecreateFeedback={onRecreateFeedback} />
        ) : (
          <form onSubmit={handleSendFeedback} className={styles.suggestionForm}>
            <Dropdown
              title="Tipo do feedback"
              onChange={handleSelectFeedbackType}
            >
              <option value="">Selecione uma opção</option>
              <option value="suggestion">Sugestão</option>
              <option value="problem">Feedback</option>
            </Dropdown>

            <TextArea
              title="Descrição"
              rows={6}
              disabled={isSendingFeedback || !isFilledFeedbackType}
              required
              ref={descriptionRef}
            />

            <Button
              className={styles.sendButton}
              disabled={!isFilledFeedbackType}
              type="submit"
              isLoading={isSendingFeedback}
            >
              Enviar feedback
            </Button>
          </form>
        )}
      </Dialog>

      <Tooltip
        place="top"
        message="Reporte um problema ou sugira uma nova funcionalidade"
      >
        <Button
          colorScheme="secondary"
          isShort
          onClick={openDialog}
          title="Enviar um feedback"
          className={styles.feedbackButton}
        >
          <MdFeedback size={18} />
          <p>Feedback</p>
        </Button>
      </Tooltip>
    </>
  );
}
