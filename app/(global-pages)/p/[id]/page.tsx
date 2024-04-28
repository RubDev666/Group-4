import type { Metadata, ResolvingMetadata } from 'next';

import Post from "../../_pages-components/Post";
import firebase from '@/app/_firebase/firebase';

type Props = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const post = await firebase.getData('posts', params.id);

    if(!post) return {title: 'Post Not Found'}

    return {
        title: 'p/' + post.title,
    }
}

export default function Page({ params }: { params: { id: string } }) {
    return <Post idPost={params.id} />
}
