'use client';

import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { FavoriteBorder, ChatBubbleOutline, IosShare, Favorite } from '@mui/icons-material';

import { AvatarImg } from '../ui';

import formatDate from '@/src/utilities/formatDate';

import firebase from '@/src/firebase/firebase';
import PostOptions from './PostOptions';

import { GlobalContext } from "@/src/app/providers";

import type { PostComponentProps } from '@/src/types/components-props';
import { handleLikes } from '@/src/firebase/utils';

export default function Post({ postData, creator }: PostComponentProps) {
    const path = usePathname();
    const router = useRouter();

    const {setFormModal, user, setAllPosts, allPosts} = useContext(GlobalContext);

    const totalComments = (): number => postData.comments.reduce((total: number, comment: any) => total + (comment.replies.length || 0), postData.comments.length);

    const likeToggle = async () => {
        if (!user) return setFormModal(true);

        const {updatePosts, currentPosts} = update_state(user.uid);

        try {
            setAllPosts(updatePosts);

            if (user.uid !== postData.idUser) await firebase.handleRecentActivity(user.uid, postData.idUser);

            await update_db(user.uid);
        } catch (error) {
            console.log(error);

            setAllPosts(currentPosts);
        }
    }

    //Modify data only for the state
    const update_state = (uid: string) => {
        const currentPosts = [...allPosts];

        const currentPost_state = JSON.parse(JSON.stringify(postData));

        const currentLikes_state: string[] = JSON.parse(JSON.stringify(postData.likes));
        currentPost_state.likes = handleLikes(currentLikes_state, uid);

        const updatePosts = allPosts.map(data => data.posts.id === postData.id ? { ...data, posts: currentPost_state } : data);

        return {
            currentPosts,
            updatePosts
        }
    }

    //modify data only for the db
    const update_db = async (uid: string) => {
        const currentPost_db = await firebase.getData('posts', postData.id);

        if(!currentPost_db) return;

        const currentLikes_db = handleLikes(currentPost_db.likes, uid);

        await firebase.updatePost({
            idPost: postData.id,
            idCreator: postData.idUser,
            currentData: currentPost_db.likes.length,
            key: 'likes',
            newData: currentLikes_db
        });
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
                        <Link href={`/u/${creator.displayName}`} className="user text-color flex align-center">
                            <AvatarImg
                                size={30}
                                fontSize={20}
                                user={creator}
                            />

                            <span className='user-name'>{`u/${creator.displayName}`} </span>
                        </Link>

                        <p className='time text-opacity relative'>{formatDate(postData.date)}</p>
                    </div>

                    {(user && user.uid === creator.uid) && (
                        <PostOptions idPost={postData.id} />
                    )}
                </div>

                <h3>{postData.title}</h3>

                {(path !== '/' && !path.includes('/u/')) && <p className='description'>{postData.description}</p>}

                {(!path.includes('/u/') && postData.imgUrl) && (
                    <div className="img-container relative w-full all-center">
                        <Image
                            src={postData.imgUrl}
                            alt='bg-img'
                            fill
                            className='bg-img absolute'
                            priority
                        />

                        <Image
                            src={postData.imgUrl}
                            alt='bg-img'
                            fill
                            className='img-post h-full absolute'
                            priority
                        />
                    </div>
                )}

                <div className="actions-container w-full flex align-center justify-start">
                    <div className="relative like all-center pointer bg-hover-2" onClick={likeToggle}>
                        {(user && postData.likes.includes(user.uid)) ? (
                            <Favorite className='icon primary-color' />
                        ) : (
                            <FavoriteBorder className='icon' />
                        )}

                        <span>{postData.likes.length.toString()}</span>
                    </div>

                    <div className="relative comment all-center pointer bg-hover-2" onClick={redirectPost}>
                        <ChatBubbleOutline className='icon' />

                        <span>{totalComments().toString()}</span>
                    </div>

                    <div className="relative share all-center pointer bg-hover-2">
                        <IosShare className='icon' />

                        <span>Share</span>
                    </div>
                </div>
            </article >

            <hr />
        </>
    )
}
