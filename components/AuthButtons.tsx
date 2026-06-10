import { auth, signIn, signOut } from "@/auth";

export default async function AuthButton() {
  const session = await auth();

  if (!session) {
    return (
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button
          type="submit"
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          Login
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-slate-300 sm:inline">
        {session.user?.name ?? session.user?.email}
      </span>

      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button
          type="submit"
          className="rounded-md border border-red-900/60 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-red-500 hover:text-white"
        >
          Logout
        </button>
      </form>
    </div>
  );
}