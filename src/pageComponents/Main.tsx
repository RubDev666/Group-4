'use client';

import { useContext } from 'react';

import { Spinner } from '../components/ui';
import { Post } from '../components/posts';

import { AllPostsType } from '@/src/types';

import { GlobalContext } from '@/src/app/providers';

export default function Main() {
    const { allPosts, loading } = useContext(GlobalContext);

    if (!allPosts) return (
        <div className="main-container w-full">
            <p>error....</p>
        </div>
    )

    if (loading) return (
        <div className="main-container w-full">
            <Spinner />
        </div>
    )

    return (
        <div className="main-container w-full">
            {(allPosts.length > 0) ? (
                <>
                    {allPosts.map((dato: AllPostsType) => (
                        <Post
                            key={dato.posts.id}
                            postData={dato.posts}
                            creador={dato.usuario}
                        />
                    ))}
                </>
            ) : (
                <p>se el primero en publicar...</p>
            )}
        </div>
    );
}