'use client';

import { ChangeEvent, useContext, useEffect, useState, useMemo } from "react";
import Link from "next/link";

import { Favorite, FavoriteBorder } from '@mui/icons-material';

import { DocumentData } from "firebase/firestore";

import { GlobalContext } from "@/src/app/providers";

import { AvatarImg } from "../ui";

import formatDate from "@/src/utilities/formatDate";
import firebase from "@/src/firebase/firebase";
import CommentOptions from "./CommentOptions";

import type { ReplyProps } from "@/src/types/components-props";

export default function Reply({ reply, currentPost, indexComment, indexReply }: ReplyProps) {
    const [edit, setEdit] = useState(false);
    const [commentEdit, setCommentEdit] = useState<string>(reply.comment);
    const [userReply, setUserReply] = useState<DocumentData | undefined>(undefined);

    const { allUsers, setFormModal, user, allPosts, setAllPosts } = useContext(GlobalContext);

    useEffect(() => {
        if (allUsers) {
            const getUser = allUsers.get(reply.idUser);

            setUserReply(getUser);
        }
    }, [allUsers, reply])

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
        if (commentEdit === reply.comment) return setEdit(false);

        if(!user || commentEdit === '') return;

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
                    let currentLikes: string[] = JSON.parse(JSON.stringify(reply.likes));

                    newPost.comments[indexComment].replies[indexReply].likes = currentLikes.includes(user.uid) ? currentLikes.filter(uid => uid !== user.uid) : [user.uid, ...currentLikes];
                }

                break;
            }
            case 'editComment': {
                newPost.comments[indexComment].replies[indexReply].comment = commentEdit;

                break;
            }
            case 'deleteComment': {
                let currentComments = JSON.parse(JSON.stringify(currentPost.comments));

                newPost.comments[indexComment].replies = currentComments[indexComment].replies.filter((com: DocumentData) => com.id !== reply.id);   

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

    const memoizedHeaderReply = useMemo(() => {
        if (userReply) return (
            <div className="header-comentario relative flex justify-between w-full">
                <div className='flex info-creator'>
                    <Link href={`/u/${userReply.displayName}`} className="user text-color flex align-center">
                        <AvatarImg
                            size={30}
                            fontSize={16}
                            user={userReply}
                        />

                        <span className='user-name'>{`u/${userReply.displayName}`} </span>
                    </Link>

                    <p className='time text-opacity relative'>{formatDate(reply.date)}</p>
                </div>

                {(user && user.uid === reply.idUser) && (
                    <CommentOptions deleteF={deleteComm} setEdit={setEdit} />
                )}
            </div>
        )
    }, [user, currentPost, userReply])

    if (userReply) return (
        <div className="respuesta-main-container relative flex">
            <div className="linea"></div>

            <div className="respuesta-container w-full">
                {memoizedHeaderReply}

                <div className="respuesta">
                    {!edit && <p>{reply.comment}</p>}

                    {edit && (
                        <textarea
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentEdit(e.target.value)}
                            name='edit-respuesta'
                            id='edit-respuesta'
                            className="w-full scroll-bar-style"
                            defaultValue={reply.comment}
                        />
                    )}

                    <div className="actions-container w-full flex align-center justify-start">
                        {!edit && (
                            <div className="relative like all-center pointer bg-hover" onClick={likeToggle}>
                                {(user && reply.likes.includes(user.uid)) ? (
                                    <Favorite className='icon primary-color' />
                                ) : (
                                    <FavoriteBorder className='icon' />
                                )}

                                <span>{reply.likes.length.toString()}</span>
                            </div>
                        )}

                        {edit && (
                            <>
                                <button className="cancel-btn pointer bg-hover-2" onClick={() => setEdit(false)}>Cancel</button>

                                <button className="comentar-btn pointer" onClick={saveEditComment}>Edit</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}
