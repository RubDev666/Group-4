'use client';

import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Collections } from "@mui/icons-material";

type DZProps = {
    getImg: Dispatch<SetStateAction<File | undefined | string>>;
    img: File | undefined | string;
    setErrorImg: Dispatch<SetStateAction<string>>;
    errorImg: string;
}

export default function Dropzone({ getImg, img, setErrorImg, errorImg }: DZProps) {
    const [previewImg, setPreviewImg] = useState<string>('');

    const onDropRejected = () => setErrorImg("Error (Max. 10Mb, 'jpeg/png')*");

    const onDropAccepted = useCallback(async (acceptedFiles: Array<File>) => {
        const formData = new FormData();

        formData.append('imgPost', acceptedFiles[0]);

        //console.log(acceptedFiles[0])

        if (acceptedFiles.length > 0) {
            //changeDrop(acceptedFiles[0])
            getImg(acceptedFiles[0]);

            //codigo clave e importante para mostrar imagen previsualizada al usuario, solo es obtener el archivo del input y luego pasarlo a esta url y luego colocarlo en etiqueta de imagen y listo!!!!!
            const url = URL.createObjectURL(acceptedFiles[0]);

            setPreviewImg(url);
            setErrorImg('');
        }
        //subirArchivo(formData, acceptedFiles[0].path);
    }, [getImg, setErrorImg]);

    //determinar el tamaño maximo de la imagen
    const maxSize = true ? 1000000000000 : 1000000;

    // Extraer contenido de Dropzone
    const {
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive, //para saber si se esta arrastrando un archivo
        acceptedFiles
    } = useDropzone({ onDropAccepted, onDropRejected, accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] }, maxSize }); //argumentos para el hook

    return (
        <div className="dropzone-container w-full bg-input">
            {errorImg !== '' && (
                <span className="error-input">{errorImg}</span>
            )}

            {img ? (
                <div className="preview-img-container w-full all-center relative">
                    {typeof img === 'string' ? (
                        <Image
                            src={img}
                            fill
                            alt="img-prueba"
                            priority
                        />
                    ) : (
                        <Image
                            src={previewImg}
                            fill
                            alt="img-prueba"
                            priority
                        />
                    )}
                </div>
            ) : (
                <div {...getRootProps({ className: 'dropzone w-full bg-input all-center' })}>
                    <input {...getInputProps()} />

                    {isDragActive ? (
                        <p>Suelta la imagen para subir</p>
                    ) : (
                        <div className="instructions-container">
                            <p>Arrastra y suelta una imagen o haz click aqui para elegir una</p>

                            <Collections className="icon" />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}