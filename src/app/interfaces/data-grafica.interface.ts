export interface DataGrafica {
    codigo: number;
    data: {
        listaAhorroPorDias: AhorroPorDias[];
        listaIngresoPorDias: IngresoPorDias[];
        listaEgresoPorDias: EgresoPorDias[];
        listaEgresoPorCategoria: listaEgresoPorCategoria[];
        listaMetaCumplimiento: MetaCumplientoGrafica[];
        listaRentabilidad: Rentabilidad[]
    }
}

interface AhorroPorDias {
    dia: number;
    total: number;
}

interface IngresoPorDias {
    dia: number;
    total: number;
}

interface EgresoPorDias {
    dia: number;
    total: number;
}

interface listaEgresoPorCategoria {
    nombreCategoria: string;
    total: number;
}

interface MetaCumplientoGrafica {
    nombreMeta: string;
    montoActual: number;
    montoObjetivo: number;
}

interface Rentabilidad {
    dia: number;
    diferencia: number;
}