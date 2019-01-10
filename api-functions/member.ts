import { request } from "./send-request";

/** Keeps a cached member object to limit the number of api calls */
let _cachedMember: Member | undefined;


/** Returns information about the selected member */
export async function member() {

	// Load the selected users number id on Filmtipset
	const usernr: string = require('../settings.json').user;

	if (!_cachedMember) {
		const results = await request<{ member: Member }[]>({ action: 'user', id: usernr });
		_cachedMember = results[0].member;
	}
	
	return _cachedMember;
}