import firebaseConfig from './config';

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, User, Auth, sendEmailVerification } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, FirebaseStorage } from 'firebase/storage';
import { getFirestore, collection, getDocs, orderBy, query, deleteDoc, doc, getDoc, updateDoc, DocumentData, setDoc, Firestore } from 'firebase/firestore';

import { RegisterType, UserDbType, LoginType, PostTypes, CreatePostArg, AllPostsType, updatePostParams, EditPost, PopularUsers } from '../_types';
import getDateRegister from '../_utilities/getDateRegister';
import getRandomColor from '../_utilities/getRandomColor';

import { v4 as generateId } from 'uuid';

class Firebase {
    auth: Auth | undefined;
    storage: FirebaseStorage | undefined;
    db: Firestore | undefined;

    constructor() {
        if (initializeApp) {
            const app = initializeApp(firebaseConfig);

            this.auth = getAuth(app);
            this.storage = getStorage(app);
            this.db = getFirestore(app);
        }
    }

    //registrar usuario
    async registrar(data: RegisterType) {
        if (!this.auth || !this.db) throw new Error('Fallo la conexion, intentelo mas tarde*');

        const { name, email, password } = data;

        const nameUserVerified = await this.getData('usuarios', name.replace(/ /g, ""));

        if (nameUserVerified) throw new Error('El nombre de usuario ya esta en uso*');

        const res = await createUserWithEmailAndPassword(this.auth, email, password);

        if (this.auth.currentUser) await updateProfile(this.auth.currentUser, { displayName: name.replace(/ /g, ""), photoURL: getRandomColor() });

        if (this.auth.currentUser) sendEmailVerification(this.auth.currentUser)
            .then(() => {
                // Email verification sent!
                // ...
                console.log('email enviado');
            });

        const newUser: UserDbType = {
            uid: res.user.uid,
            displayName: res.user.displayName,
            photoURL: res.user.photoURL,
            dateRegister: getDateRegister()
        }

        const popularData: PopularUsers = {
            uid: res.user.uid,
            totalCommentsReceived: 0,
            totalLikesReceived: 0
        }

        if (res.user.displayName) {
            await setDoc(doc(this.db, "usuarios", res.user.displayName), newUser);

            await setDoc(doc(this.db, 'popularUsers', res.user.uid), popularData)
        }
    }

    cerrarSesion = async () => {
        if (this.auth) await signOut(this.auth);
    }

    login = async (datos: LoginType) => {
        if (this.auth) await signInWithEmailAndPassword(this.auth, datos.email, datos.password);
    }

    async updateProfileImg(img: File, user: User) {
        if (!this.auth) return;
        if (!this.db) return;
        if (!this.auth.currentUser) return;

        //obtener url y actualizar el perfil del usuario
        const urlImg = await this.uploadImg(`images/profiles/${user.uid}`, img)

        await updateProfile(this.auth.currentUser, { photoURL: urlImg });

        //actualizar la base de datos con el usuario
        if (user.displayName) {
            const referencia = doc(this.db, "usuarios", user.displayName);
            await updateDoc(referencia, { photoURL: urlImg })
        }
    }

    async updateUserName(name: string, usuario: User) {
        if (!this.auth || !this.db) throw new Error('Fallo la conexion, intentelo mas tarde*');

        const nameUserVerified = await this.getData('usuarios', name);
        if (nameUserVerified) throw new Error('El nombre de usuario ya esta en uso*');

        let datosActuales;

        if (usuario.displayName) datosActuales = await this.getData('usuarios', usuario.displayName);

        //actualizar el usuario de la base de datos
        if (datosActuales) {
            const updateUser: UserDbType = {
                uid: datosActuales.uid,
                displayName: name,
                photoURL: datosActuales.photoURL,
                dateRegister: datosActuales.dateRegister
            }

            //crea un nuevo registro con el resto de los datos anteriores conservados
            await setDoc(doc(this.db, "usuarios", name), updateUser);

            //elimina el anterior registro, lo hago de esta forma para que las busquedas de usuario en la base de datos sea mas rapido y no iterar uno por uno con el id...
            await deleteDoc(doc(this.db, "usuarios", datosActuales.displayName));
        }

        //actualizar el nombre del perfil
        if (this.auth.currentUser) await updateProfile(this.auth.currentUser, { displayName: name });
    }

    async createPost({ title, description, imgFile, user }: CreatePostArg): Promise<string> {
        const idPost = generateId();

        let imgUrl: string | null = null;

        if (imgFile) imgUrl = await this.uploadImg(`images/post/${idPost}`, imgFile);

        const newPost: PostTypes = {
            id: idPost,
            idUser: user.uid,
            date: Date.now(),
            title,
            description,
            imgUrl,
            likes: [],
            comments: []
        }

        if (this.db) await setDoc(doc(this.db, "posts", idPost), newPost);

        return idPost;
    }

