'use client';

import { useContext, useEffect, useState } from "react";

import { GlobalContext } from "@/src/app/providers";
import { FormLogin, FormRegister } from '@/src/components/forms';

import { Close } from "@mui/icons-material";

export default function FormSesion() {
    const [formRegister, setFormRegister] = useState(false);
    const { setFormModal, user, setRefresh } = useContext(GlobalContext);

    const [succes, setSucces] = useState(false);
    const [errorSubmit, setErrorSubmit] = useState<string>('')

    useEffect(() => {
        if (succes && user) {
            setSucces(false);

            setRefresh({refresh: true, redirectTo: `/u/${user.displayName}`})

            setFormModal(false);
        }
    }, [succes, setFormModal, user])

    const closeLoginModal = (e: React.MouseEvent<HTMLElement>): void => {
        const target = e.target as HTMLElement;

        //Thanks to the icon this gives an error, better a dataset to avoid so much validation...
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
                        setSucces={setSucces}
                        errorSubmit={errorSubmit}
                        setErrorSubmit={setErrorSubmit}
                        setFormModal={setFormModal}
                    />
                ) : (
                    <FormRegister
                        select={select}
                        setFormRegister={setFormRegister}
                        blur={blur}
                        setSucces={setSucces}
                        errorSubmit={errorSubmit}
                        setErrorSubmit={setErrorSubmit}
                    />
                )}
            </div>
        </div>
    )
}
