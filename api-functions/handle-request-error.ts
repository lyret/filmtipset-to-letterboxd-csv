
/** Logs a request error in a standardised way */
export function handleRequestError(err: Error | any): never {
	if (err.responseJSON) {
		console.error(JSON.stringify(err.responseJSON, null, 2));
	}
	else if (err.responseText) {
		console.error(err.responseText);
	}
	else {
		console.error(err);
	}
	
	throw new Error("The request failed.");
}