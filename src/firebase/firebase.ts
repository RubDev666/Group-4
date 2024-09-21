import firebaseConfig from './config';

import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, User, Auth, sendEmailVerification } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, FirebaseStorage } from 'firebase/storage';
import { getFirestore, collection, getDocs, orderBy, query, deleteDoc, doc, getDoc, updateDoc, DocumentData, setDoc, Firestore } from 'firebase/firestore';

import { RegisterType, UserDbType, LoginType, PostTypes, CreatePostArg, AllPostsType, updatePostParams, EditPost, PopularUsers, AllUsersFetch } from '../types';

import { getDateRegister, getRandomColor, CONECTION_ERROR_MESSAGE, USERNAME_EXIST_ERROR_MESSAGE } from './utils';

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
    async registerUser(data: RegisterType) {
        if (!this.auth || !this.db) throw new Error(CONECTION_ERROR_MESSAGE);

        const { name, email, password } = data;
        const cleanName = name.replace(/ /g, "");

        const nameUserVerified = await this.getData('users', cleanName);

        if (nameUserVerified) throw new Error(USERNAME_EXIST_ERROR_MESSAGE);

        const res = await createUserWithEmailAndPassword(this.auth, email, password);

        const currentUser = this.auth.currentUser;

        if (currentUser) {
            await updateProfile(currentUser, { displayName: cleanName, photoURL: getRandomColor() });

            sendEmailVerification(currentUser)
                .then(() => {
                    // Email verification sent!
                    // ...
                    console.log('email sent');
                });
        }

        const newUser: UserDbType = {
            uid: res.user.uid,
            displayName: res.user.displayName,
            photoURL: res.user.photoURL,
            dateRegister: getDateRegister()
        }

        if (res.user.displayName) await setDoc(doc(this.db, "users", res.user.displayName), newUser);
    }

    logOut = async () => {
        if (this.auth) await signOut(this.auth);
    }

    signIn = async (data: LoginType) => {
        if (this.auth) await signInWithEmailAndPassword(this.auth, data.email, data.password);
    }

    async updateProfileImg(img: File, user: User) {
        if (!this.auth || !this.db || !this.auth.currentUser) return;

        //get url and update user profile
        const urlImg = await this.uploadImg(`images/profiles/${user.uid}`, img);

        await updateProfile(this.auth.currentUser, { photoURL: urlImg });

        //update database with user
        if (user.displayName) await updateDoc(doc(this.db, "users", user.displayName), { photoURL: urlImg });
    }

    async updateUserName(newName: string, user: User) {
        if (!this.auth || !this.db) throw new Error(CONECTION_ERROR_MESSAGE);

        const nameUserVerified = await this.getData('users', newName);
        if (nameUserVerified) throw new Error(USERNAME_EXIST_ERROR_MESSAGE);

        let currentData;

        if (user.displayName) currentData = await this.getData('users', user.displayName);

        //update database user
        if (currentData) {
            const updateUser: UserDbType = {
                uid: currentData.uid,
                displayName: newName,
                photoURL: currentData.photoURL,
                dateRegister: currentData.dateRegister
            }

            //creates a new record with the rest of the previous data preserved
            await setDoc(doc(this.db, "users", newName), updateUser);

            //delete previous record, I do it this way so that user searches in the database are faster and not iterate one by one with the id...
            await deleteDoc(doc(this.db, "users", currentData.displayName));
        }

        //update profile name
        if (this.auth.currentUser) await updateProfile(this.auth.currentUser, { displayName: newName });
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

    //save image for "posts" or "profile image" to database
    async uploadImg(location: string, img: File): Promise<string> {
        if (!this.storage) throw new Error(CONECTION_ERROR_MESSAGE);

        const storageRef = ref(this.storage, location);
        await uploadBytes(storageRef, img);

        //get url y update user profile
        const urlImg = await getDownloadURL(storageRef).then((url) => url);

        return urlImg;
    }

    //extract a single specific piece of data from the database, whether it is a post or a specific user.
    async getData(ref: string, idData: string): Promise<DocumentData | null> {
        if (!this.db) return null;

        const docSnap = await getDoc(doc(this.db, ref, idData));

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null
        }
    }

    async getAllPosts(): Promise<AllPostsType[]> {
        if (!this.db) return [];

        const resPosts = await getDocs(query(collection(this.db, "posts"), orderBy('date', 'desc')));
        const usersMap = await this.getAllUsers();

        if(!usersMap) return [];

        const getData = resPosts.docs.map(post => {
            const postData = post.data();
            const user = usersMap.get(postData.idUser);
        
            return user ? { user, posts: postData } : null;
        }).filter(post => post !== null);
        
        return getData;
    }

    async getAllUsers(): Promise<AllUsersFetch> {
        if (!this.db) return null;

        const refUsers = query(collection(this.db, 'users'));
        const resUsers = await getDocs(refUsers);

        const users = resUsers.docs.map(user => user.data());

        const usersMap = new Map(users.map(user => [user.uid, user]));

        return usersMap;
    }

    //add or update comments or responses at the same time
    //it is easier to replace the entire array than to search specifically...
    //we also update the likes of the post
    async updatePost({ idPost, key, newData, currentData, idCreator }: updatePostParams) {
        if (!this.db) return;

        if ((key === 'likes') && (currentData !== undefined && idCreator !== undefined)) {
            const creator = await this.getData('popularUsers', idCreator);

            if (creator) {
                const currentTotalLikes = creator.totalLikesReceived || 0;
                const newTotal = currentTotalLikes > 0 ? (currentTotalLikes - currentData) + newData.length : newData.length;
    
                await updateDoc(doc(this.db, "popularUsers", idCreator), { totalLikesReceived: newTotal });
            }
        }

        await updateDoc(doc(this.db, "posts", idPost), { [key]: newData });
    }

    async editPost({ title, description, imgUrl, idPost, deleteImg }: EditPost) {
        if (!this.db || !this.storage) return;

        let img: string | null = null;

        //to upload a new image or replace it in the post
        if (imgUrl && typeof imgUrl !== 'string') img = await this.uploadImg(`images/post/${idPost}`, imgUrl);

        //delete image from a post
        if (deleteImg) await deleteObject(ref(this.storage, `images/post/${idPost}`));

        await updateDoc(doc(this.db, "posts", idPost), {
            title,
            description,
            imgUrl: img || imgUrl
        });
    }

    deletePost = async (idPost: string) => {
        if (this.db) await deleteDoc(doc(this.db, "posts", idPost));
    }

    async createPopularUser(uid: string) {
        if (!this.db) return;

        const allPosts = await this.getAllPosts();

        const getTotalLikes = allPosts
            .filter(data => data.user.uid === uid)
            .reduce((total, data) => data.posts.likes.length + total, 0)

        const popularData: PopularUsers = {
            uid: uid,
            totalCommentsReceived: 0,
            totalLikesReceived: getTotalLikes
        }

        await setDoc(doc(this.db, 'popularUsers', uid), popularData);
    }

    async getPopularUsers(): Promise<DocumentData[]> {
        if (!this.db) return [];

        const ref = query(collection(this.db, 'popularUsers'));
        const getData = await getDocs(ref);

        const usersMap= await this.getAllUsers();

        if(!usersMap) return [];

        const getAndOrderPopularUsers = getData.docs
            .map(doc => doc.data())
            .sort((a, b) => b.totalLikesReceived - a.totalLikesReceived)
            .slice(0, 5);

        const popularUsers = getAndOrderPopularUsers
            .map(popular => usersMap.get(popular.uid))
            .filter(user => user !== undefined);

        return popularUsers;
    }

    async getRecentActivity(uid: string) {
        const getActivity = await firebase.getData('recentActivity', uid);

        if(!getActivity) return [];

        const usersMap = await this.getAllUsers();
        if(!usersMap) return;

        const recentActivity = [...getActivity.users]
            .map((user) => usersMap.get(user))
            .filter(user => user !== undefined);

        return recentActivity;
    } 

    async setRecentActivity(idCreator: string, uid: string, currentData: string[]) {
        if(!this.db) return;

        let indexUser = currentData.indexOf(idCreator);

        if(currentData.length === 5 && indexUser === -1) currentData.pop();
        if(indexUser >= 0) currentData.splice(indexUser, 1);

        let newData = [idCreator, ...currentData];

        await setDoc(doc(this.db, 'recentActivity', uid), {users: newData})
    }

    async handleRecentActivity(uid: string, idCreator: string) {
        if(!this.db) return;

        const activity = await this.getData('recentActivity', uid);

        if(!activity) {
            await setDoc(doc(this.db, 'recentActivity', uid), {users: [idCreator]});
        } else {
            await this.setRecentActivity(idCreator, uid, activity.users);
        }
    }
}

const firebase = new Firebase();

export default firebase;