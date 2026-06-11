import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function SecretPage() {
	const session = await auth();

	if (!session?.user) {
		redirect("/");
	}

	return (
		<main className="min-h-screen px-6 py-12 text-white">
			<section className="mx-auto max-w-4xl rounded-xl border border-red-950/40 bg-black/70 p-8 shadow-xl backdrop-blur">
				<p className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-500">
					Secret Page
				</p>

				<h1 className="mb-4 text-4xl font-bold">Secret Robflix Page</h1>

				<p className="mb-6 text-lg leading-8 text-slate-300">
					You have found the secret page! This page can only be viewed by users
					who are signed in with GitHub.
				</p>

				<div className="rounded-lg bg-slate-950/80 p-4 text-sm text-slate-300">
					<p>
						<span className="font-semibold text-white">Signed in as:</span>{" "}
						{session.user.email ?? session.user.name ?? "GitHub user"}
					</p>
				</div>
			</section>
		</main>
	);
}
