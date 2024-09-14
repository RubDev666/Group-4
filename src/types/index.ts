import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";

export interface GlobalContextType {
    navModal: boolean;
    formModal: boolean;
    setNavModal: React.Dispatch<React.SetStateAction<boolean>>;
    setFormModal: React.Dispatch<React.SetStateAction<boolean>>;
    allPosts: AllPostsType[];
    allUsers: AllUsersFetch;
    getPosts: () => Promise<void>;
    loading: boolean;
    popularUsers: DocumentData[];
    loadingPopular: boolean;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
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

export type PopularUsers = Pick<UserDbType, 'uid'> & {
    totalLikesReceived: number;
    totalCommentsReceived: number;
}

export type LoginType = Pick<RegisterType, 'email' | 'password'>;

type MainPostProperties = {
    title: string;
    description: string;
}

export type UserFormType =  MainPostProperties & Pick<RegisterType, 'name'>;

type GlobalTypesPost = {
    id: string;
    idUser: string;
    date: number;
    likes: string[];
}

export interface ReplyTypes extends GlobalTypesPost {
    comment: string;
}

export interface CommentTypes extends ReplyTypes {
    respuestas: ReplyTypes[];
}

export interface PostTypes extends GlobalTypesPost, MainPostProperties {
    imgUrl: string | null;
    comments: CommentTypes[];
}

export type CreatePostArg = MainPostProperties & {
    imgFile: File | undefined;
    user: User;
}

export type AllPostsType = {
    usuario: DocumentData;
    posts: DocumentData;
}

export type AllUsersFetch = Map<string, DocumentData> | null;

export type updatePostParams = {
    idPost: string;
    idCreator?: string;
    key: string;
    currentData?: number;
    newData: CommentTypes[] | string[];
}

export type EditPost = MainPostProperties & {
    idPost: string;
    imgUrl: string | File | null;
    deleteImg: boolean;
}