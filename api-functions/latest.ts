import { get } from 'web-request';
import { writeFile, readFile, exists, ensureDir } from 'fs-promise';
import { read, utils } from 'xlsx';
import { map } from 'lodash';
import * as Moment from 'moment';

import { handleRequestError } from './handle-request-error';


/** The URL to the export function on Filmtipset.se */
const _apiURL: string = "http://www.filmtipset.se/export.cgi";

/** Gets the selected users latest movies, whitch seems to include the full history of all watched films */
export async function latest() {

	// Set the correct encoding for the result data
	const charset = "utf8";

	// Load the selected users number id on Filmtipset
	const usernr: string = require('../settings.json').user;
	const userkey: string = "YhmN6rVr"; // TODO: Move

	// Compose the request url
	const url = `${_apiURL}?list=latest&userkey=${userkey}&member=${usernr}`;

	// Compose the cache file path
	let cachedFile = `.cache/${usernr}-latest`;

	try {
		let xlsResults: string | Buffer | undefined = undefined;

		// Load the cached request if available
		if (await exists(cachedFile)) {
			xlsResults = await readFile(cachedFile);
		}

		// Get a list of responses from filmtipset
		else {
			const response = await get(url, {
				throwResponseError: true,
				headers: {
					'Content-Type': `application/vnd.ms-excel; charset=${charset}`
				},
				encoding: null
			});

			await ensureDir(`.cache`);
			await writeFile(cachedFile, response.content, { encoding: charset });
			xlsResults = response.content;
		}

		// Exctract a json data list from the xls results
		const workbook = read(xlsResults, { raw: true });

		for (const name of workbook.SheetNames) {
			const sheet = workbook.Sheets[name];

			const jsonResults = utils.sheet_to_json<MovieReviewRow>(sheet);

			map(jsonResults, (row) => {
				row.Datum = Moment(row.Datum, "YYYY-MM-DD hh:mm:ss").toDate();
			});

			// Return the first sheet
			return (jsonResults)
		}
	}
	catch (err) {
		throw handleRequestError(err);
	}
	return [];
}