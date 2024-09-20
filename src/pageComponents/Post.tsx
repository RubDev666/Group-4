'use client';

import { useEffect, useState, useContext } from "react";

import { NotFound } from "@/src/components/ui";
import { Post as PostComponent, CommentsContainer } from "@/src/components/posts";
import { FormComment } from "@/src/components/forms";

import { GlobalContext } from "@/src/app/providers";

import { DocumentData } from "firebase/firestore";
import type { AllPostsType } from "@/src/types";
import type { PostProps } from "../types/components-props";

export default function Post({ idPost }: PostProps) {
    const [formComment, setFormComment] = useState(false);
    const [comentario, setComentario] = useState<string>('');
    const [comentarioId, setComentarioId] = useState<string>('');
    const [currentPost, setCurrentPost] = useState<AllPostsType | null>(null);
    const [loadingPage, setLoadingPage] = useState(true);

    const { allPosts, setFormModal, user } = useContext(GlobalContext);

    useEffect(() => {
        const loadingPost = allPosts.find(post => post.posts.id === idPost);

        setCurrentPost(loadingPost ? loadingPost : null);
        setLoadingPage(false);
    }, [allPosts, idPost])

    useEffect(() => {
        resetFormComment();
    }, [currentPost])

    const resetFormComment = () => {
        setFormComment(false);
        setComentarioId('');
        setComentario('');
    }

    const addCommentBtn = () => !user ? setFormModal(true) : setFormComment(true);

    if(!currentPost && !loadingPage) return <NotFound message="Publicacion no encontrada o eliminada" />

    if (currentPost) return (
        <div className="main-container w-full">
            <PostComponent
                postData={currentPost.posts}
                creador={currentPost.usuario}
            />

            <section className="comentarios-section w-full">
                {!formComment && <button onClick={addCommentBtn} className="btn-add-comment all-center pointer border-color"><span className="all-center">+</span> Añadir comentario</button>}

                {formComment && (
                    <FormComment
                        post={currentPost.posts}
                        comentario={comentario}
                        setComentario={setComentario}
                        isReplyForm={false}
                        resetFormComment={resetFormComment}
                    />
                )}

                <div className="comentarios">
                    {currentPost.posts.comments.map((comentarioPost: DocumentData, indexComment: number) => (
                        <CommentsContainer
                            key={comentarioPost.id}
                            comentarioDoc={comentarioPost}
                            setComentarioId={setComentarioId}
                            currentPost={currentPost.posts}
                            indexComment={indexComment}
                            comentario={comentario}
                            setComentario={setComentario}
                            comentarioId={comentarioId}
                            resetFormComment={resetFormComment}
                        />
                    ))}

                    {currentPost.posts.comments.length === 0 && (
                        <div className="no-comentarios">
                            <h4>Se la primera persona en comentar</h4>
                            <p>Di lo que piensas y da inicio a esta conversacion</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
