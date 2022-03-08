import React, {useState} from "react";

import {Box, Button, Container} from "@mui/material";

import LoadingOverlay from "react-loading-overlay-ts";

import Form from "@rjsf/material-ui";

import fileSchema from "../../schema/fileSchema.json";
import {FormProps} from "@rjsf/core";
import {useDispatch} from "react-redux";
import {fileCreated} from "../../actions/file";


type UploadFileProps ={
	selectedDatasetId?: string,
	folderId: string | null,
	setOpen:(open:boolean) => void,
}

export const UploadFile: React.FC<UploadFileProps> = (props: UploadFileProps) => {
	const dispatch = useDispatch();
	const uploadFile = (formData: any, selectedDatasetId?: string) => dispatch(fileCreated(formData, selectedDatasetId));

	const {selectedDatasetId, folderId, setOpen,} = props;

	const [loading, setLoading] = useState<boolean>(false);

	const onSave = async (formData:any) => {
		setLoading(true);
		formData["folder_id"] = folderId;
		uploadFile(formData, selectedDatasetId);
		setLoading(false);
		setOpen(false);
	};

	// TODO
	// @ts-ignore
	return (
		<Container>
			<LoadingOverlay
				active={loading}
				spinner
				text="Saving..."
			>
				<Form schema={fileSchema["schema"] as FormProps<any>["schema"]}
					  uiSchema={fileSchema["uiSchema"] as FormProps<any>["uiSchema"]}
					  onSubmit={({formData}) => {onSave(formData);}}>
					<Box className="inputGroup">
						<Button variant="contained" type="submit" className="form-button-block">Upload</Button>
					</Box>
				</Form>
			</LoadingOverlay>
		</Container>
	);

};
