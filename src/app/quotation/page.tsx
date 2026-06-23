"use client";

import { useState, useCallback } from "react";
import { COMPANY } from "@/lib/documentStyles";
import {
  QuotationData,
  QuotationLineItem,
  buildQuotationHtml,
  calcQuotationTotal,
  PaymentTerm,
  DEFAULT_PAYMENT_TERMS,
} from "@/lib/quotationBuilder";
import { printHtml } from "@/lib/print";
import { getLogoBase64 } from "@/lib/logo";
import { GeneratorHeader } from "@/components/GeneratorHeader";
import { FormInput, FormTextarea } from "@/components/FormFields";
import { OwnerDetailsForm } from "@/components/OwnerDetailsForm";
import { ClientDetailsForm } from "@/components/ClientDetailsForm";
import {
  PinIcon,
  PhoneIcon,
  EmailIcon,
  WebsiteIcon,
} from "@/components/CompanyIcons";

const DEFAULT_ITEMS: QuotationLineItem[] = [
  {
    title: "Protection",
    description:
      "Shuttering will be done wherever required around the area of extension. Please remove all the fragile and valuable items from the area of work.",
    amount: "",
  },
];

const DEFAULT_DATA: QuotationData = {
  quotationNo: "",
  date: "",
  clientAddress: "",
  forProject: "Double Storey Rear and Front Extension",
  items: DEFAULT_ITEMS,
  totalLabel: "Side Double Story Extension",
  ownerAddress: COMPANY.address,
  ownerPhone: COMPANY.phones.join(" / "),
  ownerEmail: COMPANY.email,
  ownerWebsite: COMPANY.website,
  paymentTerms: DEFAULT_PAYMENT_TERMS,
};

