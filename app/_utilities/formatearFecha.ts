import {formatDistanceToNow} from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";

export default function formatearFecha(date: number): string {
    const cadena = formatDistanceToNow( new Date(date), {locale: es} ) + ' ';

    if(cadena.includes('alrededor')) return 'Hace ' + cadena.slice(12, -1);

    return 'Hace ' + cadena;
}
