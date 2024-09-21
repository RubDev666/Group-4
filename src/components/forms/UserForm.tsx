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
        titleForm: 'Create post',
        btnAction: 'Create'
    },
    editProfile: {
        titleForm: 'Edit profile',
        btnAction: 'Update profile'
    }
}

export default function UserForm({ typeForm }: TypeOfFormProps) {
    const [imgFile, setImgFile] = useState<File | null | string>(null)
    const [errorImg, setErrorImg] = useState<string>('');

    const { register, handleSubmit, formState: { errors }, watch } = useForm<UserFormType>();

    const {setRefresh, loadingData, user} = useContext(GlobalContext);

    const router = useRouter();

    useEffect(() => {
        if(!user && !loadingData) router.push('/');
    }, [loadingData, user])

    const onSubmit: SubmitHandler<UserFormType> = async (data) => {
        //It will never be a string, only since we use the same state for the other form, that's why I put it...
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

    if (loadingData && !user) return null;

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
                                <p className={`${errors.name ? 'error' : ''}`}>Current name: <span className='primary-color'>{user?.displayName}</span></p>

                                <input
                                    className="bg-input"
                                    type="text"
                                    autoComplete='off'
                                    placeholder="New user name"
                                    {...register('name', {
                                        required: false,
                                        minLength: {
                                            value: 4,
                                            message: 'Min. 4 chars.'
                                        },
                                        maxLength: {
                                            value: 10,
                                            message: 'Max. 10 chars.'
                                        },
                                        pattern: {
                                            value: /[A-Za-z]{1}/,
                                            message: 'Invalid name'
                                        }
                                    })}
                                />

                                {errors.name && <span className="error-input">{errors.name.message + '*'}</span>}
                            </>
                        )}

                        {typeForm === 'createPost' && (
                            <>
                                <p>Title:</p>

                                <input
                                    className="bg-input"
                                    type="text"
                                    id="title-post"
                                    placeholder="Post title"
                                    {...register('title', {
                                        required: {
                                            value: true,
                                            message: 'Title required*'
                                        },
                                        maxLength: {
                                            value: 60,
                                            message: 'Max. 60 chars.*'
                                        }
                                    })}
                                />

                                {errors.title && (
                                    <span className="error-input">{errors.title.message}</span>
                                )}

                                <div className="relative">
                                    <p>Description:</p>

                                    <textarea
                                        {...register("description", {
                                            required: {
                                                value: true,
                                                message: 'Description required*'
                                            },
                                            maxLength: {
                                                value: 300,
                                                message: 'Max. 300 chars.*'
                                            }
                                        })}
                                        className="w-full bg-input"
                                        id="description-post"
                                        placeholder="Post description"
                                    />

                                    {errors.description && (
                                        <span className="error-input">{errors.description.message}</span>
                                    )}
                                </div>
                            </>
                        )}

                        <div className="dropzone-main-container relative">
                            <p className={`${errorImg !== '' ? 'error' : ''}`}>{`${typeForm === 'editProfile' ? 'Profile photo:' : 'Choose/change your photo:'}`}</p>

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

                            <button className="w-full calcel-btn bg-hover-2 pointer" onClick={() => router.push('/')}>Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}