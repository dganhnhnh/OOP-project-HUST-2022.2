import React, { useState, useRef } from "react";
import { RxTriangleDown } from 'react-icons/rx';
import { IoMdCloudUpload } from 'react-icons/io';
import './Import.css';

export default function NewQuiz() {
	const [selectedFile, setSelectedFile] = useState(null);
	const [nameFile, setNameFile] = useState("");

	const handleDragOver = (event) => {
		event.preventDefault();
	};

	const handleDrop = (event) => {
		event.preventDefault();
		setSelectedFile(event.dataTransfer.selectedFile);
	};
	const handleFileChange = (e) => {
		setSelectedFile(e.target.files[0]);
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			alert("Please first select a file");
			return;
		}
		const formData = new FormData();
		formData.append("text", selectedFile);
		try {
			// Replace this URL with your server-side endpoint for handling file uploads
			const response = await fetch(" ", {
				method: "POST",
				body: formData
			})
			const data = JSON.stringify(response);
			if (response.ok) {
				console.log(data)
			} else {
				alert("ao the nhe");
			}
		} catch (error) {
			console.error("Error while uploading the file:", error);
			alert("Error occurred while uploading the file");
		}
	};

	// const handleSubmit = async ({ nameFile }) => {
	// 	const formData = new FormData();
	// 	formData.append("nameFile", nameFile, setNameFile);
	// 	try {
	// 		// Replace this URL with your server-side endpoint for handling file uploads
	// 		const response = await fetch(`http://localhost:8080/api/File/createQuestion/${nameFile}`, {
	// 			method: "GET",
	// 			body: formData
	// 		})
	// 		const data = JSON.stringify(response);

	// 		if (response.ok) {
	// 			alert(data);
	// 		} else {
	// 			alert("ao the nhe");
	// 		}
	// 	} catch (error) {
	// 		alert("Error occurred while uploading the file");
	// 	}
	// };



	return (
		<div>
			<div className="line1">
				<p >Import questions from file </p>
			</div>
			<ul className="list">
				<li> <p><RxTriangleDown className='icon_general' /> File format</p> </li>
				<li> <p><RxTriangleDown className='icon_general' /> General</p>     </li>
				<li> <p><RxTriangleDown className='icon_general' /> Import question from file</p> </li>
			</ul>
			<div className="main">
				<p className="textimp"> Import </p>
				<form method="post" className="importArea">
					<label onClick={() => document.querySelector(".input-field").click()}>
						<input className="input-field" type="file" onChange={handleFileChange} />
						<button className="buttonImport">
							CHOOSE A FILE...
						</button>

					</label>
					<p className="note">Maximum size for new files: 100MB</p>
					<div
						className="dropzone"
						onDragOver={handleDragOver}
						onDrop={handleDrop}
					>
						<IoMdCloudUpload />
						<p>You can drag and drop files here to add them</p>
						<input
							type="file"
							onChange={handleFileChange}
							hidden
						/>
					</div>
					<button className="btnImport"  onClick={handleUpload}>Import</button>
				</form>
			</div>
		</div>
	);
};