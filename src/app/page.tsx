import { api } from "~/trpc/server";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <nav
        className="fixed top-0 left-0 z-50 w-full px-4 py-2 bg-black text-white border-b border-gray-800 shadow-md"
      >
        Nav
      </nav>
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
        </h1>
      </div>
    </main>
  );
}

