import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {
	AppBar,
	Box,
	Button, Dialog,
	DialogTitle,
	Divider,
	Grid,
	ListItem,
	Menu,
	MenuItem,
	Tab,
	Tabs,
	Typography
} from "@material-ui/core";
import {ClowderInput} from "./styledComponents/ClowderInput";
import {ClowderButton} from "./styledComponents/ClowderButton";
import DescriptionIcon from "@material-ui/icons/Description";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import {UploadFile} from "./childComponents/UploadFile";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import CloudDownloadOutlinedIcon from "@material-ui/icons/CloudDownloadOutlined";
import {downloadDataset} from "../utils/dataset";
import {downloadFile} from "../utils/file";
import {About as AboutType, File as FileType} from "../types/data";

const useStyles = makeStyles(() => ({
	appBar: {
		background: "#FFFFFF",
		boxShadow: "none",
	},
	tab: {
		fontStyle: "normal",
		fontWeight: "normal",
		fontSize: "16px",
		color: "#495057",
		textTransform: "capitalize",
		maxWidth: "50px",
	},
	fileCardOuterBox:{
		position:"relative"
	},
	fileCard: {
		background: "#FFFFFF",
		border: "1px solid #DFDFDF",
		boxSizing: "border-box",
		borderRadius: "4px",
		margin: "20px auto",
		"& > .MuiGrid-item": {
			padding: 0,
			height: "150px",
		}
	},
	fileCardImg: {
		height: "50%",
		margin: "40px auto",
		display: "block"
	},
	fileCardText:{
		padding: "40px 20px",
		fontSize:"16px",
		fontWeight:"normal",
		color:"#212529"
	},
	fileCardActionBox:{
		position:"absolute",
		right:"5%",
		top: "40px",
	},
	fileCardActionItem:{
		display:"block"
	},
	optionButton:{
		float: "right",
		padding: "6px 12px",
		width: "100px",
		background: "#6C757D",
		borderRadius: "4px",
		color: "white",
		textTransform: "capitalize"
	},
	optionMenuItem:{
		fontWeight: "normal",
		fontSize: "14px",
		color: "#212529",
		marginTop:"8px",
	}
}));

type DatasetProps = {
	files: FileType[],
	deleteFile: (fileId:string) => void,
	thumbnails: [],
	about: AboutType,
	selectFile: (selectedFileId: string) => void,
	selectedDatasetId: string,
	deleteDataset: (datasetId:string) => void,
	selectDataset: (selectedDatasetId: string) => void,
};

