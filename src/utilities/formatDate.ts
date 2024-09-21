import {formatDistanceToNow} from "date-fns/formatDistanceToNow";
import { enUS } from "date-fns/locale"; //language

export default function formatDate(date: number): string {
    const getString = formatDistanceToNow( new Date(date), {locale: enUS} );

    if(getString.includes('about')) {
        const cleanedString = getString.replace('about', '').trim() + ' ago';

        return cleanedString;
    } else if(getString.includes('less')){
        return getString
    } else {
        return getString + ' ago'
    }
}
