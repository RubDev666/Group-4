'use client';

import Image from "next/image";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Collections } from "@mui/icons-material";

import type { DZProps } from "@/src/types/components-props";

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

            //important code to show a preview image to the user, just get the input file and then pass it to this url and then place it in the image tag and that's it!!!!!
            const url = URL.createObjectURL(acceptedFiles[0]);

            setPreviewImg(url);
            setErrorImg('');
        }
    }, [getImg, setErrorImg]);

    const maxSize = true ? 1000000000000 : 1000000;

    //extract Dropzone content
    const {
        fileRejections,
        getRootProps,
        getInputProps,
        isDragActive,
        acceptedFiles
    } = useDropzone({ onDropAccepted, onDropRejected, accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] }, maxSize });

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
                            alt="img-preview"
                            priority
                        />
                    ) : (
                        <Image
                            src={previewImg}
                            fill
                            alt="img-preview"
                            priority
                        />
                    )}
                </div>
            ) : (
                <div {...getRootProps({ className: 'dropzone w-full bg-input all-center' })}>
                    <input {...getInputProps()} />

                    {isDragActive ? (
                        <p>Drop image to upload</p>
                    ) : (
                        <div className="instructions-container">
                            <p>Drag and drop an image or click here to choose one</p>

                            <Collections className="icon" />
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}