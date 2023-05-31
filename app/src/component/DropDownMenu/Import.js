import React, { useState, useRef } from "react";
import { RxTriangleDown } from 'react-icons/rx';
import { IoMdCloudUpload } from 'react-icons/io';
import './Import.css';

export default function New_quiz() {
	const [files, setFiles] = useState(null);
	const inputRef = useRef();

	const handleDragOver = (event) => {
		event.preventDefault();
	};

	const handleDrop = (event) => {
		event.preventDefault();
		setFiles(event.dataTransfer.files)
	};
	const handleUpload = () => {
		const formData = new FormData();
		formData.append("Files", files);
		console.log(formData.getAll())
		fetch(
		  "http://localhost:8080/api/File/uploadTextFile", {
		    method: "POST",
		    body: formData
		  }  
		)
	};

	if (files) return (
		<div className="uploads">
			<ul>
				{Array.from(files).map((file, idx) => <li key={idx}>{file.name}</li>)}
			</ul>
			<div className="actions">
				<button onClick={() => setFiles(null)}>Cancel</button>
				<button onClick={handleUpload}>Upload</button>
			</div>
		</div>
	)

	return (
		<div className="Import">
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
				<div className="importArea">
					<form action=""
						onClick={() => document.querySelector(".input-field").click()}
					>
						<input type="file" className="input-field"
							onChange={({ target: { files } }) => {
								files[0] && setFiles(files[0].name)
							}}
						/>
						<div className="btnoteimp">
							<button className="buttonImport">
								CHOOSE A FILE...
							</button>
							<p className="note">Maximum size for new files: 100MB</p>
						</div>
					</form>
					<div
						className="dropzone"
						onDragOver={handleDragOver}
						onDrop={handleDrop}
					>
						<IoMdCloudUpload />
						<p>You can drag and drop files here to add them</p>
						<input
							type="file"
							multiple
							onChange={(event) => setFiles(event.target.files)}
							hidden
							ref={inputRef}
						/>
					</div>
					<button className="btnImport" onClick={() => inputRef.current.click()}>Import</button>
				</div>


			</div>
		</div>
	)
}
