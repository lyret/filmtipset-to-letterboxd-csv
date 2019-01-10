import { request } from "./send-request";

/* Returns a list of the selected members owned movies */
export async function owned() {
	return (await request<MovieList[]>({ action: 'list', id: 'owned' }))[0];
}