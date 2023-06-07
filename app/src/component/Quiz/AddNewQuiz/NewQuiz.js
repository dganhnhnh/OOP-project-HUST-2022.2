import React, { useState } from "react";
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { RiNewspaperLine } from 'react-icons/ri';
import { RxTriangleDown } from 'react-icons/rx';
import Datetime from "react-datetime";
import { DatetimepickerProps } from "react-datetime";
import "react-datetime/css/react-datetime.css"
import './NewQuiz.css';
import moment from "moment";

const NewQuiz = () => {

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [questionsID, setQuestionsID] = useState([]);
	const [timeLimit, setTimeLimit] = useState(0);
	const [timeOpen, setTimeOpen] = useState(""); // Default value
	const [timeClose, setTimeClose] = useState(""); // Default value
	const [quizAttemptID, setQuizAttemptID] = useState([]);
	const [quizState, setQuizState] = useState(null)
	const [ongoingAttempt, setOngoingAttempt] = useState(false);
	const [quizMaxGrade, setQuizMaxGrade] = useState(0.0);
	const [isEnabled, setIsEnabled] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [check, setCheck] = useState(true)

	function handleTimeOpenChange(event) {
		setTimeOpen(event.target.value);
	}

	function handleTimeCloseChange(event) {
		setTimeClose(event.target.value);
	}

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
		setTimeOpen = (null);
		setTimeClose = (null);
		setTimeLimit = ("");
	}

	const handleSave = async (e) => {
		e.preventDefault();
		// Check if any input field is empty
		if (!name || !timeClose || !timeOpen || !timeLimit)
		{
			alert("Please fill out all fields before submitting.");
			return;
		}
		setIsSubmitted(true);
		const NewQuiz = {
			name,
			description,
			questionsID,
			timeLimit,
			timeOpen,
			timeClose,
			quizAttemptID,
			quizState,
			ongoingAttempt,
			quizMaxGrade
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
		setTimeOpen = (null);
		setTimeClose = (null);
		setTimeLimit = ("");
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
						<input
							className="TimeOpenQuiz"
							type="datetime-local"
							name="partydate"
							value={timeOpen}
							onChange={handleTimeOpenChange}
						/>
					</label>

					<label htmlFor="TimeCloseQuiz">
						Time Close:
						<input
							className="TimeCloseQuiz"
							type="datetime-local"
							name="partydate"
							value={timeClose}
							onChange={handleTimeCloseChange}
						/>
					</label>
					<label htmlFor="TimeLimit">
						Timelimit: <input type="number" className="timeNumber" value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}></input>
						<select className="selectedTime" >
							<option value="Minutes">Minutes</option>
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
