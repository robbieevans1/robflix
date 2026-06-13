import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import { prismaMock } from "./helpers/mock-prisma";

process.env.AUTH_SECRET ??= "test-secret-for-vitest";

vi.mock("@/lib/prisma", () => ({
	prisma: prismaMock,
}));

vi.mock("next/link", () => ({
	default: ({
		children,
		href,
		...props
	}: {
		children: React.ReactNode;
		href: string;
	}) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}));

afterEach(() => {
	cleanup();
});
