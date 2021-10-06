import RenderFile from '@components/RenderFile';
import axios from 'axios';
import { IFile } from 'libs/types';
import { GetServerSidePropsContext, NextPage } from 'next';
import React from 'react';
import Button from '@components/Reusable/Button';
import fileDownload from 'js-file-download';

const DownloadPage: NextPage<{ file: IFile }> = ({ file: { format, name, sizeInBytes, id } }) => {
    const handleDownload = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_SERVER_API}api/files/${id}/download`, {
            responseType: "blob"
        });
        fileDownload(data, name);
    }

    return (
        <div className="flex flex-col items-center justify-center py-3 space-y-4 bg-gray-800 rounded-md shadow-xl w-96">
            {!id ? <span>Oops! File does not exist</span> : (
                <>
                    <img
                        src="/images/file-download.png"
                        alt=""
                        className="w-16 h-16" />
                    <h1 className="text-xl">Your file is ready to be downloaded</h1>
                    <RenderFile file={{ format, name, sizeInBytes }} />
                    <Button
                        text="Download"
                        onClick={handleDownload} />
                </>
            )}
        </div>
    )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
    const { id } = context.query;
    let file;

    try {
        const { data } = await axios.get(`${process.env.REACT_APP_SERVER_API}api/files/${id}`);
        console.log(data);
        file = data;
    } catch (error) {
        console.log(error.response.data);
        file = {

        };
    }

    return {
        props: {
            file
        }
    }
}

export default DownloadPage
