import { request } from "./send-request";

/* Returns a list of movies from the given list/package */
export async function list(listId?: "string") {
	return (await request<MovieList[]>({ action: 'list', id: listId }))[0];
}