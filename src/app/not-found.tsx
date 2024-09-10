import Link from 'next/link';
import { NotFound as NotFoundComponent} from '../components/ui';

export default function NotFound() {
    return (
        <NotFoundComponent message='Pagina no encontrada, regresa al inicio idiota...' />
    )
}