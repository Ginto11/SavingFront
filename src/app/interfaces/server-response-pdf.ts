export interface ServerResponsePdf {
    codigo: number;
    data: DataPdfMetaAhorro
}

export interface DataPdfMetaAhorro {
    usuario: UsuarioPdf;
    meta: MetaPdf;
    listaIngresos: IngresoPdf[];
    resumen: ResumenPdf;
    detalleAdicional: DetalleAdicionalPdf;
}

interface UsuarioPdf {
    nombreUsuario: string;
    correoUsuario: string;
}

interface MetaPdf {
    nombreMeta: string;
    estadoMeta: string;
    montoObjetivo: number;
    montoActual: number;
    fechaCreacion: Date;
    fechaCumplimiento: Date;
}

interface IngresoPdf {
    id: number;
    fecha: Date;
    descripcion: string;
    tipoAhorro: string;
    monto: number;
}

interface ResumenPdf {
    totalIngresos: number;
    promedio: number;
    cantidadMovimientos: number;
    porcentaje: number;
}

interface DetalleAdicionalPdf {
    mayorIngreso: number;
    menorIngreso: number;
    fechaUltimoMovimiento: Date;
}