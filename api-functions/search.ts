import { map } from "lodash";
import { request } from "./send-request";

/* Returns a list of movies matching the search string */
export async function search(query: string) {
	const results = await request<{ hits: { movie: MovieSummary }[] }[]>({ action: 'search', id: query.trim().toLowerCase() });

	return map(results[0].hits, hit => hit.movie);
}