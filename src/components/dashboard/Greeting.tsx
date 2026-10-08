import { useAuth } from "../../context/useAuth";

// "Good morning", "Good afternoon" or "Good evening", based on the hour on the user's own device
function greetingFor(hour: number): string {
  if (hour < 5) return "Good evening"; // the small hours still feel like evening
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Top of the logged-in home page: "Good morning, Theo 👋"
function Greeting() {
  const { user } = useAuth();

  // getHours() uses the device's own time zone, so it's right wherever the user travels
  const greeting = greetingFor(new Date().getHours());

  return (
    <header className="flex flex-col gap-1">
      <h1 className="font-display text-4xl tracking-tight text-forest sm:text-5xl">
        {greeting}, {user?.firstName} <span aria-hidden="true"></span>
      </h1>
      <p className="text-lg text-ink/80">What would you like to explore today?</p>
    </header>
  );
}

export default Greeting;