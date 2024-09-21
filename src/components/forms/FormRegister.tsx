'use client';

import { useForm, SubmitHandler } from "react-hook-form";
import firebase from "@/src/firebase/firebase";
import { RegisterType } from "@/src/types";
import type { FormsSessionProps } from "@/src/types/components-props";

export default function FormRegister({ select, setFormRegister, blur, setSucces, setErrorSubmit, errorSubmit }: FormsSessionProps) {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterType>();

    const onSubmit: SubmitHandler<RegisterType> = async (data) => {
        if(data.password !== data.confirmPassword) return;
 
        try {
            await firebase.registerUser(data);

            setSucces(true);
        } catch (error: any) {
            if(error.message.includes('auth/email')) setErrorSubmit('The email is already in use*');

            if(error.message.includes('name')) setErrorSubmit(error.message);

            setTimeout(() => {
                setErrorSubmit('');
            }, 3000)
        }
    }

    return (
        <>
            <h3>Register</h3>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-input relative">
                    <label htmlFor="username" className="username absolute">User name <span>*</span></label>
                    <input
                        type="text"
                        className="relative w-full"
                        onSelect={select}
                        id="username" 
                        autoComplete="off"
                        {...register("name", { required: true, pattern: /[A-Za-z]{1}/, maxLength: {value: 10, message: 'Max. 10 chars.*'} })}
                        onBlur={blur}
                    />

                    {errors.name?.type === 'pattern' && <span className="error-input">Invalid name*</span>}
                    {errors.name?.type === 'required' && <span className="error-input">Name required*</span>}
                    {errors.name?.type === 'maxLength' && <span className="error-input">{errors.name.message}</span>}
                </div>

                <div className="bg-input relative">
                    <label htmlFor="email" className="email absolute">Email <span>*</span></label>
                    <input
                        type="email"
                        className="relative w-full"
                        onSelect={select}
                        id="email"
                        autoComplete="off"
                        {...register("email", {
                            required: "Email required",
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email'
                            }
                        })}
                        onBlur={blur}
                    />

                    {errors.email && <span className="error-input">{errors.email.message + '*'}</span>}
                </div>

                <div className="bg-input relative">
                    <label htmlFor="password" className="password absolute">Password <span>*</span></label>
                    <input
                        type="password"
                        className="relative w-full"
                        onSelect={select}
                        id="password"
                        autoComplete="off"
                        {...register('password', {
                            required: 'Password required*',
                            minLength: {
                                value: 6,
                                message: 'Min. 6 chars.*'
                            }
                        })}
                        onBlur={blur}
                    />

                    {errors.password && <span className="error-input">{errors.password.message}</span>}
                </div>
 
                <div className="bg-input relative">
                    <label htmlFor="password-confirm" className="password-confirm absolute">Confirm password <span>*</span></label>
                    <input
                        type="password"
                        className="relative w-full"
                        {...register('confirmPassword', {required: true})}
                        onBlur={blur}
                        onSelect={select}
                        id="password-confirm"
                        autoComplete="off"
                    />

                    {(watch('password') !== undefined && watch('confirmPassword') !== undefined) && (watch('confirmPassword') !== watch('password') && <span className="error-input">Password does not match*</span>)}
                </div>

                <p>Are you already a member of group 4? <span className="pointer" onClick={() => setFormRegister(false)}>Sign in</span></p>

                <div className="action-container relative text-center">
                    {errorSubmit !== '' && <span className="error-submit absolute w-full">{errorSubmit}</span>}

                    <button type="submit" className="btn-submit w-full pointer">Register</button>
                </div>
            </form>
        </>
    )
}