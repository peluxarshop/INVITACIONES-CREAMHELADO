export type GuestStatus = 'pending' | 'confirmed' | 'declined';

export interface Guest {
  id: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  phone: string;
  email: string;
  status: GuestStatus;
  cedula?: string;
  area?: 'Logística' | 'Comercial' | 'Mantenimiento' | 'Administración' | string;
  confirmedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface EventConfig {
  id?: string;
  eventName: string;
  companyName: string;
  eventDate: string;
  eventTime: string;
  eventEndTime?: string;
  locationName: string;
  locationAddress: string;
  mapsUrl: string;
  dressCode: string;
  motivationalMessage: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  whatsappTemplate: string;
  musicEnabled?: boolean;
  musicUrl?: string;
}

export interface DashboardMetrics {
  total: number;
  confirmed: number;
  declined: number;
  pending: number;
  confirmationRate: number;
}
