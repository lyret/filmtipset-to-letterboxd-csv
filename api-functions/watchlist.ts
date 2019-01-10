import { request } from "./send-request";

/* Returns a list of the selected members watchlisted movies */
export async function watchlist() {
	return (await request<MovieList[]>({ action: 'list', id: 'wantedlist' }))[0];
}