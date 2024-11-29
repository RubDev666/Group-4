import type { Metadata, ResolvingMetadata } from 'next';

import User from '@/src/pageComponents/User';
import firebase from '@/src/firebase/firebase';

import type { Params, DynamicParams } from '@/src/types/components-props';

export async function generateMetadata(
    { params, searchParams }: DynamicParams,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const user = await firebase.getData('users', id);

    if(!user) return {title: 'User Not Found'}

    return {title: 'u/' + user.displayName,}
}

export default async function Page({ params }: Params) {
    const { id } = await params;

    return <User userName={id} />
}
 