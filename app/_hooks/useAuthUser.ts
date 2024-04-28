//esta es la unica forma en la que funciona el "onAuthStateChanged";

'use client';

import { useEffect, useState } from 'react';

import { initializeApp } from 'firebase/app';
import firebaseConfig from '../_firebase/config';
import { User, getAuth, onAuthStateChanged } from "firebase/auth";

function useAutenticacion() {
    const [ usuarioAutenticado, guardarUsuarioAutenticado] = useState<User | null>(null);

    useEffect(() => {
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        const unsuscribe = onAuthStateChanged(auth, (user) => {
            if( user ) {
                guardarUsuarioAutenticado(user);
            } else {
                guardarUsuarioAutenticado(null);
            }
        })

        return () => unsuscribe();
    }, []);

    return usuarioAutenticado;
}

export default useAutenticacion;
