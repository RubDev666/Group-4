'use client';

import { useEffect, useState, useContext, useCallback, useMemo } from "react";

import { NotFound } from "@/src/components/ui";
import { Post as PostComponent, CommentsContainer } from "@/src/components/posts";
import { FormComment } from "@/src/components/forms";

import { GlobalContext } from "@/src/app/providers";

import type { DocumentData } from "firebase/firestore";
import type { AllPostsType } from "@/src/types";
import type { PostProps } from "../types/components-props";

export default function Post({ idPost }: PostProps) {
    const [formComment, setFormComment] = useState(false);
    const [commentId, setCommentId] = useState<string>('');
    const [currentPost, setCurrentPost] = useState<AllPostsType | null>(null);
    const [loadingPage, setLoadingPage] = useState(true);

    const { allPosts, setFormModal, user } = useContext(GlobalContext);

    useEffect(() => {
        const loadingPost = allPosts.find(post => post.posts.id === idPost);

        setCurrentPost(loadingPost ? loadingPost : null);
        setLoadingPage(false);
    }, [allPosts, idPost]);

    useEffect(() => {
        resetFormComment();
    }, [currentPost]);

    const resetFormComment = useCallback(() => {
        setFormComment(false);
        setCommentId('');
    }, []);

    const addCommentBtn = useCallback(() => {
        !user ? setFormModal(true) : setFormComment(true);
    }, [user, setFormModal]);

    const memoizedPost = useMemo(() => {
        if (currentPost) return <PostComponent postData={currentPost.posts} creator={currentPost.user} />
    }, [currentPost]);

    if (!currentPost && !loadingPage) return <NotFound message="Post not found or deleted" />;

    if (currentPost) return (
        <div className="main-container w-full">
            {memoizedPost}

            <section className="comentarios-section w-full">
                {!formComment && <button onClick={addCommentBtn} className="btn-add-comment all-center pointer border-color"><span className="all-center">+</span> Add comment</button>}

                {formComment && (
                    <FormComment
                        post={currentPost.posts}
                        isReplyForm={false}
                        resetFormComment={resetFormComment}
                    />
                )}

                <div className="comentarios">
                    {currentPost.posts.comments.map((commentPost: DocumentData, indexComment: number) => (
                        <CommentsContainer
                            key={commentPost.id}
                            commentDoc={commentPost}
                            setCommentId={setCommentId}
                            currentPost={currentPost.posts}
                            indexComment={indexComment}
                            commentId={commentId}
                            resetFormComment={resetFormComment}
                        />
                    ))}

                    {currentPost.posts.comments.length === 0 && (
                        <div className="no-comentarios">
                            <h4>Be the first person to comment</h4>
                            <p>Say what you think and start this conversation.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
