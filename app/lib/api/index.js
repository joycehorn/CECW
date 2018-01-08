/* global fetch:false */

import qs from "qs";
import axios from 'axios';
// import fetchival from 'fetchival';
axios.defaults.baseURL = 'http://staging.cleanedgecarwash.com.au/wp-json/ce-api/v1/';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
import apiConfig from "./config";

export const exceptionExtractError = (exception) => {
	if (!exception.Errors) return false;
	let error = false;
	const errorKeys = Object.keys(exception.Errors);
	if (errorKeys.length > 0) {
		error = exception.Errors[errorKeys[0]][0].message;
	}
	return error;
};

const endPoints = {
	lookupIdentifier: "lookupIdentifier",
	logVisit: "logVisit",
	updateRego: "updateRego",
  addRego: "addRego",
  giveWashcard: "giveWashcard",
};

export const lookupIdentifier = (identifier) => {
	return new Promise((resolve, reject) => {
		fetch(`${apiConfig.url}${endPoints.lookupIdentifier}`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: qs.stringify({
				"identifier": identifier,
				format: 'json'
			})
		}).then(response => response.json()).then(response => resolve(response)).catch(error => { console.log(error); reject(error);});
	});
};

export const giveWashcard = (data) => {
	return new Promise((resolve, reject) => {
		fetch(`${apiConfig.url}${endPoints.giveWashcard}`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: qs.stringify({
				"data": data
			})
		}).then(response => response.json()).then(response => resolve(response)).catch(error => { console.log(error); reject(error);});
	});
};

export const logVisit = (data) => {
	return new Promise((resolve, reject) => {
		fetch(`${apiConfig.url}${endPoints.logVisit}`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: qs.stringify({
				"data": data
			})
		}).then(response => response.json()).then(response => resolve(response)).catch(error => { console.log(error); reject(error);});
	});
};

export const updateRego = (data) => {
	return new Promise((resolve, reject) => {
		fetch(`${apiConfig.url}${endPoints.updateRego}`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: qs.stringify({
				"data": data
			})
		}).then(response => response.json()).then(response => resolve(response)).catch(error => { console.log(error); reject(error);});
	});
};

export const addRego = (data) => {
	return new Promise((resolve, reject) => {
		fetch(`${apiConfig.url}${endPoints.addRego}`, {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: qs.stringify({
				"data": data
			})
		}).then(response => response.json()).then(response => resolve(response)).catch(error => { console.log(error); reject(error);});
	});
};