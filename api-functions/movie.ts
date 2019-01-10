import { movies } from "./movies";

/* Returns a single movie */
export async function movie(id: string, comments?: number) {
	const results = await movies([id], comments);

	if (!results.length) {
		throw new Error(`Movie ${id} was not found`);
	}
	return results[0];
}