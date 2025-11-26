export interface Meta {
  id: number;
  usuarioId: number;
  usuario: any | null;
  nombre: string;
  montoObjetivo: number;
  montoActual: number;
  fechaCreacion: string; // o Date si prefieres
  ahorros: any | null;
  estado: string;
}