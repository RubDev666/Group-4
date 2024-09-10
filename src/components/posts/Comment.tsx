'use client';

import { ChangeEvent, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { FavoriteBorder, ChatBubbleOutline, Favorite } from '@mui/icons-material';
import { DocumentData } from "firebase/firestore";

import { AvatarImg } from "../ui";

import { GlobalContext } from "@/src/app/providers";

import formatearFecha from "@/src/utilities/formatearFecha";

import useAutenticacion from "@/src/hooks/useAuthUser";
import firebase from "@/src/firebase/firebase";

import CommentOptions from "./CommentOptions";

type CommentProps = {
    comentario: DocumentData;
    setComentarioId: Dispatch<SetStateAction<string>>;
    currentPost: DocumentData;
    indexComment: number;
}

export default function Comment({ comentario, setComentarioId, currentPost, indexComment }: CommentProps) {
    const [edit, setEdit] = useState(false);
    const [comentarioEdit, setComentarioEdit] = useState<string>(comentario.comment);
    const { allUsers, setFormModal } = useContext(GlobalContext);

    const [usuarioPost, setUsuarioPost] = useState<DocumentData | null>(null);

    const usuario = useAutenticacion();
    const router = useRouter();

    useEffect(() => {
        const getUserPost = () => {
            if (allUsers) {
                let us: DocumentData | null = null;

                for (const user of allUsers) {
                    if (user.uid === comentario.idUser) {
                        us = user;

                        break;
                    }
                }

                setUsuarioPost(us);
            }
        }

        getUserPost();
    }, [allUsers, comentario])
 
    const likeToggle = async () => {
        if (!usuario) {
            setFormModal(true);

            return;
        }

        //guardar los datos actuales en caso de error...
        const currentData = comentario.likes;

        let newLikes: string[] | [] = [];

        if (comentario.likes.includes(usuario.uid)) {
            newLikes = comentario.likes.filter((uid: string) => uid !== usuario.uid);
        } else {
            newLikes = [usuario.uid, ...comentario.likes];
        }

        try {
            currentPost.comments[indexComment].likes = newLikes;

            if (usuario.uid !== currentPost.idUser) await firebase.handleRecentActivity(usuario.uid, currentPost.idUser);

            await firebase.updatePost({
                idPost: currentPost.id,
                key: 'comments',
                newData: currentPost.comments
            });

            router.refresh();
        } catch (error) {
            //console.log(error);

            currentPost.comments[indexComment].likes = currentData;

            router.refresh();
        }
    }

    const saveEditComment = async () => {
        if(comentarioEdit === comentario.comment) {
            setEdit(false);

            return;
        }

        if(!usuario) return;
        if(comentarioEdit === '') return;

        const currentComment = comentario.comment;

        try {
            currentPost.comments[indexComment].comment = comentarioEdit;

            if (usuario.uid !== currentPost.idUser) await firebase.handleRecentActivity(usuario.uid, currentPost.idUser);

            await firebase.updatePost({
                idPost: currentPost.id,
                key: 'comments',
                newData: currentPost.comments
            });

            comentario.comment = comentarioEdit;

            setEdit(false);
        } catch (error) {
            comentario.comment = currentComment;
        }
    }

    const deleteComm = async () => {
        const currentComment = currentPost.comments;

        try {
            currentPost.comments = currentPost.comments.filter((com: DocumentData) => com.id !== comentario.id);

            await firebase.updatePost({
                idPost: currentPost.id,
                key: 'comments',
                newData: currentPost.comments
            });

            router.refresh();
        } catch (error) {
            console.log('no se borro')

            currentPost.comments = currentComment;

            router.refresh();
        }
    }

    const replyBtn = () => {
        if(!usuario) {
            setFormModal(true);

            return;
        }

        setComentarioId(comentario.id)
    }

    return (
        <div className="comentario-container relative w-full">
            {usuarioPost && (
                <>
                    <div className="header-comentario relative flex justify-between">
                        <div className='flex info-creator'>
                            <Link href={`/u/${usuarioPost.displayName}`} className="user text-color flex align-center">
                                <AvatarImg
                                    size={30}
                                    fontSize={16}
                                    user={usuarioPost}
                                />

                                <span className='user-name'>{`u/${usuarioPost.displayName}`} </span>
                            </Link>

                            <p className='time text-opacity relative'>{formatearFecha(comentario.date)}</p>
                        </div>

                        {usuario && comentario.idUser === usuario.uid && (
                            <CommentOptions deleteF={deleteComm} setEdit={setEdit} />
                        )}
                    </div>

                    <div className={`comentario ${comentario.respuestas.length === 0 && 'unique'}`}>
                        {!edit && <p>{comentario.comment}</p>}

                        {edit && (
                            <textarea
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComentarioEdit(e.target.value)}
                                name='edit-comentario'
                                id='edit-comentario'
                                className="w-full scroll-bar-style"
                                defaultValue={comentario.comment}
                            />
                        )}

                        <div className="actions-container w-full flex align-center justify-start">
                            {!edit && (
                                <>
                                    <div className="relative like all-center pointer bg-hover" onClick={likeToggle}>
                                        {(usuario && comentario.likes.includes(usuario.uid)) ? (
                                            <Favorite className='icon primary-color' />
                                        ) : (
                                            <FavoriteBorder className='icon' />
                                        )}

                                        <span>{comentario.likes.length.toString()}</span>
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
                </>
            )}
        </div>
    )
}
