import React from "react";
import { FormInput, FormTextarea } from "./FormFields";

interface ClientDetailsFormProps {
  clientAddress: string;
  forProject: string;
  projectLabel: string;
  projectPlaceholder: string;
  onChangeField: (field: "clientAddress" | "forProject", value: string) => void;
  // Optional field specifically for Quotation page
  totalLabel?: string;
  onChangeTotalLabel?: (value: string) => void;
}

export function ClientDetailsForm({
  clientAddress,
  forProject,
  projectLabel,
  projectPlaceholder,
  onChangeField,
  totalLabel,
  onChangeTotalLabel,
}: ClientDetailsFormProps) {
  return (
    <section>
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-1">
        Client
      </h2>
      <div className="space-y-3">
        <FormTextarea
          label="Client Address"
          rows={4}
          placeholder="Mr & Mrs Smith\n15 Example Road\nLondon"
          value={clientAddress}
          onChange={(val) => onChangeField("clientAddress", val)}
        />
        <FormTextarea
          label={projectLabel}
          rows={2}
          placeholder={projectPlaceholder}
          value={forProject}
          onChange={(val) => onChangeField("forProject", val)}
        />
        {onChangeTotalLabel && totalLabel !== undefined && (
          <FormInput
            label="Total Cost Label"
            placeholder="Side Double Story Extension"
            value={totalLabel}
            onChange={onChangeTotalLabel}
          />
        )}
      </div>
    </section>
  );
}
