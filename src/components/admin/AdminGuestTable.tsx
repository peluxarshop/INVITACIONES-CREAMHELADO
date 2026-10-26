'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faCopy,
  faTrashAlt,
  faUserPlus,
  faDownload,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faExternalLinkAlt,
  faCheck,
  faEnvelope,
  faPaperPlane,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { Guest, GuestStatus, EventConfig } from '@/types';
import { formatEventSchedule } from '@/lib/timeUtils';

interface AdminGuestTableProps {
  guests: Guest[];
  config: EventConfig;
  onAddGuest: (guest: Omit<Guest, 'id' | 'createdAt'>) => Promise<void>;
  onUpdateGuest: (guest: Guest) => Promise<void>;
  onDeleteGuest: (id: string) => Promise<void>;
  onStatusChange: (id: string, status: GuestStatus) => Promise<void>;
}

export const AdminGuestTable: React.FC<AdminGuestTableProps> = ({
  guests,
  config,
  onAddGuest,
  onUpdateGuest,
  onDeleteGuest,
  onStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | GuestStatus>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [emailingId, setEmailingId] = useState<string | null>(null);
  const [emailSentId, setEmailSentId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Edición de invitado
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    cedula: '',
    area: '',
    status: 'pending' as GuestStatus,
    notes: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Nuevo invitado manual
  const [newFullName, setNewFullName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newArea, setNewArea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getOrigin = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_APP_URL || 'https://tudominio.com';
  };

  const getInvitationUrl = (guestId: string) => {
    return `${getOrigin()}/invitacion/${guestId}`;
  };

  const formatPhoneNumber = (phone: string) => {
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.length === 10 && clean.startsWith('3')) {
      clean = '57' + clean;
    }
    return clean;
  };

  const generateWhatsAppUrl = (guest: Guest) => {
    const formattedPhone = formatPhoneNumber(guest.phone);
    const link = getInvitationUrl(guest.id);
    const firstName = guest.firstName || guest.fullName.split(' ')[0];

    let message = config.whatsappTemplate || '¡Hola {nombre}! 🎉 Tienes una invitación muy especial para nuestra Fiesta de Fin de Año de {empresa}. Confirma tu asistencia y obtén tu pase digital aquí: {link}';
    message = message
      .replace(/{nombre}/g, firstName)
      .replace(/{empresa}/g, config.companyName)
      .replace(/{fecha}/g, config.eventDate)
      .replace(/{hora}|{horario}/g, formatEventSchedule(config.eventTime, config.eventEndTime))
      .replace(/{link}/g, link);

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
  };

  const copyToClipboard = (guestId: string) => {
    const link = getInvitationUrl(guestId);
    navigator.clipboard.writeText(link);
    setCopiedId(guestId);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSendEmail = async (guest: Guest) => {
    try {
      setEmailingId(guest.id);
      const invitationUrl = getInvitationUrl(guest.id);
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'invitation',
          guest,
          config,
          url: invitationUrl,
        }),
      });
      if (res.ok) {
        setEmailSentId(guest.id);
        setTimeout(() => setEmailSentId(null), 3000);
      } else {
        alert('No se pudo enviar el correo.');
      }
    } catch {
      alert('Error de conexión enviando correo');
    } finally {
      setEmailingId(null);
    }
  };

  // Filtrado de invitados
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.cedula && guest.cedula.includes(searchTerm)) ||
      (guest.area && guest.area.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' ? true : guest.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Exportar reporte a CSV (Compatible 100% con Microsoft Excel)
  const handleExportCsv = () => {
    const headers = ['Nombre Completo', 'Celular', 'Correo', 'Estado', 'Cédula', 'Área', 'Fecha Confirmación', 'Notas'];
    const rows = filteredGuests.map((g) => [
      `"${g.fullName}"`,
      `"${g.phone}"`,
      `"${g.email}"`,
      `"${g.status === 'confirmed' ? 'Confirmado' : g.status === 'declined' ? 'No Asiste' : 'Pendiente'}"`,
      `"${g.cedula || ''}"`,
      `"${g.area || 'Sin asignar'}"`,
      `"${g.confirmedAt ? new Date(g.confirmedAt).toLocaleString('es-CO') : ''}"`,
      `"${g.notes || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_invitados_por_area_${config.companyName.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newPhone.trim()) return;

    try {
      setIsSubmitting(true);
      await onAddGuest({
        fullName: newFullName.trim(),
        firstName: newFullName.trim().split(' ')[0],
        phone: newPhone.trim(),
        email: newEmail.trim() || `${newFullName.trim().toLowerCase().replace(/\s+/g, '.')}@cremhelado.com.co`,
        status: 'pending',
        area: newArea.trim() || undefined,
      });
      setNewFullName('');
      setNewPhone('');
      setNewEmail('');
      setNewArea('');
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setEditForm({
      fullName: guest.fullName || '',
      phone: guest.phone || '',
      email: guest.email || '',
      cedula: guest.cedula || '',
      area: guest.area || '',
      status: guest.status || 'pending',
      notes: guest.notes || '',
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;
    if (!editForm.fullName.trim() || !editForm.phone.trim()) {
      alert('Nombre completo y celular son campos obligatorios.');
      return;
    }

    try {
      setIsUpdating(true);
      const updatedGuest: Guest = {
        ...editingGuest,
        fullName: editForm.fullName.trim(),
        firstName: editForm.fullName.trim().split(' ')[0],
        lastName: editForm.fullName.trim().split(' ').slice(1).join(' '),
        phone: editForm.phone.trim(),
        email: editForm.email.trim(),
        cedula: editForm.cedula.trim() || undefined,
        area: (editForm.area.trim() || undefined) as any,
        status: editForm.status,
        notes: editForm.notes.trim() || undefined,
        confirmedAt:
          editForm.status === 'confirmed'
            ? editingGuest.confirmedAt || new Date().toISOString()
            : undefined,
      };

      await onUpdateGuest(updatedGuest);
      setEditingGuest(null);
    } catch (err) {
      console.error('Error al actualizar invitado:', err);
      alert('Error al actualizar la información del invitado.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteFromEdit = async () => {
    if (!editingGuest) return;
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente la invitación de ${editingGuest.fullName}?`)) {
      await onDeleteGuest(editingGuest.id);
      setEditingGuest(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de herramientas superior */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Búsqueda */}
        <div className="relative flex-1 max-w-md">
          <FontAwesomeIcon icon={faSearch} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, cédula o celular..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] transition-colors shadow-xs"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-300 transition-colors shadow-xs cursor-pointer"
            title="Exportar a Excel / CSV"
          >
            <FontAwesomeIcon icon={faDownload} className="text-slate-500" />
            <span className="hidden sm:inline">Exportar CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#E30613] hover:bg-[#c40510] text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Agregar Invitado</span>
          </button>
        </div>
      </div>

      {/* Filtros por estado (botones limpios, sin badges cápsula) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            statusFilter === 'all'
              ? 'bg-[#E30613] text-white'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          Todos ({guests.length})
        </button>
        <button
          onClick={() => setStatusFilter('confirmed')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            statusFilter === 'confirmed'
              ? 'bg-emerald-600 text-white'
              : 'bg-white text-emerald-700 hover:text-emerald-800 border border-slate-200'
          }`}
        >
          Confirmados ({guests.filter((g) => g.status === 'confirmed').length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            statusFilter === 'pending'
              ? 'bg-amber-600 text-white'
              : 'bg-white text-amber-700 hover:text-amber-800 border border-slate-200'
          }`}
        >
          Por Confirmar ({guests.filter((g) => g.status === 'pending').length})
        </button>
        <button
          onClick={() => setStatusFilter('declined')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            statusFilter === 'declined'
              ? 'bg-slate-700 text-white'
              : 'bg-white text-slate-600 hover:text-slate-800 border border-slate-200'
          }`}
        >
          No Asisten ({guests.filter((g) => g.status === 'declined').length})
        </button>
      </div>

      {/* Tabla para pantallas medianas/grandes */}
      <div className="hidden md:block rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Invitado</th>
              <th className="py-3.5 px-4">Contacto</th>
              <th className="py-3.5 px-4">Estado</th>
              <th className="py-3.5 px-4">Cédula</th>
              <th className="py-3.5 px-4">Área</th>
              <th className="py-3.5 px-4 text-center">Enviar Invitación</th>
              <th className="py-3.5 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredGuests.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400">
                  No se encontraron invitados con los filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredGuests.map((guest) => {
                const waUrl = generateWhatsAppUrl(guest);
                const isCopied = copiedId === guest.id;
                const isEmailing = emailingId === guest.id;
                const isEmailSent = emailSentId === guest.id;

                return (
                  <tr key={guest.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">{guest.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        ID: {guest.id}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-700 font-mono">{guest.phone}</div>
                      <div className="text-[11px] text-slate-400">{guest.email}</div>
                    </td>

                    {/* Estado sin badges cápsula */}
                    <td className="py-3.5 px-4">
                      {guest.status === 'confirmed' ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                          <FontAwesomeIcon icon={faCheckCircle} />
                          <span>Confirmado</span>
                        </div>
                      ) : guest.status === 'declined' ? (
                        <div>
                          <div className="flex items-center gap-1.5 text-rose-600 font-bold">
                            <FontAwesomeIcon icon={faTimesCircle} />
                            <span>No Asiste</span>
                          </div>
                          {guest.notes && (
                            <div className="text-[11px] text-slate-500 italic mt-0.5 max-w-[180px] truncate" title={`Motivo: ${guest.notes}`}>
                              &quot;{guest.notes}&quot;
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                          <FontAwesomeIcon icon={faClock} />
                          <span>Pendiente</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {guest.cedula ? (
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {guest.cedula}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">- Por registrar -</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {guest.area ? (
                        <span className="font-bold text-slate-800 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs">
                          {guest.area}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">- Sin asignar -</span>
                      )}
                    </td>

                    {/* Botones de Envío: WhatsApp y Correo */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs hover:scale-105"
                          title="Enviar por WhatsApp con 1 clic"
                        >
                          <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
                          <span>WhatsApp</span>
                        </a>

                        <button
                          onClick={() => handleSendEmail(guest)}
                          disabled={isEmailing}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                            isEmailSent
                              ? 'bg-blue-50 border-blue-400 text-blue-700'
                              : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                          }`}
                          title="Enviar invitación a su correo"
                        >
                          <FontAwesomeIcon icon={isEmailSent ? faCheck : faEnvelope} className="text-slate-500" />
                          <span>{isEmailing ? 'Enviando...' : isEmailSent ? 'Enviado' : 'Correo'}</span>
                        </button>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(guest)}
                          className="p-2 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-[#E30613] hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                          title="Editar datos del invitado"
                        >
                          <FontAwesomeIcon icon={faEdit} className="text-xs" />
                        </button>

                        <button
                          onClick={() => copyToClipboard(guest.id)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-600'
                              : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                          title="Copiar enlace de invitación"
                        >
                          <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} className="text-xs" />
                        </button>

                        <a
                          href={getInvitationUrl(guest.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                          title="Ver invitación como invitado"
                        >
                          <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
                        </a>

                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la invitación de ${guest.fullName}?`)) {
                              onDeleteGuest(guest.id);
                            }
                          }}
                          className="p-2 rounded-lg bg-white border border-slate-300 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-colors cursor-pointer"
                          title="Eliminar invitado"
                        >
                          <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Tarjetas Mobile-First para celulares */}
      <div className="md:hidden space-y-3">
        {filteredGuests.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No se encontraron invitados.
          </div>
        ) : (
          filteredGuests.map((guest) => {
            const waUrl = generateWhatsAppUrl(guest);
            const isCopied = copiedId === guest.id;

            return (
              <div
                key={guest.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{guest.fullName}</h4>
                    <span className="text-[11px] text-slate-500">{guest.phone}</span>
                  </div>
                  {guest.status === 'confirmed' ? (
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <FontAwesomeIcon icon={faCheckCircle} /> Confirmado
                    </span>
                  ) : guest.status === 'declined' ? (
                    <span className="text-rose-600 font-bold text-xs flex items-center gap-1">
                      <FontAwesomeIcon icon={faTimesCircle} /> No Asiste
                    </span>
                  ) : (
                    <span className="text-amber-600 font-bold text-xs flex items-center gap-1">
                      <FontAwesomeIcon icon={faClock} /> Pendiente
                    </span>
                  )}
                </div>

                {guest.cedula && (
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span>Cédula:</span>
                    <span className="font-mono font-bold text-slate-900">{guest.cedula}</span>
                  </div>
                )}

                {guest.area && (
                  <div className="text-xs text-slate-600 flex items-center gap-1.5">
                    <span>Área:</span>
                    <span className="font-semibold text-slate-900 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">{guest.area}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="text-sm" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => handleSendEmail(guest)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
                    title="Enviar Correo"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(guest)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-[#E30613] hover:bg-red-50 border border-slate-200 transition-colors"
                    title="Editar datos"
                  >
                    <FontAwesomeIcon icon={faEdit} className="text-xs" />
                  </button>

                  <button
                    onClick={() => copyToClipboard(guest.id)}
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
                    title="Copiar link"
                  >
                    <FontAwesomeIcon icon={isCopied ? faCheck : faCopy} className="text-xs" />
                  </button>

                  <a
                    href={getInvitationUrl(guest.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="text-xs" />
                  </a>

                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar la invitación de ${guest.fullName}?`)) {
                        onDeleteGuest(guest.id);
                      }
                    }}
                    className="p-2 rounded-xl bg-slate-100 text-rose-500 hover:bg-rose-50 border border-slate-200 transition-colors"
                    title="Eliminar invitado"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="text-xs" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal para Agregar Invitado Manual */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Agregar Invitado Manualmente</h3>
            <p className="text-xs text-slate-500 mb-4">
              Ingresa los datos para generar el enlace personalizado
            </p>

            <form onSubmit={handleCreateGuest} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#E30613]"
                  placeholder="Ej: Laura Cristina Montoya"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Celular / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#E30613]"
                  placeholder="Ej: 3001234567 o 573001234567"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Área (Opcional)
                </label>
                <select
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#E30613] cursor-pointer"
                >
                  <option value="">Selecciona el área...</option>
                  <option value="Logística">Logística</option>
                  <option value="Comercial">Comercial</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Administración">Administración</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Correo Electrónico (Opcional)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#E30613]"
                  placeholder="laura.montoya@cremhelado.com.co"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#E30613] hover:bg-[#c40510] text-white font-bold text-xs shadow-sm cursor-pointer"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Invitado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Editar / Modificar Invitado (CRUD Completo) */}
      {editingGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl my-8">
            <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E30613] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                  Gestión de Invitación
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                  Editar Datos del Invitado
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">
                  ID: {editingGuest.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingGuest(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-[#E30613] focus:bg-white transition-all"
                    placeholder="Ej: Carlos Gómez Restrepo"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Cédula / Documento
                  </label>
                  <input
                    type="text"
                    value={editForm.cedula}
                    onChange={(e) => setEditForm({ ...editForm, cedula: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#E30613] focus:bg-white transition-all font-mono"
                    placeholder="Ej: 1020304050"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Celular / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#E30613] focus:bg-white transition-all font-mono"
                    placeholder="Ej: 3101234567"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#E30613] focus:bg-white transition-all"
                    placeholder="carlos.gomez@cremhelado.com.co"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Área Operativa
                  </label>
                  <select
                    value={editForm.area}
                    onChange={(e) => setEditForm({ ...editForm, area: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#E30613] focus:bg-white cursor-pointer font-medium"
                  >
                    <option value="">-- Sin Asignar --</option>
                    <option value="Logística">Logística</option>
                    <option value="Comercial">Comercial</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Administración">Administración</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Estado de Asistencia
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as GuestStatus })}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#E30613] cursor-pointer font-bold ${
                      editForm.status === 'confirmed'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : editForm.status === 'declined'
                        ? 'bg-rose-50 border-rose-300 text-rose-800'
                        : 'bg-amber-50 border-amber-300 text-amber-800'
                    }`}
                  >
                    <option value="pending">⏳ Pendiente</option>
                    <option value="confirmed">✅ Confirmado (Asistirá)</option>
                    <option value="declined">❌ No Asiste</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Observaciones / Notas Especiales
                  </label>
                  <textarea
                    rows={2}
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-[#E30613] focus:bg-white transition-all resize-none"
                    placeholder="Restricciones alimentarias, detalles de transporte, mesa asignada..."
                  />
                </div>
              </div>

              {/* Botones de acción del Modal de Edición */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={handleDeleteFromEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 text-xs font-bold transition-all cursor-pointer"
                  title="Eliminar invitado permanentemente"
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                  <span>Eliminar</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingGuest(null)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E30613] hover:bg-[#c40510] text-white font-bold text-xs shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <FontAwesomeIcon icon={faCheck} />
                    <span>{isUpdating ? 'Guardando...' : 'Guardar Cambios'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
