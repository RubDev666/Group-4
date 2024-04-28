'use client';

import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { FavoriteBorder, ChatBubbleOutline, IosShare, Favorite } from '@mui/icons-material';
import { DocumentData } from 'firebase/firestore';

import AvatarImg from './AvatarImg';

import formatearFecha from '@/app/_utilities/formatearFecha';

import useAutenticacion from '@/app/_hooks/useAuthUser';
import firebase from '@/app/_firebase/firebase';
import PostOptions from './PostOptions';

import { GlobalContext } from '@/app/(global-pages)/providers';

export default function Post({ postData, creador }: { postData: DocumentData, creador: DocumentData }) {
    const path = usePathname();
    const router = useRouter();
    const usuario = useAutenticacion();

    const {setFormModal} = useContext(GlobalContext);

    const totalComments = (): number => {
        let total: number = postData.comments.length ?? 0;

        for (let comment of postData.comments) total = total + comment.respuestas.length;

        return total;
    }

    const likeToggle = async () => {
        if (!usuario) {
            setFormModal(true);

            return;
        }

        const currentData = postData.likes;

        let newLikes: string[] | [] = [];

        if (postData.likes.includes(usuario.uid)) {
            newLikes = postData.likes.filter((uid: string) => uid !== usuario.uid);
        } else {
            newLikes = [usuario.uid, ...postData.likes];
        }

        try {
            postData.likes = newLikes;

            await firebase.updatePost({
                idPost: postData.id,
                key: 'likes',
                newData: newLikes
            });

            router.refresh();
        } catch (error) {
            postData.likes = currentData;

            router.refresh();
        }
    }

    const redirectPost = () => {
        if(path.includes('/p/')) return;

        router.push('/p/' + postData.id);
    }

    return (
        <>
            <article className={`w-full relative ${(path === '/' || path.includes('/u/')) ? 'bg-hover' : ''}`}>
                {(path === '/' || path.includes('/u/')) && <Link href={`/p/${postData.id}`} className='link-post absolute w-full h-full'></Link>}

                <div className="header-post relative flex justify-between">
                    <div className='flex info-creator'>
                        <Link href={`/u/${creador.displayName}`} className="user text-color all-center">
                            <AvatarImg
                                size={30}
                                fontSize={20}
                                user={creador}
                            />

                            <span className='user-name'>{`u/${creador.displayName}`} </span>
                        </Link>

                        <p className='time text-opacity relative'>{formatearFecha(postData.date)}</p>
                    </div>

                    {(usuario && usuario.uid === creador.uid) && (
                        <PostOptions idPost={postData.id} />
                    )}
                </div>

                <h3>{postData.title}</h3>

                {(path !== '/' && !path.includes('/u/')) && <p className='descripcion'>{postData.description}</p>}

                {(!path.includes('/u/') && postData.imgUrl) && (
                    <div className="img-container relative w-full all-center">
                        <Image
                            src={postData.imgUrl}
                            alt='img-fondo'
                            fill
                            className='img-fondo absolute'
                            priority
                        />

                        <Image
                            src={postData.imgUrl}
                            alt='img-fondo'
                            fill
                            className='img-post h-full absolute'
                            priority
                        />
                    </div>
                )}

                <div className="actions-container w-full flex align-center justify-start">
                    <div className="relative like all-center pointer bg-hover-2" onClick={likeToggle}>
                        {(usuario && postData.likes.includes(usuario.uid)) ? (
                            <Favorite className='icon primary-color' />
                        ) : (
                            <FavoriteBorder className='icon' />
                        )}

                        <span>{postData.likes.length.toString()}</span>
                    </div>

                    <div className="relative comment all-center pointer bg-hover-2" onClick={redirectPost}>
                        <ChatBubbleOutline className='icon' />

                        <span>{totalComments()}</span>
                    </div>

                    <div className="relative share all-center pointer bg-hover-2">
                        <IosShare className='icon' />

                        <span>Compartir</span>
                    </div>
                </div>
            </article >

            <hr />
        </>
    )
}
