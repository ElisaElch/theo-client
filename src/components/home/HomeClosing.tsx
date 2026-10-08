import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import mascot from "../../assets/theo-mascot1.png";

// Forest-green band at the bottom of the landing page: mascot, note, closing line and button
function HomeClosing() {
  return (
    <section className="flex flex-col items-center gap-8 rounded-[2rem] bg-forest px-8 py-10 text-center text-cream lg:flex-row lg:justify-between lg:px-14 lg:text-left">
      {/* Left: the mascot with a handwritten note */}
      <div className="flex items-center gap-4">
                <img src={mascot} alt="" className="w-48 shrink-0" />
        <p className="max-w-44 -rotate-6 font-hand text-2xl leading-tight">
          Collect moments, not things <span aria-hidden="true">♡</span>
        </p>
      </div>

      {/* Middle: the closing line, with a thin divider line on its left on large screens */}
      <p className="font-heading text-3xl leading-snug lg:border-l lg:border-cream/30 lg:pl-10">
        Places stay with you.
        <br />
        So does Theo.
      </p>

      {/* Right: the button */}
      <Link
        to="/signup"
        className="btn btn-lg border-none bg-cream text-forest hover:bg-soft-white"
      >
        Join Theo
        <ArrowRight className="size-5" aria-hidden="true" />
      </Link>
    </section>
  );
}

export default HomeClosing;