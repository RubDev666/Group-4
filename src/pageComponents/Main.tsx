'use client';

import { useContext } from 'react';

import { Post } from '../components/posts';

import { AllPostsType } from '@/src/types';

import { GlobalContext } from '@/src/app/providers';

export default function Main() {
    const { allPosts } = useContext(GlobalContext);

    if (!allPosts || allPosts.length === 0) {
        return (
            <div className="main-container w-full">
                <p>{!allPosts ? 'Error al cargar datos...' : 'Se el primero en publicar...'}</p>
            </div>
        );
    }

    return (
        <div className="main-container w-full">
            {allPosts.map((dato: AllPostsType) => (
                <Post
                    key={dato.posts.id}
                    postData={dato.posts}
                    creador={dato.usuario}
                />
            ))}
        </div>
    );
}