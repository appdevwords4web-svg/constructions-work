"use client";

import { useState, useCallback, useRef } from "react";
import { COMPANY } from "@/lib/documentStyles";
import {
  InvoiceData,
  InvoiceLineItem,
  buildInvoiceHtml,
  calcInvoiceTotals,
} from "@/lib/invoiceBuilder";
import { printHtml } from "@/lib/print";
import { getLogoBase64 } from "@/lib/logo";
import { GeneratorHeader } from "@/components/GeneratorHeader";
import { FormInput, FormTextarea } from "@/components/FormFields";
import { OwnerDetailsForm } from "@/components/OwnerDetailsForm";
import { ClientDetailsForm } from "@/components/ClientDetailsForm";
import { BankDetailsForm } from "@/components/BankDetailsForm";
import { PinIcon, PhoneIcon, EmailIcon } from "@/components/CompanyIcons";

const DEFAULT_ITEMS: InvoiceLineItem[] = [{ description: "", amount: "" }];

const DEFAULT_DATA: InvoiceData = {
  invoiceNo: "",
  date: "",
  utrNo: "",
  clientAddress: "",
  forProject: "Single Story Side Extension",
  items: DEFAULT_ITEMS,
  vatNo: "",
  bank: "",
  accountNo: "",
  sortCode: "",
  ownerAddress: COMPANY.address,
  ownerPhone: COMPANY.phones.join(" / "),
  ownerEmail: COMPANY.email,
};

