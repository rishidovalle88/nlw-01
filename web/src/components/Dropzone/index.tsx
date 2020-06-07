import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";

import "./styles.css";

interface Props {
  onFileUploaded: (file: File) => void , 
}

const Dropzone: React.FC<Props> = ({onFileUploaded}) => {
  const [selectedFileUrl, SetselectedFileUrl] = React.useState("");
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const fileUrl = URL.createObjectURL(file);
    SetselectedFileUrl(fileUrl);
    onFileUploaded(file);
  }, [onFileUploaded]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />

      {selectedFileUrl ? (
        <img src={selectedFileUrl} alt="Point" />
      ) : (
        <p>Imagem do estabelecimento</p>
      )}
      <FiUpload />
    </div>
  );
};

export default Dropzone;
