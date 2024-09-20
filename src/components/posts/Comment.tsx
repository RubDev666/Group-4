'use client';

import { ChangeEvent, useContext, useState } from "react";
import Link from "next/link";

import { FavoriteBorder, ChatBubbleOutline, Favorite } from '@mui/icons-material';

import { GlobalContext } from "@/src/app/providers";

import formatearFecha from "@/src/utilities/formatearFecha";

import firebase from "@/src/firebase/firebase";

import { AvatarImg } from "../ui";
import CommentOptions from "./CommentOptions";

import type { CommentProps } from "@/src/types/components-props";
import type { DocumentData } from "firebase/firestore";

export default function Comment({comentarioDoc, setComentarioId, currentPost, indexComment, userPost}: CommentProps) {
    const [edit, setEdit] = useState(false);
    const [comentarioEdit, setComentarioEdit] = useState<string>(comentarioDoc.comment);

    const { setFormModal, user, allPosts, setAllPosts } = useContext(GlobalContext);

    const likeToggle = async () => {
        if (!user) return setFormModal(true);

        const {updatePosts, currentPosts, newPost} = handleCurrentData('like');

        try {
            setAllPosts(updatePosts);

            if (user.uid !== currentPost.idUser) await firebase.handleRecentActivity(user.uid, currentPost.idUser);

            await firebase.updatePost({
                idPost: currentPost.id,
                key: 'comments',
                newData: newPost.comments
            });
        } catch (error) {
            console.log(error);

            setAllPosts(currentPosts);
        }
    }

    const saveEditComment = async () => {
        if(comentarioEdit === comentarioDoc.comment) return setEdit(false);
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
        const {updatePosts, currentPosts, newPost} = handleCurrentData('deleteComment');

        try {
            await firebase.updatePost({
                idPost: currentPost.id,
                key: 'comments',
                newData: newPost.comments
            });

            setAllPosts(updatePosts);
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
                    let currentLikes: string[] = JSON.parse(JSON.stringify(comentarioDoc.likes));

                    newPost.comments[indexComment].likes = currentLikes.includes(user.uid) ? currentLikes.filter(uid => uid !== user.uid) : [user.uid, ...currentLikes];
                }

                break;
            }
            case 'editComment': {
                newPost.comments[indexComment].comment = comentarioEdit;

                break;
            }
            case 'deleteComment': {
                let currentComments = JSON.parse(JSON.stringify(currentPost.comments));

                newPost.comments = currentComments.filter((com: DocumentData) => com.id !== comentarioDoc.id);   

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

    const replyBtn = () => {
        if(!user) return setFormModal(true);

        setComentarioId(comentarioDoc.id)
    }

    return (
        <div className="comentario-container relative w-full">
            <div className="header-comentario relative flex justify-between">
                <div className='flex info-creator'>
                    <Link href={`/u/${userPost.displayName}`} className="user text-color flex align-center">
                        <AvatarImg
                            size={30}
                            fontSize={16}
                            user={userPost}
                        />

                        <span className='user-name'>{`u/${userPost.displayName}`} </span>
                    </Link>

                    <p className='time text-opacity relative'>{formatearFecha(comentarioDoc.date)}</p>
                </div>

                {(user && comentarioDoc.idUser === user.uid) && (
                    <CommentOptions deleteF={deleteComm} setEdit={setEdit} />
                )}
            </div>

            <div className={`comentario ${comentarioDoc.respuestas.length === 0 && 'unique'}`}>
                {!edit && <p>{comentarioDoc.comment}</p>}

                {edit && (
                    <textarea
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComentarioEdit(e.target.value)}
                        name='edit-comentario'
                        id='edit-comentario'
                        className="w-full scroll-bar-style"
                        defaultValue={comentarioDoc.comment}
                    />
                )}

                <div className="actions-container w-full flex align-center justify-start">
                    {!edit && (
                        <>
                            <div className="relative like all-center pointer bg-hover" onClick={likeToggle}>
                                {(user && comentarioDoc.likes.includes(user.uid)) ? (
                                    <Favorite className='icon primary-color' />
                                ) : (
                                    <FavoriteBorder className='icon' />
                                )}

                                <span>{comentarioDoc.likes.length.toString()}</span>
                            </div>

                            <div className="relative comment all-center pointer bg-hover" onClick={replyBtn}>
                                <ChatBubbleOutline className='icon' />

                                <span>Responder</span>
                            </div>
                        </>
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
    )
}