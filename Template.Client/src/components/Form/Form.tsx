import React from "react";
import { cn } from "@/utils";
import styles from "./Form.module.css";
import { FormMethods } from "@/models";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
  methods?: FormMethods;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
}

const Form: React.FC<FormProps> = ({
  children,
  className = "",
  methods,
  onSubmit,
  ...props
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className={cn(styles.spacing, className)}
      {...props}
    >
      {children}
    </form>
  );
};

export default Form;
