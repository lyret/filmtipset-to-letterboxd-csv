
/** Throws an error if a neccessary setting is unconfigured */
export function validateSettings() : void | never {

	// Load the selected users number id on Filmtipset
	const usernr: string = require('../settings.json').user;

	if (!usernr || !usernr.length) {
		throw new Error("No user number is configured");
	}
}