import { Link } from "react-router";
import LegalLayout from "../components/LegalLayout";

// /privacy: what Theo stores, who can see it, and what you can do about it
function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <p>
        Theo is built around your own memories, so privacy matters. This page explains, in plain
        language, what we store, who can see it, and what you can do about it. It goes together
        with our <Link to="/terms" className="link">Terms of Service</Link>.
      </p>

      <h2>What we store</h2>
      <ul>
        <li>
          <strong>Your account:</strong> first and last name, username, email address, bio, home
          city, profile photo, your settings, and when you agreed to our terms.
        </li>
        <li>
          <strong>Your password</strong> is never stored as you typed it, only as a secure,
          scrambled version (a hash) that can't be turned back into the password.
        </li>
        <li>
          <strong>Your places:</strong> each place's name and location, plus your own visit
          details: date, rating, what you had, your memory, tags, photos and favourites.
        </li>
        <li>
          <strong>Your friends:</strong> who you're connected with, pending requests, and who
          you've muted.
        </li>
      </ul>

      <h2>Who can see what</h2>
      <ul>
        <li>You can see everything in your own account.</li>
        <li>
          Your friends can see your places, ratings, memories, tags and photos, but never the
          dates. Theo never shows anyone else when you were somewhere.
        </li>
        <li>
          Someone who searches for your exact username only sees your username and first name.
          Your full name is shown to people you're friends with, or who you've sent a request to.
        </li>
        <li>Theo has no public profiles, and nothing appears in search engines.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Theo uses one cookie, to keep you logged in. It lasts 7 days and is removed when you log
        out. There are no advertising, analytics or tracking cookies.
      </p>

      <h2>Services we use</h2>
      <p>To run Theo, some data passes through these services:</p>
      <ul>
        <li>
          <strong>MongoDB Atlas</strong> stores the database, <strong>Cloudinary</strong> stores
          photos, <strong>Render</strong> runs the server and <strong>Vercel</strong> hosts the
          website.
        </li>
        <li>
          <strong>OpenStreetMap (Nominatim)</strong> receives what you type when you search for a
          place, and your approximate location if you use "near me".
        </li>
        <li>
          <strong>CARTO</strong> provides the map images, and <strong>Google Fonts</strong>{" "}
          provides the fonts. Like any website, these receive your IP address when they load.
        </li>
      </ul>
      <p>We never sell your data, and we don't show ads.</p>

      <h2>Your choices</h2>
      <ul>
        <li>You can edit or delete any of your places and photos at any time.</li>
        <li>You can mute or remove friends at any time.</li>
        <li>
          You can ask to see the data we hold about you, have it corrected, or have your account
          and everything in it deleted.
        </li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        Your data is kept until you delete it or ask for your account to be deleted. Photos you
        delete are removed from Cloudinary too.
      </p>
    </LegalLayout>
  );
}

export default PrivacyPage;