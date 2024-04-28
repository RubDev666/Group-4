const colores = [
    '#b41b1b',
    '#0a5a0e',
    '#108888',
    '#aa164f',
    '#e40c4d',
    '#7c189b',
    '#3b30d6',
    '#0d9b7c',
    '#8a7500',
    '#0b29d3',
    '#cabe16',
    '#ce1a6e'
]

export default function getRandomColor(): string {
    return colores[Math.floor(Math.random() * colores.length)];
}
