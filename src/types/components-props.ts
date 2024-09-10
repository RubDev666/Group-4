import { Dispatch, SetStateAction } from "react";
import { DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";

//====================== COMPONENTS > forms ========== 
export type DZProps = {
    getImg: Dispatch<SetStateAction<File | undefined | string>>;
    img: File | undefined | string;
    setErrorImg: Dispatch<SetStateAction<string>>;
    errorImg: string;
}

export type FormCommentProps = {
    post: DocumentData;
    setFormComment?: Dispatch<SetStateAction<boolean>>;
    comentario: string;
    setComentario: Dispatch<SetStateAction<string>>;
    isReplyForm: boolean;
    comentarioId?: string;
    setComentarioId?: Dispatch<SetStateAction<string>>;
    indexComment?: number;
}

export type FormsSessionProps = {
    select: (e: React.FocusEvent<HTMLInputElement>) => void;
    blur: (e: React.FocusEvent<HTMLInputElement>) => void;
    setFormRegister: Dispatch<SetStateAction<boolean>>;
    setExito: Dispatch<SetStateAction<boolean>>;
    errorSubmit: string;
    setErrorSubmit: Dispatch<SetStateAction<string>>;
    setFormModal?: Dispatch<SetStateAction<boolean>>;
}

export type TypeOfFormProps = {
    typeForm: 'createPost' | 'editProfile';
}

//================ COMPONENTS > posts =========
export type CommentProps = {
    comentario: DocumentData;
    setComentarioId: Dispatch<SetStateAction<string>>;
    currentPost: DocumentData;
    indexComment: number;
}

export type CommentOptionsProps = {
    deleteF: () => void;
    setEdit: Dispatch<SetStateAction<boolean>>;
}

export type PostComponentProps = {
    postData: DocumentData;
    creador: DocumentData;
}

export type ReplyProps = {
    respuesta: DocumentData;
    currentPost: DocumentData;
    indexComment: number;
}

//================ COMPONENTS > ui =========
export type AvatarProps = {
    size: number;
    fontSize: number;
    user: DocumentData | User;
}

export type SkeletonProps = {
    variant: 'circular' | 'rectangular';
    width: number;
    height: number;
}

export type UserOptionsProps = {
    theme: string;
    usuario: User;
}

//===================== PAGE, PAGE COMPONENTS PROPS ============ 
export type Params = {
    params: { id: string };
}

export type DynamicParams = Params & {
    searchParams: { [key: string]: string | string[] | undefined }
}

//=============== ID ============
export type PostProps = {
    idPost: string;
}

export type UserProps = {
    userName: string;
}
