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
    const {setNavModal, loading, fetchError} = useContext(GlobalContext);

    const path = usePathname();

    return ( 
        <div className="grid-layout">
            <FormSesion />

            <div className="bg-modal nav-modal w-full flex" onClick={() => setNavModal(false)}></div>

            <AsideLeft />

            {path === '/' && <ImgHero />}

            <main>
                {loading && <Spinner />}

                {fetchError && <p>Error en el servidor, recargar la pagina o intentelo mas tarde...</p> }

                {(!loading && !fetchError) && (
                    <>
                        {children}
                    </>
                )}
            </main>

            <AsideRight />
        </div>
    )
}
