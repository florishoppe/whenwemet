import Link from 'next/link';

export default function CompletePage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        <h2 className="mb-8 text-3xl font-black leading-tight md:text-4xl">
          DANK JE WEL
        </h2>
        <p className="mb-12 max-w-md text-lg leading-relaxed text-[#F5E8DC]/90">
          Je hebt een moment genomen om stil te staan bij waar je nu bent. Neem dit mee en gebruik het als startpunt voor gesprek, reflectie of richting.
        </p>
        <Link
          href="/"
          className="btn-primary rounded-full px-8 py-4 text-lg transition-all hover:scale-105"
        >
          OPNIEUW BEGINNEN
        </Link>
      </div>
    </div>
  );
}

