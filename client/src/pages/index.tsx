import { useState } from 'react';
import axios from 'axios';
import ImageUpload from '@components/ImageUpload';
import RenderFile from '@components/RenderFile';
import DownloadFile from '@components/DownloadFile';
import EmailFrom from '@components/EmailForm';
import Button from '@components/Reusable/Button';

const Home = () => {
  const [file, setFile] = useState(null);
  const [id, setId] = useState(null);
  const [downloadPageLink, setDownloadPageLink] = useState(null);
  const [uploadState, setUploadState] = useState<"Uploading" | "Upload Failed" | "Uploaded" | "Upload">("Upload");

  const handleUpload = async () => {
    if (uploadState === "Uploading") return;

    // upload file
    const formData = new FormData();
    formData.append("myFile", file);
    try {
      const { data } = await axios({
        method: "POST",
        data: formData,
        url: 'api/files/upload',
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      // @ts-ignore
      setDownloadPageLink(data.downloadPageLink);
      // @ts-ignore
      setId(data.id);
    } catch (error) {
      console.log(error.response.data);
      setUploadState("Upload Failed");
    }
  }

  const handleReset = () => {
    setFile(null);
    setDownloadPageLink(null);
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="my-4 text-3xl font-medium">Got a file? Share It Like Fake News!</h1>
      <div className="w-96 flex flex-col items-center bg-gray-800 shadow-xl w-96 rounded-xl justify-center">
        {!downloadPageLink && <ImageUpload setFile={setFile} />}
        {
          file && <RenderFile file={{
            format: file.type.split("/")[1],
            name: file.name,
            sizeInBytes: file.size
          }} />
        }
        {
          !downloadPageLink && file && (
            <Button
              text={uploadState}
              onClick={handleUpload} />
          )
        }
        {
          downloadPageLink && (
            <div className="p-2 text-center">
              <DownloadFile downloadPageLink={downloadPageLink} />
              <EmailFrom id={id} />
              <Button
                onClick={handleReset}
                text="Upload New File" />
            </div>
          )
        }
      </div>
    </div>
  );
}


export default Home;