'use client';

import { ThemeProvider } from 'next-themes';
import { useState, useEffect, createContext } from 'react';
import { AllPostsType } from '../_types';
import firebase from '../_firebase/firebase';
import { DocumentData } from 'firebase/firestore';
 
export const GlobalContext = createContext<any>({}); 

//el codigo original llevaba esto, pero era un ejemplo con tailwind
//<ThemeProvider attribute="class" defaultTheme='system' enableSystem>
 
export function Providers({ children }: { children: React.ReactNode }) {
    const [navModal, setNavModal] = useState(false);
    const [formModal, setFormModal] = useState(false);
    const [allPosts, setAllPosts] = useState<AllPostsType[] | []>([]);
    const [allUsers, setAllUsers] = useState<DocumentData[] | []>([]);

    useEffect(() => {
        getPosts();
    }, [])

    const getPosts = async () => {
        const res = await firebase.getAllPosts();
        const users = await firebase.getAllUsers();

        setAllUsers(users);
        setAllPosts(res);
    }

    useEffect(() => {
        const loginModal = document.querySelector('.bg-modal.login-modal') as HTMLElement;
        const asideLeft = document.querySelector('ASIDE.left') as HTMLElement;
        const bgNavModal = document.querySelector('.bg-modal.nav-modal') as HTMLElement;
        const body = document.querySelector('BODY') as HTMLElement;

        if(formModal) {
            loginModal.classList.add('active');
        } else {
            loginModal.classList.remove('active');
        }

        if(!navModal) {
            asideLeft.classList.add('flex');
            asideLeft.classList.add('none');

            bgNavModal.classList.remove('active');
        } else {
            asideLeft.classList.remove('flex');
            asideLeft.classList.remove('none');

            bgNavModal.classList.add('active');
        }

        if(navModal || formModal) {
            body.style.overflowY = 'hidden';
        } else {
            body.style.overflowY = 'auto';
        }
    }, [navModal, formModal])

    return (
        <ThemeProvider>
            <GlobalContext.Provider
                value={{
                    navModal, 
                    formModal, 
                    setNavModal, 
                    setFormModal,
                    allPosts,
                    allUsers,
                    getPosts,
                }}
            >
                {children}
            </GlobalContext.Provider>
        </ThemeProvider>
    )
}
