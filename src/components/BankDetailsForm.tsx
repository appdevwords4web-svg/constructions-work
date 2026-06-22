import React from "react";
import { FormInput } from "./FormFields";

interface BankDetailsFormProps {
  vatNo: string;
  bank: string;
  accountNo: string;
  sortCode: string;
  onChangeField: (
    field: "vatNo" | "bank" | "accountNo" | "sortCode",
    value: string,
  ) => void;
}

export function BankDetailsForm({
  vatNo,
  bank,
  accountNo,
  sortCode,
  onChangeField,
}: BankDetailsFormProps) {
  return (
    <section>
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-1">
        Company / Bank Details
      </h2>
      <div className="space-y-3">
        <FormInput
          label="VAT No."
          placeholder="VAT Registration Number"
          value={vatNo}
          onChange={(val) => onChangeField("vatNo", val)}
        />
        <FormInput
          label="Bank"
          placeholder="e.g. HSBC"
          value={bank}
          onChange={(val) => onChangeField("bank", val)}
        />
        <FormInput
          label="A/C No."
          placeholder="Account Number"
          value={accountNo}
          onChange={(val) => onChangeField("accountNo", val)}
        />
        <FormInput
          label="Sort Code"
          placeholder="XX-XX-XX"
          value={sortCode}
          onChange={(val) => onChangeField("sortCode", val)}
        />
      </div>
    </section>
  );
}
