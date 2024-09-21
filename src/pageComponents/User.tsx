'use client';

import { useEffect, useState, useContext } from "react";

import { NotFound, AvatarImg } from "@/src/components/ui";
import { Post } from "../components/posts";

import { GlobalContext } from "@/src/app/providers";

import type { DocumentData } from "firebase/firestore";
import type { AllPostsType } from "@/src/types";
import type { UserProps } from "../types/components-props";
 
import firebase from "@/src/firebase/firebase";

export default function User({ userName }: UserProps) {
    const [loadingPageUser, setLoadingPageUser] = useState(true);
    const [user, setUser] = useState<DocumentData | null>(null);
    const [posts, setPosts] = useState<AllPostsType[] | []>([]);

    const {allPosts, loadingData } = useContext(GlobalContext);

    useEffect(() => {
        const getDataUser = async () => {
            const getUser = await firebase.getData('users', userName);

            if(!getUser) return setLoadingPageUser(false);

            const loadingPost: AllPostsType[] = allPosts.filter(post => post.user.displayName === userName);
    
            setUser(getUser);
            setPosts(loadingPost);
            setLoadingPageUser(false);
        }

        if(!loadingData && allPosts.length > 0) getDataUser();
        if(!loadingData && allPosts.length === 0) setLoadingPageUser(false);
    }, [allPosts, userName, loadingData])

    if (loadingPageUser && !user) return null;

    if(!loadingPageUser && !user) return <NotFound message="User not found" />;

    if(!loadingPageUser && user) return (
        <div className="user-main-container w-full">
            <div className="img-name-container flex justify-start align-center">
                <AvatarImg
                    size={100}
                    fontSize={70}
                    user={user}
                />

                <h4>{'u/' + user.displayName}</h4>
            </div>

            <p>{'Member since: ' + user.dateRegister}</p>

            <hr />

            {posts.length > 0 ? (
                <h5>{'Posts by u/' + user.displayName}</h5>

            ) : (
                <h5>{'u/' + user.displayName + " hasn't published anything yet"}</h5>
            )}

            {posts.map((post: AllPostsType) => (
                <Post key={post.posts.id} postData={post.posts} creator={post.user} />
            ))}
        </div>
    )
}