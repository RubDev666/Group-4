'use client';

import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";

import Dropzone from "./Dropzone";
import { Spinner, AvatarImg } from "../ui";

import useAutenticacion from "@/src/hooks/useAuthUser";

import { UserFormType } from '@/src/types';
import type { PostProps } from "@/src/types/components-props";

import firebase from '@/src/firebase/firebase';
import { DocumentData } from "firebase/firestore";

import { GlobalContext } from "@/src/app/providers";

export default function EditPostForm({ idPost }: PostProps) {
    const [imgFile, setImgFile] = useState<File | undefined | string>(undefined)
    const [loadingPage, setLoadingPage] = useState(true);
    const [errorImg, setErrorImg] = useState<string>('');
    const [currentPost, setCurrentPost] = useState<DocumentData | null | undefined>(undefined);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<UserFormType>();

    const usuario = useAutenticacion();
    const router = useRouter();

    const {loading} = useContext(GlobalContext);

    useEffect(() => {
        const getPost = async () => {
            const res = await firebase.getData('posts', idPost);

            setCurrentPost(res);

            if(res && res.imgUrl) setImgFile(res.imgUrl);

            setLoadingPage(false);
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

    if(loading) return <Spinner />;

    //si no hay usuarios nos redirecciona al inicio
    if (!loadingPage && (!usuario || currentPost === null)) router.push('/');

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
