export const genres = [
	"Horror",
	"Comedy",
	"Drama",
	"Sci-Fi",
	"Western",
	"Silent",
	"Animation",
	"Documentary",
	"Film Noir",
	"Crime",
	"Adventure",
	"Classic",
] as const;

export type Genre = (typeof genres)[number];
