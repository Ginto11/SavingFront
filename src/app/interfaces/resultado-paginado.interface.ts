export interface ResultadoPaginado<T> {
    totalPaginas: number;
    totalRegistros: number;
    paginaActual: number;
    tamanoPagina: number;
    registroInicial: number;
    registroFinal: number;
    data: T[]
}

export interface AhorroDto {
    id: number;
    monto: number;
    fecha: Date;
    descripcion: number;
    metaAhorroNombre: string;
    tipoAhorro: string;
    estadoMeta: string;
}