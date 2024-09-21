'use client';

import { useContext } from 'react';

import { Post } from '../components/posts';

import type { AllPostsType } from '@/src/types';

import { GlobalContext } from '@/src/app/providers';

export default function Main() {
    const { allPosts } = useContext(GlobalContext);

    if (allPosts.length === 0) {
        return (
            <div className="main-container w-full">
                <p>Be the first to publish...</p>
            </div>
        );
    }

    return (
        <div className="main-container w-full">
            {allPosts.map((data: AllPostsType) => (
                <Post
                    key={data.posts.id}
                    postData={data.posts}
                    creator={data.user}
                />
            ))}
        </div>
    );
}