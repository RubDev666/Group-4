'use client';

import { useContext } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import firebase from "@/src/firebase/firebase";
import { RegisterType, FormsSessionProps } from "@/src/types";

import { GlobalContext } from "@/src/app/providers";

export default function FormRegister({ select, setFormRegister, blur, setExito, setErrorSubmit, errorSubmit }: FormsSessionProps) {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterType>();

    const {getPosts} = useContext(GlobalContext);

    const onSubmit: SubmitHandler<RegisterType> = async (data) => {
        if(data.password !== data.confirmPassword) return;
 
        try {
            await firebase.registrar(data);

            getPosts();
            setExito(true);
        } catch (error: any) {
            if(error.message.includes('auth/email')) setErrorSubmit('El email ya esta en uso*');

            if(error.message.includes('nombre')) setErrorSubmit(error.message);

            setTimeout(() => {
                setErrorSubmit('');
            }, 3000)
        }
    }

    return (
        <>
            <h3>Registrate</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-input relative">
                    <label htmlFor="username" className="username absolute">Nombre de usuario <span>*</span></label>
                    <input
                        type="text"
                        className="relative w-full"
                        onSelect={select}
                        id="username" 
                        autoComplete="off"
                        {...register("name", { required: true, pattern: /[A-Za-z]{1}/, maxLength: {value: 10, message: 'Maximo 10 caracteres*'} })}
                        onBlur={blur}
                    />

                    {errors.name?.type === 'pattern' && <span className="error-input">Nombre no valido*</span>}
                    {errors.name?.type === 'required' && <span className="error-input">Nombre obligatorio*</span>}
                    {errors.name?.type === 'maxLength' && <span className="error-input">{errors.name.message}</span>}
                </div>

                <div className="bg-input relative">
                    <label htmlFor="email" className="email absolute">Correo electronico <span>*</span></label>
                    <input
                        type="email"
                        className="relative w-full"
                        onSelect={select}
                        id="email"
                        autoComplete="off"
                        {...register("email", {
                            required: "Email obligatorio",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Email No Válido'
                            }
                        })}
                        onBlur={blur}
                    />

                    {errors.email && <span className="error-input">{errors.email.message + '*'}</span>}
                </div>

                <div className="bg-input relative">
                    <label htmlFor="password" className="password absolute">Contraseña <span>*</span></label>
                    <input
                        type="password"
                        className="relative w-full"
                        onSelect={select}
                        id="password"
                        autoComplete="off"
                        {...register('password', {
                            required: 'Contraseña obligatoria*',
                            minLength: {
                                value: 6,
                                message: 'Minimo 6 caracteres*'
                            }
                        })}
                        onBlur={blur}
                    />

                    {errors.password && <span className="error-input">{errors.password.message}</span>}
                </div>
 
                <div className="bg-input relative">
                    <label htmlFor="password-confirm" className="password-confirm absolute">Confirmar contraseña <span>*</span></label>
                    <input
                        type="password"
                        className="relative w-full"
                        {...register('confirmPassword', {required: true})}
                        onBlur={blur}
                        onSelect={select}
                        id="password-confirm"
                        autoComplete="off"
                    />

                    {(watch('password') !== undefined && watch('confirmPassword') !== undefined) && (watch('confirmPassword') !== watch('password') && <span className="error-input">No coincide la contraseña*</span>)}
                </div>

                <p>¿Ya eres mienbro de Group 4? <span className="pointer" onClick={() => setFormRegister(false)}>Inicia Sesion</span></p>

                <div className="action-container relative text-center">
                    {errorSubmit !== '' && <span className="error-submit absolute w-full">{errorSubmit}</span>}

                    <button type="submit" className="btn-submit w-full pointer">Registrarse</button>
                </div>
            </form>
        </>
    )
}