'use client';

import { ThemeProvider } from 'next-themes';
import { useState, useEffect, createContext } from 'react';
import { AllPostsType, AllUsersFetch, GlobalContextType } from '../types';
import firebase from '../firebase/firebase';
import { DocumentData } from 'firebase/firestore';
import useAutenticacion from '../hooks/useAuthUser';
import { User } from 'firebase/auth';

const defaultValues: GlobalContextType = {
    navModal: false,
    formModal: false,
    setNavModal: () => {},
    setFormModal: () => {},
    allPosts: [],
    allUsers: null,
    getPosts: async () => {},
    loading: true,
    popularUsers: [],
    loadingPopular: true,
    setRefresh: () => {},
    user: null
};
 
export const GlobalContext = createContext<GlobalContextType>(defaultValues); 

//el codigo original llevaba esto, pero era un ejemplo con tailwind
//<ThemeProvider attribute="class" defaultTheme='system' enableSystem>
 
export function Providers({ children }: { children: React.ReactNode }) {
    const [navModal, setNavModal] = useState(false);
    const [formModal, setFormModal] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingPopular, setLoadingPopular] = useState(true);

    const [popularUsers, setPopularUsers] = useState<DocumentData[]>([]);
    const [allPosts, setAllPosts] = useState<AllPostsType[]>([]);
    const [allUsers, setAllUsers] = useState<AllUsersFetch>(null);

    const [user, setUser] = useState<User | null>(null)

    //when the user edits their profile
    const [refresh, setRefresh] = useState(false);

    const getCurrentUser = useAutenticacion();

    useEffect(() => {
        setUser(getCurrentUser);
    }, [getCurrentUser])

    useEffect(() => {
        const fetchData = async () => {
            await getPosts();
            await getPopulars();
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
        if (refresh) {
            const refreshData = async () => {
                await getPosts();
                await getPopulars();

                setRefresh(false);
            };
    
            refreshData();
        }
    }, [refresh]);    

    const getPopulars = async () => {
        const res = await firebase.getPopularUsers();

        setPopularUsers(res);
        setLoadingPopular(false);
    }

    const getPosts = async () => {
        const res = await firebase.getAllPosts();
        const users = await firebase.getAllUsers();
        
        setAllPosts(res);
        setAllUsers(users);
        setLoadingData(false);
    }

    useEffect(() => {
        const loginModal = document.querySelector('.bg-modal.login-modal') as HTMLElement;
        const asideLeft = document.querySelector('ASIDE.left') as HTMLElement;
        const bgNavModal = document.querySelector('.bg-modal.nav-modal') as HTMLElement;
        const body = document.querySelector('BODY') as HTMLElement;

        loginModal.classList.toggle('active', formModal);
        asideLeft.classList.toggle('flex', !navModal);
        asideLeft.classList.toggle('none', !navModal);
        bgNavModal.classList.toggle('active', navModal);

        body.style.overflowY = (navModal || formModal) ? 'hidden' : 'auto';
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
                    loading: loadingData,
                    popularUsers,
                    loadingPopular,
                    setRefresh,
                    user
                }}
            >
                {children}
            </GlobalContext.Provider>
        </ThemeProvider>
    )
}
