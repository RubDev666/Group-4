'use client';

import { useContext, useEffect, useState } from "react";

import { DocumentData } from "firebase/firestore";

import { GlobalContext } from "@/src/app/providers";

import { FormComment } from "@/src/components/forms";
import { Reply, Comment } from "@/src/components/posts";

import type { CommentsContainerProps } from "@/src/types/components-props";

export default function CommentsContainer({ comentarioDoc, setComentarioId, currentPost, indexComment, comentario, comentarioId, setComentario, resetFormComment}: CommentsContainerProps) {
    const { allUsers } = useContext(GlobalContext);

    const [usuarioPost, setUsuarioPost] = useState<DocumentData | undefined>(undefined);

    useEffect(() => {
        if (allUsers) {
            const getUser = allUsers.get(comentarioDoc.idUser);

            setUsuarioPost(getUser);
        }
    }, [allUsers, comentarioDoc])

    if (usuarioPost) return (
        <div className="comentario-main-container w-full">
            <Comment 
                userPost={usuarioPost}
                comentarioDoc={comentarioDoc}
                setComentarioId={setComentarioId}
                currentPost={currentPost}
                indexComment={indexComment}
            />

            {comentarioId === comentarioDoc.id && (
                <div className={`formulario-container w-full ${comentarioDoc.respuestas.length > 0 && 'reply-true'}`}>
                    <FormComment
                        post={currentPost}
                        comentario={comentario}
                        setComentario={setComentario}
                        comentarioId={comentarioId}
                        isReplyForm={true}
                        indexComment={indexComment}
                        resetFormComment={resetFormComment}
                    />
                </div>
            )}

            {comentarioDoc.respuestas.length > 0 && comentarioDoc.respuestas.map((res: DocumentData, indexReply: number) => <Reply key={res.id} respuesta={res} currentPost={currentPost} indexComment={indexComment} indexReply={indexReply} />)}
        </div>
    )
}
