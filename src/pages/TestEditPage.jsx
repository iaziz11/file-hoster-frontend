import { DocumentEditor } from "@onlyoffice/document-editor-react";
import Navbar from "../ui/Navbar";

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

export default function TestEditPage() {
  return (
    <div>
      <Navbar />
      <div style={{ height: "90vh", marginTop: "1rem" }}>
        <DocumentEditor
          id="docxEditor"
          documentServerUrl="http://localhost:8080"
          config={{
            document: {
              fileType: "docx",
              key: "Khirz6zTPdfd7",
              title: "Example Document Title.docx",
              url: "https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.doc",
            },
            documentType: "word",
            editorConfig: {
              coEditing: {
                mode: "strict",
              },
              callbackUrl: "https://example.com/url-to-callback.ashx",
            },
          }}
          events_onDocumentReady={onDocumentReady}
          onLoadComponentError={onLoadComponentError}
        />
      </div>
    </div>
  );
}
