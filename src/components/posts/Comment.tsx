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
import { CommentActions } from "@/src/types/components-functions";
import { handleLikes } from "@/src/firebase/utils";

export default function Comment({commentDoc, setCommentId, currentPost, userPost}: CommentProps) {
    const [edit, setEdit] = useState(false);
    const [commentEdit, setCommentEdit] = useState<string>(commentDoc.comment);

    const { setFormModal, user, allPosts, setAllPosts } = useContext(GlobalContext);

    const likeToggle = async () => {
        if (!user) return setFormModal(true);

        const {updatePosts, currentPosts} = update_state('like', user.uid);

        try {
            setAllPosts(updatePosts);

            if (user.uid !== currentPost.idUser) await firebase.handleRecentActivity(user.uid, currentPost.idUser);

            await update_db('like', user.uid);
        } catch (error) {
            console.log(error);

            setAllPosts(currentPosts);
        }
    }

    const saveEditComment = async () => {
        if(commentEdit === commentDoc.comment) return setEdit(false);
        if(!user || commentEdit === '') return;

        const {updatePosts, currentPosts} = update_state('edit', user.uid);
        
        try {
            setAllPosts(updatePosts);
            
            if (user.uid !== currentPost.idUser) await firebase.handleRecentActivity(user.uid, currentPost.idUser);

            await update_db('edit', user.uid);

            setEdit(false);
        } catch (error) {
            console.log(error);

            setAllPosts(currentPosts);
        }
    }

    const deleteComm = async () => {
        if(!user) return;

        const {updatePosts, currentPosts} = update_state('delete', user.uid);

        try {
            await update_db('delete', user.uid);

            setAllPosts(updatePosts);
        } catch (error) {
            console.log(error);

            setAllPosts(currentPosts);
        }
    }

    const update_post = (type: CommentActions, post: DocumentData, uid: string) => {
        const currentIndexComment = post.comments.findIndex((currentComment: any) => currentComment.id === commentDoc.id);

        if (currentIndexComment === -1) throw new Error('this comment does not exist...');

        switch (type) {
            case 'like': {
                let currentLikes: string[] = post.comments[currentIndexComment].likes;

                post.comments[currentIndexComment].likes = handleLikes(currentLikes, uid);
                
                break;
            }
            case 'edit': {
                post.comments[currentIndexComment].comment = commentEdit;

                break;
            }
            case 'delete': {
                post.comments = post.comments.filter((currentComment: DocumentData) => currentComment.id !== commentDoc.id);  

                break;
            }

            default: break;
        }
    }

    const update_state = (type: CommentActions, uid: string) => {
        const currentPosts = [...allPosts];

        let newPost = JSON.parse(JSON.stringify(currentPost));

        update_post(type, newPost, uid);

        const updatePosts = allPosts.map(data => data.posts.id === currentPost.id ? { ...data, posts: newPost } : data);

        return {
            currentPosts,
            updatePosts
        }
    }

    const update_db = async (type: CommentActions, uid: string) => {
        const currentPost_db = await firebase.getData('posts', currentPost.id);

        if(!currentPost_db) return;

        update_post(type, currentPost_db, uid);

        await firebase.updatePost({
            idPost: currentPost.id,
            key: 'comments',
            newData: currentPost_db.comments 
        })
    }

    const replyBtn = () => {
        if(!user) return setFormModal(true);

        setCommentId(commentDoc.id)
    }

    const meoizedHeaderComment = useMemo(() => {
        return (
            <div className="header-comment relative flex justify-between">
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
        <div className="comment-container relative w-full">
            {meoizedHeaderComment}

            <div className={`comment ${commentDoc.replies.length === 0 && 'unique'}`}>
                {!edit && <p>{commentDoc.comment}</p>}

                {edit && (
                    <textarea
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentEdit(e.target.value)}
                        name='edit-comment'
                        id='edit-comment'
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

                            <div className="relative all-center pointer bg-hover" onClick={replyBtn}>
                                <ChatBubbleOutline className='icon' />

                                <span>Reply</span>
                            </div>
                        </>
                    )}

                    {edit && (
                        <>
                            <button className="cancel-btn pointer bg-hover-2" onClick={() => setEdit(false)}>Cancel</button>

                            <button className="comment-btn pointer" onClick={saveEditComment}>Edit</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}