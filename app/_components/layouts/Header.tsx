'use client';

import Link from "next/link";
import { useTheme } from 'next-themes';
import { usePathname } from "next/navigation";
import { useState, useEffect, useContext } from "react";

import { GlobalContext } from "@/app/(global-pages)/providers";

import useAutenticacion from "@/app/_hooks/useAuthUser";

import { Skeleton as SkeletonComponent, UserOptions } from "../ui";

import { 
    Menu as MenuIcon, 
    Close, 
    Search, 
    ArrowBack, 
    LightMode, 
    DarkMode,
} from "@mui/icons-material"; 

export default function Header() {
    const { navModal, setNavModal, setFormModal, getPosts } = useContext(GlobalContext);

    const [mounted, setMounted] = useState(false);
    const [searchActive, setSearchActive] = useState(false);
    const [loading, setLoading] = useState(true);

    const { theme, setTheme } = useTheme();

    const pathname = usePathname();

    const usuario = useAutenticacion();

    const notUserPage: boolean = (pathname.includes('/u/') || pathname.includes('/p/')) || pathname === '/';

    useEffect(() => {
        window.addEventListener('resize', (e: UIEvent) => {
            if (innerWidth >= 1024) {
                if (notUserPage) setNavModal(false);

                setSearchActive(false);
            }
        })
    })

    //obtener el usuario actual autenticado
    useEffect(() => {
        if (usuario) setLoading(false);

        //si no hay usuario igual detener la carga de la animacion
        setTimeout(() => {
            if (!usuario) setLoading(false);
        }, 3000);

        console.log(usuario);
    }, [usuario])

    useEffect(() => {
        setMounted(true);
    }, []); 

    const toggleMenu = () => setNavModal(!navModal);

    const toggleSearch = () => {
        setSearchActive(!searchActive);
        if (notUserPage) setNavModal(false);
    }

    const select = () => document.querySelector('HEADER FORM')?.classList.add('shadow');

    const blur = () => document.querySelector('HEADER FORM')?.classList.remove('shadow');

    const reloadedData = () => {
        if(pathname === '/') getPosts();
    }

    return (
        <header className='flex align-center border-bottom bg-color w-full'>
            {!searchActive && (
                <div className='all-center'>
                    {!navModal ? (
                        (notUserPage && <MenuIcon onClick={toggleMenu} className="icon pointer" />)
                    ) : (
                        (notUserPage && <Close onClick={toggleMenu} className="icon pointer" />)
                    )}

                    <Link href='/' className="logo-mobile logo-font pointer"><span>4</span></Link>

                    <Link href='/' className="logo-desktop logo-font pointer" onClick={reloadedData}>Group <span>4</span></Link>
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

                {((!usuario && !loading) && !searchActive) && (
                    <button className="pointer" onClick={() => setFormModal(true)}>Iniciar Sesión</button>
                )}

                {(((usuario && !loading) && theme !== undefined) && !searchActive) && (
                    <UserOptions 
                        theme={theme}
                        usuario={usuario}
                    />
                )}
            </div>
        </header>
    )
}
