import React, { useState } from "react";
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { RiNewspaperLine } from 'react-icons/ri';
import { RxTriangleDown } from 'react-icons/rx';

import './NewQuiz.css';


const NewQuiz = () => {

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	// const [questionID, setQuestionID] = useState("");
	// const [timeOpen, setTimeOpen] = useState("");
	// const [timeClose, setTimeClose] = useState("");
	// const [quizAttemp, setQuizAttemp] = useState(null);
	// const [quizState, setQuizState ] = useState(null);
	// const []
	const [check, setCheck] = useState("")
	const [numberTime, setNumberTime] = useState("");
	const [time, setTime] = useState('');


	//general
	const handleChangeCheck = (data) => {
		if (data === "check") {
			if (check === true)
				setCheck(!check);
		}
	}

	// form
	const handleCancel = () => {
		// setName = ("");
		// setDescription = ("");
		// setNumberTime = ("");
		// setTime = ("")
	}

	const handleSave = async (e) => {
		e.preventDefault();
		const NewQuiz = new FormData();
		NewQuiz.append("id", name, description, numberTime, time)
		try {
			// Replace this URL with your server-side endpoint for handling file uploads
			const response = await fetch("http://localhost:8080/api/quiz", {
				method:"POST",
				body: NewQuiz
			})
			const data = response.json();
			if (response.ok) {
				console.log(data)
			} else {
				alert("ao the nhe");
			}
		} catch (error) {
			console.error("Error while add new quiz", error);
			alert("Error while add new quiz");
		}
		// reset form
		// setName = ("");
		// setDescription = ("");
		// setNumberTime = ("");
		// setTime = ("")
	}

	return (
		<div className="New_quiz">
			<div className="line1">
				<RiNewspaperLine className='icon_test' />
				<p > Adding a new Quiz  <BsFillQuestionCircleFill className='icon_question' /></p>
			</div>

			<div className='form_add_quizz'>
				<p className='general'><RxTriangleDown className='icon_general' /> General</p>

				<form className="form" >
					<label className="form Name" htmlFor="NameQuiz">
						Name: <input type="text" value={name} onChange={(e) => setName(e.target.value)}></input>
					</label>
					<label className="form Description" htmlFor="DescriptionQuiz">
						Description: <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}></input>
					</label >
					{/* cái checkbox này ko có chức năng nên ko cần làm gì cả, mình cho nó hiện ra là được :))) */}
					<label className="form checkbox" htmlFor="check">
						<input type="checkbox" value={check} onChange={() => handleChangeCheck("checked")} />Display description on course page <BsFillQuestionCircleFill className='icon_c' />
					</label>

					<p className='general1'><RxTriangleDown className='icon_general' />Timing</p>
					<label htmlFor="TimeLimit">

						Timelimit: <input type="number" className="timeNumber" value={numberTime} onChange={(e) => setNumberTime(e.target.value)}></input>
						<select className="selectedTime" onChange={(e) => setTime(e.target.value)}>
							<option value="Minutes">Minutes</option>
							<option value="Hours">Hours</option>
							<option value="Day">Day</option>
						</select>
					</label>
					<div className="button">
						<button type="submit" onClick={handleSave}>CREATE</button>
						<button type="submit" onClick={handleCancel}>CANCEL</button>
					</div>
				</form>
			</div>
		</div >
	)
}
export default NewQuiz;
