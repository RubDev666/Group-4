import type { Metadata, ResolvingMetadata } from 'next';

import Post from "@/src/pageComponents/Post";
import firebase from '@/src/firebase/firebase';

import type { Params, DynamicParams } from '@/src/types/components-props';

export async function generateMetadata(
    { params, searchParams }: DynamicParams,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const post = await firebase.getData('posts', params.id);

    if(!post) return {title: 'Post Not Found'}

    return {
        title: 'p/' + post.title,
    }
}

export default function Page({ params }: Params) {
    return <Post idPost={params.id} />
}
