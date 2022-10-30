import { useRef, useState } from "react";
import { MdFeedback } from "react-icons/md";

import { useDialog } from "../../../hooks/use-dialog";
import Button from "../../ui/button";
import Dialog from "../../ui/dialog";
import { DialogHeader } from "../../ui/dialog/dialog-header";
import { TextArea } from "../../ui/text-area";
import { FeedbackType, FeedbackTypes } from "./feedback-types";

import styles from "./styles.module.css";

export function FeedbackDialog() {
  const { isOpen, openDialog, closeDialog } = useDialog();
  const [selectedFeedbackType, setSelectedFeedbackType] =
    useState<FeedbackType>();

  const descriptionRef = useRef<HTMLTextAreaElement>();

  const isFilledFeedbackType = !!selectedFeedbackType;

  function handleSelectFeedbackType(type: FeedbackType) {
    setSelectedFeedbackType(type);
  }

  return (
    <>
      <Dialog isOpen={isOpen} onRequestClose={closeDialog}>
        <DialogHeader title="Enviar um feedback">
          <Button colorScheme="danger" outlined onClick={closeDialog}>
            Voltar
          </Button>
        </DialogHeader>

        <FeedbackTypes
          selectedFeedbackType={selectedFeedbackType}
          onSelectFeedbackType={handleSelectFeedbackType}
        />
        <form>
          <TextArea
            title="Descrição"
            rows={5}
            disabled={!isFilledFeedbackType}
            required
            ref={descriptionRef}
          />

          <Button
            className={styles.sendButton}
            disabled={!isFilledFeedbackType}
            type="submit"
          >
            Enviar feedback
          </Button>
        </form>
      </Dialog>
      <Button colorScheme="secondary" isShort onClick={openDialog}>
        <MdFeedback size={18} />
      </Button>
    </>
  );
}
