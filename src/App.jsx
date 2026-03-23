import { useState, useEffect } from "react";

const FONT = "'CeraPro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Breakroom design tokens
const COLORS = {
  bg: "#faf8f4",
  card: "#ffffff",
  text: "#323232",
  muted: "#646362",
  border: "#e1e1e1",
  // good
  green: "#6dba84",
  greenBg: "#eaf6e8",
  greenBorder: "#6dba84",
  // okay/warning
  amber: "#ffcf4d",
  amberText: "#8a6400",
  amberBg: "#fff4d7",
  amberBorder: "#ffcf4d",
  // bad/danger
  red: "#cf4044",
  redBg: "#faecec",
  redBorder: "#cf4044",
  // primary brand (coral/peach)
  accent: "#f1666a",
  accentBg: "#ffecea",
  accentBorder: "#f9d5d3",
};

const SHADOW = "0px 4px 4px rgba(0, 0, 0, 0.05)";

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.innerWidth >= 900);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isDesktop;
};

const Signal = ({ status, label, detail, subtext }) => {
  const c =
    status === "good"
      ? { bg: COLORS.greenBg, border: COLORS.greenBorder, dot: COLORS.green, textColor: COLORS.green, icon: "✓" }
      : status === "warning"
      ? { bg: COLORS.amberBg, border: COLORS.amberBorder, dot: COLORS.amber, textColor: COLORS.amberText, icon: "~" }
      : { bg: COLORS.redBg, border: COLORS.redBorder, dot: COLORS.red, textColor: COLORS.red, icon: "✕" };
  return (
    <div style={{ padding: "12px 14px", background: c.bg, border: `1px solid ${c.border}`, borderRadius: 5, display: "flex", gap: 10, alignItems: "flex-start" }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: c.dot, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{c.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{label}</div>
        <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 2, lineHeight: 1.45 }}>{detail}</div>
        {subtext && <div style={{ fontSize: 12, color: c.textColor, marginTop: 4, fontWeight: 500 }}>{subtext}</div>}
      </div>
    </div>
  );
};

const Section = ({ title, icon, children, defaultOpen = false, badge }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", padding: "14px 0", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: FONT }}
      >
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, flex: 1, textAlign: "left" }}>{title}</span>
        {badge && (
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: badge.bg, color: badge.textColor || badge.color }}>
            {badge.text}
          </span>
        )}
        <span style={{ fontSize: 12, color: COLORS.muted, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}>▾</span>
      </button>
      <div style={{ maxHeight: open ? 1200 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ paddingBottom: 16, display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
      </div>
    </div>
  );
};

const ReviewSnippet = ({ quote, score, role, date, best }) => (
  <div style={{ padding: "10px 12px", background: COLORS.bg, borderRadius: 5, border: `1px solid ${COLORS.border}`, fontSize: 13, lineHeight: 1.5 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
      <span style={{ fontWeight: 700, color: COLORS.text }}>{best ? "👍 Best:" : "👎 Worst:"}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: score >= 6 ? COLORS.green : score >= 4 ? COLORS.amberText : COLORS.red }}>{score}/10</span>
    </div>
    <div style={{ color: COLORS.muted, fontStyle: "italic" }}>"{quote}"</div>
    <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 4 }}>{role} · {date}</div>
  </div>
);

