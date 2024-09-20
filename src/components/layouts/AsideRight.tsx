'use client';

import { useContext } from "react";
import Link from "next/link";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { ExpandMore } from "@mui/icons-material";

import { GlobalContext } from "@/src/app/providers";

import { DocumentData } from "firebase/firestore";

import { AvatarImg, SkeletonUser } from "../ui";

export default function AsideRight() {
    const { popularUsers, loadingPopular } = useContext(GlobalContext);

    return (
        <aside className="right none bg-color scroll-bar-style">
            <Accordion className='w-full text-color acordeon' defaultExpanded sx={{ backgroundColor: 'transparent', boxShadow: 'none', "::before": { display: 'none' } }}>
                <AccordionSummary
                    expandIcon={<ExpandMore className='icon-expanded' />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    className="titulo-acordeon"
                >
                    usuarios populares
                </AccordionSummary>

                <AccordionDetails className='acordeon-items-container' sx={{ padding: '0' }}>
                    {loadingPopular && (
                        <>
                            <SkeletonUser />
                            <SkeletonUser />
                            <SkeletonUser />
                            <SkeletonUser />
                            <SkeletonUser />
                        </>
                    )}

                    {(!loadingPopular && popularUsers.length > 0) && (
                        <>
                            {popularUsers.map((user: DocumentData) => (
                                <Link key={user.uid} href={`/u/${user.displayName}`} className="flex align-center justify-start text-color w-full bg-hover">
                                    <AvatarImg
                                        size={30}
                                        fontSize={20}
                                        user={user}
                                    />

                                    <span>{`u/${user.displayName}`}</span>
                                </Link>
                            ))}
                        </>
                    )}
                </AccordionDetails>
            </Accordion>

            <hr />
        </aside>
    )
}