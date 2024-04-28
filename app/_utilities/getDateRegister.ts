const meses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
]

export default function getDateRegister(): string {
    const day = new Date().getDate().toLocaleString();
    const month = new Date().getMonth();
    const year = new Date().getFullYear().toLocaleString();

    return `${day} de ${meses[month]} de ${year}`
}