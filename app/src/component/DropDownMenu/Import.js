import React, { useState, useRef } from "react";
import { RxTriangleDown } from 'react-icons/rx';
import { IoMdCloudUpload } from 'react-icons/io';
import './Import.css';

export default function NewQuiz() {	//không nên để tên này vì k phải là tạo quiz, đây là nhập hàng loạt questions thôi
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
		setNameFile(e.target.files[0].name);
	};

	const handleUpload = async () => {
		if (!selectedFile) {
			alert("Please first select a file");
			return;
		}

		const formData = new FormData();
		formData.append("text", selectedFile);
		try {
			const response = await fetch("http://localhost:8080/api/File/uploadTextFile", {
				method: "POST",
				body: formData
			})
			// const data = JSON.stringify(response);
			const data = await response.text();		// nếu không có await thì sẽ trả về Promise 
			if (response.ok) {
				console.log(data)
			} else {
				alert("Unknown error");
			}
		} catch (error) {
			console.error("Error while uploading the file:", error);
			alert("Error occurred while uploading the file");
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
	  }
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
				<form	//form này là để dùng hooks
					// method="post"	
					onSubmit={handleSubmit}
					className="importArea"
				>
					<label 
						// onClick={() => document.querySelector(".input-field").click()}
					>
						<input className="input-field" type="file" onChange={handleFileChange} />
						<button 
							className="buttonImport"
							onClick={() => document.querySelector(".input-field").click()}
						>
							CHOOSE A FILE...
						</button>

					</label>
					<p className="note">File chosen: {(nameFile==="")?"none":nameFile}</p>
					<p className="note">Maximum size for new files: 100MB</p>
					{/* <div
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
					</div> */}
					<button className="btnImport" onClick={handleUpload}>Import</button>
				</form>
			</div>
		</div>
	);
};