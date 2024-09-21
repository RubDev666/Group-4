'use client';

import { ThemeProvider } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useState, useEffect, createContext } from 'react';

import { AllPostsType, AllUsersFetch, GlobalContextType } from '../types';

import { DocumentData } from 'firebase/firestore';
import { User } from 'firebase/auth';

import firebase from '../firebase/firebase';
import useAutenticacion from '../hooks/useAuthUser';

const defaultValues: GlobalContextType = {
    navModal: false,
    formModal: false,
    setNavModal: () => {},
    setFormModal: () => {},
    allPosts: [],
    setAllPosts: () => {},
    allUsers: null,
    loadingData: true,
    popularUsers: [],
    loadingPopular: true,
    setRefresh: () => {},
    user: null,
    fetchError: false
};

export const GlobalContext = createContext<GlobalContextType>(defaultValues); 

//The original code had this, but it was an example with tailwind
//<ThemeProvider attribute="class" defaultTheme='system' enableSystem>

export function Providers({ children }: { children: React.ReactNode }) {
    const [navModal, setNavModal] = useState(false);
    const [formModal, setFormModal] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [loadingPopular, setLoadingPopular] = useState(true);

    const [popularUsers, setPopularUsers] = useState<DocumentData[]>([]);
    const [allPosts, setAllPosts] = useState<AllPostsType[]>([]);
    const [allUsers, setAllUsers] = useState<AllUsersFetch>(null);
    const [user, setUser] = useState<User | null>(null);
    const [fetchError, setFetchError] = useState(false);

    //when the user edits their profile, or another fetch actions
    const [refresh, setRefresh] = useState({refresh: false, redirectTo: ''});

    const getCurrentUser = useAutenticacion();

    const router = useRouter();

    useEffect(() => {
        setUser(getCurrentUser);
    }, [getCurrentUser])

    useEffect(() => {
        const fetchData = async () => {
            await handleFetch();
        };
    
        fetchData();
    }, []);
    
    useEffect(() => {
        if (refresh.refresh) {
            const refreshData = async () => {
                await handleFetch();

                setRefresh({...refresh, refresh: false});
                    
                if(refresh.redirectTo !== '') router.push(refresh.redirectTo);
            };
    
            refreshData();
        }
    }, [refresh]);    

    const getPopulars = async () => {
        const res = await firebase.getPopularUsers();

        setPopularUsers(res);
        setLoadingPopular(false);
    }

    const getData = async () => {
        const res = await firebase.getAllPosts();
        const users = await firebase.getAllUsers();
        
        setAllPosts(res);
        setAllUsers(users);
        setLoadingData(false);
    }

    const handleFetch = async () => {
        try {
            await getData();
            await getPopulars();
        } catch (error) {
            console.log(error);

            setFetchError(true);
            setLoadingData(false);
            setLoadingPopular(false);
        }
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
                    setAllPosts,
                    allUsers,
                    loadingData,
                    popularUsers,
                    loadingPopular,
                    setRefresh,
                    user,
                    fetchError
                }}
            >
                {children}
            </GlobalContext.Provider>
        </ThemeProvider>
    )
}
