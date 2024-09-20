'use client';

import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";

import Dropzone from "./Dropzone";
import { AvatarImg } from "../ui";

import { UserFormType } from '@/src/types';
import type { TypeOfFormProps } from "@/src/types/components-props";

import firebase from '@/src/firebase/firebase';

import { GlobalContext } from "@/src/app/providers";

const FormActions = {
    createPost: {
        titleForm: 'Crear un post',
        btnAction: 'Crear'
    },
    editProfile: {
        titleForm: 'Editar perfil',
        btnAction: 'Actualizar informacion'
    }
}

export default function UserForm({ typeForm }: TypeOfFormProps) {
    const [imgFile, setImgFile] = useState<File | null | string>(null)
    const [errorImg, setErrorImg] = useState<string>('');

    const { register, handleSubmit, formState: { errors }, watch } = useForm<UserFormType>();

    const {setRefresh, loading: firstload, user} = useContext(GlobalContext);

    const router = useRouter();

    useEffect(() => {
        if(!user && !firstload) router.push('/');
    }, [firstload, user])

    const onSubmit: SubmitHandler<UserFormType> = async (data) => {
        //jamas sera string, solo que como usamos el mismo state para el otro formulario, por eso lo pongo...
        if(typeof imgFile === 'string' || !user) return;

        try {
            switch (typeForm) {
                case 'editProfile': {
                    if (imgFile) {
                        await firebase.updateProfileImg(imgFile, user);
    
                        if (data.name === '') setRefresh({refresh: true, redirectTo: '/u/' + user.displayName})
                    }

                    if (data.name !== '') {
                        await firebase.updateUserName(data.name.replace(/ /g, ""), user);

                        setRefresh({refresh: true, redirectTo: '/u/' + data.name.replace(/ /g, "")})
                    }

                    break;
                }
                case 'createPost': {
                    const { title, description } = data;

                    const idNewPost = await firebase.createPost({
                        title,
                        description,
                        imgFile,
                        user
                    });

                    setRefresh({refresh: true, redirectTo: '/p/' + idNewPost});

                    break;
                } 
                default: break;
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (firstload && !user) return null;

    if (user) return (
        <div className="user-form-container">
            <h3>{FormActions[typeForm].titleForm}</h3>

            <div className="user-form">
                {typeForm === 'createPost' && (
                    <div className="header relative flex align-center justify-start">
                        <AvatarImg
                            size={30}
                            fontSize={20}
                            user={user}
                        />

                        <span>{'u/' + user?.displayName} </span>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="inputs-container w-full relative">
                        {typeForm === 'editProfile' && (
                            <>
                                <p className={`${errors.name ? 'error' : ''}`}>Tu nombre actual: <span className='primary-color'>{user?.displayName}</span></p>

                                <input
                                    className="bg-input"
                                    type="text"
                                    autoComplete='off'
                                    placeholder="Tu nuevo nombre de user"
                                    {...register('name', {
                                        required: false,
                                        minLength: {
                                            value: 4,
                                            message: 'Minimo 4 caracteres'
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: 'Maximo 10 caracteres'
                                        },
                                        pattern: {
                                            value: /[A-Za-z]{1}/,
                                            message: 'Nombre no valido'
                                        }
                                    })}
                                />

                                {errors.name && <span className="error-input">{errors.name.message + '*'}</span>}
                            </>
                        )}

                        {typeForm === 'createPost' && (
                            <>
                                <p>Titulo:</p>

                                <input
                                    className="bg-input"
                                    type="text"
                                    id="title-post"
                                    placeholder="Titulo del post"
                                    {...register('title', {
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
                            </>
                        )}

                        <div className="dropzone-main-container relative">
                            <p className={`${errorImg !== '' ? 'error' : ''}`}>{`${typeForm === 'editProfile' ? 'Tu foto de perfil:' : 'Elige/cambia tu foto:'}`}</p>

                            <Dropzone
                                getImg={setImgFile}
                                img={imgFile}
                                setErrorImg={setErrorImg}
                                errorImg={errorImg}
                            />

                            {imgFile && (
                                <button className="bg-hover-2 pointer" onClick={() => setImgFile(null)}>Replace / Cancel</button>
                            )}
                        </div>

                        <div className="actions-post">
                            <button className="w-full create-btn pointer" type="submit">{FormActions[typeForm].btnAction}</button>

                            <button className="w-full calcel-btn bg-hover-2 pointer" onClick={() => router.push('/')}>Cancelar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}