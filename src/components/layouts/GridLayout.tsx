'use client';

import { useContext } from "react";
import { usePathname } from "next/navigation";

import { GlobalContext } from "@/src/app/providers";

import AsideLeft from "./AsideLeft";
import ImgHero from "./ImgHero";
import AsideRight from "./AsideRight";
import FormSesion from "../forms/FormSesion";
import { Spinner } from "../ui";
 
export default function GridLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const {setNavModal, loadingData, fetchError} = useContext(GlobalContext);

    const path = usePathname();

    return ( 
        <div className="grid-layout">
            <FormSesion />

            <div className="bg-modal nav-modal w-full flex" onClick={() => setNavModal(false)}></div>

            <AsideLeft />

            {path === '/' && <ImgHero />}

            <main>
                {loadingData && <Spinner />}

                {fetchError && <p>server error, reload the page or try again later...</p> }

                {(!loadingData && !fetchError) && (
                    <>
                        {children}
                    </>
                )}
            </main>

            <AsideRight />
        </div>
    )
}
