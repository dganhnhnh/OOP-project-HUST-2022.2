import React, { useState } from "react";
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { RiNewspaperLine } from 'react-icons/ri';
import { RxTriangleDown } from 'react-icons/rx';
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css"
import './NewQuiz.css';


const NewQuiz = () => {

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [check, setCheck] = useState("")
	const [numberTime, setNumberTime] = useState("");
	const [time, setTime] = useState('');
	const [timeOpen, setTimeOpen] = useState("2023-06-05T00:00:00Z"); // Default value
	const [timeClose, setTimeClose] = useState("2023-06-06T23:59:59Z"); // Default value
	const [isEnabled, setIsEnabled] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);


	//general
	const handleChangeCheck = (data) => {
		if (data === "check")
		{
			if (check === true)
				setCheck(!check);
		}
	}

	// form
	const handleCancel = () => {
		setName = ("");
		setDescription = ("");
		setNumberTime = ("");
		setTime = ("")
	}

	const handleSave = async (e) => {
		e.preventDefault();
		// Check if any input field is empty
		if (!name || !description || !numberTime || !time)
		{
			alert("Please fill out all fields before submitting.");
			return;
		}
		setIsSubmitted(true);
		const NewQuiz = {
			name,
			description,
			numberTime,
			time,
			"questionsID": [],
			"timeLimitDay": 0,
			"timeOpen": null,
			"timeClose": null,
			"quizAttemp": null,
			"quizState": null,
			"quizMaxGrade": 0.0
		};

		try
		{
			// Replace this URL with your server-side endpoint for handling file uploads
			const response = await fetch("http://localhost:8080/api/quiz", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(NewQuiz)
			})
			const data = await response.json();
			if (response.ok)
			{
				console.log(data)
				alert('Quiz created successfully!');
			} else
			{
				alert("An error occurred.");
			}
		} catch (error)
		{
			console.error("Error while add new quiz", error);
			alert("Error while add new quiz");
		}
		// reset form
		setName = ("");
		setDescription = ("");
		setNumberTime = ("");
		setTime = ("")
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

					<label htmlFor="TimeOpenQuiz">
						Time Open:
						<Datetime
							className="form TimeOpen"
							value={timeOpen}
							onChange={(date) => isEnabled && setTimeOpen(date.format())}
							dateFormat="YYYY-MM-DD"
							timeFormat="HH:mm:ss"
							inputProps={{ disabled: !isEnabled, placeholder: 'Select time open...', readOnly: true }}
						/>
					</label>
					<label htmlFor="TimeCloseQuiz">
						Time Close:
						<Datetime
							className="form TimeClose"
							value={timeClose}
							onChange={(date) => isEnabled && setTimeClose(date.format())}
							dateFormat="YYYY-MM-DD"
							timeFormat="HH:mm:ss"
							inputProps={{ disabled: !isEnabled, placeholder: 'Select time close...', readOnly: true }}
						/>
					</label>
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
				{isSubmitted && (
					<div>
						<p>Form submitted successfully!</p>
					</div>
				)}

			</div>
		</div >
	)
}
export default NewQuiz;
