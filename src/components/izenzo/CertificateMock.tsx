function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{k}</span>
      <span className="text-[11px] text-foreground text-right">{v}</span>
    </div>
  );
}

function MockShell({
  label,
  right,
  children,
}: {
  label: string;
  right?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-border bg-card shadow-lg font-mono">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{label}</span>
        {right && (
          <span className="rounded-full bg-emerald-muted text-emerald-brand px-2 py-0.5 text-[10px] uppercase tracking-widest">
            {right}
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function CertificateOfIntent() {
  const evidence: [string, string][] = [
    ["Sale_Contract_GLN-IZN-2025-0418.pdf", "9f86d081…"],
    ["SGS_Quality_Certificate_LME-A.pdf", "2c26b46b…"],
    ["BL_Maersk_MAEU-7842910.pdf", "fcde2b2e…"],
  ];
  return (
    <MockShell label="Izenzo · Trade Desk" right="Bound">
      <p className="text-sm font-sans font-semibold text-foreground">Certificate of Intent</p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground/60">
        Match · A1B2C3D4 · WaD/A v1.2
      </p>
      <dl className="mt-5 space-y-2.5">
        <Row k="Counterparty" v="Glencore Singapore Pte Ltd" />
        <Row k="Commodity" v="Copper Cathode · LME Grade A" />
        <Row k="Volume" v="500 MT" />
        <Row k="Price" v="USD 9,420" />
        <Row k="Incoterms" v="CIF Rotterdam" />
      </dl>
      <div className="mt-5 pt-4 border-t border-border">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">
          Bound Evidence · 3 Files
        </p>
        <div className="space-y-1.5">
          {evidence.map(([file, hash]) => (
            <div key={file} className="flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted-foreground truncate">{file}</span>
              <span className="text-[10px] text-muted-foreground/50 shrink-0">{hash}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-border">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">
          SHA-256 hash-sealed record
        </p>
        <p className="text-[10px] text-muted-foreground/50 break-all">
          7c1a3d8e9b4f2a6c5d8e1f0b3c7a9d2e4f6b8a1c3d5e7f9a2b4c6d8e0f1a3b5c
        </p>
      </div>
    </MockShell>
  );
}

export function ComplianceProfileMock() {
  const owners: [string, string, string][] = [
    ["Aurelia Holdings AG", "Corporate · CH", "51.0%"],
    ["Marcus Van Der Berg", "Natural person · ZA", "32.5%"],
    ["Pinehurst Trust", "Corporate · JE", "16.5%"],
  ];
  return (
    <MockShell label="Izenzo · Compliance Engine" right="KYB reviewed">
      <p className="text-sm font-sans font-semibold text-foreground">Aurelia Trade Holdings (Pty) Ltd</p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground/60">
        Reg · 2019/438217/07 · ZA
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {["§01 · Entity", "§02 · Owners", "§03 · Documents"].map((s) => (
          <span key={s} className="rounded border border-border px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            {s}
          </span>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
            Declared beneficial owners
          </p>
          <span className="text-[10px] uppercase tracking-widest text-emerald-brand">100.0% · Resolved</span>
        </div>
        <div className="space-y-3">
          {owners.map(([name, meta, pct]) => (
            <div key={name} className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] text-foreground">{name}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground/50">{meta}</div>
              </div>
              <span className="text-[11px] text-emerald-brand">{pct}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
          <span className="text-muted-foreground/60">UBO threshold · 100%</span>
          <span className="text-emerald-brand">Complete</span>
        </div>
        <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground/60">
          KYB profile · SHA-256 sealed
        </p>
        <p className="text-[10px] text-muted-foreground/50 break-all">
          0x9f4e2c8a1b6d3f7e5a0c4b8d2e6f1a9c3b7d5e8f2a4c6b9d1e3f5a7c8b0d2e4f
        </p>
      </div>
    </MockShell>
  );
}

const WAD_GATES: [string, string][] = [
  ["Bilateral Signatures Verified", "aabbccddeeff00112233445566778899aabbccdd"],
  ["Counterparty KYB Reviewed", "1f0e3dad99908345f7439f8ffabdffc41859267b"],
  ["Sanctions Screening Cleared", "b6d767d2f8ed5d21a44b0e5886680cb9f2b3e2a1"],
  ["Jurisdiction Resolved (ZA · SG)", "3c59dc048e8850243be8079a5c74d079f2b3e1aa"],
  ["Signing Authority Bound", "b1d5781111d84f7b3fe45a0852e59758b3e0a9c2"],
  ["Commercial Terms Hash-Locked", "a3f5b8d2c4e7f1a9b6d8e2c5f7a4b1d9e6c3f8a2"],
  ["Document Integrity Verified", "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b"],
  ["Audit Trail Sealed (NTP Anchored)", "ccddeeff00112233445566778899aabbccddeeff"],
  ["WaD Certificate Issued", "verified"],
];

export function WadCertificate() {
  const terms: [string, string][] = [
    ["Commodity", "Copper Cathode · LME Grade A"],
    ["Volume", "500 MT"],
    ["Unit price", "USD 9,420"],
    ["Total consideration", "USD 4,710,000"],
    ["Incoterms", "CIF Rotterdam"],
    ["Payment terms", "L/C at sight (ABN AMRO confirmed)"],
    ["Buyer", "Aurubis AG"],
    ["Seller", "Glencore Singapore Pte Ltd"],
    ["Execution date", "Fri, 18 Apr 2025 09:41:58 GMT"],
    ["Status", "settled"],
  ];
  return (
    <MockShell label="Audit Ledger · Hash-sealed record" right="Ref · A1B2C3D4">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
        Izenzo Governance Infrastructure
      </p>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
        Without-a-Doubt · Issuance authority
      </p>
      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Match UUID</p>
        <p className="text-[11px] text-foreground break-all">a1b2c3d4-demo-4f5e-9c2a-7d3e8f1a2b3c</p>
      </div>
      <div className="mt-4">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Certificate class, WaD/A</p>
        <p className="text-sm font-sans font-semibold text-foreground leading-snug mt-1">
          Attestation of Commercial Intent
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-emerald-brand">
          Issued &amp; sealed · 2025-04-18T09:42:17Z
        </p>
      </div>
      <div className="mt-5 pt-4 border-t border-border">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-3">
          I · Verified commercial terms
        </p>
        <dl className="space-y-2">
          {terms.map(([k, v]) => (
            <Row key={k} k={k} v={v} />
          ))}
        </dl>
      </div>
      <div className="mt-5 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
            II · 9-Gate compliance trail
          </p>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40">Sample gate data</span>
        </div>
        <div className="space-y-2">
          {WAD_GATES.map(([title, hash], i) => (
            <div key={title}>
              <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] text-muted-foreground/50">GATE_0{i + 1}</span>
                <span className="flex-1 text-[11px] text-foreground">{title}</span>
                <span className="text-[10px] text-emerald-brand">0{i + 1}/09</span>
              </div>
              <p className="text-[10px] text-muted-foreground/40 break-all">{hash}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-5 pt-4 border-t border-border">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1">Payload hash (SHA-256)</p>
        <p className="text-[10px] text-muted-foreground/50 break-all">
          a3f5b8d2c4e7f1a9b6d8e2c5f7a4b1d9e6c3f8a2b5d7e1c4f9a6b3d8e2c5f7a4
        </p>
        <p className="mt-3 text-[10px] uppercase tracking-widest text-emerald-brand">Verify record integrity</p>
        <p className="mt-3 text-[10px] uppercase tracking-widest text-muted-foreground/60">Issuance authority</p>
        <p className="text-[11px] text-muted-foreground">Izenzo Governor, izenzo-gov-key-2025-q2-01</p>
        <p className="text-[10px] text-muted-foreground/40">Source · NTP · time.cloudflare.com (drift 4ms)</p>
      </div>
    </MockShell>
  );
}

export function NineGateTrail() {
  const gates = [
    "Entity Verification",
    "UBO Disclosure",
    "Sanctions Screening",
    "Jurisdiction Resolution",
    "Authority Binding",
    "Terms Lock",
    "Evidence Attachment",
    "Bilateral Collapse Sign",
    "WaD Certificate Issuance",
  ];
  return (
    <div className="rounded-md border border-border bg-card p-6 font-mono text-xs">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-sans font-semibold text-foreground">9-Gate Compliance Trail</span>
        <span className="rounded-full bg-emerald-muted text-emerald-brand px-2 py-0.5 text-[10px]">06/09</span>
      </div>
      <div className="space-y-2">
        {gates.map((g, i) => (
          <div key={g} className="flex items-center gap-3 text-muted-foreground">
            <span className="text-[10px] text-muted-foreground/50">GATE_0{i + 1}</span>
            <span className="flex-1 text-[11px]">{g}</span>
            <span className={`h-1.5 w-1.5 rounded-full ${i < 6 ? "bg-emerald-brand" : "bg-border"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
