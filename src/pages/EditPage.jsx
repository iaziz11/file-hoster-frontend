import { DocumentEditor } from "@onlyoffice/document-editor-react";
import Navbar from "../ui/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchFile } from "../firebase/fetchFile";
import { useAuthUser } from "../hooks/useAuthUser";

function onDocumentReady() {
  console.log("Document is loaded");
}

function onLoadComponentError(errorCode, errorDescription) {
  switch (errorCode) {
    case -1: // Unknown error loading component
      console.log(errorDescription);
      break;

    case -2: // Error load DocsAPI from http://documentserver/
      console.log(errorDescription);
      break;

    case -3: // DocsAPI is not defined
      console.log(errorDescription);
      break;
  }
}

const fileTypeGroups = {
  // Word Processing
  docx: "word",
  odt: "word",
  txt: "word",
  rtf: "word",
  html: "word",
  htm: "word",
  docxf: "word",

  // Spreadsheets
  xlsx: "cell",
  ods: "cell",
  csv: "cell",
  xls: "cell",

  // Presentations
  pptx: "slide",
  odp: "slide",
  ppsx: "slide",
  ppt: "slide",
};

export default function EditPage() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const { user: loggedInUser } = useAuthUser();
  if (!fileId) navigate("/");

  const [editFile, setEditFile] = useState({
    id: "",
    fileType: "",
    title: "",
    documentType: "",
  });

  const [editFileUrl, setEditFileUrl] = useState("");

  useEffect(() => {
    const fetchFileData = async () => {
      const { file } = await fetchFile(fileId);
      const fileExt = file.fileName.split(".").at(-1);
      setEditFile({
        id: fileId,
        fileType: fileExt,
        title: file.fileName,
        documentType: fileTypeGroups[fileExt.toLowerCase()] || "word",
      });
    };
    const fetchFileUrl = async () => {
      const res = await fetch(
        `https://mpower-host.duckdns.org/document/${fileId}`
      );
      const { url } = await res.json();
      setEditFileUrl(url);
    };
    if (!editFile.id) {
      fetchFileData();
    }
    if (!editFileUrl) {
      fetchFileUrl();
    }
  }, [fileId, editFile, editFileUrl]);

  if (!editFile.id || !editFileUrl || !loggedInUser) return;
  return (
    <div>
      <Navbar />
      <div style={{ height: "90vh", marginTop: "1rem" }}>
        <DocumentEditor
          id="docxEditor"
          documentServerUrl="https://mpower-onlyoffice.duckdns.org/"
          config={{
            document: {
              fileType: editFile.fileType,
              key: editFile.id,
              title: editFile.title,
              url: editFileUrl,
            },
            documentType: editFile.documentType,
            editorConfig: {
              mode: "edit",
              user: {
                id: loggedInUser.id,
                name: loggedInUser.fullName,
              },
              coEditing: {
                mode: "strict",
              },
              callbackUrl: `https://mpower-host.duckdns.org/document/${editFile.id}`,
              permissions: {
                edit: true,
                save: true,
              },
            },
          }}
          events_onDocumentReady={onDocumentReady}
          onLoadComponentError={onLoadComponentError}
        />
      </div>
    </div>
  );
}
