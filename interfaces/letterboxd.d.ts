
// This file contains interfaces for creating propeply formated csv files for letterboxd

/** A correctly formated row in a csv file that can be imported to Letterboxd */
interface LetterboxdImportRow {
	/** (optional, the URI of the matching film or diary entry) */
	LetterboxdURI? : string
	/** (optional, eg. 27205) */
	tmdbID? : number
	/** (optional, eg. tt1375666) */
	imdbID? : string
	/** (used for matching when no ID or URI is provided) */
	Title : string
	/** YYYY (optional, used for matching when no ID or URI is provided) */
	Year : string
	/** (optional, used for matching when no ID or URI is provided) */
	Directors? : string
	/** YYYY-MM-DD (optional, creates a Diary Entry for the film on this day) */
	WatchedDate : string
	/** (optional, rating out of 5 including 0.5 increments) */
	Rating? : number
	/** (optional, rating out of 10) */
	Rating10? : number
	/** (optional, added to Diary Entry if WatchedDate is provided) */
	Tags? : string
	/** Text/HTML (optional, allows the same HTML tags as the website, added to Diary Entry if WatchedDate is provided, otherwise added as a review with no specified date)* */
	Review? : string

}