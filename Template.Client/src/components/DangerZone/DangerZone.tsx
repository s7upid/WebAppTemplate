import React from "react";
import { Button } from "@/components";
import { Trash2 } from "lucide-react";
import styles from "./DangerZone.module.css";

interface DangerZoneProps {
  title: string;
  description: string;
  buttonLabel: string;
  onConfirm: () => void;
  disabled?: boolean;
  testId?: string;
}

const DangerZone: React.FC<DangerZoneProps> = ({
  title,
  description,
  buttonLabel,
  onConfirm,
  disabled = false,
  testId,
}) => {
  return (
    <div className={styles.zone}>
      <div className={styles.content}>
        <div>
          <h4 className={styles.title}>{title}</h4>
          <p className={styles.text}>{description}</p>
        </div>
        <Button
          onClick={onConfirm}
          variant="danger"
          disabled={disabled}
          data-testid={testId}
          icon={Trash2}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
};

export default DangerZone;
