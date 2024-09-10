'use client';

import { useForm, SubmitHandler } from "react-hook-form";
import { LoginType } from "@/src/types";
import type { FormsSessionProps } from "@/src/types/components-props";
import firebase from "@/src/firebase/firebase";

export default function FormLogin({ select, setFormRegister, blur, setErrorSubmit, setExito, errorSubmit, setFormModal }: FormsSessionProps) {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginType>();

    const onSubmit: SubmitHandler<LoginType> = async (data) => {
        try {
            await firebase.login(data);

            if(setFormModal) setFormModal(false);
        } catch (error: any) {
            if(error.message.includes('auth/invalid-credential')) setErrorSubmit('Correo o contraseña incorrecta*');

            if(error.message.includes('Access to this')) setErrorSubmit('Error - intentelo mas tarde');

            setTimeout(() => {
                setErrorSubmit('');
            }, 3000)
        }
    }

    return ( 
        <>
            <h3>Iniciar Sesion</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/*esta etiqueta me ayuda a corregir el error al cambiar de formulario, donde los valores de los inputs se mezclaban, por eso el otro formulario de registro no tiene esta etiqueta 'fieldset'...*/}
                <fieldset>
                    <div className="bg-input relative">
                        <label htmlFor="email-s" className="email-s absolute">Correo electronico <span>*</span></label>
                        <input 
                            type="email" 
                            className="relative w-full"
                            {...register("email", {
                                required: true,
                                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                            })} 
                            onBlur={blur}
                            onSelect={select} 
                            id="email-s"
                            autoComplete="off" 
                        />

                        {errors.email && <span className="error-input">Email obligatorio*</span>}
                    </div>

                    <div className="bg-input relative">
                        <label htmlFor="password-s" className="password-s absolute">Contraseña <span>*</span></label>
                        <input 
                            type="password" 
                            className="relative w-full"
                            {...register('password', {
                                required: true
                            })} 
                            onBlur={blur}
                            onSelect={select} 
                            id="password-s"
                            autoComplete="off"  
                        />

                        {errors.password && <span className="error-input">Contraseña obligatoria*</span>}
                    </div>
                </fieldset>

                <p>¿Es tu primera vez en Group 4? <span className="pointer" onClick={() => setFormRegister(true)}>Registrate</span></p>

                <div className="action-container relative text-center">
                    {errorSubmit !== '' && <span className="error-submit absolute w-full">{errorSubmit}</span>}

                    <button type="submit" className="btn-submit w-full">Inciar Sesion</button>
                </div>
            </form>
        </>
    )
}