export default function InvoicePage() {
  const [data, setData] = useState<InvoiceData>(DEFAULT_DATA);
  const [printing, setPrinting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  /* ── Helpers ──────────────────────────────────────────── */
  const setField = (field: keyof InvoiceData, value: string) =>
    setData((d) => ({ ...d, [field]: value }));

  const setItem = (idx: number, field: keyof InvoiceLineItem, value: string) =>
    setData((d) => ({
      ...d,
      items: d.items.map((it, i) =>
        i === idx ? { ...it, [field]: value } : it,
      ),
    }));

  const addItem = () =>
    setData((d) => ({
      ...d,
      items: [...d.items, { description: "", amount: "" }],
    }));

  const removeItem = (idx: number) =>
    setData((d) => ({
      ...d,
      items: d.items.length > 1 ? d.items.filter((_, i) => i !== idx) : d.items,
    }));

  /* ── Print ─────────────────────────────────────────────── */
  const handlePrint = useCallback(async () => {
    setPrinting(true);
    try {
      const logoBase64 = await getLogoBase64();
      const html = buildInvoiceHtml(data, logoBase64);
      printHtml(html);
    } finally {
      setTimeout(() => setPrinting(false), 1500);
    }
  }, [data]);

  const totals = calcInvoiceTotals(data.items);

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      <GeneratorHeader
        title="Invoice Generator"
        onPrint={handlePrint}
        printing={printing}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* ── FORM PANEL ── */}
        <aside className="w-[400px] min-w-[320px] bg-white border-r border-gray-200 overflow-y-auto p-5 space-y-5 shrink-0 text-gray-800">
          <OwnerDetailsForm
            ownerAddress={data.ownerAddress || ""}
            ownerPhone={data.ownerPhone || ""}
            ownerEmail={data.ownerEmail || ""}
            onChangeField={(field, val) => setField(field, val)}
          />

          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-1">
              Invoice Details
            </h2>
            <div className="space-y-3">
              <FormInput
                label="Invoice No."
                placeholder="e.g. INV-001"
                value={data.invoiceNo}
                onChange={(val) => setField("invoiceNo", val)}
              />
              <FormInput
                label="Date"
                type="date"
                value={data.date}
                onChange={(val) => setField("date", val)}
              />
              <FormInput
                label="UTR No."
                placeholder="Unique Tax Reference"
                value={data.utrNo}
                onChange={(val) => setField("utrNo", val)}
              />
            </div>
          </section>

          <ClientDetailsForm
            clientAddress={data.clientAddress}
            forProject={data.forProject}
            projectLabel="For (Project Description)"
            projectPlaceholder="Single Story Side Extension"
            onChangeField={(field, val) => setField(field, val)}
          />

          <section>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b pb-1">
              Line Items
            </h2>
            <div className="space-y-2">
              {data.items.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gray-400">
                      Item {idx + 1}
                    </span>
                    {data.items.length > 1 && (
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-xs text-red-400 hover:text-red-655 cursor-pointer">
                        Remove
                      </button>
                    )}
                  </div>
                  <FormTextarea
                    label="Description"
                    rows={2}
                    placeholder="Description"
                    value={item.description}
                    onChange={(val) => setItem(idx, "description", val)}
                  />
                  <FormInput
                    label="Amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Amount (e.g. 2500)"
                    value={item.amount}
                    onChange={(val) => setItem(idx, "amount", val)}
                  />
                </div>
              ))}
              <button
                onClick={addItem}
                className="w-full border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 text-sm py-2 rounded-lg transition-colors font-medium cursor-pointer">
                + Add Item
              </button>
            </div>
            {/* Running totals */}
            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1 text-sm text-gray-800">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span>
                  £
                  {totals.subtotal.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-550">VAT @ 20%</span>
                <span>
                  £
                  {totals.vat.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-200 pt-1 mt-1 text-gray-900">
                <span>Amount Payable</span>
                <span>
                  £
                  {totals.total.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </section>

          <BankDetailsForm
            vatNo={data.vatNo}
            bank={data.bank}
            accountNo={data.accountNo}
            sortCode={data.sortCode}
            onChangeField={(field, val) => setField(field, val)}
          />
        </aside>

        {/* ── A4 PREVIEW PANEL ── */}
        <main className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center">
          <div
            ref={previewRef}
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
                      alignItems: "flex-start",
                      gap: "10px",
                    }}>
                    <div style={{ flexShrink: 0, marginTop: "3px" }}>
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
                  INVOICE
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
                        INVOICE NO.
                      </td>
                      <td>{data.invoiceNo || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", textAlign: "left" }}>
                        DATE:
                      </td>
                      <td>{data.date || "—"}</td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: "bold", textAlign: "left" }}>
                        UTR NO.
                      </td>
                      <td>{data.utrNo || "—"}</td>
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
              <div style={{ textAlign: "right", whiteSpace: "pre-wrap" }}>
                For: {data.forProject}
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
                      textAlign: "center",
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
                  <tr key={idx} style={{ minHeight: "24px" }}>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        verticalAlign: "top",
                        whiteSpace: "pre-wrap",
                      }}>
                      {item.description}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "6px 10px",
                        textAlign: "right",
                        width: "110px",
                        whiteSpace: "nowrap",
                      }}>
                      {item.amount
                        ? `£${parseFloat(item.amount.replace(/[^0-9.]/g, "") || "0").toLocaleString("en-GB", { minimumFractionDigits: 2 })}`
                        : ""}
                    </td>
                  </tr>
                ))}
                {Array.from({ length: Math.max(0, 8 - data.items.length) }).map(
                  (_, i) => (
                    <tr key={`blank-${i}`} style={{ height: "26px" }}>
                      <td style={{ border: "1px solid #000" }}></td>
                      <td style={{ border: "1px solid #000" }}></td>
                    </tr>
                  ),
                )}
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "6px 10px",
                      textAlign: "right",
                      fontSize: "9pt",
                    }}>
                    VAT @ 20%
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "6px 10px",
                      textAlign: "right",
                      width: "110px",
                    }}>
                    {totals.fmtVat}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* AMOUNT PAYABLE */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "9.5pt",
              }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      border: "1px solid #000",
                      borderTop: "none",
                      padding: "7px 10px",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}>
                    AMOUNT PAYABLE
                  </td>
                  <td
                    style={{
                      border: "2px solid #000",
                      borderTop: "none",
                      padding: "7px 10px",
                      textAlign: "right",
                      width: "110px",
                      fontWeight: "bold",
                    }}>
                    {totals.fmtTotal}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* FOOTER */}
            <div
              style={{ marginTop: "22px", fontSize: "9pt", lineHeight: "1.8" }}>
              <div>
                <strong>VAT NO:</strong> {data.vatNo}
              </div>
              <div>Company Registered in England and Wales No: 14326005</div>
              <br />
              <div>
                <strong>BANK:</strong> {data.bank}
              </div>
              <div>
                <strong>A/C No:</strong> {data.accountNo}
              </div>
              <div>
                <strong>Sort Code:</strong> {data.sortCode}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
