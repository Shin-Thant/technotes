import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import usePersist from "../../hooks/usePersist";
import PulseLoader from "react-spinners/PulseLoader";

export const Login = () => {
	const userRef = useRef();
	const errRef = useRef();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [persist, setPersist] = usePersist();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [login, { isLoading }] = useLoginMutation();

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [username, password]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// * ususally mutation return a value when it triggers
			// * mutation will return a promise with an 'unwrap' property
			// * use 'unwrap()' if you want to get the raw 'value' if fullfilled or 'error' if rejected
			// also if you don't want to use 'useError' and 'error' from hook and you want to use 'trycatch' you can use 'unwrap'
			const { accessToken } = await login({
				username,
				password,
			}).unwrap();
			dispatch(setCredentials({ accessToken }));
			setUsername("");
			setPassword("");
			navigate("/dash");
		} catch (err) {
			if (!err.status) {
				setErrMsg("No Server Response");
			} else if (err.status === 400) {
				setErrMsg("Missing Username or Password");
			} else if (err.status === 401) {
				setErrMsg("Unauthorized");
			} else {
				setErrMsg(err.data?.message);
			}
			errRef.current.focus();
		}
	};

	const handleUserInput = (e) => setUsername(e.target.value);
	const handlePwdInput = (e) => setPassword(e.target.value);
	const handleToggle = () => setPersist((prev) => !prev);

	const errClass = errMsg ? "errmsg" : "offscreen";

	if (isLoading) return <PulseLoader color={"#fff"} />;

	const content = (
		<section className="public">
			<header>
				<h1>Employee Login</h1>
			</header>
			<main className="login">
				<p ref={errRef} className={errClass} aria-live="assertive">
					{errMsg}
				</p>

				<form className="form" onSubmit={handleSubmit}>
					<label htmlFor="username">Username:</label>
					<input
						className="form__input"
						type="text"
						id="username"
						ref={userRef}
						value={username}
						onChange={handleUserInput}
						autoComplete="off"
						required
					/>

					<label htmlFor="password">Password:</label>
					<input
						className="form__input"
						type="password"
						id="password"
						onChange={handlePwdInput}
						value={password}
						required
					/>
					<button className="form__submit-button">Sign In</button>

					<label htmlFor="persist" className="form__persist">
						<input
							type="checkbox"
							className="form__checkbox"
							id="persist"
							onChange={handleToggle}
							checked={persist}
						/>
						Trus This Device!
					</label>
				</form>
			</main>
			<footer>
				<Link to="/">Back to Home</Link>
			</footer>
		</section>
	);

	return content;
};
