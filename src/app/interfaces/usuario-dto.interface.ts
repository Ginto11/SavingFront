export interface UsuarioDto {
  id: number;
  primerNombre: string;
  primerApellido: string;
  cedula: number;
  correo: string;
  fechaNacimiento: Date | null;
  manejaGastos: boolean;
  fotoPerfil: string;
  nuevaFoto: File | null;
}
