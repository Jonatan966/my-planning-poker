import Button from "../../../ui/button";

import styles from "./styles.module.css";

export type FeedbackType = "problem" | "suggestion";

interface FeedbackTypesProps {
  selectedFeedbackType?: FeedbackType;
  onSelectFeedbackType(type: FeedbackType): void;
}

export function FeedbackTypes({
  onSelectFeedbackType,
  selectedFeedbackType,
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
        >
          Problema
        </Button>
        <Button
          colorScheme={
            selectedFeedbackType === "suggestion" ? "primary" : "secondary"
          }
          onClick={() => onSelectFeedbackType("suggestion")}
        >
          Sugestão
        </Button>
      </div>
    </div>
  );
}
