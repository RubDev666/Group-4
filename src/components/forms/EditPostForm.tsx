'use client';

import { useEffect, useState, useContext } from "react";
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";

import Dropzone from "./Dropzone";
import { AvatarImg } from "../ui";

import { UserFormType } from '@/src/types';
import type { PostProps } from "@/src/types/components-props";

import firebase from '@/src/firebase/firebase';
import { DocumentData } from "firebase/firestore";

import { GlobalContext } from "@/src/app/providers";

export default function EditPostForm({ idPost }: PostProps) {
    const [imgFile, setImgFile] = useState<File | null | string>(null)
    const [loadingPage, setLoadingPage] = useState(true);
    const [errorImg, setErrorImg] = useState<string>('');
    const [currentPost, setCurrentPost] = useState<DocumentData | undefined>(undefined);

    const { register, handleSubmit, formState: { errors }, watch } = useForm<UserFormType>();

    const router = useRouter();

    const {user, setRefresh, allPosts, loadingData} = useContext(GlobalContext);

    useEffect(() => {
        if(!loadingData && loadingPage) {
            const getPost = allPosts.find(data => data.posts.id === idPost);

            if (getPost) {
                setCurrentPost(getPost.posts);
                setImgFile(getPost.posts.imgUrl);
            }

            setLoadingPage(false);
        }

        if (!loadingPage && (!user || !currentPost)) router.push('/');
    }, [loadingPage, loadingData, user]);

    const onSubmit: SubmitHandler<UserFormType> = async (data) => {
        try {
            if(!currentPost) return;

            await firebase.editPost({
                title: data.title,
                description: data.description,
                imgUrl: imgFile,
                idPost,
                deleteImg: !imgFile && currentPost.imgUrl
            })

            setRefresh({refresh: true, redirectTo: '/p/' + idPost});
        } catch (error) {
            console.log(error);
        }
    }

    if (user && currentPost) return (
        <div className="user-form-container">
            <h3>Edit post</h3>

            <div className="user-form">
                <div className="header relative flex align-center justify-start">
                    <AvatarImg
                        size={30}
                        fontSize={20}
                        user={user}
                    />

                    <span>{'u/' + user?.displayName} </span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="inputs-container w-full relative">
                        <p>Title:</p>

                        <input
                            className="bg-input"
                            type="text"
                            id="title-post"
                            placeholder="Post title"
                            {...register('title', {
                                value: currentPost.title,
                                required: {
                                    value: true,
                                    message: 'required*'
                                },
                                maxLength: {
                                    value: 60,
                                    message: 'Max. 60 chars.*'
                                }
                            })}
                        />

                        {errors.title && <span className="error-input">{errors.title.message}</span>}

                        <div className="relative">
                            <p>Description:</p>

                            <textarea
                                {...register("description", {
                                    value: currentPost.description,
                                    required: {
                                        value: true,
                                        message: 'required*'
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

                            {errors.description && <span className="error-input">{errors.description.message}</span>}
                        </div>

                        <div className="dropzone-main-container relative">
                            <p className={`${errorImg !== '' ? 'error' : ''}`}>{'Choose/change your photo:'}</p>

                            <Dropzone
                                getImg={setImgFile}
                                img={imgFile}
                                setErrorImg={setErrorImg}
                                errorImg={errorImg}
                            />

                            {imgFile && <button className="bg-hover-2 pointer" onClick={() => setImgFile(null)}>Replace / Cancel</button>}
                        </div>

                        <div className="actions-post">
                            <button className="w-full create-btn pointer" type="submit">Update post</button>

                            <button className="w-full calcel-btn bg-hover-2 pointer" onClick={() => router.push('/')} type="button">Cancel</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
