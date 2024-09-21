const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

const colors = [
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

export function getDateRegister(): string {
    const day = new Date().getDate().toLocaleString();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    return `${MONTHS[month]} ${day}, ${year}`;
}

export function getRandomColor(): string {
    return colors[Math.floor(Math.random() * colors.length)];
}

export const CONECTION_ERROR_MESSAGE = 'Connection failed, try again later*';
export const USERNAME_EXIST_ERROR_MESSAGE = 'User name already exists*';