const RatingBadge = ({ score, size = "small" }) => {
  const color = score >= 7 ? COLORS.green : score >= 5.5 ? COLORS.amber : COLORS.red;
  const bgColor = score >= 7 ? COLORS.greenBg : score >= 5.5 ? COLORS.amberBg : COLORS.redBg;
  const dim = size === "large" ? 52 : 36;
  const fontSize = size === "large" ? 18 : 14;
  return (
    <div style={{ width: dim, height: dim, borderRadius: "50%", background: bgColor, border: `2px solid ${color}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontSize, fontWeight: 700, color: score >= 5.5 ? COLORS.amberText : color, lineHeight: 1 }}>{score}</span>
      <span style={{ fontSize: 8, fontWeight: 500, color: COLORS.muted, lineHeight: 1 }}>/10</span>
    </div>
  );
};

const AltJob = ({ title, company, pay, rating, location, badge, highlight }) => (
  <div
    style={{ padding: "12px 14px", border: `1px solid ${COLORS.border}`, borderRadius: 5, cursor: "pointer", transition: "all 0.15s", background: COLORS.card, position: "relative", boxShadow: SHADOW }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accent; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; }}
  >
    {badge && (
      <div style={{ position: "absolute", top: -8, right: 12, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
        {badge.text}
      </div>
    )}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{title}</div>
        <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>{company} · {location}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{pay}</div>
        <div style={{ fontSize: 12, fontWeight: 700, color: rating >= 7 ? COLORS.green : rating >= 5.5 ? COLORS.amberText : COLORS.muted }}>{rating}/10</div>
      </div>
    </div>
    {highlight && <div style={{ fontSize: 12, color: COLORS.green, fontWeight: 500, marginTop: 6 }}>{highlight}</div>}
  </div>
);

const OnboardingDrawer = ({ open, onClose, onSubmit }) => {
  const [postcode, setPostcode] = useState("");
  const [currentPay, setCurrentPay] = useState("");
  const [travel, setTravel] = useState("");
  const [priorities, setPriorities] = useState(new Set());
  const togglePriority = (p) => setPriorities((s) => { const n = new Set(s); n.has(p) ? n.delete(p) : n.add(p); return n; });

  const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 4, border: `1px solid ${COLORS.border}`, fontSize: 14, fontFamily: FONT, marginBottom: 16, background: COLORS.card, color: COLORS.text, outline: "none" };
  const labelStyle = { fontSize: 13, fontWeight: 700, color: COLORS.text, display: "block", marginBottom: 6 };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s", zIndex: 100 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "85vh", background: COLORS.bg, borderRadius: "16px 16px 0 0", padding: "20px 20px 32px", transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform 0.35s ease", zIndex: 101, overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border, margin: "0 auto 16px" }} />
        <h3 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: COLORS.text, fontFamily: FONT }}>Help us find you better jobs</h3>
        <p style={{ fontSize: 14, color: COLORS.muted, margin: "6px 0 20px", lineHeight: 1.5 }}>Answer a few quick ones and we'll show you jobs that actually fit your life. Takes 30 seconds.</p>

        <label style={labelStyle}>Your postcode (for commute times)</label>
        <input value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="e.g. TW1 3QS" style={inputStyle} />

        <label style={labelStyle}>What do you currently earn? (per hour)</label>
        <input value={currentPay} onChange={(e) => setCurrentPay(e.target.value)} placeholder="e.g. £12.00" type="text" style={inputStyle} />

        <label style={labelStyle}>How do you get to work?</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          {["🚗 Drive", "🚌 Bus", "🚂 Train", "🚲 Cycle", "🚶 Walk"].map((t) => (
            <button key={t} onClick={() => setTravel(t)}
              style={{ padding: "8px 14px", borderRadius: 100, border: `1px solid ${travel === t ? COLORS.accent : COLORS.border}`, background: travel === t ? COLORS.accentBg : COLORS.card, fontSize: 13, cursor: "pointer", fontFamily: FONT, color: travel === t ? COLORS.accent : COLORS.text, fontWeight: travel === t ? 700 : 400, transition: "all 0.15s" }}>
              {t}
            </button>
          ))}
        </div>

        <label style={labelStyle}>What matters most to you? (pick up to 3)</label>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
          {["Better pay", "Short commute", "No heavy lifting", "Daytime only", "Paid breaks", "Sick pay", "Friendly team", "Career progression"].map((p) => (
            <button key={p} onClick={() => { if (priorities.has(p) || priorities.size < 3) togglePriority(p); }}
              style={{ padding: "6px 12px", borderRadius: 100, border: `1px solid ${priorities.has(p) ? COLORS.green : COLORS.border}`, background: priorities.has(p) ? COLORS.greenBg : COLORS.card, fontSize: 12, cursor: "pointer", fontFamily: FONT, color: priorities.has(p) ? COLORS.green : COLORS.muted, fontWeight: priorities.has(p) ? 700 : 400, transition: "all 0.15s" }}>
              {p}
            </button>
          ))}
        </div>

        <button onClick={() => onSubmit({ postcode, currentPay, travel, priorities: [...priorities] })}
          style={{ width: "100%", padding: "14px", borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONT, transition: "opacity 0.15s" }}
          onMouseEnter={(e) => e.target.style.opacity = "0.85"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
          Show me better matches →
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: "10px", background: "none", border: "none", fontSize: 13, color: COLORS.muted, cursor: "pointer", marginTop: 8, fontFamily: FONT }}>
          Not now, I'll keep browsing
        </button>
      </div>
    </>
  );
};

// ─── Shared sub-components ─────────────────────────────────────────────────────

const AlternativesList = ({ personalised, onOpenDrawer }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, fontFamily: FONT }}>Similar jobs nearby</h2>
      <button onClick={onOpenDrawer} style={{ fontSize: 12, color: COLORS.accent, fontWeight: 700, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, textDecoration: "underline" }}>
        Match me ✎
      </button>
    </div>
    <p style={{ fontSize: 13, color: COLORS.muted, margin: "0 0 14px" }}>
      {personalised ? "Sorted by your preferences" : "Based on this job's location and pay range. Tell us more to get better matches."}
    </p>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <AltJob title="Warehouse Operative" company="Gap Personnel" pay="£13.25–17.25/hr" rating={7.4} location="London"
        badge={{ text: "BETTER RATED", bg: COLORS.greenBg, color: COLORS.green, border: COLORS.greenBorder }}
        highlight="Rated 'Good Employer' · +£0.67–4.67/hr more · Proper breaks & respectful managers" />
      <AltJob title="Logistics Operator" company="Shorterm Group" pay="£14.24–18.37/hr" rating={6.3} location="London SE25"
        badge={{ text: "+£1.66/HR", bg: COLORS.accentBg, color: COLORS.accent, border: COLORS.accentBorder }}
        highlight="Significantly higher pay · Better employer rating (6.3 vs 5.2)" />
      <AltJob title="Warehouse Operative" company="Gi Group" pay="£14.69/hr" rating={6.0} location="London"
        highlight="£2.11/hr more · Part time available · Proper breaks & respectful managers" />
      <AltJob title="Warehouse Operator (Nights)" company="DSV" pay="TBC" rating={7.7} location="Hounslow"
        badge={{ text: "TOP RATED", bg: COLORS.greenBg, color: COLORS.green, border: COLORS.greenBorder }}
        highlight="7.7/10 score · Same area · People enjoy this job & learn new skills" />
      <AltJob title="FLT Driver" company="Manpower" pay="£13/hr" rating={6.2} location="Hounslow"
        highlight="Same location · Higher employer score · £0.42/hr more" />
    </div>
  </div>
);

const PersonaliseNudge = ({ personalised, onOpenDrawer }) =>
  personalised ? (
    <div style={{ marginTop: 16, padding: "12px 16px", background: COLORS.greenBg, borderRadius: 5, border: `1px solid ${COLORS.greenBorder}`, textAlign: "center" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>✓ Showing personalised matches</div>
      <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 2 }}>
        Based on your commute, pay, and preferences ·{" "}
        <span onClick={onOpenDrawer} style={{ textDecoration: "underline", cursor: "pointer", color: COLORS.accent }}>Edit</span>
      </div>
    </div>
  ) : (
    <button onClick={onOpenDrawer} style={{ width: "100%", marginTop: 20, padding: "16px", borderRadius: 5, border: `1.5px dashed ${COLORS.accent}`, background: COLORS.accentBg, cursor: "pointer", fontFamily: FONT, textAlign: "center" }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>🎯 Get jobs that match your life</div>
      <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>Tell us your postcode, current pay, and what matters — we'll filter out the noise</div>
    </button>
  );

// ─── Desktop sidebar ───────────────────────────────────────────────────────────

const DesktopSidebar = ({ personalised, onOpenDrawer }) => (
  <div style={{ position: "sticky", top: 60, alignSelf: "start", display: "flex", flexDirection: "column", gap: 16 }}>
    {/* Job summary card */}
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 5, padding: "20px 20px 16px", boxShadow: SHADOW }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16 }}>
        <RatingBadge score={5.2} size="large" />
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: FONT, color: COLORS.text, lineHeight: 1.2 }}>Warehouse Operative</div>
          <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 3 }}>The Best Connection · Agency</div>
          <div style={{ fontSize: 12, color: COLORS.amberText, fontWeight: 500, marginTop: 2 }}>Mixed reviews from 53 workers</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[
          { icon: "💷", label: "Pay", value: "£12.58/hr" },
          { icon: "📍", label: "Location", value: "Hounslow" },
          { icon: "🕐", label: "Type", value: "Full time" },
          { icon: "📋", label: "Shifts", value: "4 on / 4 off" },
        ].map((f) => (
          <div key={f.label} style={{ padding: "8px 10px", background: COLORS.bg, borderRadius: 4 }}>
            <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 2 }}>{f.icon} {f.label}</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{f.value}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "8px 12px", background: COLORS.amberBg, border: `1px solid ${COLORS.amberBorder}`, borderRadius: 4, fontSize: 13, color: COLORS.amberText, fontWeight: 500, textAlign: "center", marginBottom: 16 }}>
        ⚠ Mixed employer — check pay & hours before applying
      </div>

      <button style={{ width: "100%", padding: "13px", borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONT, transition: "opacity 0.15s", marginBottom: 8 }}
        onMouseEnter={(e) => e.target.style.opacity = "0.85"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
        Apply →
      </button>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={{ flex: 1, padding: "10px", borderRadius: 4, border: `1.5px solid ${COLORS.border}`, background: COLORS.card, fontSize: 14, cursor: "pointer", fontFamily: FONT, color: COLORS.text, fontWeight: 500 }}>
          ☆ Save
        </button>
        <button onClick={onOpenDrawer} style={{ flex: 1, padding: "10px", borderRadius: 4, border: `1.5px solid ${COLORS.accent}`, background: COLORS.accentBg, fontSize: 14, cursor: "pointer", fontFamily: FONT, color: COLORS.accent, fontWeight: 700 }}>
          Match me ✎
        </button>
      </div>
    </div>

    {/* Alternatives */}
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 5, padding: "20px", boxShadow: SHADOW }}>
      <AlternativesList personalised={personalised} onOpenDrawer={onOpenDrawer} />
      <PersonaliseNudge personalised={personalised} onOpenDrawer={onOpenDrawer} />
    </div>
  </div>
);

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function JobTriagePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [personalised, setPersonalised] = useState(false);
  const isDesktop = useIsDesktop();

  const heroBlock = (
    <div style={{ padding: "20px 0 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <RatingBadge score={5.2} size="small" />
        <div>
          <div style={{ fontSize: 13, color: COLORS.text }}>The Best Connection <span style={{ color: COLORS.muted }}>· Agency</span></div>
          <div style={{ fontSize: 12, color: COLORS.amberText, fontWeight: 500 }}>Mixed reviews from 53 workers</div>
        </div>
      </div>
      <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, lineHeight: 1.2, fontFamily: FONT, color: COLORS.text }}>Warehouse Operative</h1>
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        {[
          { icon: "💷", text: "£12.58/hr" },
          { icon: "📍", text: "Hounslow" },
          { icon: "🕐", text: "Full time", sub: "4 on / 4 off" },
          { icon: "📋", text: "12hr shifts" },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ fontSize: 14 }}>{f.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{f.text}</span>
            {f.sub && <span style={{ fontSize: 12, color: COLORS.muted }}>({f.sub})</span>}
          </div>
        ))}
      </div>
    </div>
  );

  const sectionsBlock = (
    <>
      <Section title="Can you do this job?" icon="⚡" defaultOpen={true} badge={{ text: "CHECK FIRST", bg: COLORS.amberBg, textColor: COLORS.amberText }}>
        <Signal status="warning" label="Pay: below London Living Wage"
          detail="£12.58/hr — the London Living Wage is £14.80/hr. 38% of workers here say they're paid below Living Wage."
          subtext="That's ~£26,165/yr before tax on these shifts" />
        <Signal status="warning" label="Commute: Hounslow (Twickenham area)"
          detail="Near Heathrow. Shift times are 6am, 8am, or 10am starts — check early-morning transport from your area."
          subtext="Tap to check commute from your postcode →" />
        <Signal status="warning" label="Requirements: 5-year background check + DBS"
          detail="You'll need 5 years of address history and references. CAA security clearance required (they pay for it). Must have valid photo ID."
          subtext="Heavy lifting up to 30kg required" />
        <Signal status="good" label="No prior warehouse experience mentioned"
          detail="The listing doesn't require previous warehouse experience — just that you're reliable and comfortable with physical work." />
      </Section>

      <Section title="What's it really like here?" icon="🔍" badge={{ text: "5.2/10", bg: COLORS.amberBg, textColor: COLORS.amberText }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[
            { label: "Respectful managers", pct: 72, status: "good" },
            { label: "Proper breaks", pct: 82, status: "good" },
            { label: "Stressed at work", pct: 71, status: "bad" },
            { label: "No sick pay", pct: 86, status: "bad" },
            { label: "Unpaid breaks", pct: 70, status: "bad" },
            { label: "Easy to book holiday", pct: 83, status: "good" },
          ].map((v) => (
            <div key={v.label} style={{ padding: "8px 10px", borderRadius: 4, background: v.status === "good" ? COLORS.greenBg : COLORS.redBg, fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: v.status === "good" ? COLORS.green : COLORS.red, marginBottom: 3 }}>{v.status === "good" ? "✓" : "✕"} {v.pct}%</div>
              <div style={{ color: COLORS.muted, lineHeight: 1.3 }}>{v.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 4, padding: "10px 12px", background: COLORS.redBg, border: `1px solid ${COLORS.redBorder}`, borderRadius: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.red, marginBottom: 4 }}>⚠ Red flags from workers</div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>
            <li>86% say no proper sick pay</li>
            <li>71% say the job is stressful</li>
            <li>80% say head office is disconnected</li>
            <li>Shift notice: 1 week or less (100% report this)</li>
          </ul>
        </div>
        <div style={{ padding: "10px 12px", background: COLORS.greenBg, border: `1px solid ${COLORS.greenBorder}`, borderRadius: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.green, marginBottom: 4 }}>✓ Good things workers mention</div>
          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: COLORS.muted, lineHeight: 1.6 }}>
            <li>Managers are mostly respectful (72%)</li>
            <li>Proper breaks taken (82%)</li>
            <li>Easy to book holiday (83%)</li>
            <li>No shift changes at short notice (69%)</li>
          </ul>
        </div>
      </Section>

      <Section title="What workers actually said" icon="💬">
        <ReviewSnippet best={true} quote="Flexible when needed" score={8.2} role="Agency worker" date="Sep 2024" />
        <ReviewSnippet best={true} quote="Good team and good training" score={8.0} role="Branch manager" date="Jun 2024" />
        <ReviewSnippet best={false} quote="The managers, the stress levels" score={1.8} role="Administrator" date="Jul 2023" />
        <div style={{ fontSize: 13, color: COLORS.accent, fontWeight: 700, cursor: "pointer", textAlign: "center", padding: "4px 0" }}>See all 53 reviews →</div>
      </Section>

      <Section title="Full job details" icon="📄">
        <div style={{ fontSize: 14, lineHeight: 1.7, color: COLORS.muted }}>
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: COLORS.text }}>What you'll do:</strong> Sorting, scanning, and processing mail bags for international dispatch. Heavy lifting up to 30kg. Working with a leading international mail and parcel courier.</p>
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: COLORS.text }}>Shifts:</strong> 4 on / 4 off rotation. Three possible start times: 6am–6pm, 8am–8pm, or 10am–10pm (12-hour shifts).</p>
          <p style={{ margin: "0 0 8px" }}><strong style={{ color: COLORS.text }}>You'll need:</strong> Valid photo ID, 5-year address history, willingness to get DBS check and attend Aviation Security Course (both paid by employer).</p>
          <p style={{ margin: 0 }}><strong style={{ color: COLORS.text }}>Regulated by:</strong> Civil Aviation Authority (CAA) — that's why the background checks are strict.</p>
        </div>
      </Section>
    </>
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONT, color: COLORS.text }}>
      {/* Sticky top bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}`, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>← Back to results</span>
        <span style={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>Breakroom</span>
      </div>

      {isDesktop ? (
        /* ── Desktop two-column layout ── */
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: "0 32px 60px", display: "grid", gridTemplateColumns: "1fr 400px", gap: 48, alignItems: "start" }}>
          <div>
            {heroBlock}
            {sectionsBlock}
          </div>
          <DesktopSidebar personalised={personalised} onOpenDrawer={() => setDrawerOpen(true)} />
        </div>
      ) : (
        /* ── Mobile single-column layout ── */
        <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 120px" }}>
          {heroBlock}
          {sectionsBlock}

          <div style={{ marginTop: 24, marginBottom: 8 }}>
            <AlternativesList personalised={personalised} onOpenDrawer={() => setDrawerOpen(true)} />
            <PersonaliseNudge personalised={personalised} onOpenDrawer={() => setDrawerOpen(true)} />
          </div>
        </div>
      )}

      {/* Mobile-only sticky bottom bar */}
      {!isDesktop && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, background: "rgba(250,248,244,0.95)", backdropFilter: "blur(12px)", borderTop: `1px solid ${COLORS.border}`, padding: "12px 16px" }}>
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", gap: 10 }}>
            <button style={{ flex: 1, padding: "12px", borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: FONT, transition: "opacity 0.15s" }}
              onMouseEnter={(e) => e.target.style.opacity = "0.85"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
              Apply →
            </button>
            <button style={{ padding: "12px 16px", borderRadius: 4, border: `1.5px solid ${COLORS.border}`, background: COLORS.card, fontSize: 14, cursor: "pointer", fontFamily: FONT, color: COLORS.text, fontWeight: 500 }}>
              ☆ Save
            </button>
            <button onClick={() => setDrawerOpen(true)} style={{ padding: "12px 16px", borderRadius: 4, border: `1.5px solid ${COLORS.accent}`, background: COLORS.accentBg, fontSize: 13, cursor: "pointer", fontFamily: FONT, color: COLORS.accent, fontWeight: 700, whiteSpace: "nowrap" }}>
              Match me
            </button>
          </div>
        </div>
      )}

      <OnboardingDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        onSubmit={() => { setPersonalised(true); setDrawerOpen(false); }} />
    </div>
  );
}
