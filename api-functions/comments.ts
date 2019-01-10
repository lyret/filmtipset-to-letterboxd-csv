import { get } from 'web-request';
import { writeFile, readFile, exists, ensureDir } from 'fs-promise';
import { read, utils } from 'xlsx';
import { map } from 'lodash';
import * as Moment from 'moment';

import { handleRequestError } from './handle-request-error';

/** The URL to Arvids php script for getting comments from Filmtipset   */
const _apiURL: string = "http://www.arvid.nu/scripts/ft-kommentarer.php";

/** Gets the selected users comments from Arvids PHP script */
export async function comments() {

	// Set the correct encoding for the result data
	const charset = "utf8";

	// Load the selected users number id on Filmtipset
	const usernr: string = require('../settings.json').user;

	// Compose the request url
	let url = `${_apiURL}?id=${usernr}`;

	// Compose the cache file path
	let cachedFile = `.cache/${usernr}-comments`;

	try {
		let csvResults: string | Buffer | undefined = undefined;

		// Load the cached request if available
		if (await exists(cachedFile)) {
			csvResults = await readFile(cachedFile);
		}

		// Get a list of responses from filmtipset
		const response = await get(url, {
			throwResponseError: true,
			headers: {
				'Content-Type': `application/vnd.ms-excel; charset=${charset}`
			},
			encoding: null
		});

		await ensureDir(`.cache`);
		await writeFile(cachedFile, response.content, { encoding: charset });
		csvResults = response.content;

		// Exctract a json data list from the csv results
		const workbook = read(csvResults, { raw: true });

		for (const name of workbook.SheetNames) {
			const sheet = workbook.Sheets[name];

			const jsonResults = utils.sheet_to_json<MovieCommentRow>(sheet);

			for (const row of jsonResults) {
				row.datum = Moment(row.datum, "YYYY-MM-DD hh:mm:ss").toDate();
			}

			// Return the first sheet
			return jsonResults
		}
	}
	catch (err) {
		handleRequestError(err);
	}
	return [];
}