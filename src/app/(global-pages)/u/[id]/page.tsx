import type { Metadata, ResolvingMetadata } from 'next';

import User from '@/src/pageComponents/User';
import firebase from '@/src/firebase/firebase';

import type { Params, DynamicParams } from '@/src/types/components-props';

export async function generateMetadata(
    { params, searchParams }: DynamicParams,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const user = await firebase.getData('usuarios', params.id);

    if(!user) return {title: 'User Not Found'}

    return {title: 'u/' + user.displayName,}
}

export default async function Page({ params }: Params) {
    return <User userName={params.id} />
}
 