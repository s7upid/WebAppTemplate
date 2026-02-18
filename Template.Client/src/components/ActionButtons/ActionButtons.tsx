import React from "react";
import { ActionButton } from "@/models";
import styles from "./ActionButtons.module.css";

interface ActionButtonsProps {
  actions: ActionButton[];
  testId?: string;
  columns?: 2 | 3 | 4;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  actions,
  testId,
  columns = 2,
}) => {
  const getGridClass = () => {
    switch (columns) {
      case 3:
        return styles.grid3;
      case 4:
        return styles.grid4;
      case 2:
      default:
        return styles.grid2;
    }
  };

  return (
    <div className={getGridClass()} data-testid={testId}>
      {actions.map((action) => (
        <button
          key={action.id}
          className={styles.button}
          data-testid={action.testId}
          onClick={action.onClick}
        >
          <div className={styles.item}>
            <action.icon className={styles.icon} />
            <div>
              <p className={styles.title}>{action.title}</p>
              <p className={styles.description}>{action.description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
