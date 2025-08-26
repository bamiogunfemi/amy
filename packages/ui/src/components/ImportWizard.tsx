import { useState } from "react";
import { Button, Input } from "..";
import apiClient from "../lib/axios";

interface ImportWizardProps {
  onDone?: () => void;
}

export function ImportWizard({ onDone }: ImportWizardProps) {
  const [file, setFile] = useState<File | null>(null);
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [airtableKey, setAirtableKey] = useState("");
  const [airtableBase, setAirtableBase] = useState("");
  const [airtableTable, setAirtableTable] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadCsv = async () => {
    if (!file) return;
    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("file", file);
      await apiClient.post("/api/recruiter/imports/csv", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onDone?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const importSheets = async () => {
    if (!sheetsUrl.trim()) return;
    setIsSubmitting(true);
    try {
      await apiClient.post("/api/recruiter/imports/google-sheets", { url: sheetsUrl });
      onDone?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  const importAirtable = async () => {
    if (!airtableKey || !airtableBase || !airtableTable) return;
    setIsSubmitting(true);
    try {
      await apiClient.post("/api/recruiter/imports/airtable", {
        apiKey: airtableKey,
        baseId: airtableBase,
        table: airtableTable,
      });
      onDone?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-2">CSV Upload</h4>
        <Input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        <div className="mt-2">
          <Button disabled={!file || isSubmitting} onClick={uploadCsv}>Upload CSV</Button>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Google Sheets</h4>
        <Input placeholder="Share URL" value={sheetsUrl} onChange={(e) => setSheetsUrl(e.target.value)} />
        <div className="mt-2">
          <Button disabled={!sheetsUrl || isSubmitting} onClick={importSheets}>Import from Sheets</Button>
        </div>
      </div>

      <div>
        <h4 className="font-medium mb-2">Airtable</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Input placeholder="API Key" value={airtableKey} onChange={(e) => setAirtableKey(e.target.value)} />
          <Input placeholder="Base ID" value={airtableBase} onChange={(e) => setAirtableBase(e.target.value)} />
          <Input placeholder="Table" value={airtableTable} onChange={(e) => setAirtableTable(e.target.value)} />
        </div>
        <div className="mt-2">
          <Button disabled={!airtableKey || !airtableBase || !airtableTable || isSubmitting} onClick={importAirtable}>Import from Airtable</Button>
        </div>
      </div>
    </div>
  );
}


