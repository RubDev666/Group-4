'use client';

import { ChangeEvent, useContext, useEffect, useState } from "react";
import Link from "next/link";

import { Favorite, FavoriteBorder } from '@mui/icons-material';

import { DocumentData } from "firebase/firestore";

import { GlobalContext } from "@/src/app/providers";

import { AvatarImg } from "../ui";

import formatearFecha from "@/src/utilities/formatearFecha";
import firebase from "@/src/firebase/firebase";
import CommentOptions from "./CommentOptions";

import type { ReplyProps } from "@/src/types/components-props";

export default function Reply({ respuesta, currentPost, indexComment, indexReply }: ReplyProps) {
    const [edit, setEdit] = useState(false);
    const [comentarioEdit, setComentarioEdit] = useState<string>(respuesta.comment);
    const { allUsers, setFormModal, user, allPosts, setAllPosts } = useContext(GlobalContext);
    const [usuarioReply, setUsuarioReply] = useState<DocumentData | undefined>(undefined);

    useEffect(() => {
        if (allUsers) {
            const getUser = allUsers.get(respuesta.idUser);

            setUsuarioReply(getUser);
        }
    }, [allUsers, respuesta])

    const likeToggle = async () => {
        if (!user) return setFormModal(true);

        const {updatePosts, newPost, currentPosts} = handleCurrentData('like');

        try {
            setAllPosts(updatePosts);

            if (user.uid !== currentPost.idUser) await firebase.handleRecentActivity(user.uid, currentPost.idUser);

            await firebase.updatePost({
                idPost: currentPost.id,
                key: 'comments',
                newData: newPost.comments 
            })
        } catch (error) {
            console.log(error);

            setAllPosts(currentPosts);
        }
    }

    const saveEditComment = async () => {
        if (comentarioEdit === respuesta.comment) return setEdit(false);

        if(!user || comentarioEdit === '') return;

        const {updatePosts, currentPosts, newPost} = handleCurrentData('editComment');

        try {
            setAllPosts(updatePosts);

            if (user.uid !== currentPost.idUser) await firebase.handleRecentActivity(user.uid, currentPost.idUser);

            await firebase.updatePost({
                idPost: currentPost.id,
                key: 'comments',
                newData: newPost.comments
            });

            setEdit(false);
        } catch (error) {
            console.log(error);

            setAllPosts(currentPosts);
        }
    }

    const deleteComm = async () => {
        const {updatePosts, newPost, currentPosts} = handleCurrentData('deleteComment');

        try {
            await firebase.updatePost({
                idPost: currentPost.id,
                key: 'comments',
                newData: newPost.comments
            });

            setAllPosts(updatePosts);

            setEdit(false);
        } catch (error) {
            console.log(error);

            setAllPosts(currentPosts);
        }
    }

    const handleCurrentData = (type: 'like' | 'deleteComment' | 'editComment') => {
        const currentPosts = [...allPosts];

        let newPost = JSON.parse(JSON.stringify(currentPost));

        switch (type) {
            case 'like': {
                if(user) {
                    let currentLikes: string[] = JSON.parse(JSON.stringify(respuesta.likes));

                    newPost.comments[indexComment].respuestas[indexReply].likes = currentLikes.includes(user.uid) ? currentLikes.filter(uid => uid !== user.uid) : [user.uid, ...currentLikes];
                }

                break;
            }
            case 'editComment': {
                newPost.comments[indexComment].respuestas[indexReply].comment = comentarioEdit;

                break;
            }
            case 'deleteComment': {
                let currentComments = JSON.parse(JSON.stringify(currentPost.comments));

                newPost.comments[indexComment].respuestas = currentComments[indexComment].respuestas.filter((com: DocumentData) => com.id !== respuesta.id);   

                break;
            }

            default: break;
        }

        const updatePosts = allPosts.map(data => data.posts.id === currentPost.id ? { ...data, posts: newPost } : data);

        return {
            currentPosts,
            updatePosts,
            newPost
        }
    }

    if (usuarioReply) return (
        <div className="respuesta-main-container relative flex">
            <div className="linea"></div>

            <div className="respuesta-container w-full">
                <div className="header-comentario relative flex justify-between w-full">
                    <div className='flex info-creator'>
                        <Link href={`/u/${usuarioReply.displayName}`} className="user text-color flex align-center">
                            <AvatarImg
                                size={30}
                                fontSize={16}
                                user={usuarioReply}
                            />

                            <span className='user-name'>{`u/${usuarioReply.displayName}`} </span>
                        </Link>

                        <p className='time text-opacity relative'>{formatearFecha(respuesta.date)}</p>
                    </div>

                    {(user && user.uid === respuesta.idUser) && (
                        <CommentOptions deleteF={deleteComm} setEdit={setEdit} />
                    )}
                </div>

                <div className="respuesta">
                    {!edit && <p>{respuesta.comment}</p>}

                    {edit && (
                        <textarea
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComentarioEdit(e.target.value)}
                            name='edit-respuesta'
                            id='edit-respuesta'
                            className="w-full scroll-bar-style"
                            defaultValue={respuesta.comment}
                        />
                    )}

                    <div className="actions-container w-full flex align-center justify-start">
                        {!edit && (
                            <div className="relative like all-center pointer bg-hover" onClick={likeToggle}>
                                {(user && respuesta.likes.includes(user.uid)) ? (
                                    <Favorite className='icon primary-color' />
                                ) : (
                                    <FavoriteBorder className='icon' />
                                )}

                                <span>{respuesta.likes.length.toString()}</span>
                            </div>
                        )}

                        {edit && (
                            <>
                                <button className="cancel-btn pointer bg-hover-2" onClick={() => setEdit(false)}>Cancelar</button>

                                <button className="comentar-btn pointer" onClick={saveEditComment}>Editar</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}
