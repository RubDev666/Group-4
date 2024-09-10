import { Dispatch, SetStateAction, ChangeEvent } from "react";

import { CommentTypes, ReplyTypes } from "@/src/types";
import { DocumentData } from "firebase/firestore";

import { v4 as generateId } from 'uuid';

import useAutenticacion from "@/src/hooks/useAuthUser";

import firebase from "@/src/firebase/firebase";

type FormCommentProps = {
    post: DocumentData;
    setFormComment?: Dispatch<SetStateAction<boolean>>;
    comentario: string;
    setComentario: Dispatch<SetStateAction<string>>;
    isReplyForm: boolean;
    comentarioId?: string;
    setComentarioId?: Dispatch<SetStateAction<string>>;
    indexComment?: number;
}

export default function FormComment({ post, setFormComment, comentario, setComentario, isReplyForm, setComentarioId, indexComment }: FormCommentProps) {
    const usuario = useAutenticacion();

    const submitComment = async (e: React.FormEvent) => {
        e.preventDefault();

        //debido a un error que me pasa al clonar el state en otra variable, si modifico la nueva variable tambien se modifica el state original, y no tengo idea del por que... asi que para solucionarlo y ya que todas formas se modifica aunque no quiera, guardo los datos previos en esta variable, y si hay error en la base de datos usamos esta variable para volverlo a su estado original y asi no moestrarlo en el cliente...
        let currentData;

        if (comentario === '') return;
        if (!usuario) return;

        try {
            if (usuario.uid !== post.idUser) await firebase.handleRecentActivity(usuario.uid, post.idUser);

            if (!isReplyForm) {
                currentData = post.comments;

                await createComment(usuario);
            }

            if (isReplyForm && indexComment !== undefined) {
                currentData = post.comments[indexComment].respuestas;

                await createReply(usuario, indexComment);
            }

            //en dado caso que no se borre lo escrito en el formulario, usar este codigo
            /*const text = document.querySelector(`${isReplyForm ? '#form-respuestas' : '#form-comentarios'}`) as HTMLTextAreaElement;
            text.value = '';*/

            reset();
        } catch (error) {
            //console.log(error);
            
            //resetear los valores predeterminados si no se pudo actualizar en la base de datos, ya que si no hago esto, se mostraran los comentarios o respuestas aun si no se guarda en la base de datos...

            if (!isReplyForm) post.comments = currentData;
            if (isReplyForm && indexComment !== undefined) post.comments[indexComment].respuestas = currentData;
        }
    }

    const createComment = async (usuario: DocumentData) => {
        const newComment: CommentTypes = {
            id: generateId(),
            idUser: usuario.uid,
            date: Date.now(),
            likes: [],
            comment: comentario,
            respuestas: []
        }

        //NO ES CORRECTO MODIFICAR EL ESTATE DE ESTA FORMA, PERO NO ENCONTRE OTRA FORMA DE COPIAR EL STATE SIN QUE MODIFIQUE IGUAL EL STATE ORIGINAL...
        post.comments = [newComment, ...post.comments];

        await firebase.updatePost({ idPost: post.id, key: 'comments', newData: post.comments });
    }

    const createReply = async (usuario: DocumentData, i: number) => {
        const newReply: ReplyTypes = {
            id: generateId(),
            idUser: usuario.uid,
            date: Date.now(),
            likes: [],
            comment: comentario,
        }

        //NO ES CORRECTO MODIFICAR EL ESTATE DE ESTA FORMA, PERO NO ENCONTRE OTRA FORMA DE COPIAR EL STATE SIN QUE MODIFIQUE IGUAL EL STATE ORIGINAL...
        post.comments[i].respuestas = [newReply, ...post.comments[i].respuestas];

        await firebase.updatePost({ idPost: post.id, key: 'comments', newData: post.comments });
    }

    const reset = () => {
        if (setFormComment) setFormComment(false);
        if (setComentarioId) setComentarioId('');

        setComentario('');
    }

    return (
        <form
            onSubmit={submitComment}
            className={`${isReplyForm ? 'relative' : 'w-full'} bg-input`}
        >
            <textarea
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComentario(e.target.value)}
                name={`${isReplyForm ? 'form-respuestas' : 'form-comentarios'}`}
                id={`${isReplyForm ? 'form-respuestas' : 'form-comentarios'}`}
                className="w-full scroll-bar-style"
                placeholder={`Escribe tu ${isReplyForm ? 'respuesta' : 'comentario'}`}
            />
 
            <div className="actions-form-container w-full flex align-center">
                <button className="cancel-btn pointer bg-hover-2" type="reset" onClick={reset}>Cancelar</button>

                <button className="comentar-btn pointer" type="submit">{`${isReplyForm ? 'Responder' : 'Comentar'}`}</button>
            </div>
        </form>
    )
}