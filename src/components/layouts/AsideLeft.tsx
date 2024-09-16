'use client';

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import {
    Home,
    HomeOutlined,
    TrendingUpOutlined,
    ExpandMore,
    Info
} from "@mui/icons-material";

import { IconTema, iconsTemas } from "@/src/utilities/asideLeftItems";

import { AvatarImg } from "../ui";
import { DocumentData } from "firebase/firestore";

import useAutenticacion from "@/src/hooks/useAuthUser";
import firebase from "@/src/firebase/firebase";

export default function AsideLeft() {
    const [mostrar, setMostrar] = useState(false);
    const [recentActivity, setRecentActivity] = useState<DocumentData>([]);

    const path = usePathname();

    const user = useAutenticacion();

    useEffect(() => {
        if(user) fetchRecentActivity(user.uid);
    }, [user])

    const fetchRecentActivity = async (uid: string) => {
        const getRecentActivity = await firebase.getRecentActivity(uid);

        setRecentActivity(getRecentActivity ? getRecentActivity : []);
    }

    return (
        <aside className="left none bg-color scroll-bar-style">
            <Link href='/' className={`flex align-center justify-start text-color w-full bg-hover ${path === '/' ? 'bg-path' : ''}`}>
                {path === '/' ? (
                    <Home className="icon icon-path" />
                ) : (<HomeOutlined className="icon icon-path" />)}

                <span>Principal</span>
            </Link>

            <Link href='#' className="flex align-center justify-start text-color w-full bg-hover">
                <TrendingUpOutlined className="icon" />

                <span>Popular</span>
            </Link>

            <hr />

            {(recentActivity.length > 0 && user) && (
                <>
                    <Accordion className='w-full text-color acordeon' defaultExpanded sx={{ backgroundColor: 'transparent', boxShadow: 'none', "::before": { display: 'none' } }}>
                        <AccordionSummary
                            expandIcon={<ExpandMore className='icon-expanded' />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                            className="titulo-acordeon"
                        >
                            Recientes
                        </AccordionSummary>

                        <AccordionDetails className='acordeon-items-container' sx={{ padding: '0' }}>
                            {recentActivity.map((user: DocumentData) => (
                                <Link key={user.uid} href={`/u/${user.displayName}`} className="flex align-center justify-start text-color w-full bg-hover">
                                    <AvatarImg
                                        size={30}
                                        fontSize={20}
                                        user={user}
                                    />

                                    <span>{`u/${user.displayName}`}</span>
                                </Link>
                            ))}
                        </AccordionDetails>
                    </Accordion>

                    <hr />
                </>
            )}

            <Accordion className='w-full text-color acordeon' defaultExpanded sx={{ backgroundColor: 'transparent', boxShadow: 'none', "::before": { display: 'none' } }}>
                <AccordionSummary
                    expandIcon={<ExpandMore className='icon-expanded' />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    className="titulo-acordeon"
                >
                    Temas
                </AccordionSummary>

                <AccordionDetails className='acordeon-items-container' sx={{ padding: '0' }}>
                    {iconsTemas.map((iconTema: IconTema, index: number): ReactNode => {
                        if (index > 5 && !mostrar) return;

                        return (
                            <Link key={iconTema.titulo} href={iconTema.path} className={`flex align-center justify-start text-color w-full bg-hover ${path === iconTema.path ? 'bg-path' : ''}`}>
                                {iconTema.iconPath && path === iconTema.path ? (
                                    <iconTema.iconPath className="icon icon-path" />
                                ) : (<iconTema.icon className="icon icon-path" />)}

                                <span>{iconTema.titulo}</span>
                            </Link>
                        )
                    })}

                    <button onClick={() => setMostrar(!mostrar)} className="btn-view bg-hover pointer">{!mostrar ? 'Ver más...' : 'Ver menos'}</button>
                </AccordionDetails>
            </Accordion>

            <hr />

            <Accordion className='w-full text-color acordeon' defaultExpanded sx={{ backgroundColor: 'transparent', boxShadow: 'none', "::before": { display: 'none' } }}>
                <AccordionSummary
                    expandIcon={<ExpandMore className='icon-expanded' />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    className="titulo-acordeon"
                >
                    Recursos
                </AccordionSummary>

                <AccordionDetails className='acordeon-items-container' sx={{ padding: '0' }}>
                    <Link href='#' className="flex align-center justify-start text-color w-full bg-hover">
                        <Info className="icon icon-path" />

                        <span>Acerca de Group 4</span>
                    </Link>
                </AccordionDetails>
            </Accordion>

            <hr />

            <p>Created by <span>Rub</span>Developer © {new Date().getFullYear()}</p>
        </aside>
    )
}