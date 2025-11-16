export interface CrearNuevoAhorroDto {
    usuarioId: number,
    monto: number | null,
    descripcion: string | null,
    metaAhorroId: any | null
}