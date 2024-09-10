'use client';

import { useEffect, useState, useContext } from "react";

import { Spinner, NotFound } from "@/src/components/ui";
import { Post as PostComponent, Comment, Reply } from "@/src/components/posts";
import { FormComment } from "@/src/components/forms";
import { DocumentData } from "firebase/firestore";

import { GlobalContext } from "@/src/app/providers";
import firebase from "@/src/firebase/firebase";
import type { AllPostsType } from "@/src/types";
import type { PostProps } from "../types/components-props";

import useAutenticacion from "@/src/hooks/useAuthUser";

export default function Post({ idPost }: PostProps) {
    const [formComment, setFormComment] = useState(false);
    const [comentario, setComentario] = useState<string>('');
    const [comentarioId, setComentarioId] = useState<string>('');
    const [currentPost, setCurrentPost] = useState<AllPostsType | null>(null);
    const [loading, setLoading] = useState(true);

    const usuario = useAutenticacion();

    const { allPosts, setFormModal } = useContext(GlobalContext);

    useEffect(() => {
        const getPost = async () => {
            if (allPosts.length > 0) {

                const verfiedDB = await firebase.getData('posts', idPost);

                if (!verfiedDB) {
                    setLoading(false);

                    return;
                }

                let loadingPost: AllPostsType | null = null;

                for(const post of allPosts) {
                    if (post.posts.id === idPost) {
                        loadingPost = post;

                        break;
                    }
                }

                setCurrentPost(loadingPost);
                setLoading(false);
            }
        }

        getPost();
    }, [allPosts, idPost])

    const addCommentBtn = () => {
        if(!usuario) {
            setFormModal(true);

            return;
        }

        setFormComment(true)
    }

    if (loading) return <Spinner />

    return (
        <>
            {(currentPost && !loading) ? (
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
                                setFormComment={setFormComment}
                                comentario={comentario}
                                setComentario={setComentario}
                                isReplyForm={false}
                            />
                        )}

                        <div className="comentarios">
                            {currentPost.posts.comments.length > 0 ? (
                                <>
                                    {currentPost.posts.comments.map((comentarioPost: DocumentData, indexComment: number) => (
                                        <div key={comentarioPost.id} className="comentario-main-container w-full">
                                            <Comment 
                                                comentario={comentarioPost} 
                                                setComentarioId={setComentarioId}
                                                currentPost={currentPost.posts}
                                                indexComment={indexComment}
                                            />

                                            {comentarioId === comentarioPost.id && (
                                                <div className={`formulario-container w-full ${comentarioPost.respuestas.length > 0 && 'reply-true'}`}>
                                                    <FormComment
                                                        post={currentPost.posts}
                                                        setComentarioId={setComentarioId}
                                                        comentario={comentario}
                                                        setComentario={setComentario}
                                                        comentarioId={comentarioId}
                                                        isReplyForm={true}
                                                        indexComment={indexComment}
                                                    />
                                                </div>
                                            )}
 
                                            {comentarioPost.respuestas.length > 0 && comentarioPost.respuestas.map((res: DocumentData, indexReply: number) => <Reply key={res.id} respuesta={res} currentPost={currentPost.posts} indexComment={indexComment} />)}
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="no-comentarios">
                                    <h4>Se la primera persona en comentar</h4>
                                    <p>Di lo que piensas y da inicio a esta conversacion</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            ) : (
                <NotFound message="Publicacion no encontrada o eliminada" />
            )}
        </>
    )
}
