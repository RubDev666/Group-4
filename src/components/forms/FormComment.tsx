'use client';

import { ChangeEvent, useContext, useState } from "react";

import { v4 as generateId } from 'uuid';

import firebase from "@/src/firebase/firebase";

import type { CommentTypes, ReplyTypes } from "@/src/types";
import type { FormCommentProps } from "@/src/types/components-props";

import { GlobalContext } from "@/src/app/providers";

export default function FormComment({ post, isReplyForm, resetFormComment, commentId }: FormCommentProps) {
    const [comment, setComment] = useState<string>('');

    const {user, setAllPosts, allPosts} = useContext(GlobalContext);

    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (comment === '' || !user) return;

        try {
            if (user.uid !== post.idUser) await firebase.handleRecentActivity(user.uid, post.idUser);

            let newComment: CommentTypes | ReplyTypes = {
                id: generateId(),
                idUser: user.uid,
                date: Date.now(),
                likes: [],
                comment: comment,
            }
            
            const {updatePosts} = update_state(newComment);

            await update_db(newComment);

            setAllPosts(updatePosts);
            setComment('');
        } catch (error) {
            console.log(error);
        }
    }

    const update_post = (newComment: CommentTypes | ReplyTypes, currentComments: CommentTypes[]) => {
        if(!isReplyForm) {
            newComment = {...newComment, replies: []};

            currentComments = [newComment, ...currentComments];

            return currentComments;
        }

        if(!commentId) return currentComments;

        const currentIndexComment = currentComments.findIndex(comment => comment.id === commentId);

        if(isReplyForm && currentIndexComment !== -1) {
            currentComments[currentIndexComment].replies = [newComment, ...currentComments[currentIndexComment].replies]; 
        } else if(isReplyForm && currentIndexComment === -1) {
            throw new Error('no comment...')
        }

        return currentComments;
    }

    const update_state = (newComment: CommentTypes | ReplyTypes) => {
        let currentComments_state: CommentTypes[] = JSON.parse(JSON.stringify(post.comments));

        const newComments = update_post(newComment, currentComments_state);

        const updatePosts = allPosts.map(data => data.posts.id === post.id ? { ...data, posts: { ...data.posts, comments: newComments} } : data );

        return {
            updatePosts
        }
    }

    const update_db = async (newComment: CommentTypes | ReplyTypes) => {
        const currentPost_db = await firebase.getData('posts', post.id);

        if(!currentPost_db) return;

        let currentComments_db = currentPost_db.comments;

        const newComments = update_post(newComment, currentComments_db);
        
        await firebase.updatePost({ idPost: post.id, key: 'comments', newData: newComments});
    }

    const cancel = () => {
        resetFormComment();
        setComment('');
    }

    return (
        <form
            onSubmit={submitComment}
            className={`${isReplyForm ? 'relative' : 'w-full'} bg-input`}
        >
            <textarea
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                name={`${isReplyForm ? 'form-replies' : 'form-comments'}`}
                id={`${isReplyForm ? 'form-replies' : 'form-comments'}`}
                className="w-full scroll-bar-style"
                placeholder={`Write ${isReplyForm ? 'reply' : 'comment'}`}
            />
 
            <div className="actions-form-container w-full flex align-center">
                <button className="cancel-btn pointer bg-hover-2" type="reset" onClick={cancel}>Cancel</button>

                <button className="comment-btn pointer" type="submit">{`${isReplyForm ? 'Reply' : 'Comment'}`}</button>
            </div>
        </form>
    )
}