import { Link } from "react-router";
import LegalLayout from "../components/LegalLayout";

// /terms: the Terms of Service, in plain language
function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <p>
        Welcome to Theo, a personal memory book for the cafés, restaurants and hotels you love. By
        creating an account, you agree to these terms. We've kept them short and in plain language.
      </p>

      <h2>About Theo</h2>
      <p>
        Theo is a student portfolio project. It's provided as it is, without any guarantees, and
        it may change, have interruptions or be taken offline at any time.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>Use your real details and keep your password to yourself.</li>
        <li>You're responsible for what happens in your account.</li>
        <li>One account per person, please.</li>
      </ul>

      <h2>Your places and photos</h2>
      <ul>
        <li>Everything you add (your places, memories, ratings and photos) stays yours.</li>
        <li>
          You give Theo permission to store it and show it to you and your friends, as described
          in our <Link to="/privacy" className="link">Privacy Policy</Link>.
        </li>
        <li>Only upload photos you took yourself or have permission to share.</li>
      </ul>

      <h2>Be kind</h2>
      <ul>
        <li>No offensive, hateful or illegal content.</li>
        <li>No spam, and no pretending to be someone else.</li>
        <li>Don't try to access other people's accounts or break the service.</li>
      </ul>

      <h2>Friends</h2>
      <p>
        You decide who your friends are. Friends can see your saved places, ratings and memories,
        but never when you were there. You can mute or remove a friend at any time.
      </p>

      <h2>Recommendations</h2>
      <p>
        Places on Theo are personal opinions from you and your friends, not checked facts. Opening
        times, prices and other details may have changed, so please check before you go.
      </p>

      <h2>Ending your account</h2>
      <p>
        You can ask for your account and everything in it to be deleted at any time. We may remove
        accounts that break these terms.
      </p>

      <h2>Changes</h2>
      <p>
        If these terms change, we'll update the date at the top of this page.
      </p>
    </LegalLayout>
  );
}

export default TermsPage;