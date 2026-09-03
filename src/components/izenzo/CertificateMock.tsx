export function CertificateOfIntent() {
  return (
    <div className="rounded-md border border-border bg-card shadow-lg p-6 font-mono text-xs">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-sans font-semibold text-foreground">Certificate of Intent</span>
        <span className="rounded-full bg-emerald-muted text-emerald-brand px-2 py-0.5 text-[10px] uppercase">
          Bound
        </span>
      </div>
      <dl className="space-y-2 text-muted-foreground">
        <Row k="Counterparty" v="Glencore Singapore Pte Ltd" />
        <Row k="Commodity" v="Copper Cathode LME Grade A" />
        <Row k="Volume" v="500 MT" />
        <Row k="Price" v="USD 9,420" />
        <Row k="Incoterms" v="CIF Rotterdam" />
      </dl>
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2">Bound Evidence</p>
        <div className="space-y-1">
          {['kyc_cert_a1f9…pdf', 'sanctions_scr_7c2e…json', 'authority_bind_9d1a…sig'].map((f) => (
            <div key={f} className="text-[11px] text-muted-foreground">
              {f}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border text-[10px] text-muted-foreground/50 break-all">
        SHA-256 8f3a1c9e2b4d7f60a1e5c8b2d9f4a7e3c6b1d8f2a5e9c3b7d1f4a8e2c5b9d3f7
      </div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground/60">{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  )
}

export function NineGateTrail() {
  const gates = [
    'Entity Verification',
    'UBO Disclosure',
    'Sanctions Screening',
    'Jurisdiction Resolution',
    'Authority Binding',
    'Terms Lock',
    'Evidence Attachment',
    'Bilateral Collapse Sign',
    'WaD Certificate Issuance',
  ]
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
            <span
              className={`h-1.5 w-1.5 rounded-full ${i < 6 ? 'bg-emerald-brand' : 'bg-border'}`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
