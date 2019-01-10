import { request } from "./send-request";

/* Returns a list of recomended movies */
export async function recommendations() {
	return (await request<MovieList[]>({ action: 'recommendations', id: 0 }))[0];
}