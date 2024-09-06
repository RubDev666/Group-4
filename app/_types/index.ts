import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export type FormsSessionProps = {
    select: (e: React.FocusEvent<HTMLInputElement>) => void;
    blur: (e: React.FocusEvent<HTMLInputElement>) => void;
    setFormRegister: Dispatch<SetStateAction<boolean>>;
    setExito: Dispatch<SetStateAction<boolean>>;
    errorSubmit: string;
    setErrorSubmit: Dispatch<SetStateAction<string>>;
    setFormModal?: Dispatch<SetStateAction<boolean>>;
}

export type RegisterType = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    
}

export type UserDbType = {
    uid: string,
    displayName: string | null,
    photoURL: string | null,
    dateRegister: string
}

export type PopularUsers = {
    uid: string;
    totalLikesReceived: number;
    totalCommentsReceived: number;
}

export type LoginType = {
    email: string,
    password: string,
}

export type UserFormType = {
    name: string, //edit-profile

    //create/edit post
    title: string,
    description: string,
}

type GlobalTypesPost = {
    id: string;
    idUser: string;
    date: number;
    likes: string[] | [];
}

export interface ReplyTypes extends GlobalTypesPost {
    comment: string;
}

export interface CommentTypes extends ReplyTypes {
    respuestas: ReplyTypes[] | [];
}

export interface PostTypes extends GlobalTypesPost {
    title: string;
    description: string;
    imgUrl: string | null;
    comments: CommentTypes[] | [];
}

export type CreatePostArg = {
    title: string;
    description: string;
    imgFile: File | undefined;
    user: User;
}

export type AllPostsType = {
    usuario: DocumentData;
    posts: DocumentData;
}

export type updatePostParams = {
    idPost: string;
    idCreator?: string;
    key: string;
    currentData?: number;
    newData: CommentTypes[] | string[] | [];
}

export type EditPost = {
    idPost: string;
    title: string;
    description: string;
    imgUrl: string | File | null;
    deleteImg: boolean;
}