export const Dataset:React.FC<DatasetProps> = (props: DatasetProps) => {
	const classes = useStyles();

	const {files, deleteFile, thumbnails, about, selectFile, selectedDatasetId, deleteDataset, selectDataset } = props;
	const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
	const [open, setOpen] = React.useState<boolean>(false);
	const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

	const handleTabChange = (_event:React.ChangeEvent<{}>, newTabIndex:number) => {
		setSelectedTabIndex(newTabIndex);
	};

	const handleOptionClick = (event: React.MouseEvent<any>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleOptionClose = () => {
		setAnchorEl(null);
	};

	return (
		<div className="inner-container">
			<Grid container spacing={4}>
				<Grid item lg={8} xl={8} md={8} sm={8} xs={12}>
					<AppBar className={classes.appBar} position="static">
						{/*Tabs*/}
						<Tabs value={selectedTabIndex} onChange={handleTabChange} aria-label="dataset tabs">
							<Tab className={classes.tab} label="Files" {...a11yProps(0)} />
							<Tab className={classes.tab} label="Metadata" {...a11yProps(1)} />
							<Tab className={classes.tab} label="Extractions" {...a11yProps(2)} />
							<Tab className={classes.tab} label="Visualizations" {...a11yProps(3)} />
							<Tab className={classes.tab} label="Comments" {...a11yProps(4)} />
						</Tabs>
						{/*option menus*/}
						<Box>
								<Button aria-haspopup="true" onClick={handleOptionClick}
										className={classes.optionButton} endIcon={<ArrowDropDownIcon />}>
									Options
								</Button>
								<Menu
									id="simple-menu"
									anchorEl={anchorEl}
									keepMounted
									open={Boolean(anchorEl)}
									onClose={handleOptionClose}
								>
									<MenuItem className={classes.optionMenuItem}
											  onClick={()=>{
											  	setOpen(true);
											  	handleOptionClose();
											  }}>
										Add Files
									</MenuItem>
									<MenuItem className={classes.optionMenuItem}
											  onClick={() => {
											  	downloadDataset(selectedDatasetId, about["name"]);
											  	handleOptionClose();
											  }}>
										Download All
									</MenuItem>
									<MenuItem onClick={()=>{
										deleteDataset(selectedDatasetId);
										handleOptionClose();
										// TODO go to the explore page
									}
									} className={classes.optionMenuItem}>Delete</MenuItem>
									<MenuItem onClick={handleOptionClose} className={classes.optionMenuItem}>Follow</MenuItem>
									<MenuItem onClick={handleOptionClose} className={classes.optionMenuItem}>Collaborators</MenuItem>
									<MenuItem onClick={handleOptionClose} className={classes.optionMenuItem}>Extraction</MenuItem>
								</Menu>
							</Box>
					</AppBar>
					<TabPanel value={selectedTabIndex} index={0}>

						{
							files !== undefined && thumbnails !== undefined ?
								files.map((file) => {
									let thumbnailComp = <DescriptionIcon className={classes.fileCardImg}
																		 style={{fontSize: "5em"}}/>;
									thumbnails.map((thumbnail) => {
										if (file["id"] !== undefined && thumbnail["id"] !== undefined &&
											thumbnail["thumbnail"] !== null && thumbnail["thumbnail"] !== undefined &&
											file["id"] === thumbnail["id"]) {
											thumbnailComp = <img src={thumbnail["thumbnail"]} alt="thumbnail"
																 className={classes.fileCardImg}/>;
										}
									});
									return (
										<Box className={classes.fileCardOuterBox}>
											<ListItem button className={classes.fileCard} key={file["id"]}
													  onClick={() => selectFile(file["id"])}>
												<Grid item xl={2} lg={2} md={2} sm={2} xs={12}>
													{thumbnailComp}
												</Grid>
												<Grid item xl={8} lg={8} md={8} sm={8} xs={12}>
													<Box className={classes.fileCardText}>
														<Typography>File name: {file["filename"]}</Typography>
														<Typography>File size: {file["size"]}</Typography>
														<Typography>Created on: {file["date-created"]}</Typography>
														<Typography>Content type: {file["contentType"]}</Typography>
													</Box>
												</Grid>
											</ListItem>
											<Box className={classes.fileCardActionBox}>
												<Box className={classes.fileCardActionItem}>
													<Button startIcon={<DeleteOutlineIcon />}
															onClick={()=>{deleteFile(file["id"]);}}>Delete</Button>
												</Box>
												<Box className={classes.fileCardActionItem}>
													<Button startIcon={<StarBorderIcon />}>Follow</Button>
												</Box>
												<Box className={classes.fileCardActionItem}>
													<Button startIcon={<CloudDownloadOutlinedIcon />}
															onClick={()=>{downloadFile(file["id"], file["filename"]);}}>
														Download</Button>
												</Box>
											</Box>
										</Box>
									);
								})
								:
								<></>
						}
					</TabPanel>
					<TabPanel value={selectedTabIndex} index={1}></TabPanel>
					<TabPanel value={selectedTabIndex} index={2}></TabPanel>
					<TabPanel value={selectedTabIndex} index={3}></TabPanel>
					<TabPanel value={selectedTabIndex} index={4}></TabPanel>
				</Grid>
				<Grid item lg={4} md={4} xl={4} sm={4} xs={12}>
					{
						about !== undefined ?
							<Box className="infoCard">
								<Typography className="title">About</Typography>
								<Typography className="content">Name: {about["name"]}</Typography>
								<Typography className="content">Dataset ID: {about["id"]}</Typography>
								<Typography className="content">Owner: {about["authorId"]}</Typography>
								<Typography className="content">Description: {about["description"]}</Typography>
								<Typography className="content">Created on: {about["created"]}</Typography>
								{/*/!*TODO use this to get thumbnail*!/*/}
								<Typography className="content">Thumbnail: {about["thumbnail"]}</Typography>
								{/*<Typography className="content">Belongs to spaces: {about["authorId"]}</Typography>*/}
								{/*/!*TODO not sure how to use this info*!/*/}
								{/*<Typography className="content">Resource type: {about["resource_type"]}</Typography>*/}
							</Box> : <></>
					}
					<Divider light/>
					<Box className="infoCard">
						<Typography className="title">Statistics</Typography>
						<Typography className="content">Views: 10</Typography>
						<Typography className="content">Last viewed: Jun 07, 2021 21:49:09</Typography>
						<Typography className="content">Downloads: 0</Typography>
						<Typography className="content">Last downloaded: Never</Typography>
					</Box>
					<Divider light/>
					<Box className="infoCard">
						<Typography className="title">Tags</Typography>
						<Grid container spacing={4}>
							<Grid item lg={8} sm={8} xl={8} xs={12}>
								<ClowderInput defaultValue="Tag"/>
							</Grid>
							<Grid item lg={4} sm={4} xl={4} xs={12}>
								<ClowderButton>Search</ClowderButton>
							</Grid>
						</Grid>
					</Box>
					<Divider light/>
				</Grid>
			</Grid>
			<Dialog open={open} onClose={()=>{setOpen(false);}} fullWidth={true} aria-labelledby="form-dialog">
				<DialogTitle id="form-dialog-title">Add Files</DialogTitle>
				{/*pass select to uploader so once upload succeeded, can jump to that dataset/file page*/}
				<UploadFile selectedDatasetId={selectedDatasetId} selectDataset={selectDataset} setOpen={setOpen}/>
			</Dialog>
		</div>
	);
}

function TabPanel(props:any) {
	const {children, value, index, ...other} = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`dataset-tabpanel-${index}`}
			aria-labelledby={`dataset-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index:number) {
	return {
		id: `dataset-tab-${index}`,
		"aria-controls": `dataset-tabpanel-${index}`,
	};
}
