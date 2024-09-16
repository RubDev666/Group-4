'use client';

import { useEffect, useState, useContext } from "react";

import { NotFound, Spinner, AvatarImg } from "@/src/components/ui";
import { Post } from "../components/posts";

import { DocumentData } from "firebase/firestore";

import { GlobalContext } from "@/src/app/providers";
import type { AllPostsType, AllUsersFetch } from "@/src/types";
import type { UserProps } from "../types/components-props";
 
import firebase from "@/src/firebase/firebase";

export default function User({ userName }: UserProps) {
    const [loadingPageUser, setLoadingPageUser] = useState(true);
    const [user, setUser] = useState<DocumentData | null>(null);
    const [posts, setPosts] = useState<AllPostsType[] | []>([]);

    const {allPosts, loading } = useContext(GlobalContext);

    useEffect(() => {
        const getDataUser = async () => {
            const getUser = await firebase.getData('usuarios', userName);

            if(!getUser) return setLoadingPageUser(false);

            const loadingPost: AllPostsType[] = allPosts.filter(post => post.usuario.displayName === userName);
    
            setUser(getUser);
            setPosts(loadingPost);
            setLoadingPageUser(false);
        }

        if(!loading && allPosts.length > 0) getDataUser();
        if(!loading && allPosts.length === 0) setLoadingPageUser(false);
    }, [allPosts, userName, loading])

    if ((loadingPageUser && !user)) return null;

    return (
        <>
            {(user) ? (
                <div className="user-main-container w-full">
                    <div className="img-name-container flex justify-start align-center">
                        <AvatarImg 
                            size={100}
                            fontSize={70}
                            user={user}
                        />

                        <h4>{'u/' + user.displayName}</h4>
                    </div>

                    <p>{'Miembro desde el: ' + user.dateRegister}</p>

                    <hr />

                    {posts.length > 0 ? (
                        <h5>{'Publicaciones de u/' + user.displayName}</h5>

                    ) : (
                        <h5>{'u/' + user.displayName + ' aun no ha publicado nada'}</h5>
                    )}

                    {posts.map((post: AllPostsType) => (
                        <Post key={post.posts.id} postData={post.posts} creador={post.usuario} />
                    ))}
                </div>
            ) : (
                <NotFound message="Usuario no encontrado" />
            )}
        </>
    )
}