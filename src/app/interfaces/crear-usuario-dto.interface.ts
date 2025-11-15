export interface CrearUsuarioDto {
    primerNombre: string | null;
    primerApellido: string |null;
    cedula: number | null;
    nombreUsuario: string | null;
    correo: string | null;
    fechaNacimiento: string | null;
    contrasena: string | null;
    aceptaTerminos: boolean | null;
}