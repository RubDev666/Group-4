'use client';

import { useEffect, useState } from 'react';

import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebase/config';
import { User, getAuth, onAuthStateChanged } from "firebase/auth";

function useAutenticacion() {
    const [ usuarioAutenticado, guardarUsuarioAutenticado] = useState<User | null>(null);

    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        const unsuscribe = onAuthStateChanged(auth, (user) => guardarUsuarioAutenticado(user));

        return () => unsuscribe();
    }, []);

    return usuarioAutenticado;
}

export default useAutenticacion;
