export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 text-white">
      <main className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight">Palette</h1>
        <p className="max-w-md text-lg text-neutral-400">
          Tell us your color in 90 seconds. We&apos;ll find your next obsession
          in every swipe after that.
        </p>
      </main>
    </div>
  );
}
