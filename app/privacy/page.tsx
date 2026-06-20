import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalList,
  LegalPageLayout,
  LegalSection,
} from "@/components/legal/LegalPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Learn how NoorFlix collects, uses, and protects your information when you browse movies, TV, and anime.",
  path: "/privacy",
});

const LAST_UPDATED = "June 18, 2026";

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="We built NoorFlix to help you discover great stories — not to collect unnecessary data. This policy explains what we handle, what stays on your device, and how third-party services fit in."
      lastUpdated={LAST_UPDATED}
      currentPath="/privacy"
    >
      <LegalSection title="1. Overview">
        <p>
          NoorFlix (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is
          a movie and TV discovery platform. We do not host or stream copyrighted
          content. Most of what you see on NoorFlix comes from public entertainment
          databases and is displayed for browsing and discovery purposes only.
        </p>
        <p>
          By using NoorFlix, you agree to the practices described in this Privacy
          Policy. If you do not agree, please discontinue use of the service.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>
          We take a minimal-data approach. You can browse titles, read details, and
          build a watchlist without creating an account.
        </p>
        <p>
          <strong className="text-foreground">Guests (not signed in)</strong> — we
          do not store your watchlist on our servers. Saved titles remain in your
          browser&apos;s local storage on your device.
        </p>
        <p>
          <strong className="text-foreground">Signed-in users</strong> — if you
          create an account, we store only what is needed to provide the service:
        </p>
        <LegalList
          items={[
            "Account identifier and email address (via Supabase Auth).",
            "Optional profile fields: username and avatar URL.",
            "Watchlist entries: TMDB content ID, media type, title, poster path reference, and save date — not full video content.",
            "Preferences: favorite genres, language, theme, and optional cloud sync setting.",
          ]}
        />
        <p>We may also process limited technical data:</p>
        <LegalList
          items={[
            "Usage data such as pages visited and search queries — typically in hosting logs.",
            "Technical data such as browser type and general region — to keep the site secure and responsive.",
            "Theme preference stored locally in your browser.",
          ]}
        />
        <p>
          We do not collect payment details. We do not sell personal data or use
          your watchlist for advertising profiling.
        </p>
      </LegalSection>

      <LegalSection title="3. Your Watchlist — Local & Cloud Storage">
        <p>
          NoorFlix uses a hybrid watchlist model designed for data minimization:
        </p>
        <LegalList
          items={[
            "Guests: watchlist data is stored in localStorage on your device only.",
            "Signed-in users with cloud sync enabled: watchlist is stored in our Supabase database, protected by Row Level Security so only you can access your rows.",
            "Signed-in users with cloud sync disabled: watchlist stays on your device, like a guest.",
            "We store TMDB references and basic display metadata only — never hosted media files.",
          ]}
        />
        <p>
          Clearing browser site data may remove local copies. Deleting your account
          removes associated server-side watchlist and preference data.
        </p>
      </LegalSection>

      <LegalSection title="4. Cookies & Similar Technologies">
        <p>
          NoorFlix uses a small number of browser storage mechanisms to provide a
          smooth experience:
        </p>
        <LegalList
          items={[
            "localStorage for guest watchlists, UI preferences, and consent notices.",
            "Authentication session cookies managed by Supabase when you sign in.",
            "Theme settings managed by our appearance provider (next-themes).",
          ]}
        />
        <p>
          We do not use cookies to track you across unrelated websites. You can
          clear cookies and local storage at any time through your browser settings,
          though doing so may remove your watchlist and preferences.
        </p>
      </LegalSection>

      <LegalSection title="5. Third-Party Services">
        <p>
          NoorFlix relies on trusted third-party APIs to show posters, ratings,
          cast information, and streaming availability. When you use NoorFlix,
          your browser may request data from these services (often through our
          secure server-side proxies):
        </p>
        <LegalList
          items={[
            "TMDB (The Movie Database) — metadata, images, trailers, and recommendations.",
            "OMDb — supplementary ratings such as IMDb and Metascore where available.",
            "Watchmode — “Where to Watch” streaming availability by region.",
          ]}
        />
        <p>
          Each third party has its own privacy policy and data practices. We
          encourage you to review their documentation. We only send the minimum
          information needed to retrieve public entertainment data — for example, a
          title ID or search term — not your personal identity.
        </p>
        <p>
          Links to external streaming platforms open in a new tab and are governed
          by those providers&apos; terms and privacy policies.
        </p>
      </LegalSection>

      <LegalSection title="6. How We Use Information">
        <p>Any limited data we process is used to:</p>
        <LegalList
          items={[
            "Display search results, detail pages, and recommendations.",
            "Remember your watchlist and theme preference.",
            "Improve performance, fix bugs, and protect against abuse.",
            "Understand aggregate usage patterns to make NoorFlix better.",
          ]}
        />
        <p>We do not use your data for targeted advertising or sell it to data brokers.</p>
      </LegalSection>

      <LegalSection title="7. Data Retention">
        <p>
          Server logs and hosting analytics may be retained for a limited period
          according to our infrastructure provider&apos;s policies, then deleted or
          aggregated.
        </p>
        <p>
          Local watchlist and UI data remain on your device until you clear them.
          Account-linked watchlist and preferences are retained while your account
          is active and deleted when your account is deleted, subject to our
          database provider&apos;s backup policies.
        </p>
      </LegalSection>

      <LegalSection title="8. Your Choices & Rights">
        <p>You are in control. You can:</p>
        <LegalList
          items={[
            "Clear your watchlist by removing items individually or clearing site data in your browser.",
            "Disable cloud sync in your watchlist settings to keep data local only.",
            "Sign out to end your session, or delete your account from the account menu to permanently remove server-side data.",
            "Switch between light and dark mode at any time.",
            "Stop using NoorFlix at any time without penalty.",
          ]}
        />
        <p>
          Depending on where you live, you may have additional rights regarding
          access, correction, or deletion of personal data. Contact us if you have
          questions — we are happy to help.
        </p>
      </LegalSection>

      <LegalSection title="9. Children's Privacy">
        <p>
          NoorFlix is intended for a general audience. We do not knowingly collect
          personal information from children under 13. If you believe a child has
          provided us with personal information, please reach out so we can address
          it promptly.
        </p>
      </LegalSection>

      <LegalSection title="10. Security">
        <p>
          We use industry-standard practices to protect your information,
          including:
        </p>
        <LegalList
          items={[
            "Row Level Security (RLS) on all user database tables in Supabase.",
            "Server Actions and route handlers for database writes — no direct client database access.",
            "Server-side proxies for third-party API keys (TMDB, OMDb, Watchmode).",
            "Input validation on user-submitted data and API parameters.",
            "HTTPS in production and security headers including Content Security Policy.",
          ]}
        />
        <p>
          No method of transmission over the internet is 100% secure, but we work
          to safeguard information within reasonable means. See our project
          security documentation for technical details.
        </p>
      </LegalSection>

      <LegalSection title="11. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will
          revise the &ldquo;Last updated&rdquo; date at the top of this page.
          Continued use of NoorFlix after changes take effect constitutes acceptance
          of the updated policy.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact Us">
        <p>
          Questions about privacy? Reach us through our social channels linked in
          the footer, or review our{" "}
          <Link
            href="/terms"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Terms & Conditions
          </Link>{" "}
          for usage guidelines.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}