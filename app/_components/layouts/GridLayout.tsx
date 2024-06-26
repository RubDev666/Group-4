'use client';

import { useContext } from "react";
import { usePathname } from "next/navigation";

import { GlobalContext } from "@/app/(global-pages)/providers";

import AsideLeft from "./AsideLeft";
import ImgHero from "./ImgHero";
import AsideRight from "./AsideRight";
import FormSesion from "../forms/FormSesion";
 
export default function GridLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const {setNavModal} = useContext(GlobalContext);

    const path = usePathname();

    return ( 
        <div className="grid-layout">
            <FormSesion />

            <div className="bg-modal nav-modal w-full flex" onClick={() => setNavModal(false)}></div>

            <AsideLeft />

            {path === '/' && <ImgHero />}

            <main>
                {children}
            </main>

            <AsideRight />
        </div>
    )
}
