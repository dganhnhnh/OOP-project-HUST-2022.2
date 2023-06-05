import React, { useState, useRef, useEffect } from "react";
import { RxTriangleDown } from 'react-icons/rx';
import { IoMdCloudUpload } from 'react-icons/io';
import './Import.css';

const Import = () => {
   const [file, setFile] = useState(null);
   const [nameFile, setNameFile] = useState("");
   const dropArea = useRef();
   const [categories, setCategories] = useState([]);

   useEffect(() => {
      // Fetch the list of categories when the component mounts
      const fetchCategories = async () => {
         try
         {
            // Replace this URL with the endpoint that fetches the list of categories from your API
            const response = await fetch("http://localhost:8080/api/categories");
            const data = await response.json();
            setCategories(data);
         } catch (error)
         {
            console.error("Error occurred while fetching categories:", error);
         }
      };
      fetchCategories();
   }, []);
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
            console.log(uploadedFileName);
            try
            {
               // Replace this URL with your server-side endpoint for handling file uploads
               const response = await fetch(`http://localhost:8080/api/File/createQuestion/${uploadedFileName}`, {
                  method: "GET"
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
         <div className="line1">
            <p >Import questions from file </p>
         </div>
         <ul className="list">
            <li> <p><RxTriangleDown className='icon_general' /> File format</p> </li>
            <li className='icon_general'>
               <div>
                  <p><RxTriangleDown className='icon_general' /> General</p>
               </div>
               <div className="dropdown-content">
                  <button onClick={() => alert("Selected All Categories")}>Choose Categories</button>
                  {categories.map((category) => (
                     <button key={category.id} onClick={() => alert(`Selected ${category.name}`)}>{category.name}</button>
                  ))}
               </div>
            </li>
            <li> <p><RxTriangleDown className='icon_general' /> Import question from file</p> </li>
         </ul>
         <div className="main">
            <div className="importArea" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
               <div className="top">
                  <p className="textimp"> Import </p>

                  <input className="input-field" type="file" onChange={handleFileChange} />
                  <button
                     className="buttonImport"
                     onClick={() => document.querySelector(".input-field").click()}
                  >
                     CHOOSE A FILE...
                  </button>
                  <p className="note">Maximum size for new files: 100MB</p>
               </div>
               <div className="dropzone">
                  <div className="dropArea" ref={dropArea} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                     <p>Drop file here to upload</p>
                  </div>
               </div>
               <p className="note">File chosen: {nameFile ? nameFile : "none"}</p>
               <button className="btnImport" onClick={handleUpload}>Import</button>
            </div>
         </div>
      </div >
   );
};
export default Import;
