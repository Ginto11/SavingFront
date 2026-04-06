export interface DataGrafica {
    codigo: number;
    data: {
        listaAhorroPorDias: AhorroPorDias[];
        listaIngresoPorDias: IngresoPorDias[];
        listaEgresoPorDias: EgresoPorDias[];
        listaEgresoPorCategoria: listaEgresoPorCategoria[]
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