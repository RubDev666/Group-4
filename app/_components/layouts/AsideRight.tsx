'use client';

import Link from "next/link";
import Image from "next/image";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { ExpandMore } from "@mui/icons-material";

export default function AsideRight() {
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
                    <Link href='#' className="flex align-center justify-start text-color w-full bg-hover">
                        <Image
                            src={'/images/perfil.jpg'}
                            alt="img-profile"
                            width={30}
                            height={30}
                            className="img-profile"
                        />

                        <span>u/charlotteG</span>
                    </Link>

                    <Link href='#' className="flex align-center justify-start text-color w-full bg-hover">
                        <Image
                            src={'/images/perfil.jpg'}
                            alt="img-profile"
                            width={30}
                            height={30}
                            className="img-profile"
                        />

                        <span>u/charlotteG</span>
                    </Link>

                    <Link href='#' className="flex align-center justify-start text-color w-full bg-hover">
                        <Image
                            src={'/images/perfil.jpg'}
                            alt="img-profile"
                            width={30}
                            height={30}
                            className="img-profile"
                        />

                        <span>u/charlotteG</span>
                    </Link>

                    <Link href='#' className="flex align-center justify-start text-color w-full bg-hover">
                        <Image
                            src={'/images/perfil.jpg'}
                            alt="img-profile"
                            width={30}
                            height={30}
                            className="img-profile"
                        />

                        <span>u/charlotteG</span>
                    </Link>

                    <Link href='#' className="flex align-center justify-start text-color w-full bg-hover">
                        <Image
                            src={'/images/perfil.jpg'}
                            alt="img-profile"
                            width={30}
                            height={30}
                            className="img-profile"
                        />

                        <span>u/charlotteG</span>
                    </Link>
                </AccordionDetails>
            </Accordion>

            <hr />
        </aside>
    )
}