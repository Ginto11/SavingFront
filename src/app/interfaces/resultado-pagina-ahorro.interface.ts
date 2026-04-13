export interface ResultadoPaginaAhorros {
    totalPaginas: number;
    totalRegistros: number;
    paginaActual: number;
    tamanoPagina: number;
    registroInicial: number;
    registroFinal: number;
    data: AhorroDto[]
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