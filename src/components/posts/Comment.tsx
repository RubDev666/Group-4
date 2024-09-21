'use client';

import { ChangeEvent, useContext, useState, useMemo } from "react";
import Link from "next/link";

import { FavoriteBorder, ChatBubbleOutline, Favorite } from '@mui/icons-material';

import { GlobalContext } from "@/src/app/providers";

import formatDate from "@/src/utilities/formatDate";

import firebase from "@/src/firebase/firebase";

import { AvatarImg } from "../ui";
import CommentOptions from "./CommentOptions";

import type { CommentProps } from "@/src/types/components-props";
import type { DocumentData } from "firebase/firestore";

export default function Comment({commentDoc, setCommentId, currentPost, indexComment, userPost}: CommentProps) {
    const [edit, setEdit] = useState(false);
    const [commentEdit, setCommentEdit] = useState<string>(commentDoc.comment);

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
        if(commentEdit === commentDoc.comment) return setEdit(false);
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
                    let currentLikes: string[] = JSON.parse(JSON.stringify(commentDoc.likes));

                    newPost.comments[indexComment].likes = currentLikes.includes(user.uid) ? currentLikes.filter(uid => uid !== user.uid) : [user.uid, ...currentLikes];
                }

                break;
            }
            case 'editComment': {
                newPost.comments[indexComment].comment = commentEdit;

                break;
            }
            case 'deleteComment': {
                let currentComments = JSON.parse(JSON.stringify(currentPost.comments));

                newPost.comments = currentComments.filter((com: DocumentData) => com.id !== commentDoc.id);   

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

        setCommentId(commentDoc.id)
    }

    const meoizedHeaderComment = useMemo(() => {
        return (
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

                    <p className='time text-opacity relative'>{formatDate(commentDoc.date)}</p>
                </div>

                {(user && commentDoc.idUser === user.uid) && (
                    <CommentOptions deleteF={deleteComm} setEdit={setEdit} />
                )}
            </div>
        )
    }, [currentPost, user])

    return (
        <div className="comentario-container relative w-full">
            {meoizedHeaderComment}

            <div className={`comentario ${commentDoc.replies.length === 0 && 'unique'}`}>
                {!edit && <p>{commentDoc.comment}</p>}

                {edit && (
                    <textarea
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentEdit(e.target.value)}
                        name='edit-comentario'
                        id='edit-comentario'
                        className="w-full scroll-bar-style"
                        defaultValue={commentDoc.comment}
                    />
                )}

                <div className="actions-container w-full flex align-center justify-start">
                    {!edit && (
                        <>
                            <div className="relative like all-center pointer bg-hover" onClick={likeToggle}>
                                {(user && commentDoc.likes.includes(user.uid)) ? (
                                    <Favorite className='icon primary-color' />
                                ) : (
                                    <FavoriteBorder className='icon' />
                                )}

                                <span>{commentDoc.likes.length.toString()}</span>
                            </div>

                            <div className="relative comment all-center pointer bg-hover" onClick={replyBtn}>
                                <ChatBubbleOutline className='icon' />

                                <span>Reply</span>
                            </div>
                        </>
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
    )
}