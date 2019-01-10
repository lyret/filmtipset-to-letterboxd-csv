
// This file contains interfaces for responses sent by Filmtipsets API

interface FilmtipsetAPIResponse<D> {
    /** API identifier */ source?: string
    /** Request as the server understood it */ request: { action?: string, id?: string }
    /** Username of the user that owns the application (awlays Lyret) */ "access-user": string
    /** Data sent in response */ data?: D

    /** The user that made the request if any */ user?: { name: string, id: number }
}

interface MovieGrade { value: "5" | "4" | "3" | "2" | "1", type: string }
interface PersonalMovieGrade extends MovieGrade { type: "seen" }
interface OfficialMovieGrade extends MovieGrade { count: string, type: "official" }

interface MovieCommentRow {
	"titel": string
	"filmtipsid": string
	"kommentar": string
	"datum": Date
	
	"summary"?: MovieSummary | Movie

}

interface MovieReviewRow {
	"Titel": string
	"Orginaltitel": string
	"År": string
	"Regissör": string
	"Datum"?: Date
	"Ditt betyg": string
	"IMDB#": string,

	"summary"?: MovieSummary | Movie
	"comments"?: MovieCommentRow[]
}

interface MovieSummary {
	directorids: { director: { name: string, id: string } }[]
	filmtipsetgrade: OfficialMovieGrade
	genres: { genre: string }[]
	grade: OfficialMovieGrade | PersonalMovieGrade
	id: string
	imdb: string
	image: string
	length: string
	name: string
	orgname: string
	url: string
	year: string
}

interface Movie {
	actorids: { name: string, id: string }[]
	country: string
	description: string
	directorids: { director: { name: string, id: string } }[]
	filmtipsetgrade: { count: string, value: string }
	genres: { genre: string }[]
	grade: { count: string, value: string, type: "seen" | "none" | "calculated" | "official" }
	id: string
	comments?: { comment: Comment }[]
	imdb: string
	image: string
	length: string
	name: string
	orgname: string
	url: string
	writerids: { writer: { name: string, id: string } }[]
	year: string
}

interface MovieList {
	list: string

	title: string
	description: string
	count: number
	movies: { movie: MovieSummary }[]
	offset?: number
}

interface Comment {
	member: string
	name: string
	text: string
	grade: string
	date: string // YYYY-MM-DD hh:mm:ss
}

interface Member {
	id: string
	/** Nickname */ name: string
	firstname: string
	lastname: string
	personaltext: string
	city: string
	age: string
	/** Indicates if this user is active  */activity: 'aktiv' | string
	/** Comma seperated lists of latest movies seen (ids) */ 'last-seen': string
	/** Comma seperated lists of friends (ids) */ 'friends': string
	/** Comma seperated list of this users favorite movies (ids) */ 'favorites': string
	/** Comma seperated list of this users hated movies (ids) */ 'hated': string
	/** Comma seperated list of this users watchlist ( movie ids) */ 'wanted': string
}