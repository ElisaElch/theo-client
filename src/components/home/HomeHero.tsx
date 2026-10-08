import { Link } from "react-router";
import heroPhoto from "../../assets/home-hero.webp";

// Top of the landing page: headline, intro, buttons and the main photo
function HomeHero() {
  return (
    <section className="grid items-center gap-10 lg:grid-cols-2">
      {/* Left: text and buttons (relative: the note is pinned to this on medium screens) */}
      <div className="relative flex flex-col gap-6">
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-forest sm:text-5xl lg:text-6xl">
          Good places stay with you.
        </h1>
        <p className="max-w-md text-lg text-ink">
          Theo helps you remember, share and discover the cafés, restaurants and hotels worth
          coming back to.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link to="/signup" className="btn btn-primary btn-lg">
            Get started
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            Log in
          </Link>
        </div>

    
      </div>

      {/* Right: the photo, with a big soft curve on the top-left corner like the mockup */}
      <div className="relative">
        <img
          src={heroPhoto}
          alt=""
          className="aspect-[4/3] w-full rounded-[2rem] object-cover lg:aspect-auto lg:h-[34rem] lg:rounded-tl-[9rem]"
        />

        {/* Handwritten list over the top-left of the photo */}
        <p className="absolute top-8 left-10 -rotate-6 font-hand text-2xl leading-snug font-semibold text-forest sm:text-3xl lg:top-14 lg:left-24">
          Cafés
          <br />
          Restaurants
          <br />
          Hotels
          <br />
          
          <br />
          
        </p>
      </div>
    </section>
  );
}

export default HomeHero;