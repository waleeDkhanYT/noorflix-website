import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalList,
  LegalPageLayout,
  LegalSection,
} from "@/components/legal/LegalPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms & Conditions",
  description:
    "Read the terms of use for NoorFlix — a premium discovery platform for movies, TV shows, and anime.",
  path: "/terms",
});

const LAST_UPDATED = "June 17, 2026";

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="Welcome to NoorFlix. These terms explain what you can expect from us, what we expect from you, and how third-party content fits into the experience."
      lastUpdated={LAST_UPDATED}
      currentPath="/terms"
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using NoorFlix at any URL we operate, you agree to these
          Terms & Conditions and our{" "}
          <Link
            href="/privacy"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          . If you do not agree, please do not use the service.
        </p>
        <p>
          We may update these terms occasionally. Material changes will be reflected
          by updating the date at the top of this page. Your continued use after
          changes are posted means you accept the revised terms.
        </p>
      </LegalSection>

      <LegalSection title="2. What NoorFlix Is (and Isn't)">
        <p>
          NoorFlix is a <strong className="text-foreground">discovery and information platform</strong> for
          movies, TV shows, and anime. We help you explore titles, compare ratings,
          view cast and crew, find trailers, and see where content may be available
          to stream through legitimate third-party services.
        </p>
        <p>
          NoorFlix does <strong className="text-foreground">not</strong> host, upload, or provide
          illegal streams, downloads, or pirated content. We are not a substitute
          for licensed streaming platforms, cinemas, or physical media.
        </p>
      </LegalSection>

      <LegalSection title="3. Permitted Use">
        <p>You may use NoorFlix for lawful, personal, non-commercial purposes, including:</p>
        <LegalList
          items={[
            "Browsing and searching for movies, TV shows, and anime.",
            "Saving titles to your personal watchlist for later reference.",
            "Following links to official streaming providers, trailers, and external resources.",
            "Sharing links to NoorFlix pages with friends and fellow fans.",
          ]}
        />
        <p>
          You agree to use the service responsibly and in compliance with all
          applicable laws in your jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="4. Prohibited Use">
        <p>You agree not to:</p>
        <LegalList
          items={[
            "Use NoorFlix to find, promote, or access pirated or unauthorized streams or downloads.",
            "Scrape, crawl, or automate access to the service in a way that harms performance or violates third-party API terms.",
            "Attempt to bypass security measures, reverse engineer proprietary parts of the site, or interfere with normal operation.",
            "Misrepresent NoorFlix as a streaming service or content licensor.",
            "Use the platform for harassment, spam, or any unlawful activity.",
          ]}
        />
        <p>
          We reserve the right to restrict or block access for behavior that violates
          these terms or puts the service or its users at risk.
        </p>
      </LegalSection>

      <LegalSection title="5. Third-Party Content & Services">
        <p>
          NoorFlix displays metadata, images, ratings, and availability information
          sourced from third parties such as TMDB, OMDb, and Watchmode. We do not
          control and are not responsible for the accuracy, completeness, or
          timeliness of third-party data.
        </p>
        <LegalList
          items={[
            "Posters, backdrops, and descriptions may be subject to copyright held by studios, distributors, or other rights holders.",
            "Ratings and reviews are provided by third-party databases and may change without notice.",
            "“Where to Watch” links point to external platforms; availability, pricing, and regional access are determined solely by those providers.",
          ]}
        />
        <p>
          Your use of third-party websites and apps is governed by their own terms
          and policies. NoorFlix is not affiliated with or endorsed by TMDB, OMDb,
          Watchmode, IMDb, Netflix, or any other rights holder unless explicitly
          stated.
        </p>
      </LegalSection>

      <LegalSection title="6. Intellectual Property">
        <p>
          The NoorFlix name, logo, interface design, and original code are owned by
          us or our licensors. You may not copy, modify, or redistribute them without
          permission.
        </p>
        <p>
          All movie, TV, and anime titles, artwork, logos, and trademarks displayed
          on NoorFlix belong to their respective owners. Display of this material is
          for identification and discovery purposes only and does not imply
          ownership or licensing by NoorFlix.
        </p>
      </LegalSection>

      <LegalSection title="7. User Content & Watchlist">
        <p>
          Your watchlist is stored locally in your browser. You are responsible for
          maintaining backups of anything important to you, since clearing browser
          data may remove saved items.
        </p>
        <p>
          If optional account features are introduced later, additional terms may
          apply and will be communicated clearly at that time.
        </p>
      </LegalSection>

      <LegalSection title="8. Disclaimers">
        <p>
          NoorFlix is provided <strong className="text-foreground">&ldquo;as is&rdquo;</strong> and{" "}
          <strong className="text-foreground">&ldquo;as available&rdquo;</strong> without warranties of
          any kind, whether express or implied, including merchantability, fitness
          for a particular purpose, or non-infringement.
        </p>
        <p>We do not guarantee that:</p>
        <LegalList
          items={[
            "The service will be uninterrupted, error-free, or free of harmful components.",
            "Third-party data (ratings, availability, metadata) will always be accurate or up to date.",
            "Any particular title will be available on any specific streaming platform.",
          ]}
        />
      </LegalSection>

      <LegalSection title="9. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, NoorFlix and its operators shall
          not be liable for any indirect, incidental, special, consequential, or
          punitive damages arising from your use of — or inability to use — the
          service, including reliance on third-party data or external links.
        </p>
        <p>
          Our total liability for any claim related to the service shall not exceed
          the amount you paid to use NoorFlix in the twelve months preceding the
          claim (which, for most users, is zero).
        </p>
      </LegalSection>

      <LegalSection title="10. Indemnification">
        <p>
          You agree to indemnify and hold harmless NoorFlix from claims, damages,
          or expenses arising from your misuse of the service, violation of these
          terms, or infringement of any third-party rights.
        </p>
      </LegalSection>

      <LegalSection title="11. Governing Law">
        <p>
          These terms are intended to be interpreted in a fair and reasonable manner
          consistent with applicable consumer protection laws in your region. If any
          provision is found unenforceable, the remaining provisions will continue
          in full effect.
        </p>
      </LegalSection>

      <LegalSection title="12. Contact">
        <p>
          For questions about these Terms & Conditions, reach out through the social
          channels in our footer. For privacy-related inquiries, see our{" "}
          <Link
            href="/privacy"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}