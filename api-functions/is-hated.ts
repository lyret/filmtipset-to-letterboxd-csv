import { includes } from "lodash";
import { member } from "./member";

/** Returns whenever a given movie is hated by the selected members */
export async function isHated(movie : MovieSummary | Movie) {
	const hated = (await member()).hated.split(',').map(id => id.trim());

	return (includes(hated, movie.id))
}