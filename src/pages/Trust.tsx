import { Layout } from "@/components/izenzo/Layout";

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 list-disc list-inside">
      {items.map((i) => (
        <li key={i}>{i}</li>
      ))}
    </ul>
  );
}

const sections: { h: string; body: React.ReactNode }[] = [
  {
    h: "Shared responsibility",
    body: "Izenzo is built on a managed cloud backend (database, authentication, file storage, and serverless functions). The platform provider operates the underlying infrastructure. Izenzo configures application-level access rules, workflows and integrations on top of it, and you, as the account holder - remain responsible for protecting your sign-in credentials, the counterparties you invite, and the information you choose to upload.",
  },
  {
    h: "Access & authentication",
    body: (
      <Bullets
        items={[
          "Email + password sign-in with managed password reset flows.",
          "Server-side session management; sessions expire and can be revoked.",
          "Role-based access (platform admin, compliance owner, organisation admin, member, auditor) enforced in the database.",
          "Row-level security policies scope every organisation's records so members of one organisation cannot read another organisation's data.",
          "Sensitive operational tables (raw import data, provenance, internal readiness state) are restricted to platform admin and compliance owner roles.",
        ]}
      />
    ),
  },
  {
    h: "Platform & hosting context",
    body: (
      <Bullets
        items={[
          "Application data is stored in a managed Postgres database with row-level security enabled.",
          "Uploaded files are stored in managed object storage with per-object access policies.",
          "Server-side logic runs in serverless functions invoked over HTTPS.",
          "All client ↔ server traffic is served over TLS.",
        ]}
      />
    ),
  },
  {
    h: "Data we collect & how it is used",
    body: (
      <>
        <Bullets
          items={[
            "Account profile information (name, email, organisation).",
            "Trade Request, Counterparty and Proof of Intent records you create.",
            "Evidence documents you upload to support a match or claim.",
            "Audit events generated as you act on records (used for governance, dispute handling and regulatory traceability).",
          ]}
        />
        <p className="mt-3">
          We use this data to operate the service, fulfil compliance obligations on transactions you initiate, and
          improve product reliability. We do not sell personal data.
        </p>
      </>
    ),
  },
  {
    h: "Retention & deletion",
    body: (
      <Bullets
        items={[
          "Trade and compliance records follow a documented lifecycle and are retained for the period required to meet audit and regulatory obligations.",
          "Account holders can request deletion of their account from within the app; account self-deletion follows a 30-day grace window and then anonymises personal fields.",
          "Records under an active legal hold or dispute are preserved until the matter is resolved, after which standard retention applies.",
        ]}
      />
    ),
  },
  {
    h: "Subprocessors & integrations",
    body: "Izenzo relies on the managed cloud backend that hosts the application, database, authentication and storage layers. Specific third-party services (for example identity verification, registry lookups, payment settlement, transactional email) are engaged for the workflow you trigger. A current list of subprocessors is available on request.",
  },
  {
    h: "Cookies & analytics",
    body: "Izenzo uses cookies and similar storage required to keep you signed in and to remember basic UI preferences. Product analytics, if enabled, are used in aggregate to understand which workflows are used; we do not use this data for cross-site advertising.",
  },
  {
    h: "Privacy requests",
    body: (
      <>
        To request access to, correction of, export of, or deletion of your personal data, email{" "}
        <a href="mailto:privacy@izenzo.co.za" className="text-emerald-brand">
          privacy@izenzo.co.za
        </a>
        . We will acknowledge requests within a reasonable timeframe and respond in line with applicable South
        African data-protection law (POPIA).
      </>
    ),
  },
  {
    h: "Security contact & vulnerability reporting",
    body: (
      <>
        If you believe you have found a security issue, please report it privately to{" "}
        <a href="mailto:security@izenzo.co.za" className="text-emerald-brand">
          security@izenzo.co.za
        </a>
        . Please do not publicly disclose the issue before we have had a reasonable opportunity to investigate and
        remediate. We appreciate coordinated disclosure and will keep reporters informed of progress.
      </>
    ),
  },
  {
    h: "Compliance & certifications",
    body: (
      <>
        Izenzo operates as a South African private company. We align internal controls with POPIA obligations for
        the personal data we process. We do not currently claim SOC 2, ISO 27001, PCI-DSS or HIPAA certification;
        if you require a specific compliance statement for procurement, contact{" "}
        <a href="mailto:compliance@izenzo.co.za" className="text-emerald-brand">
          compliance@izenzo.co.za
        </a>
        .
      </>
    ),
  },
];

export default function Trust() {
  return (
    <Layout>
      <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-16">
        <span className="text-xs font-mono uppercase tracking-widest text-emerald-brand">Trust Surface</span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-foreground mb-4">
          Trust, security &amp; privacy
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-3">
          This page is maintained by Starfair162 (Pty) Ltd t/a Izenzo to answer common security and privacy
          questions about the Izenzo Trade Desk and Registry. It describes controls currently enabled in the app,
          the hosting platform we build on, and how the Izenzo team handles your data. It is not an independent
          certification.
        </p>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground/50 mb-12">
          Last updated: 21 June 2026
        </p>

        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.h}>
              <h2 className="text-lg font-semibold text-foreground mb-2">{s.h}</h2>
              <div className="text-sm text-muted-foreground leading-relaxed">{s.body}</div>
            </div>
          ))}
        </div>

        <p className="mt-14 text-xs italic text-muted-foreground/50">
          This page is editable project content maintained by the Izenzo team. It is not independently verified or
          certified by any third party. Capabilities described reflect the production configuration on the date
          above and may change as the product evolves.
        </p>
      </div>
    </Layout>
  );
}
