import { includes } from "lodash";
import { member } from "./member";

/** Returns whenever a given movie is a favorite of the selected members */
export async function isFavorite(movie : MovieSummary | Movie) {
	const favorites = (await member()).favorites.split(',').map(id => id.trim());
	
	return (includes(favorites, movie.id))
}