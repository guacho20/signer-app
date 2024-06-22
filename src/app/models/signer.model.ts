export interface FirmaValido {
  firmasValidas: boolean;
  integridadDocumento: boolean;
  error: string;
  certificado: Certificado[];
}

export interface Certificado {
  emitidoPara: string;
  emitidoPor: string;
  validoDesde: string;
  validoHasta: string;
  fechaFirma: string;
  fechaRevocado: string;
  certificadoVigente: boolean;
  clavesUso: string;
  fechaSelloTiempo: string;
  integridadFirma: boolean;
  razonFirma: string;
  localizacion: string;
  cedula: string;
  nombre: string;
  apellido: string;
  institucion: string;
  cargo: string;
  entidadCertificadora: string;
  serial: string;
  selladoTiempo: boolean;
  certificadoDigitalValido: boolean;
}
