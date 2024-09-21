'use client';

import { ReactNode, useState, useEffect, useContext } from "react";
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

import { TopicIcon, topicIcons } from "@/src/utilities/asideLeftItems";

import { AvatarImg } from "../ui";
import { DocumentData } from "firebase/firestore";

import firebase from "@/src/firebase/firebase";
import { GlobalContext } from "@/src/app/providers";

import AccordionPopulars from "./AccordionPopulars";

export default function AsideLeft() {
    const [showMoreTopics, setShowTopics] = useState(false);
    const [recentActivity, setRecentActivity] = useState<DocumentData>([]);

    const path = usePathname();
    
    const { user } = useContext(GlobalContext);

    useEffect(() => {
        if(user) fetchRecentActivity(user.uid);
        if(!user) setRecentActivity([]);
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

                <span>Main</span>
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
                            className="accordion-title"
                        >
                            Recent
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

            <div className="accordion-populars">
                <AccordionPopulars />

                <hr />
            </div>

            <Accordion className='w-full text-color acordeon' defaultExpanded sx={{ backgroundColor: 'transparent', boxShadow: 'none', "::before": { display: 'none' } }}>
                <AccordionSummary
                    expandIcon={<ExpandMore className='icon-expanded' />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    className="accordion-title"
                >
                    Topics
                </AccordionSummary>

                <AccordionDetails className='acordeon-items-container' sx={{ padding: '0' }}>
                    {topicIcons.map((topic: TopicIcon, index: number): ReactNode => {
                        if (index > 5 && !showMoreTopics) return;

                        return (
                            <Link key={topic.title} href={topic.path} className={`flex align-center justify-start text-color w-full bg-hover ${path === topic.path ? 'bg-path' : ''}`}>
                                {topic.iconPath && path === topic.path ? (
                                    <topic.iconPath className="icon icon-path" />
                                ) : (<topic.icon className="icon icon-path" />)}

                                <span>{topic.title}</span>
                            </Link>
                        )
                    })}

                    <button onClick={() => setShowTopics(!showMoreTopics)} className="btn-view bg-hover pointer">{!showMoreTopics ? 'See more...' : 'See less'}</button>
                </AccordionDetails>
            </Accordion>

            <hr />

            <Accordion className='w-full text-color acordeon' defaultExpanded sx={{ backgroundColor: 'transparent', boxShadow: 'none', "::before": { display: 'none' } }}>
                <AccordionSummary
                    expandIcon={<ExpandMore className='icon-expanded' />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    className="accordion-title"
                >
                    Resources
                </AccordionSummary>

                <AccordionDetails className='acordeon-items-container' sx={{ padding: '0' }}>
                    <Link href='#' className="flex align-center justify-start text-color w-full bg-hover">
                        <Info className="icon icon-path" />

                        <span>About Group 4</span>
                    </Link>
                </AccordionDetails>
            </Accordion>

            <hr />

            <p>Created by <span>Rub</span>Developer © {new Date().getFullYear()}</p>
        </aside>
    )
}