'use client';

import { useEffect, useState, useContext } from "react";

import { NotFound, Spinner, AvatarImg } from "@/src/components/ui";
import { Post } from "../components/posts";

import { DocumentData } from "firebase/firestore";

import { GlobalContext } from "@/src/app/providers";
import { AllPostsType } from "@/src/types";
 
import firebase from "@/src/firebase/firebase";

export default function User({ userName }: { userName: string }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<DocumentData | null>(null);
    const [posts, setPosts] = useState<AllPostsType[] | []>([]);

    const {allPosts, allUsers} = useContext(GlobalContext);

    useEffect(() => {
        const getDataUser = async () => {
            const verfiedDB = await firebase.getData('usuarios', userName);
    
            if(!verfiedDB) {
                setLoading(false);
                return; 
            }
    
            let loadingUser: DocumentData | null = null;
    
            allUsers.forEach((userDB: DocumentData) => {
                if(userDB.displayName === userName) {
                    loadingUser = userDB;
                }
            })
    
            if(!loadingUser) {
                setLoading(false);
    
                return;
            }
    
            let loadingPost: AllPostsType[] | [] = [];
    
            allPosts.forEach((post: AllPostsType) => {
                if(post.usuario.displayName === userName) {
                    loadingPost = [...loadingPost, post]
                }
            });
    
            setUser(loadingUser);
            setPosts(loadingPost);
            setLoading(false);
        }

        if(allUsers.length > 0) getDataUser();

        setTimeout(() => {
            setLoading(false);
        }, 3000)
    }, [allUsers, allPosts, userName])


    if (loading && !user) return <Spinner />

    return (
        <>
            {(user && !loading) ? (
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