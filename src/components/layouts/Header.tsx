'use client';

import Link from "next/link";
import { useTheme } from 'next-themes';
import { useState, useEffect, useContext } from "react";

import { GlobalContext } from "@/src/app/providers";

import { Skeleton as SkeletonComponent, UserOptions } from "../ui";

import { 
    Menu as MenuIcon, 
    Close, 
    Search, 
    ArrowBack, 
    LightMode, 
    DarkMode,
} from "@mui/icons-material"; 
import firebase from "@/src/firebase/firebase";

export default function Header() {
    const [mounted, setMounted] = useState(false);
    const [searchActive, setSearchActive] = useState(false);

    const { theme, setTheme } = useTheme();

    const { navModal, setNavModal, setFormModal, user, loading } = useContext(GlobalContext);

    useEffect(() => {
        window.addEventListener('resize', (e: UIEvent) => {
            if (innerWidth >= 1024) {
                setNavModal(false);
                setSearchActive(false);
            }
        })

        setMounted(true);
    }, [])

    //get auth user
    useEffect(() => {
        if (user)  handlePopular(user.uid);

        console.log(user);
    }, [user])

    const handlePopular = async (uid: string) => {
        const getPopulars = await firebase.getData('popularUsers', uid);

        if(!getPopulars) await firebase.createPopularUser(uid);
    }

    const toggleMenu = () => setNavModal(!navModal);

    const toggleSearch = () => {
        setSearchActive(!searchActive);
        setNavModal(false);
    }

    const select = () => document.querySelector('HEADER FORM')?.classList.add('shadow');

    const blur = () => document.querySelector('HEADER FORM')?.classList.remove('shadow');

    return (
        <header className='flex align-center border-bottom bg-color w-full'>
            {!searchActive && (
                <div className='all-center'>
                    {!navModal ? (
                        <MenuIcon onClick={toggleMenu} className="icon pointer" />
                    ) : (
                        <Close onClick={toggleMenu} className="icon pointer" />
                    )}

                    <Link href='/' className="logo-mobile logo-font pointer"><span>4</span></Link>

                    <Link href='/' className="logo-desktop logo-font pointer">Group <span>4</span></Link>
                </div>
            )}

            {searchActive && <ArrowBack onClick={toggleSearch} className="icon" />}

            <form
                onBlur={blur}
                onSelect={select}
                className={`bg-input align-center justify-center relative ${searchActive ? 'flex' : ''}`}
            >
                <label htmlFor="search" className="all-center absolute">
                    <Search className="icon-label" />
                </label>

                <input type="text" placeholder="Buscar en Group 4..." id="search" className="w-full h-full relative" />
            </form>

            <div className="all-center">
                {!searchActive && <Search onClick={toggleSearch} className="icon" />}

                {mounted ? (
                    (!searchActive && (
                        <div className="theme-container">
                            {(theme === 'light' || theme === 'system') && <DarkMode className="pointer" onClick={() => setTheme('dark')} />}

                            {(theme === 'dark') && <LightMode className="pointer" onClick={() => setTheme('light')} />}
                        </div>
                    ))
                ) : (
                    <SkeletonComponent 
                        variant="circular"
                        width={24}
                        height={24}
                    />
                )}

                {loading && (
                    <SkeletonComponent
                        variant="rectangular"
                        width={100}
                        height={30}
                    />
                )}

                {((!user && !loading) && !searchActive) && (
                    <button className="pointer" onClick={() => setFormModal(true)}>Iniciar Sesión</button>
                )}

                {(((user && !loading) && theme !== undefined) && !searchActive) && (
                    <UserOptions 
                        theme={theme}
                        usuario={user}
                    />
                )}
            </div>
        </header>
    )
}
