import Image from "next/image";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-white">
      <main className="flex min-h-screen w-full max-w-none flex-col items-center justify-center py-32 px-16 bg-white">
        
        <div className="flex flex-col items-center gap-10">
          <h1 className="w-full text-center text-[100px] font-semibold leading-none tracking-tighter text-black whitespace-nowrap">
            Hi! I am CJ
          </h1>
        </div>

      </main>

      <div className="fixed bottom-1 right-8">
        <Image 
          src="/cj.png" 
          alt="CJ" 
          width={700} 
          height={700} 
          className="object-contain"
          priority
        />
      </div>
    </div>
  );
}