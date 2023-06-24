import React, { useState, useEffect, useRef } from 'react';
import { SlMagnifierAdd } from 'react-icons/sl'
import { useLocation, useNavigate } from "react-router-dom";
import './RandomQuetion.css';
import { NavLink } from 'react-router-dom';

const NewCategory = () => {
	return (
		<div className='questionpage'>
			<p className='title'>Add a random question to page 1</p>
			<div className="navbarRandom">
				<ul className='randomBar'>
					<li>
						<NavLink to="/ExistingCategory"> Existing Category</NavLink>
					</li>
					<li>
						<NavLink to="/NewCategory"> New Category </NavLink>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default NewCategory