export default function QuotationPage() {
  const [data, setData] = useState<QuotationData>(DEFAULT_DATA);
  const [printing, setPrinting] = useState(false);

  /* ── Helpers ─────────────────────────────────────────── */
  const setField = (field: keyof QuotationData, value: string) =>
    setData((d) => ({ ...d, [field]: value }));

  const setItem = (
    idx: number,
    field: keyof QuotationLineItem,
    value: string,
  ) =>
    setData((d) => ({
      ...d,
      items: d.items.map((it, i) =>
        i === idx ? { ...it, [field]: value } : it,
      ),
    }));

  const addItem = () =>
    setData((d) => ({
      ...d,
      items: [...d.items, { title: "", description: "", amount: "" }],
    }));

  const removeItem = (idx: number) =>
    setData((d) => ({
      ...d,
      items: d.items.length > 1 ? d.items.filter((_, i) => i !== idx) : d.items,
    }));

  const setPaymentTerm = (
    idx: number,
    field: keyof PaymentTerm,
    value: string,
  ) =>
    setData((d) => ({
      ...d,
      paymentTerms: (d.paymentTerms || DEFAULT_PAYMENT_TERMS).map((term, i) =>
        i === idx ? { ...term, [field]: value } : term,
      ),
    }));

  const addPaymentTerm = () =>
    setData((d) => ({
      ...d,
      paymentTerms: [
        ...(d.paymentTerms || DEFAULT_PAYMENT_TERMS),
        { description: "", percentage: "" },
      ],
    }));

  const removePaymentTerm = (idx: number) =>
    setData((d) => ({
      ...d,
      paymentTerms: (d.paymentTerms || DEFAULT_PAYMENT_TERMS).filter(
        (_, i) => i !== idx,
      ),
    }));

  /* ── Print ─────────────────────────────────────────────── */
  const handlePrint = useCallback(async () => {
    setPrinting(true);
    try {
      const logoBase64 = await getLogoBase64();
      const html = buildQuotationHtml(data, logoBase64);
      printHtml(html);
    } finally {
      setTimeout(() => setPrinting(false), 1500);
    }
  }, [data]);

  const totals = calcQuotationTotal(data.items);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <GeneratorHeader
        title="Quotation Generator"
        onPrint={handlePrint}
        printing={printing}
        accentClass="bg-gray-900 hover:bg-black"
      />

      <div className="flex flex-1 overflow-hidden">
        {/* ── FORM PANEL ── */}
        <aside className="w-[400px] min-w-[320px] bg-white border-r border-gray-200 overflow-y-auto p-5 space-y-5 shrink-0 text-gray-800">
          <OwnerDetailsForm
            ownerAddress={data.ownerAddress || ""}
            ownerPhone={data.ownerPhone || ""}
            ownerEmail={data.ownerEmail || ""}
            ownerWebsite={data.ownerWebsite || COMPANY.website}
            onChangeField={(field, val) => setField(field, val)}
          />

          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-1">
              Quotation Details
            </h2>
            <div className="space-y-3">
              <FormInput
                label="Quotation No."
                placeholder="e.g. QT-001"
                value={data.quotationNo}
                onChange={(val) => setField("quotationNo", val)}
              />
              <FormInput
                label="Date"
                type="date"
                value={data.date}
                onChange={(val) => setField("date", val)}
              />
            </div>
          </section>

          <ClientDetailsForm
            clientAddress={data.clientAddress}
            forProject={data.forProject}
            projectLabel="For (Project Type)"
            projectPlaceholder="Double Storey Rear and Front Extension"
            onChangeField={(field, val) => setField(field, val)}
            totalLabel={data.totalLabel}
            onChangeTotalLabel={(val) => setField("totalLabel", val)}
          />

          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-1">
              Line Items
            </h2>
            <div className="space-y-3">
              {data.items.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-400">
                      {idx + 1}. {item.title || "New Item"}
                    </span>
                    {data.items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-xs text-red-400 hover:text-red-650 cursor-pointer">
                        Remove
                      </button>
                    )}
                  </div>
                  <FormInput
                    label="Title"
                    placeholder="Title (e.g. Drainage)"
                    value={item.title}
                    onChange={(val) => setItem(idx, "title", val)}
                  />
                  <FormTextarea
                    label="Description"
                    rows={3}
                    placeholder="Detailed description of the work..."
                    value={item.description}
                    onChange={(val) => setItem(idx, "description", val)}
                  />
                  <FormInput
                    label="Amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Amount (e.g. 5000 — leave blank if not priced)"
                    value={item.amount}
                    onChange={(val) => setItem(idx, "amount", val)}
                  />
                </div>
              ))}
              <button
                onClick={addItem}
                className="w-full border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 text-sm py-2 rounded-lg transition-colors font-medium cursor-pointer">
                + Add Item
              </button>
            </div>
            {/* Total */}
            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm text-gray-800">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total Cost</span>
                <span>
                  {totals.total > 0
                    ? `£${totals.total.toLocaleString("en-GB", {
                        minimumFractionDigits: 2,
                      })}`
                    : "—"}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                N.B. Subject to standard rate of VAT @ 20%
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-1">
              Payment Terms
            </h2>
            <div className="space-y-2">
              {(data.paymentTerms || DEFAULT_PAYMENT_TERMS).map((term, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                    value={term.description}
                    onChange={(e) =>
                      setPaymentTerm(idx, "description", e.target.value)
                    }
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    className="w-16 border border-gray-200 rounded px-2 py-1.5 text-xs text-right focus:outline-none focus:border-blue-500 bg-white text-gray-900 placeholder-gray-400"
                    value={term.percentage}
                    onChange={(e) =>
                      setPaymentTerm(idx, "percentage", e.target.value)
                    }
                    placeholder="20%"
                  />
                  {(data.paymentTerms || DEFAULT_PAYMENT_TERMS).length > 1 && (
                    <button
                      onClick={() => removePaymentTerm(idx)}
                      className="text-red-400 hover:text-red-650 text-sm px-1 cursor-pointer">
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addPaymentTerm}
                className="w-full border border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 text-xs py-2 rounded-lg transition-colors font-medium cursor-pointer">
                + Add Payment Term
              </button>
            </div>
          </section>
        </aside>

        {/* ── A4 PREVIEW PANEL ── */}
        <main className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center">
          <div
            style={{
              width: "794px",
              minHeight: "1123px",
              background: "#fff",
              boxShadow: "0 4px 32px rgba(0,0,0,0.12)",
              padding: "45px 53px",
              fontFamily: "Arial, Helvetica, sans-serif",
              fontSize: "10pt",
              color: "#111",
              flexShrink: 0,
            }}>
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "24px",
              }}>
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Live Constructions Ltd"
                  style={{ width: "220px", height: "auto" }}
                />
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "8.5pt",
                    lineHeight: "1.65",
                    color: "#000",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}>
                    <div style={{ flexShrink: 0, marginTop: "3px" }}>
                      <PinIcon />
                    </div>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#000",
                        lineHeight: "1.45",
                        whiteSpace: "pre-wrap",
                      }}>
                      {data.ownerAddress || COMPANY.address}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}>
                    <div style={{ flexShrink: 0, marginTop: "3px" }}>
                      <PhoneIcon />
                    </div>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#000",
                        lineHeight: "1.45",
                        whiteSpace: "pre-wrap",
                      }}>
                      {(data.ownerPhone || COMPANY.phones.join(" / "))
                        .split(/\s*[\/\n]\s*/)
                        .filter(Boolean)
                        .join("\n")}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}>
                    <div style={{ flexShrink: 0 }}>
                      <EmailIcon />
                    </div>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#000",
                        lineHeight: "1.45",
                      }}>
                      {data.ownerEmail || COMPANY.email}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}>
                    <div style={{ flexShrink: 0 }}>
                      <WebsiteIcon />
                    </div>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#000",
                        lineHeight: "1.45",
                      }}>
                      {data.ownerWebsite || COMPANY.website}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right", minWidth: "240px" }}>
                <div
                  style={{
                    background: "#1a56a0",
                    height: "28px",
                    clipPath: "polygon(10% 0%, 100% 0%, 100% 100%, 0% 100%)",
                    marginBottom: "8px",
                  }}
                />
                <div
                  style={{
                    fontSize: "24pt",
                    fontWeight: 900,
                    color: "#4a4a4a",
                    marginBottom: "10px",
                  }}>
                  QUOTATION
                </div>
                <table
                  style={{
                    marginLeft: "auto",
                    fontSize: "9pt",
                    borderCollapse: "collapse",
                  }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          fontWeight: "bold",
                          paddingRight: "10px",
                          textAlign: "left",
                        }}>
                        QUOTATION NO.
                      </td>
                      <td>{data.quotationNo || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", textAlign: "left" }}>
                        DATE:
                      </td>
                      <td>{data.date || "—"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* CLIENT */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "14px 0 20px",
                fontSize: "9.5pt",
              }}>
              <div>
                <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                  Client Address:
                </div>
                <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
                  {data.clientAddress || "—"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div>For:</div>
                <div style={{ whiteSpace: "pre-wrap" }}>{data.forProject}</div>
              </div>
            </div>

            {/* ITEMS TABLE */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "9.5pt",
              }}>
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "7px 10px",
                      textAlign: "left",
                      fontWeight: "bold",
                      fontStyle: "italic",
                    }}>
                    DESCRIPTION
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "7px 10px",
                      width: "110px",
                      textAlign: "center",
                    }}>
                    AMOUNT
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, idx) => (
                  <tr key={idx} style={{ pageBreakInside: "avoid" }}>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px 10px",
                        verticalAlign: "top",
                      }}>
                      <div style={{ fontWeight: "bold", marginBottom: "3px" }}>
                        {idx + 1}) {item.title}
                      </div>
                      <div
                        style={{
                          fontSize: "9pt",
                          whiteSpace: "pre-wrap",
                          lineHeight: "1.5",
                        }}>
                        {item.description}
                      </div>
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px 10px",
                        textAlign: "right",
                        verticalAlign: "top",
                        width: "110px",
                      }}>
                      {item.amount
                        ? `£${parseFloat(item.amount.replace(/[^0-9.]/g, "") || "0").toLocaleString("en-GB", { minimumFractionDigits: 2 })}`
                        : ""}
                    </td>
                  </tr>
                ))}
                {/* TOTAL COST ROW */}
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "7px 10px",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}>
                    TOTAL COST {data.totalLabel}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "7px 10px",
                      textAlign: "right",
                      width: "110px",
                      fontWeight: "bold",
                    }}>
                    {totals.total > 0
                      ? `£${totals.total.toLocaleString("en-GB", { minimumFractionDigits: 2 })}`
                      : ""}
                  </td>
                </tr>
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      border: "1px solid #000",
                      padding: "5px 10px",
                      fontWeight: "bold",
                      textAlign: "right",
                      fontSize: "8.5pt",
                    }}>
                    N.B Quotation is subject to standard rate of VAT @ 20%
                  </td>
                </tr>
              </tbody>
            </table>

            {/* PAYMENT TERMS */}
            <div style={{ marginTop: "28px", fontSize: "9.5pt" }}>
              <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
                The terms of payment are as follows:
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "9.5pt",
                  marginTop: "6px",
                }}>
                <tbody>
                  {(data.paymentTerms || DEFAULT_PAYMENT_TERMS).map(
                    (term, idx) => (
                      <tr key={idx}>
                        <td
                          style={{
                            padding: "2px 0",
                            textAlign: "left",
                            verticalAlign: "top",
                          }}>
                          {term.description}
                        </td>
                        <td
                          style={{
                            padding: "2px 0",
                            textAlign: "right",
                            width: "80px",
                            fontWeight: "bold",
                            verticalAlign: "top",
                          }}>
                          {term.percentage}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGE FOOTER */}
            <div
              style={{
                marginTop: "24px",
                fontSize: "8pt",
                color: "#444",
                borderTop: "0.5px solid #ccc",
                paddingTop: "6px",
              }}>
              <div>
                VAT NO: &nbsp;&nbsp; Company Registered in England and Wales No:
                14326005
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
