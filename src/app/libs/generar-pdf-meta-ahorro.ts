import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.addVirtualFileSystem(pdfFonts);

import { ImagenesBase64 } from '../assets/imagenes-base64';
import { DataPdfMetaAhorro } from '../interfaces/server-response-pdf';

const generarPdfMetaAhorro = (dataPdf: DataPdfMetaAhorro) => {

    const header = {
        text: 'DOCUMENTO SAVING FRONT.', 
        margin: [40, 20, 0, 0], 
        alignment: 'left',
        opacity: 0.5,
        italics: true,
        color: '#017C8E'
    };

    const footer = {
        margin: [0, 20, 0, 30],
        fontSize: 8,
        color: 'gray',
        alignment: 'center',
        text: 'Este documento es informativo y no constituye un extracto bancario oficial.'
    }

    const tabla = [
        [
            { text: 'N°', style: 'tablaHeader' },
            { text: 'Fecha', style: 'tablaHeader' },
            { text: 'Descripción', style: 'tablaHeader' },
            { text: 'Tipo Ahorro', style: 'tablaHeader' },
            { text: 'Importe', style: 'tablaHeader' }
        ],
        ...dataPdf.listaIngresos.map(ahorro => [
            ahorro.id,
            new Date(ahorro.fecha).toLocaleString(),
            ahorro.descripcion,
            ahorro.tipoAhorro,
            `$ ${ahorro.monto.toLocaleString()}`
        ])
    ];

    const content: any[] = [];

    content.push({
        columns: [
            {
                stack: [
                    { text: `Fecha: ${new Date().toLocaleDateString()}`, style: 'fecha' },
                    { text: `Extracto de ingresos de meta de ahorro (${dataPdf.meta.nombreMeta})`, style: 'titulo' }
                ]
            },
            {
                image: `${ImagenesBase64.logo}`, width: 40, margin: [0, 20, 0, 0]
            }
        ]
    });

    content.push({
        text: `Nombre: ${dataPdf.usuario.nombreUsuario}`, margin: [0, 0, 0, 3]
    });

    content.push({
        text: `Correo: ${dataPdf.usuario.correoUsuario}`, margin: [0, 0, 0, 3], lineHeight: 2
    });


    content.push({
        text: 'Datos de la meta', style: 'subtitulo'
    })

    content.push({
        columns: [
            {
                stack: [
                    { text: 'Nombre meta', style: 'subtituloCruadrilla' },
                    { text: `${dataPdf.meta.nombreMeta}`, margin: [0, 0, 0, 3] },
                    { text: 'Monto Objetivo', style: 'subtituloCruadrilla' },
                    { text: `$ ${dataPdf.meta.montoObjetivo.toLocaleString()}`, margin: [0, 0, 0, 3] },
                    { text: 'Fecha Creacion', style: 'subtituloCruadrilla' },
                    { text: `${new Date(dataPdf.meta.fechaCreacion).toLocaleString()}`, margin: [0, 0, 0, 3] }
                ]
            },
            {
                stack: [
                    { text: 'Estado', style: 'subtituloCruadrilla' },
                    { text: `${dataPdf.meta.estadoMeta}`, margin: [0, 0, 0, 3] },
                    { text: 'Monto Actual', style: 'subtituloCruadrilla' },
                    { text: `$ ${dataPdf.meta.montoActual.toLocaleString()}`, margin: [0, 0, 0, 3] },
                    { text: 'Fecha Finalizacion', style: 'subtituloCruadrilla' },
                    { text: `${(dataPdf.meta.fechaCumplimiento)? new Date(dataPdf.meta.fechaCumplimiento).toLocaleString() : 'Sin finalizar' }`, margin: [0, 0, 0, 3] }
                ]
            }
        ]
    });

    content.push({
        table: {
            widths: ['auto', '*', '*', 'auto', 'auto'],
            body: tabla
        },
        margin: [0, 20, 0, 0],
        layout: {
            dontBreakRows: true,
            paddingTop: () => 5,
            paddingBottom: () => 5
        }
    });

    content.push({
        margin: [0, 10, 0, 0],
        width: '100%',
        stack: [
            { text: 'Progreso de la meta', margin: [0, 0, 0, 5] },
            {
                canvas: [
                    {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: 515,
                    h: 10,
                    color: '#e0e0e0'
                    },
                    {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    w: `${(dataPdf.resumen.porcentaje * 515) / 100}`, 
                    h: 10,
                    color: '#4caf50'
                    }
                ]
            },
            { text: `${dataPdf.resumen.porcentaje}% completado`, margin: [0, 3, 0, 20] }
        ]
    })

    content.push({
        columns: [
            {
            width: '50%',
            stack: [
                { text: 'Resumen', style: 'subtitulo' },
                `Total ingresos: $ ${dataPdf.resumen.totalIngresos.toLocaleString()}`,
                `Promedio: $ ${dataPdf.resumen.promedio.toLocaleString()}`,
                `Cantidad movimientos: ${dataPdf.resumen.cantidadMovimientos.toLocaleString()}`
            ]
            },
            {
            width: '50%',
            stack: [
                { text: 'Detalle adicional', style: 'subtitulo' },
                `Mayor ingreso: $ ${dataPdf.detalleAdicional.mayorIngreso.toLocaleString()}`,
                `Menor ingreso: $ ${dataPdf.detalleAdicional.menorIngreso.toLocaleString()}`,
                `Último movimiento: ${new Date(dataPdf.detalleAdicional.fechaUltimoMovimiento).toLocaleString()}`
            ]
            }
        ]
    });

    content.push({
        margin: [0, 40, 0, 0],
        alignment: 'center',
        stack: [
            '___________________________',
            'Saving Front',
            'Documento generado automáticamente'
        ]
    });

    const styles = {
        titulo: {
            fontSize: 14,
            bold: true,
            lineHeight: 2,
            color: '#128C7E'
        },
        fecha: {
            fontSize: 14, 
            bold: true,
            margin: [0, 20, 0, 0],
            lineHeight: 2, 
            color: '#1e2939'
        },
        subtitulo: {
            fontSize: 14, 
            bold: true, 
            margin: [0, 0, 0, 5], 
            lineHeight: 1.2, 
            italics: true,
            decoration: 'underline', 
            color: '#0370B7'
        },
        subtituloCruadrilla: {
            bold: true,
            color: '#1B3358'
        },
        tablaHeader: {
            fillColor: '#128C7E'
        }
    };

    const pdfDefinicion: any = {
        header,
        content,
        styles,
        footer
    }

    pdfMake.createPdf(pdfDefinicion).open();

}

export default generarPdfMetaAhorro;