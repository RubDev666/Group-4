'use client';

import { useContext } from 'react';

import { Post, Spinner } from '@/app/_components/ui';

import { AllPostsType } from '@/app/_types';

import { GlobalContext } from '../providers';

export default function Index() {
    const {allPosts} = useContext(GlobalContext);

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
                <Spinner />
            )}
        </div>
    );
}