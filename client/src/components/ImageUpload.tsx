import React, { Dispatch, FC, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

const ImageUpload: FC<{ setFile: Dispatch<any> }> = ({ setFile }) => {
    const onDrop = useCallback((inputFiles) => {
        console.log(inputFiles);
        setFile(inputFiles[0]);
    }, []);

    const { getRootProps, getInputProps, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        multiple: false,
        accept: "image/jpeg, image/png, image/pd, audio/mpegf"
    });

    return (
        <div className="p-4 w-full">
            <div
                {...getRootProps()}
                className="h-80 w-full rounded-md cursor-pointer focus:outline-none">
                <input {...getInputProps()} />
                <div className={
                    "flex flex-col items-center justify-center border-2 border-dashed border-yellow-light rounded-xl space-y-3 h-full"
                    + (isDragReject === true ? "border-red-500" : "")
                    + (isDragAccept === true ? "border-green-500" : "")
                }>
                    <img src="/images/folder.png" alt="folder" className="w-16 h-16" />
                    {
                        isDragReject
                            ? <p>Sorry, your file is not supported</p>
                            : (
                                <>
                                    <p>Darg & Drop Files Here</p>
                                    <p className="mt-2 text-base text-gray-300">Only jpeg, png, pdf & mp3 files supported</p>
                                </>
                            )
                    }
                </div>
            </div>
        </div>
    )
}

export default ImageUpload
