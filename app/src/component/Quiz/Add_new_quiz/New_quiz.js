import React, { useState, useRef } from "react";
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { RiNewspaperLine } from 'react-icons/ri';
import { RxTriangleDown } from 'react-icons/rx';
import './New_quiz.css';
import "react-datepicker/dist/react-datepicker.css";  //// import required react-datepicker styling file
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
export default function New_quiz() {
	const [inputValue, setInputValue] = useState("");
	const [inputValueDes, setInputValueDes] = useState("");
	const handleCancel = () => {
		setInputValue("");
	};
	const handleSave = (event) => {
		console.log(inputValue, event);
	}
	const [first, setFirst] = useState(true);
	const handleChange = (data) => {
		if (data === "first") {
			if (first === true) console.log(data, "our value");
			setFirst(!first);
		}
	}
	const ImportFileButton = (props) => {
		const fileInputRef = React.createRef();

		const handleFileImport = (event) => {
			const file = event.target.files[0];
			if (file) {
				// Process the imported file here
				console.log('Imported file:', file);
			}
		};
	}
	return (
		<div className="New_quiz">
			<div className="line1">
				<RiNewspaperLine className='icon_test' />
				<p > Adding a new Quiz  <BsFillQuestionCircleFill className='icon_question' /></p>
			</div>

			<div className='form_add_quizz'>
				<p className='general'><RxTriangleDown className='icon_general' /> General</p>

				<div className="form">
					<label className="form Name"> Name: <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}></input>
					</label>
					<label className="form Description"> Description: <input type="text" value={inputValueDes} onChange={(e) => setInputValueDes(e.target.value)}></input>
					</label >

					<div className="form checkbox">
						<input type="checkbox" value={first} onChange={() => handleChange("first")} /> Display description on course page <BsFillQuestionCircleFill className='icon_c' />
					</div>


				</div>
				<div className="button">
					<button type="submit" onClick={handleSave}>CREATE</button>
					<button type="submit" onClick={handleCancel}>CANCEL</button>
				</div>

			</div>

		</div >
	)
}
