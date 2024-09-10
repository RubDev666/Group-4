function formatearFecha(fecha: Date): string {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();

    return `${dia} de ${mes} de ${año}`;
}

const fecha2 = new Date(2024, 8, 7); // Recuerda que los meses en JavaScript son 0-indexados (0 = Enero, 1 = Febrero, etc.)
console.log(formatearFecha(fecha2)); // Resultado: 7 de Septiembre de 2024
