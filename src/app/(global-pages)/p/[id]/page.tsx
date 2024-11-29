import type { Metadata, ResolvingMetadata } from 'next';

import Post from "@/src/pageComponents/Post";
import firebase from '@/src/firebase/firebase';

import type { Params, DynamicParams } from '@/src/types/components-props';

export async function generateMetadata(
    { params, searchParams }: DynamicParams,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params;
    const post = await firebase.getData('posts', id);

    if(!post) return {title: 'Post Not Found'}

    return {
        title: 'p/' + post.title,
    }
}

export default async function Page({ params }: Params) {
    const { id } = await params;

    return <Post idPost={id} />
}
