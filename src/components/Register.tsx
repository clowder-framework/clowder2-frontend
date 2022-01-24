import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {
	Avatar,
	Button,
	Paper,
	TextField,
	Typography,
	Link,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {useDispatch, useSelector} from "react-redux";
import {register as registerAction} from "../actions/user";
import {RootState} from "../types/data";


const textField = {
	"& .MuiFormLabel-root": {
		color: "#212529"
	},
	"& .MuiOutlinedInput-root": {
		"& fieldset": {
			borderColor: "#212529",
		},
		"&:hover fieldset": {
			borderColor: "#212529",
		},
		"&.Mui-focused fieldset": {
			borderColor: "#212529",
		},
	},
}

export const Register = (): JSX.Element => {


	// use history hook to redirect/navigate between routes
	const history = useNavigate();

	const dispatch = useDispatch();
	const register = (username:string, password:string) => dispatch(registerAction(username, password));
	const registerError = useSelector((state:RootState) => state.user.registerError);

	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [passwordErrorText, setPasswordErrorText] = useState("");
	const [passwordConfirmErrorText, setPasswordConfirmErrorText] = useState("");
	const [registerErrorText, setRegisterErrorText] = useState("");
	const [error, setError] = useState(false);

	const changeUsername = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUsername(event.target.value);
		setRegisterErrorText("");
	};

	const changePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
		const pw = event.target.value;

		if (pw.length <= 6) {
			setError(true);
			setPasswordErrorText("Your password must be at least 6 characters long");
			setRegisterErrorText("");
		} else {
			setError(false);
			setPasswordErrorText("");
			setRegisterErrorText("");
		}

		setPassword(pw);
	};

	const changePasswordConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
		const pw = event.target.value;

		if (pw !== password) {
			setError(true);
			setPasswordConfirmErrorText("Your password confirmation does not match!");
			setRegisterErrorText("");
		} else {
			setError(false);
			setPasswordConfirmErrorText("");
			setRegisterErrorText("");
		}

		setPasswordConfirm(pw);
	};

	const handleRegisterButtonClick = async () => {
		if (password === passwordConfirm){
			await register(username, password);
			if (registerError) {
				setRegisterErrorText("You cannot register!");
			}
			if (!registerError) {
				// Successful register will redirect to login page
				history("/login");
			}
		}
		else{
			setPasswordConfirmErrorText("The password confirmation does not match!");
		}

	};

	return (
		<div>
			<div className="center"
				 style={{display: "block", margin: "auto", width: "500px", paddingTop: "10%"}}>
				<Paper style={{padding: 40}}>
					<Avatar style={{margin: "auto"}}>
						<LockOutlinedIcon/>
					</Avatar>
					<Typography component="h1" variant="h5">
						Register
					</Typography>
					<Typography sx={{color: "red"}}>{registerErrorText}</Typography>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						autoFocus
						id="username"
						label="Username"
						name="username"
						value={username}
						onChange={changeUsername}
						sx={textField}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="password"
						label="Password"
						name="password"
						type="password"
						error={error}
						helperText={passwordErrorText}
						value={password}
						onChange={changePassword}
						sx={textField}
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="password-confirm"
						label="Password Confirmation"
						name="password-confirm"
						type="password"
						error={error}
						helperText={passwordConfirmErrorText}
						value={passwordConfirm}
						onChange={changePasswordConfirm}
						sx={textField}
					/>
					<Link href="#" sx={{
						display:"block",
						textAlign:"right",
						margin: "0 auto 10px auto",
						color: "#212529"
					}} target="_blank">Forgot password?</Link>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						onClick={handleRegisterButtonClick}
						sx={{
							backgroundColor: "#f7931d",
							color:"#FFFFFF"
						}}
						disabled={!(password === passwordConfirm && password !== "")}
					>Register</Button>
					<Link href="/login" sx={{
						fontWeight: 500,
						fontSize:"15px",
						display:"block",
						margin:"10px auto 5px auto",
						color: "#212529"
					}}>Alreday have an account? Log In.</Link>
				</Paper>
			</div>
		</div>
	);
};
