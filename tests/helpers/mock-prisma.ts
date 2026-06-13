import { vi } from "vitest";

export const prismaMock = {
	movie: {
		findMany: vi.fn(),
		findUnique: vi.fn(),
		create: vi.fn(),
		update: vi.fn(),
		deleteMany: vi.fn(),
	},
};

export function resetPrismaMock() {
	prismaMock.movie.findMany.mockReset();
	prismaMock.movie.findUnique.mockReset();
	prismaMock.movie.create.mockReset();
	prismaMock.movie.update.mockReset();
	prismaMock.movie.deleteMany.mockReset();
}
