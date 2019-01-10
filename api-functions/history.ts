import { request } from "./send-request";
import { SSL_OP_EPHEMERAL_RSA } from "constants";

/* Returns a list of all watched movies, optionally filtered by a grade */
export async function history(filterByGrade?: "1" | "2" | "3" | "4" | "5") {
	const responses: MovieList[] = [];
	const grades = filterByGrade ? [filterByGrade] : ["1", "2", "3", "4", "5"];

	for (const grade of grades) {
		let offset = 0;
		while (true) {
			const result = await request<MovieList[]>({ action: 'list', id: "grades", grade, offset });
			
			responses.push(result[0]);

			if (result[0].movies.length < 100) {
				break;
			}
			else {
				offset += 100;
			}
		}
	}

	let movies: { movie: MovieSummary }[] = [];

	for (const result of responses) {
		movies = [...movies, ...result.movies];
	}

	return { movies, responses };
}