import { Dispatch, SetStateAction } from "react";
import { DocumentData } from "firebase/firestore";
import { User } from "firebase/auth";

//====================== COMPONENTS > forms ========== 
export type DZProps = {
    getImg: Dispatch<SetStateAction<File | null | string>>;
    img: File | null | string;
    setErrorImg: Dispatch<SetStateAction<string>>;
    errorImg: string;
}

export type FormCommentProps = {
    post: DocumentData;
    isReplyForm: boolean;
    commentId?: string;
    resetFormComment: () => void;
}

export type FormsSessionProps = {
    select: (e: React.FocusEvent<HTMLInputElement>) => void;
    blur: (e: React.FocusEvent<HTMLInputElement>) => void;
    setFormRegister: Dispatch<SetStateAction<boolean>>;
    setSucces: Dispatch<SetStateAction<boolean>>;
    errorSubmit: string;
    setErrorSubmit: Dispatch<SetStateAction<string>>;
    setFormModal?: Dispatch<SetStateAction<boolean>>;
}

export type TypeOfFormProps = {
    typeForm: 'createPost' | 'editProfile';
}

//================ COMPONENTS > posts =========
export type CommentsContainerProps = Pick<FormCommentProps, 'commentId' | 'resetFormComment'> & {
    commentDoc: DocumentData;
    setCommentId: Dispatch<SetStateAction<string>>;
    currentPost: DocumentData;
}

export type CommentProps = Pick<CommentsContainerProps, 'commentDoc' | 'setCommentId' | 'currentPost'> & {
    userPost: DocumentData;
}

export type CommentOptionsProps = {
    deleteF: () => void;
    setEdit: Dispatch<SetStateAction<boolean>>;
}

export type PostComponentProps = {
    postData: DocumentData;
    creator: DocumentData;
}

export type ReplyProps = {
    reply: DocumentData;
    currentPost: DocumentData;
    commentId: string;
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
    user: User;
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
