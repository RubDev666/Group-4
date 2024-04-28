'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";

import Dropzone from "./Dropzone";
import { Spinner, AvatarImg } from "../ui";

import useAutenticacion from "@/app/_hooks/useAuthUser";

import { UserFormType } from '@/app/_types';

import firebase from '@/app/_firebase/firebase';

type userFormProps = {
    typeForm: 'createPost' | 'editProfile';
}

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

export default function UserForm({ typeForm }: userFormProps) {
    const [imgFile, setImgFile] = useState<File | undefined | string>(undefined)
    const [loading, setLoading] = useState(true);
    const [errorImg, setErrorImg] = useState<string>('');

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

    const onSubmit: SubmitHandler<UserFormType> = async (data) => {
        //jamas sera string, solo que como usamos el mismo state para el otro formulario, por eso lo pongo...
        if(typeof imgFile === 'string') return;

        try {
            //debido a que el componente es reutilizable por eso el monton de validaciones dependiendo el caso de uso.

            if (typeForm === 'editProfile') {
                if (imgFile && usuario) {
                    await firebase.updateProfileImg(imgFile, usuario);

                    if (data.name === '') router.push('/u/' + usuario.displayName);
                }

                if (data.name !== '' && usuario) {
                    await firebase.updateUserName(data.name.replace(/ /g, ""), usuario);

                    router.push('/u/' + data.name.replace(/ /g, ""));
                }
            }

            if (typeForm === 'createPost' && usuario) {
                const { title, description } = data;

                const idNewPost = await firebase.createPost({
                    title,
                    description,
                    imgFile,
                    user: usuario
                });

                router.push('/p/' + idNewPost);
            }
        } catch (error) {
            console.log(error)
        }
    }

    //animacion mientras carga el usuario autenticado
    if (loading && !usuario) return <div className="w-full"><Spinner /></div>

    //si no hay usuarios nos redirecciona al inicio
    if (!loading && !usuario) router.push('/');

    if (usuario) return (
        <div className="user-form-container">
            <h3>{FormActions[typeForm].titleForm}</h3>

            <div className="user-form">
                {typeForm === 'createPost' && (
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
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="inputs-container w-full relative">
                        {typeForm === 'editProfile' && (
                            <>
                                <p className={`${errors.name ? 'error' : ''}`}>Tu nombre actual: <span className='primary-color'>{usuario?.displayName}</span></p>

                                <input
                                    className="bg-input"
                                    type="text"
                                    autoComplete='off'
                                    placeholder="Tu nuevo nombre de usuario"
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
                                <button className="bg-hover-2 pointer" onClick={() => setImgFile(undefined)}>Replace / Cancel</button>
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