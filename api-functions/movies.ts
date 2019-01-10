import { map } from 'lodash';
import { request } from './send-request';

/* Returns a list of movies */
export async function movies(ids: string[], comments?: number) {

	const results = await request<{ movie: Movie }[]>({
		action: 'movie',
		id: ids.join(),
		nocomments: (comments ? undefined : 1),
		commentcount: (!comments ? undefined : comments)
	});

	return map(results, result => result.movie);
}