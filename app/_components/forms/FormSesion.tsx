'use client';

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/app/(global-pages)/providers";
import { FormLogin, FormRegister } from '@/app/_components/forms';
import useAutenticacion from "@/app/_hooks/useAuthUser";

import { Close } from "@mui/icons-material";

export default function FormSesion() {
    const [formRegister, setFormRegister] = useState(false);
    const { setFormModal } = useContext(GlobalContext);

    const [exito, setExito] = useState(false);
    const [errorSubmit, setErrorSubmit] = useState<string>('')

    const usuario = useAutenticacion();

    const router = useRouter();

    useEffect(() => {
        if (exito && usuario) {
            setExito(false);

            setFormModal(false);

            router.push(`/u/${usuario.displayName}`);
        }
    }, [exito, router, setFormModal, usuario])

    const closeLoginModal = (e: React.MouseEvent<HTMLElement>): void => {
        const target = e.target as HTMLElement;

        //gracias al icono esto da error, mejor un data-set para evitar tanta validacion...
        //console.log(target.className.includes('login-modal'));

        if (!target.dataset.set) return;

        setFormModal(false);
    }

    const select = (e: React.FocusEvent<HTMLInputElement>): void => document.querySelector(`${'.' + e.target.id}`)?.classList.add('active');

    const blur = (e: React.FocusEvent<HTMLInputElement>): void => {
        if (e.target.value !== '') return;

        document.querySelector(`${'.' + e.target.id}`)?.classList.remove('active');
    }

    return (
        <div className="bg-modal login-modal w-full none" onClick={closeLoginModal} data-set='modal'>
            <div className="form-container bg-color relative w-full">
                <button className="all-center pointer bg-hover absolute btn-close" onClick={() => setFormModal(false)}>
                    <Close className="icon" />
                </button>

                {!formRegister ? (
                    <FormLogin
                        select={select}
                        setFormRegister={setFormRegister}
                        blur={blur}
                        setExito={setExito}
                        errorSubmit={errorSubmit}
                        setErrorSubmit={setErrorSubmit}
                        setFormModal={setFormModal}
                    />
                ) : (
                    <FormRegister
                        select={select}
                        setFormRegister={setFormRegister}
                        blur={blur}
                        setExito={setExito}
                        errorSubmit={errorSubmit}
                        setErrorSubmit={setErrorSubmit}
                    />
                )}
            </div>
        </div>
    )
}
