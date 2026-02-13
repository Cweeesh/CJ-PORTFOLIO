import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-white">
     <main className="flex min-h-screen w-full max-w-1xl flex-col items-center justify-center py-32 px-16 bg-white">
    
    <div className="flex flex-col items-center gap-10">
      <h1 className="max-w-xs text-center text-3xl font-semibold leading-10 tracking-tight text-black">
        Hello world po
      </h1>
    </div>

  </main>
</div>
  );
}
