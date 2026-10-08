import type { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode; // the page's own sections
};

const LAST_UPDATED = "8 October 2026";

// Shared layout for the Terms and Privacy pages: title, date, sections, contact note
function LegalLayout({ title, children }: Props) {
  return (
    <article className="mx-auto flex max-w-2xl flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-display text-4xl tracking-tight text-forest sm:text-5xl">{title}</h1>
        <p className="text-sm text-ink/60">Last updated: {LAST_UPDATED}</p>
      </header>

      {/* The [&_h2] and [&_p] classes style every heading, paragraph and list inside,
          so the pages themselves only need plain <h2>, <p> and <ul> tags */}
      <div className="flex flex-col gap-4 text-ink [&_h2]:mt-4 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-forest [&_li]:mt-1 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>

      <footer className="flex flex-col gap-2 border-t border-base-300 pt-6 text-sm">
        <p>
          Questions? Contact us at <span className="font-medium">hello@theo.example</span>*
        </p>
        <p className="text-ink/70 italic">
          *Theo is a student portfolio project. All current users know the student personally,
          or can reach them through a friend, for account deletion or in case of questions. 
        </p>
      </footer>
    </article>
  );
}

export default LegalLayout;