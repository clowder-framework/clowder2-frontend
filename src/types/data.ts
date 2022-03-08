import {FileOut as File, DatasetOut as Dataset, FolderOut as Folder} from "../openapi/v2";

export interface FileMetadata {
	id: string;
	"content-type": string;
	size:number;
	created: string | Date;
	name: string;
	creator: string;
	status: string;
	filedescription: string;
	thumbnail:string;
	downloads:number;
	views:number;
	version: string;
}

export interface FileVersion {
	id: string;
	"version_id": string;
	"file_id": string;
	"creator": string;
	"created": string | Date;
}

export interface FileMetadataList{
	id: string;
	metadata: FileMetadata;
}

export interface Preview{
	"p_id": string;
	"pv_route": string;
	"pv_id": string;
	"p_path": string;
	"pv_contenttype": string;
}

export interface FilePreview{
	"file_id": string;
	previews: Preview[];
}

export interface PreviewConfiguration{
	previewType: string;
	url:string;
	fileid:string;
	previewer:string;
	fileType:string;
	resource:string | null;
}

export interface Path{
	name: string;
	id: string;
	type:string
}

export interface ExtractedMetadata{
	filename:string;
}

export interface MetadataJsonld{
	"id":string;
	"@context": (Context|string)[];
	agent:Agent;
	"attached_to": AttatchTo;
	content: any;
	"created_at": string | Date;
}

interface Context{
	database:string;
	scan:string;
}

interface Agent{
	"@type": string;
	"extractor_id": string;
	name: string
}

interface AttatchTo{
	"resource_type": string;
	url: string;
}

export interface Thumbnail{
	id: string;
	thumbnail: string;
}

export interface DatasetState{
	files: File[];
	datasets: Dataset[];
	newDataset: Dataset;
	about: Dataset;
	folders: Folder[];
	folderPath: string[];
}

export interface FileState{
	fileMetadata: FileMetadata;
	extractedMetadata: ExtractedMetadata;
	metadataJsonld: MetadataJsonld[];
	previews: FilePreview[];
	fileVersions: FileVersion[];
}

export interface UserState{
	Authorization: string | null;
	loginError: boolean;
	registerSucceeded: boolean;
	errorMsg: string;
}

export interface ErrorState{
	stack: string;
	reason: string;
	loggedOut: boolean;
}

export interface RootState {
	error: ErrorState;
	file:FileState;
	dataset:DatasetState;
	user: UserState;
}

