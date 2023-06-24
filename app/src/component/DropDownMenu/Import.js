import React, { useState, useRef, useEffect } from "react";
import { RxTriangleDown } from "react-icons/rx";
import { IoMdCloudUpload } from "react-icons/io";
import "./Import.css";
import SelectCategory from "../Category/SelectCategory";
import Navigation from "./Navigation";

const Import = () => {
  const [file, setFile] = useState(null);
  const [nameFile, setNameFile] = useState("");
  const dropArea = useRef();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [questionsByCategory, setQuestionsByCategory] = useState({});

  const handleFileChange = async (e) => {
    setFile(e.target.files[0]);
    setNameFile(e.target.files[0].name);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    dropArea.current.classList.add("drag-on");
  };

  const handleDragLeave = () => {
    dropArea.current.classList.remove("drag-on");
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setFile(event.dataTransfer.files[0]);
    setNameFile(event.dataTransfer.files[0].name);
    dropArea.current.classList.remove("drag-on");
  };

   const handleUpload = async () => {
      if (!file)
      {
         alert("Please first select a file");
         return;
      }
      if (!selectedCategory)
      {
         alert("Please select a category for the imported questions.");
         return;
      }
      const formData = new FormData();
      formData.append("text", file);
      try
      {
         // Replace this URL with your server-side endpoint for handling file uploads
         const response = await fetch("http://localhost:8080/api/File/uploadTextFile", {
            method: "POST",
            body: formData
         });
         const uploadedFileName = await response.text();
         if (response.ok)
         {
            alert("File upload is successfully");
            console.log(uploadedFileName)
            try
            {
               // Replace this URL with your server-side endpoint for handling file uploads
               const response = await fetch(`http://localhost:8080/api/File/createQuestion/${uploadedFileName}?categoryID=${selectedCategory}`, {
                  method: "GET",

               })
               const data = await response.text();
               if (response.ok)
               {
                  alert(data);
                  console.log(data);
               } else
               {
                  alert("Failed to create questions");
               }
            } catch (error)
            {
               console.error("Error while creating questions", error);
               alert("Error while creating questions");
            }
         } else
         {
            alert("Wrong format file, chose .txt or .doc");
         }
      } catch (error)
      {
         console.error("Error while uploading the file:", error);
         alert("Error occurred while uploading the file");
      }
      setNameFile(""); // Clear the nameFile state variable
   };

  return (
    <div>
      <div className="import-page">
      <Navigation/>
        <div className="line1">
        <p>Import questions from file </p>
      </div>
      <ul className="list">
        <li>
          {" "}
          <p>
            <RxTriangleDown className="icon_general" /> File format
          </p>{" "}
        </li>
        <li className="icon_general">
          <div>
            <p>
              <RxTriangleDown className="icon_general" /> General
            </p>
          </div>
          <div className="selected-menu">
            <p>Select a category:</p>
            <SelectCategory
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              setCategories={setCategories}
              questionsByCategory={questionsByCategory}
              setQuestionsByCategory={setQuestionsByCategory}
            />
          </div>
        </li>
        <li>
          {" "}
          <p>
            <RxTriangleDown className="icon_general" /> Import question from
            file
          </p>{" "}
        </li>
      </ul>
      <div className="main">
        <div
          className="importArea"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="top">
            <p className="textimp"> Import </p>

            <input
              className="input-field"
              type="file"
              onChange={handleFileChange}
            />
            <button
              className="buttonImport"
              onClick={() => document.querySelector(".input-field").click()}
            >
              CHOOSE A FILE...
            </button>
            <p className="note">Maximum size for new files: 100MB</p>
          </div>
          <div className="dropzone">
            <div
              className="dropArea"
              ref={dropArea}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p>Drop file here to upload</p>
            </div>
          </div>
          <p className="note">File chosen: {nameFile ? nameFile : "none"}</p>
          <button className="btnImport" onClick={handleUpload}>
            Import
          </button>
        </div>
      </div>
    </div>
      </div>
      
  );
};
export default Import;
