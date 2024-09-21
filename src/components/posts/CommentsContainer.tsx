'use client';

import { useContext, useEffect, useState, useMemo } from "react";

import { DocumentData } from "firebase/firestore";

import { GlobalContext } from "@/src/app/providers";

import { FormComment } from "@/src/components/forms";
import { Reply, Comment } from "@/src/components/posts";

import type { CommentsContainerProps } from "@/src/types/components-props";

export default function CommentsContainer({ commentDoc, setCommentId, currentPost, indexComment, commentId, resetFormComment}: CommentsContainerProps) {
    const { allUsers } = useContext(GlobalContext);

    const [userPost, setUserPost] = useState<DocumentData | undefined>(undefined);

    useEffect(() => {
        if (allUsers) {
            const getUser = allUsers.get(commentDoc.idUser);

            setUserPost(getUser);
        }
    }, [allUsers, commentDoc])

    const memoizedReplies = useMemo(() => {
        return commentDoc.replies.length > 0 && commentDoc.replies.map((res: DocumentData, indexReply: number) => <Reply key={res.id} reply={res} currentPost={currentPost} indexComment={indexComment} indexReply={indexReply} />)
    }, [currentPost]);

    if (userPost) return (
        <div className="comment-main-container w-full">
            <Comment 
                userPost={userPost}
                commentDoc={commentDoc}
                setCommentId={setCommentId}
                currentPost={currentPost}
                indexComment={indexComment}
            />

            {commentId === commentDoc.id && (
                <div className={`form-container-2 w-full ${commentDoc.replies.length > 0 && 'reply-true'}`}>
                    <FormComment
                        post={currentPost}
                        commentId={commentId}
                        isReplyForm={true}
                        indexComment={indexComment}
                        resetFormComment={resetFormComment}
                    />
                </div>
            )}

            {memoizedReplies}
        </div>
    )
}