    //guardar la imagen para post o foto de perfil en la base de datos
    async uploadImg(ubicacion: string, img: File): Promise<string> {
        if (!this.storage) throw new Error('Fallo la conexion, intentelo mas tarde*');

        const storageRef = ref(this.storage, ubicacion);
        await uploadBytes(storageRef, img);

        //obtener url y actualizar el perfil del usuario
        const urlImg = await getDownloadURL(storageRef).then((url) => url);

        return urlImg;
    }

    //extraer un solo dato en especifico de la base de datos, ya sea un post o un usuario en especifico.
    async getData(ref: string, idData: string): Promise<DocumentData | null> {
        if (!this.db) return null;

        const docRef = doc(this.db, ref, idData);
        const docSnap = await getDoc(docRef);

        let datos: DocumentData | null;

        if (docSnap.exists()) {
            datos = docSnap.data();
        } else {
            datos = null
        }

        return datos;
    }

    async getAllPosts(): Promise<AllPostsType[] | []> {
        if (!this.db) return [];

        const refPosts = query(collection(this.db, "posts"), orderBy('date', 'desc'));
        const resPosts = await getDocs(refPosts);

        const refUsers = query(collection(this.db, 'usuarios'));
        const resUsers = await getDocs(refUsers);

        let posts: AllPostsType[] | [] = [];

        resPosts.forEach((post) => {
            resUsers.forEach((user) => {
                if (post.data().idUser === user.data().uid) {
                    const newObj: AllPostsType = {
                        usuario: user.data(),
                        posts: post.data()
                    }

                    posts = [...posts, newObj]
                }
            })
        })

        return posts;
    }

    async getAllUsers(): Promise<DocumentData[] | []> {
        if (!this.db) return [];

        const refUsers = query(collection(this.db, 'usuarios'));
        const resUsers = await getDocs(refUsers);

        let users: DocumentData[] | [] = [];

        resUsers.forEach((user) => users = [...users, user.data()])

        return users;
    }

    //agrega o actualiza comentarios o respuestas a la vez
    //es mas facil reemplazar todo el arreglo que buscar en especifico...
    //tambien actualizamos los likes del post
    async updatePost({ idPost, key, newData, currentData, idCreator }: updatePostParams) {
        if (!this.db) return;

        if ((key === 'likes') && (currentData !== undefined && idCreator !== undefined)) {
            const creator = await this.getData('popularUsers', idCreator);
            let newTotal = 0;

            if (creator) {
                const currentTotalLikes = creator.totalLikesReceived;

                if (currentTotalLikes > 0) newTotal = (currentTotalLikes - currentData) + newData.length;

                if (currentTotalLikes === 0) newTotal = currentTotalLikes + newData.length;

                await updateDoc(doc(this.db, "popularUsers", idCreator), { totalLikesReceived: newTotal });
            }
        }

        await updateDoc(doc(this.db, "posts", idPost), { [key]: newData });
    }

    async editPost({ title, description, imgUrl, idPost, deleteImg }: EditPost) {
        if (!this.db || !this.storage) return;

        let img: string | null = null;

        //para subir una imagen nueva o reemplazarla del post
        if (typeof imgUrl !== 'string' && imgUrl !== null) img = await this.uploadImg(`images/post/${idPost}`, imgUrl);

        //borrar imagen de un post
        if (deleteImg) await deleteObject(ref(this.storage, `images/post/${idPost}`));

        await updateDoc(doc(this.db, "posts", idPost), {
            title,
            description,
            imgUrl: img !== null ? img : imgUrl
        });
    }

    deletePost = async (idPost: string) => {
        if (this.db) await deleteDoc(doc(this.db, "posts", idPost));
    }

    async getPopularUsers(): Promise<DocumentData[]> {
        if (!this.db) return [];

        const ref = query(collection(this.db, 'popularUsers'));
        const getData = await getDocs(ref);

        const usersDB = await this.getAllUsers();

        let populars: DocumentData[] = [];
        getData.forEach((data) => populars = [...populars, data.data()]);
        populars.sort((a, b) => b.totalLikesReceived - a.totalLikesReceived);

        let popularUsers: DocumentData[] = [];

        for (let i = 0; i < 5; i++) {
            if (!populars[i]) break;

            for (let user of usersDB) {
                if (user.uid === populars[i].uid) popularUsers = [...popularUsers, user];
            }
        }

        return popularUsers;
    }
}

const firebase = new Firebase();

export default firebase;