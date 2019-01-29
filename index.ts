import { find } from 'lodash';
import { validateSettings, isFavorite, movie, comments, latest, watchlist } from './api';
import { utils } from 'xlsx';
import { writeFile, exists, mkdir } from 'fs-promise';
import * as Moment from 'moment';

async function convertMovieReviewToLetterboxdCsvRow(movie: Movie | MovieSummary | undefined, review: MovieReviewRow, comments: MovieCommentRow[]): Promise<LetterboxdImportRow> {
	// const filmIsAfavorite = await isFavorite(movie);
	const filmHasSingleReview = (comments.length == 1);
	const filmHasSeveralReviews = (comments.length > 1);

	let watchedDate = filmHasSingleReview ? comments[0].datum : review['Datum'];
	if (Moment(watchedDate).isBefore(review['Datum'])) {
		watchedDate = review['Datum'];
	}

	let filmReview = ""

	if (filmHasSingleReview) {
		filmReview = comments[0]['kommentar'];
	}
	if (filmHasSeveralReviews) {
		for (const comment of comments) {
			filmReview += Moment().format("YYYY-MM-DD") + ":\n";
			filmReview += comment["kommentar"] + "\n\n";
		}
	}

	const results = {
		Title: review["Orginaltitel"],
		Year: review["År"],
		imdbID: "tt" + review["IMDB#"],
		WatchedDate: Moment(watchedDate).format("YYYY-MM-DD"),
		Rating: review["Ditt betyg"] ? Number(review["Ditt betyg"]) : undefined,
		Tags: "Imported from Filmtipset",
		Review: filmReview
	}

	return results;
}

async function createAHistoryCSV() {
	const userComments = await comments();
	const userReviews = await latest();
	const jsonResults = [];

	for (const comment of userComments) {
		let summary = await movie(comment.filmtipsid)
		let review = find(userReviews, (reviewedFilm) => summary.imdb == reviewedFilm["IMDB#"]);

		// Use and append this default movie review if non was found
		if (!review) {
			review = {
				"IMDB#": summary.imdb,
				"Datum": comment['datum'],
				"Orginaltitel": summary.orgname,
				"Titel": summary.name,
				"År": summary.year,
				"Ditt betyg": "",
				"Regissör": ""
			};
			userReviews.push(review);
		}

		review.summary = comment.summary = summary;
		review.comments = [...(review.comments || []), comment];
	}

	for (const review of userReviews) {
		const letterboxRow = await convertMovieReviewToLetterboxdCsvRow(review.summary, review, review.comments || []);
		jsonResults.push(letterboxRow);
	}

	// Export the results
	const worksheet = utils.json_to_sheet(jsonResults);
	const csvData = utils.sheet_to_csv(worksheet);

	if (!(await exists('.output'))) {
		await mkdir('.output');
	}
	await writeFile('.output/all-movie-reviews.csv', csvData, { encoding: 'utf8' });
}

async function createAWatchlistCSV() {
	const userWatchlist = await watchlist();
	const jsonResults = [];

	for (const { movie } of userWatchlist.movies) {

		const review: MovieReviewRow = {
			"IMDB#": movie.imdb,
			"Orginaltitel": movie.orgname,
			"Titel": movie.name,
			"År": movie.year,
			"Ditt betyg": "",
			"Regissör": "",
			"summary": movie
		};

		const letterboxRow = await convertMovieReviewToLetterboxdCsvRow(movie, review, []);
		jsonResults.push(letterboxRow);
	}

	// Export the results
	const worksheet = utils.json_to_sheet(jsonResults);
	const csvData = utils.sheet_to_csv(worksheet);

	if (!(await exists('.output'))) {
		await mkdir('.output');
	}
	await writeFile('.output/watchlist.csv', csvData, { encoding: 'utf8' });
}

async function main() {
	try {
		await validateSettings();
		createAWatchlistCSV();
		createAHistoryCSV();
	}
	catch (err) {
		console.error("The conversion failed with the following error:", err);
	}
}

main();


// SPLIT FILES PER 1000 films

// FILE SHOULD USE , DELIMITCHARACTER, STRINGS INSIDE ""

// WATCHED FILMS

// IMPORT TO A LIST
 // - Recomendations
 // - Owned

// WATCHLIST
 // - wanted list





// NOTES ON IMPORTING:

// Notes on importing
// There is no undo after the confirmation step. Be careful!
// The importer is available to Pro members all members (for a limited time).
// The importer shows you a summary of your file before performing the import, so you can fix any mis-matched titles and/or remove any inappropriate entries.
// All films imported to your Films/Diary will be automatically marked as watched (there is an option for this setting when importing films to a list).
// The importer will update existing Diary Entries if a film is imported with a WatchedDate that matches an existing entry for the same film already in your Diary, so you can add tags or a review to existing entries.
// Multiple lines containing the same film with the same WatchedDate will be combined into a single entry when the imported data is saved. If these are legitimately separate entries, you’ll need to add them manually.
// If both Rating columns contain data on any given line of the file, whichever column appears second in the file will take precedence.
// The importer works best in Chrome, due to its superior JavaScript engine. If you’re having trouble importing large files, try breaking them into multiple parts (ensure that the first “column header” row of the file exists in each part).