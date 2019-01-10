import { json } from 'web-request';
import { handleRequestError } from './handle-request-error';

/** The URL to filmtipsets API */
const _apiURL: string = "http://www.filmtipset.se/api/api.cgi";

/** The applications accesskey */
const _accessKey: string = "Z4q7DUTh8P80TLpR8QDnKQ";

/** The users access key */
const _userKey: string = "";

/** Sends a data request to Filmtipset */
export async function request<D>(data: { [key: string]: any }): Promise<D> {

	// Set the correct encoding for the result data
	const charset = "latin1";

	// Load the selected users number id on Filmtipset
	const usernr: string = require('../settings.json').user;

	// Compose the request url
	let url = `${_apiURL}?returntype=json`;

	if (_accessKey) {
		url += `&accesskey=` + _accessKey;
	}
	if (usernr) {
		url += `&usernr=` + usernr;
	}
	if (_userKey) {
		url += `&userkey=` + _userKey;
	}

	for (const key in data) {
		url += `&${key}=${data[key]}`;
	}
	// console.log(url);

	try {

		// Get a list of responses from filmtipset
		const response = await json<{ data: D }[]>(url, {
			throwResponseError: true,
			headers: {
				'Data-Type': `json`,
				'Content-Type': `application/json; charset=${charset}`
			},
			encoding: charset
		});

		// Exctract the data from the response and return it
		return response[0].data as D;
	}
	catch (err) {
		throw handleRequestError(err);
	}
}