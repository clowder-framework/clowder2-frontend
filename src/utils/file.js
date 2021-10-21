import {getHeader, dataURItoFile} from "./common";
import config from "../app.config";


export async function fetchFileMetadata(id){
	let url = `${config.hostname}/files/${id}/metadata?superAdmin=true`;
	let response = await fetch(url, {mode:"cors", headers: getHeader()});
	if (response.status  === 200){
		return await response.json();
	}
	else if  (response.status  === 401){
		// TODO handle error
		return {};
	}
	else {
		// TODO handle error
		return {};
	}
}

export async function uploadFile(formData, selectedDatasetId) {
	let endpoint = `${config.hostname}/datasets/${selectedDatasetId}/files?superAdmin=true`;
	let authHeader = getHeader();
	let body = new FormData();
	formData.map((item) =>{
		if (item["file"] !== undefined){
			body.append("file", dataURItoFile(item["file"]));
		}
	});

	let response = await fetch(endpoint, {
		method: "POST",
		mode: "cors",
		headers: authHeader,
		body: body,
	});

	if (response.status === 200) {
		// {id:xxx}
		// {ids:[{id:xxx}, {id:xxx}]}
		return response.json();
	} else if (response.status === 401) {
		// TODO handle error
		return {};
	} else {
		// TODO handle error
		return {};
	}
}

export async function downloadFile(fileId, filename=null){

	if (!filename){
		filename = `${fileId}.zip`;
	}
	let endpoint = `${config.hostname}/files/${fileId}/blob?superAdmin=true`;
	let response = await fetch(endpoint, {method: "GET", mode: "cors", headers: await getHeader()});

	if (response.status === 200) {
		let blob = await response.blob();
		if (window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveBlob(blob, filename);
		} else {
			let anchor = window.document.createElement("a");
			anchor.href = window.URL.createObjectURL(blob);
			anchor.download = filename;
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
		}
	}
	else if (response.status === 401) {
		// TODO
		console.log(response.json());
	}
	else {
		console.log(response.json());
	}

}
