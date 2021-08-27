import Cookies from "universal-cookie";
import jwt_decode from "jwt-decode";
import config from "../app.config";

const cookies = new Cookies();


//NOTE: This is only checking if a cookie is present, but not validating the cookie.
export const isAuthorized = () => {
	const authorization = cookies.get("Authorization");
	return process.env.DEPLOY_ENV === "local" ||
			(authorization !== undefined && authorization !== "" && authorization !==
					null);
};

// construct header
export function getHeader() {
	const headers = new Headers({
		"X-API-Key": config.apikey
	});

	return headers;

		// const headers = new Headers({
		// 	"Authorization": cookies.get("Authorization"),
		// });
}

export async function downloadResource(url){
		let authHeader = getHeader();
		let response = await fetch(url, {
			method: "GET",
			mode: "cors",
			headers: authHeader,
		});

		if (response.status  === 200){
			let blob = await response.blob();
			return window.URL.createObjectURL(blob);
		}
		else if  (response.status  === 401){
			// TODO handle error
			return null;
		}
		else {
			// TODO handle error
			return null;
		}
}

export function dataURItoFile(dataURI) {
	let metadata = dataURI.split(",")[0];
	let mime = metadata.match(/:(.*?);/)[1];
	let filename = metadata.match(/name=(.*?);/)[1];

	let binary = atob(dataURI.split(",")[1]);
	let array = [];
	for (let i = 0; i < binary.length; i++) {
		array.push(binary.charCodeAt(i));
	}
	const blob = new Blob([new Uint8Array(array)], {type: mime});
	return new File([blob], filename, {type: mime, lastModified: new Date()});
}

export async function upload(endpoint, formData, type='application/json') {
	endpoint = `${config.hostname}/clowder/api/${endpoint}`;
	let authHeader = getHeader();
	let body;

	if (type === "application/json"){
		authHeader.append('Accept', type);
		authHeader.append('Content-Type', type);
		body = JSON.stringify(formData);
	}
	else if (type === "multipart/form-data"){
		body = new FormData();
		formData.map((item) =>{
			if (item["file"] !== undefined) body.append("file", dataURItoFile(item["file"]));
			// TODO
			else body.append("text", JSON.stringify(item))
		});
	}

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


// get current username
// export function getCurrUsername(){
// 	if (process.env.DEPLOY_ENV === "local"){
// 		return config.testUserInfo;
// 	}
// 	else{
// 		let cookie = cookies.get("Authorization");
// 		if (cookie !== "" && cookie.split(" ").length > 0){
// 			let userInfo = jwt_decode(cookie.split(" ")[1]);
// 			return userInfo["preferred_username"];
// 		}
// 	}
// }

// get current user's encoded email address for datawolf use
// export function getCurrUserInfo(){
// 	if (process.env.DEPLOY_ENV === "local"){
// 		return config.testUserInfo;
// 	}
// 	else{
// 		let cookie = cookies.get("Authorization");
// 		if (cookie !== "" && cookie.split(" ").length > 0){
// 			let userInfo = jwt_decode(cookie.split(" ")[1]);
// 			let email = userInfo["email"];
// 			return btoa(`{"email":"${email}"}`);
// 		}
// 	}
// }
//
// // get incore token and write to a file
// export function getIncoreTokenFile(){
// 	if (process.env.DEPLOY_ENV !== "local"){
// 		return new Blob([cookies.get("Authorization")], {type:"text/plain"});
// 	}
// 	else{
// 		return null;
// 	}
// }
//
// // get current user's encoded email address for datawolf use
// export function getCurrUserEmail(){
// 	if (process.env.DEPLOY_ENV === "local"){
// 		return config.testUserInfo;
// 	}
// 	else{
// 		let cookie = cookies.get("Authorization");
// 		if (cookie !== "" && cookie.split(" ").length > 0){
// 			let userInfo = jwt_decode(cookie.split(" ")[1]);
// 			return userInfo["email"];
// 		}
// 	}
// }

// export function getShortHTML(html){
// 	let htmlSoup = new JSSoup(html);
// 	return htmlSoup.find("div", "shortDescription");
// }
//
// export function round(val, n){
// 	if (n === undefined || n === 0) {
// 		return Math.round(val);
// 	}
// 	else {
// 		return Number(val).toFixed(n);
// 	}
// }
//
// export function formatPercent(val, n = 1){
// 	return `${round(val, n)  }%`;
// }
//
// export function formatProbToPercent(val, n = 1){
// 	return formatPercent(val*100, n);
// }
