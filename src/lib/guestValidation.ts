/**
 * Utilidades de validación para invitados y control de acceso
 * Evita que se guarden nombres genéricos ("Invitado(a) de honor") y asegura trazabilidad.
 */

export function isGenericGuestName(name?: string): boolean {
  if (!name) return true;
  const clean = name.trim().toLowerCase();
  if (clean.length < 3) return true;

  const genericPatterns = [
    'invitado',
    'invitada',
    'colaborador',
    'colaboradora',
    'apreciado',
    'apreciada',
    'por registrar',
    'sin nombre',
    'anonimo',
    'anónimo',
  ];

  return genericPatterns.some((pattern) => clean.includes(pattern));
}

/**
 * Devuelve el nombre si es un nombre real. Si es un placeholder genérico, devuelve ""
 * para que el campo de texto aparezca vacío y obligue al colaborador a escribir su nombre.
 */
export function sanitizeInitialGuestName(name?: string): string {
  if (isGenericGuestName(name)) {
    return '';
  }
  return (name || '').trim();
}

/**
 * Valida que el nombre ingresado sea real y completo (mínimo dos palabras, ej: Juan Pérez)
 */
export function validateGuestFullName(name?: string): { valid: boolean; error?: string } {
  if (!name || !name.trim()) {
    return {
      valid: false,
      error: 'Por favor escribe tu Nombre y Apellido real completo.',
    };
  }

  const clean = name.trim();

  if (isGenericGuestName(clean)) {
    return {
      valid: false,
      error: 'Por favor ingresa tu Nombre y Apellido real. No se permite dejar "Invitado(a) de honor".',
    };
  }

  const words = clean.split(/\s+/).filter((w) => w.length >= 2);
  if (words.length < 2 || clean.length < 5) {
    return {
      valid: false,
      error: 'Por favor ingresa tu Nombre y Apellido completo (al menos 2 palabras, ej: Carlos Gómez).',
    };
  }

  return { valid: true };
}

/**
 * Valida que la cédula sea numérica y tenga una longitud válida (mínimo 5 dígitos)
 */
export function validateGuestCedula(cedula?: string): { valid: boolean; error?: string; cleanCedula: string } {
  if (!cedula || !cedula.trim()) {
    return {
      valid: false,
      error: 'Por favor ingresa tu número de cédula o documento.',
      cleanCedula: '',
    };
  }

  const cleanCedula = cedula.replace(/[^0-9]/g, '');

  if (!cleanCedula || cleanCedula.length < 5) {
    return {
      valid: false,
      error: 'El número de cédula debe contener solo números y al menos 5 dígitos.',
      cleanCedula,
    };
  }

  if (cleanCedula.length > 15) {
    return {
      valid: false,
      error: 'El número de cédula ingresado es demasiado largo (máximo 15 dígitos).',
      cleanCedula,
    };
  }

  return { valid: true, cleanCedula };
}
