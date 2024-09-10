'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";

import Dropzone from "./Dropzone";
import { Spinner, AvatarImg } from "../ui";

import useAutenticacion from "@/src/hooks/useAuthUser";

import { UserFormType } from '@/src/types';

import firebase from '@/src/firebase/firebase';
import { DocumentData } from "firebase/firestore";

export default function EditPostForm({ idPost }: { idPost: string }) {
    const [imgFile, setImgFile] = useState<File | undefined | string>(undefined)
    const [loading, setLoading] = useState(true);
    const [errorImg, setErrorImg] = useState<string>('');
    const [currentPost, setCurrentPost] = useState<DocumentData | null | undefined>(undefined);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<UserFormType>();

    const usuario = useAutenticacion();
    const router = useRouter();

    //obtener el usuario actual autenticado
    useEffect(() => {
        if (usuario) setLoading(false);

        //si no hay usuario igual detener la carga de la animacion
        setTimeout(() => {
            if (!usuario) setLoading(false);
        }, 4000)
    }, [usuario])

    useEffect(() => {
        const getPost = async () => {
            const res = await firebase.getData('posts', idPost);

            setCurrentPost(res);

            if(res && res.imgUrl) setImgFile(res.imgUrl);
        }

        getPost();
    }, [idPost]);

    const onSubmit: SubmitHandler<UserFormType> = async (data) => {
        try {
            if(!currentPost) return;

            //si el usuario remueve la imagen original de su post
            const deleteImg: boolean = imgFile === undefined && currentPost.imgUrl !== null;

            await firebase.editPost({
                title: data.title,
                description: data.description,
                imgUrl: imgFile === undefined ? null : imgFile,
                idPost,
                deleteImg
            })

            router.push('/p/' + idPost);
        } catch (error) {
            console.log(error);
        }
    }

    //animacion mientras carga el usuario autenticado
    if (loading && (!usuario || currentPost === undefined)) return <div className="w-full vh-100"><Spinner /></div>

    //si no hay usuarios nos redirecciona al inicio
    if (!loading && (!usuario || currentPost === null)) router.push('/');

    if (usuario && currentPost) return (
        <div className="user-form-container">
            <h3>Editar Post</h3>

            <div className="user-form">
                <div className="header relative flex align-center justify-start">
                    {usuario && (
                        <AvatarImg
                            size={30}
                            fontSize={20}
                            user={usuario}
                        />
                    )}

                    <span>{'u/' + usuario?.displayName} </span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="inputs-container w-full relative">
                        <p>Titulo:</p>

                        <input
                            className="bg-input"
                            type="text"
                            id="title-post"
                            placeholder="Titulo del post"
                            {...register('title', {
                                value: currentPost.title,
                                required: {
                                    value: true,
                                    message: 'Titulo obligatorio*'
                                },
                                maxLength: {
                                    value: 60,
                                    message: 'Maximo 60 caracteres*'
                                }
                            })}
                        />

                        {errors.title && (
                            <span className="error-input">{errors.title.message}</span>
                        )}

                        <div className="relative">
                            <p>Descripcion:</p>

                            <textarea
                                {...register("description", {
                                    value: currentPost.description,
                                    required: {
                                        value: true,
                                        message: 'Descripcion obligatoria*'
                                    },
                                    maxLength: {
                                        value: 300,
                                        message: 'Maximo 300 caracteres*'
                                    }
                                })}
                                className="w-full bg-input"
                                id="description-post"
                                placeholder="Descripcion del post"
                            />

                            {errors.description && (
                                <span className="error-input">{errors.description.message}</span>
                            )}
                        </div>

                        <div className="dropzone-main-container relative">
                            <p className={`${errorImg !== '' ? 'error' : ''}`}>{'Elige/cambia tu foto:'}</p>

                            <Dropzone
                                getImg={setImgFile}
                                img={imgFile}
                                setErrorImg={setErrorImg}
                                errorImg={errorImg}
                            />

                            {imgFile && (
                                <button className="bg-hover-2 pointer" onClick={() => setImgFile(undefined)}>Replace / Cancel</button>
                            )}
                        </div>

                        <div className="actions-post">
                            <button className="w-full create-btn pointer" type="submit">Actualizar Publicacion</button>

                            <button className="w-full calcel-btn bg-hover-2 pointer" onClick={() => router.push('/')}>Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
