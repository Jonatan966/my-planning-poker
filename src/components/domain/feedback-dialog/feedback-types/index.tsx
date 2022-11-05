import Button from "../../../ui/button";

import styles from "./styles.module.css";

export type FeedbackType = "problem" | "suggestion";

interface FeedbackTypesProps {
  selectedFeedbackType?: FeedbackType;
  isDisabled?: boolean;
  onSelectFeedbackType(type: FeedbackType): void;
}

export function FeedbackTypes({
  onSelectFeedbackType,
  selectedFeedbackType,
  isDisabled,
}: FeedbackTypesProps) {
  return (
    <div className={styles.feedbackTypesContainer}>
      <label>Tipo do feedback</label>
      <div className={styles.feedbackTypesButtons}>
        <Button
          colorScheme={
            selectedFeedbackType === "problem" ? "primary" : "secondary"
          }
          onClick={() => onSelectFeedbackType("problem")}
          disabled={isDisabled}
        >
          Problema
        </Button>
        <Button
          colorScheme={
            selectedFeedbackType === "suggestion" ? "primary" : "secondary"
          }
          onClick={() => onSelectFeedbackType("suggestion")}
          disabled={isDisabled}
        >
          Sugestão
        </Button>
      </div>
    </div>
  );
}
