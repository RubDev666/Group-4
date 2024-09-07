'use client';

import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Favorite, FavoriteBorder } from '@mui/icons-material';

import { DocumentData } from "firebase/firestore";

import { GlobalContext } from "@/app/(global-pages)/providers";

import AvatarImg from "./AvatarImg";

import formatearFecha from "@/app/_utilities/formatearFecha";
import useAutenticacion from "@/app/_hooks/useAuthUser";
import firebase from "@/app/_firebase/firebase";
import CommentOptions from "./CommentOptions";

type ReplyPops = {
    respuesta: DocumentData;
    currentPost: DocumentData;
    indexComment: number;
}

export default function Reply({ respuesta, currentPost, indexComment }: ReplyPops) {
    const [edit, setEdit] = useState(false);
    const [comentarioEdit, setComentarioEdit] = useState<string>(respuesta.comment);
    const { allUsers, setFormModal } = useContext(GlobalContext);
    const [usuarioReply, setUsuarioReply] = useState<DocumentData | null>(null);

    const usuario = useAutenticacion();
    const router = useRouter();

    useEffect(() => {
        const getUserPost = () => {
            if (allUsers) {
                let us: DocumentData | null = null;

                for (const user of allUsers) {
                    if (user.uid === respuesta.idUser) {
                        us = user;

                        break;
                    }
                }

                setUsuarioReply(us);
            }
        }

        getUserPost();
    }, [allUsers, respuesta])

    const likeToggle = async () => {
        if (!usuario) {
            setFormModal(true);

            return;
        }

        //guardar primero los datos actuales en caso que algo salga mal...
        const currentLikes = respuesta.likes;

        let newLikes: string[] | [] = [];

        //agregar o quitar like del usuario
        if (respuesta.likes.includes(usuario.uid)) {
            newLikes = respuesta.likes.filter((uid: string) => uid !== usuario.uid);
        } else {
            newLikes = [usuario.uid, ...respuesta.likes];
        }

        //esto es incorrecto, pero es la unica forma que encontre para poder cambiar los datos del state... originalmente hariamos una copia del arreglo de comentarios y sus respuestas para mandar esos datos a firebase antes de actualizar el state... sin embargo al copiar el arreglo  de comentarios en otra variable, por alguna extraña razon si modifico el nuevo arreglo modifica tambien el state... use todos los iteradores que existen, y multiples formas y sintaxis para no cambiar el arreglo del state, pero nada funciona...
        respuesta.likes = newLikes; //por eso modifico directamente este... por que modifica todo el "currentPost" del state de todas formas aunque copie o cree un nuevo arreglo en otra variable...

        try {
            if (usuario.uid !== currentPost.idUser) await firebase.handleRecentActivity(usuario.uid, currentPost.idUser);

            await firebase.updatePost({
                idPost: currentPost.id,
                key: 'comments',
                newData: currentPost.comments //ya esta modificado el state completo...
            })

            router.refresh();
        } catch (error) {
            //console.log(error);

            //si algo no sale bien lo regresamos a su estado original... esa la unica forma que encopntre para que todo funcionara bienn...
            respuesta.likes = currentLikes;

            router.refresh();
        }
    }

    const saveEditComment = async () => {
        if (comentarioEdit === respuesta.comment) {
            setEdit(false);

            return;
        }

        if(!usuario) return;

        if (comentarioEdit === '') return;

        const currentComment = respuesta.comment;

        try {
            currentPost.comments[indexComment].respuesta = comentarioEdit;

            if (usuario.uid !== currentPost.idUser) await firebase.handleRecentActivity(usuario.uid, currentPost.idUser);

            await firebase.updatePost({
                idPost: currentPost.id,
                key: 'comments',
                newData: currentPost.comments
            });

            respuesta.comment = comentarioEdit;

            setEdit(false);
        } catch (error) {
            respuesta.comment = currentComment;
        }
    }

    const deleteComm = async () => {
        const currentComment = currentPost.comments;

        try {
            currentPost.comments[indexComment].respuestas = currentPost.comments[indexComment].respuestas.filter((res: DocumentData) => res.id !== respuesta.id);
 
            await firebase.updatePost({
                idPost: currentPost.id,
                key: 'comments',
                newData: currentPost.comments
            });

            router.refresh();

            setEdit(false);
        } catch (error) {
            currentPost.comments = currentComment;
        }
    }

    return (
        <div className="respuesta-main-container relative flex">
            <div className="linea"></div>

            {usuarioReply && (
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

                        {(usuario && usuario.uid === respuesta.idUser) && (
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
                                    {(usuario && respuesta.likes.includes(usuario.uid)) ? (
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
            )}
        </div>
    )
}
