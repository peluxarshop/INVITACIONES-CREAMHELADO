'use client';

import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faFileCsv,
  faCheckCircle,
  faExclamationTriangle,
  faDownload,
  faArrowRight,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Guest } from '@/types';

interface AdminCsvUploadProps {
  onImportSuccess: (guests: Array<Omit<Guest, 'id' | 'createdAt'>>) => Promise<void>;
  onClose?: () => void;
}

interface ParsedRow {
  fullName: string;
  phone: string;
  email: string;
  isValid: boolean;
  error?: string;
}

export const AdminCsvUpload: React.FC<AdminCsvUploadProps> = ({ onImportSuccess, onClose }) => {
  const [parsedData, setParsedData] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cleanPhone = (phone: string) => {
    let clean = String(phone || '').replace(/[^0-9]/g, '');
    if (clean.length === 10 && clean.startsWith('3')) {
      clean = '57' + clean;
    }
    return clean;
  };

  const processCsvFile = (file: File) => {
    setFileName(file.name);
    setSuccessMessage(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows: ParsedRow[] = [];

        results.data.forEach((row: any) => {
          const keys = Object.keys(row);
          const findKey = (candidates: string[]) =>
            keys.find((k) => candidates.some((c) => k.trim().toLowerCase() === c.toLowerCase()));

          const nameKey = findKey(['nombre', 'nombres', 'nombre completo', 'fullname', 'full name', 'name', 'empleado']);
          const lastNameKey = findKey(['apellido', 'apellidos', 'lastname', 'last name']);
          const phoneKey = findKey(['whatsapp', 'celular', 'telefono', 'teléfono', 'phone', 'movil', 'móvil', 'numero']);
          const emailKey = findKey(['correo', 'email', 'correo electronico', 'correo electrónico', 'mail']);

          let fullName = '';
          if (nameKey && lastNameKey && row[nameKey] && row[lastNameKey]) {
            fullName = `${row[nameKey].trim()} ${row[lastNameKey].trim()}`;
          } else if (nameKey && row[nameKey]) {
            fullName = row[nameKey].trim();
          } else {
            const firstVal = Object.values(row)[0];
            fullName = typeof firstVal === 'string' ? firstVal.trim() : '';
          }

          const rawPhone = phoneKey ? row[phoneKey] : '';
          const phone = cleanPhone(rawPhone);
          const email = emailKey ? String(row[emailKey] || '').trim() : '';

          const isValid = Boolean(fullName && phone && phone.length >= 7);
          let error: string | undefined;
          if (!fullName) error = 'Falta el nombre';
          else if (!phone) error = 'Falta el celular';
          else if (phone.length < 7) error = 'Celular muy corto';

          rows.push({
            fullName,
            phone,
            email: email || `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@cremhelado.com.co`,
            isValid,
            error,
          });
        });

        setParsedData(rows);
      },
      error: (err) => {
        alert('Error al leer el archivo CSV: ' + err.message);
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processCsvFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      processCsvFile(file);
    } else {
      alert('Por favor arrastra un archivo con extensión .csv');
    }
  };

  const downloadSampleCsv = () => {
    const content = `Nombres,Apellidos,WhatsApp,Correo\nJuan David,Pérez Gómez,3001234567,juan.perez@cremhelado.com.co\nMaría Camila,Rodríguez,3109876543,maria.rodriguez@cremhelado.com.co\nCarlos Andrés,Zapata,3155554433,carlos.zapata@cremhelado.com.co\nLaura Cristina,Montoya,3208048128,laura.montoya@cremhelado.com.co`;
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'plantilla_invitados_cremhelado.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmImport = async () => {
    const validRows = parsedData.filter((r) => r.isValid);
    if (validRows.length === 0) {
      alert('No hay registros válidos para importar');
      return;
    }

    try {
      setIsProcessing(true);
      const guestsToImport = validRows.map((r) => ({
        fullName: r.fullName,
        firstName: r.fullName.split(' ')[0],
        phone: r.phone,
        email: r.email,
        status: 'pending' as const,
      }));

      await onImportSuccess(guestsToImport);
      setSuccessMessage(`¡Se importaron con éxito ${validRows.length} colaboradores a la lista!`);
      setParsedData([]);
      setFileName(null);
      if (onClose) {
        setTimeout(onClose, 1500);
      }
    } catch {
      alert('Ocurrió un error guardando los invitados');
    } finally {
      setIsProcessing(false);
    }
  };

  const validCount = parsedData.filter((r) => r.isValid).length;
  const invalidCount = parsedData.length - validCount;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FontAwesomeIcon icon={faFileCsv} className="text-[#E30613]" />
            <span>Carga Masiva de Invitados desde Excel / CSV</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Sube un archivo con columnas: Nombres, Apellidos (o Nombre Completo), Celular y Correo.
          </p>
        </div>

        <button
          onClick={downloadSampleCsv}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-300 transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={faDownload} className="text-[#E30613]" />
          <span>Descargar Plantilla CSV</span>
        </button>
      </div>

      {/* Zona de Drop */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-[#E30613] bg-red-50/60 scale-[1.01]'
            : 'border-slate-300 hover:border-[#E30613] bg-white hover:bg-slate-50/50'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="w-16 h-16 rounded-full bg-red-50 text-[#E30613] flex items-center justify-center mx-auto mb-4 text-2xl">
          <FontAwesomeIcon icon={faUpload} />
        </div>

        <p className="text-sm sm:text-base font-bold text-slate-900">
          {fileName ? (
            <span className="text-[#E30613] font-mono">{fileName}</span>
          ) : (
            'Haz clic para seleccionar o arrastra tu archivo CSV aquí'
          )}
        </p>
        <p className="text-xs text-slate-500 mt-1.5">
          Formato CSV delimitado por comas o punto y coma (máximo 5.000 filas por archivo)
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Previsualización de Datos */}
      {parsedData.length > 0 && (
        <div className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Previsualización de los datos leídos</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Total filas: <strong className="text-slate-900">{parsedData.length}</strong> | Válidas:{' '}
                <strong className="text-emerald-600">{validCount}</strong>
                {invalidCount > 0 && (
                  <>
                    {' '}
                    | Con error:{' '}
                    <strong className="text-rose-600">{invalidCount}</strong>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setParsedData([]);
                  setFileName(null);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors"
                title="Descartar archivo"
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>

              <button
                onClick={handleConfirmImport}
                disabled={isProcessing || validCount === 0}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E30613] hover:bg-[#c40510] text-white font-bold text-xs shadow-md disabled:opacity-50 transition-all cursor-pointer"
              >
                <span>{isProcessing ? 'Importando...' : `Confirmar Importación (${validCount})`}</span>
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0 text-slate-500 uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3">Nombre</th>
                  <th className="py-2.5 px-3">WhatsApp / Celular</th>
                  <th className="py-2.5 px-3">Correo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {parsedData.slice(0, 50).map((row, idx) => (
                  <tr key={idx} className={row.isValid ? 'hover:bg-slate-50' : 'bg-red-50/50'}>
                    <td className="py-2 px-3">
                      {row.isValid ? (
                        <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                          <FontAwesomeIcon icon={faCheckCircle} />
                          <span>Listo</span>
                        </span>
                      ) : (
                        <span className="text-rose-600 font-bold text-[11px] flex items-center gap-1" title={row.error}>
                          <FontAwesomeIcon icon={faExclamationTriangle} />
                          <span>{row.error}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{row.fullName || '-'}</td>
                    <td className="py-2 px-3 font-mono text-slate-700">{row.phone || '-'}</td>
                    <td className="py-2 px-3 text-slate-500">{row.email || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
