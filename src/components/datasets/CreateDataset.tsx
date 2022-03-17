import React, {useState, useEffect} from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {CreateDatasetModal} from "./CreateDatasetModal";
import {Metadata} from "../metadata/Metadata";
import {UploadFile} from "../files/UploadFile";
import TopBar from "../navigation/TopBar";
import {ActionModal} from "../dialog/ActionModal";
import config from "../../app.config";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../types/data";
import {resetFailedReason} from "../../actions/common";

const steps = [
	{
		label: "Create Dataset",
		description: "",
		component: <CreateDatasetModal />
	},
	{
		label: "Fill in Metadata",
		description: "",
		component: <Metadata />
	},
	{
		label: "Create Folders",
		description: "Users can create folders and subfolders inside dataset to help with file management.",
		component: <></>
	},
	{
		label: "Attach Files",
		description: "",
		component: <UploadFile />
	},
];

export const CreateDataset = () => {
	// Error msg dialog
	const reason = useSelector((state: RootState) => state.error.reason);
	const stack = useSelector((state: RootState) => state.error.stack);
	const dispatch = useDispatch();
	const dismissError = () => dispatch(resetFailedReason());
	const [errorOpen, setErrorOpen] = useState(false);
	useEffect(() => {
		if (reason !== "" && reason !== null && reason !== undefined) {
			setErrorOpen(true);
		}
	}, [reason])
	const handleErrorCancel = () => {
		// reset error message and close the error window
		dismissError();
		setErrorOpen(false);
	}
	const handleErrorReport = () => {
		window.open(`${config.GHIssueBaseURL}+${reason}&body=${encodeURIComponent(stack)}`);
	}

	// step
	const [activeStep, setActiveStep] = useState(0);

	const handleNext = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevActiveStep) => prevActiveStep - 1);
	};

	const handleSkip = () => {
		setActiveStep((prevActiveStep) => prevActiveStep + 1);
	};

	const handleFinish = () => {
		/// redirect to the dataset page
	}

	return (
		<div>
			<TopBar/>
			<div className="outer-container">
				{/*Error Message dialogue*/}
				<ActionModal actionOpen={errorOpen} actionTitle="Something went wrong..." actionText={reason}
							 actionBtnName="Report" handleActionBtnClick={handleErrorReport}
							 handleActionCancel={handleErrorCancel}/>
				<div className="inner-container">
					<Box>
						<Stepper activeStep={activeStep} orientation="vertical">
							{steps.map((step, index) => (
								<Step key={step.label}>
									<StepLabel
										optional={
											index === steps.length -1 ? (
												<Typography variant="caption">Last step</Typography>
											) : null
										}
									>
										{step.label}
									</StepLabel>
									<StepContent>
										<Typography>{step.description}</Typography>
										<Box>
											{step.component}
										</Box>
										{/*buttons*/}
										<Box sx={{ mb: 2 }}>
											<div>
												{index === steps.length - 1 ?

													<Button
														variant="contained"
														onClick={handleFinish}
														sx={{ mt: 1, mr: 1 }}
													>
														Finish
													</Button>

													:

													<Button
														variant="contained"
														onClick={handleNext}
														sx={{ mt: 1, mr: 1 }}
													>
														Next
													</Button>
												}
												{
													index === steps.length -1 || index === 0?
														null
														:
														<Button
															disabled={index === steps.length -1}
															onClick={handleSkip}
															sx={{ mt: 1, mr: 1 }}
														>
															Skip
														</Button>
												}
												{
													index === 0 ?
														null
														:
														<Button
															disabled={index === 0}
															onClick={handleBack}
															sx={{ mt: 1, mr: 1 }}
														>
															Back
														</Button>
												}
											</div>
										</Box>
									</StepContent>
								</Step>
							))}
						</Stepper>
					</Box>
				</div>
			</div>
		</div>
	);
}
