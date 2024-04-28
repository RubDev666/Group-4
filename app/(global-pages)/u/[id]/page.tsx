import type { Metadata, ResolvingMetadata } from 'next';

import User from '../../_pages-components/User';

import firebase from '@/app/_firebase/firebase';

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const user = await firebase.getData('usuarios', params.id);

    if(!user) return {title: 'User Not Found'}

    return {title: 'u/' + user.displayName,}
}

export default async function Page({ params }: { params: { id: string } }) {
    return <User userName={params.id} />
}
 