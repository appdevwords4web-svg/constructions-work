import React from "react";

export interface BankDetailsFormProps {
  vatNo: string;
  bank: string;
  accountNo: string;
  sortCode: string;
  onChangeField: (
    field: "vatNo" | "bank" | "accountNo" | "sortCode",
    value: string,
  ) => void;
}

export interface ClientDetailsFormProps {
  clientAddress: string;
  forProject: string;
  projectLabel: string;
  projectPlaceholder: string;
  onChangeField: (field: "clientAddress" | "forProject", value: string) => void;
  // Optional field specifically for Quotation page
  totalLabel?: string;
  onChangeTotalLabel?: (value: string) => void;
}

export interface OwnerDetailsFormProps {
  ownerAddress: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerWebsite: string;
  onChangeField: (
    field: "ownerAddress" | "ownerPhone" | "ownerEmail" | "ownerWebsite",
    value: string,
  ) => void;
}

export interface GeneratorHeaderProps {
  title: string;
  onPrint: () => void;
  printing: boolean;
  accentClass?: string;
}

export interface FormInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  label: string;
  onChange: (value: string) => void;
}

export interface FormTextareaProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  label: string;
  onChange: (value: string) => void;
}
