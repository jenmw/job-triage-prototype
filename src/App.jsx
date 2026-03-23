import { useState, useEffect } from "react";

const FONT = "'CeraPro', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

// Breakroom design tokens — /assets/css/shared/helpers/_colors.scss
const COLORS = {
  bg: "#faf8f4",
  card: "#ffffff",
  text: "#323232",
  muted: "#646362",
  border: "#e1e1e1",
  green: "#6dba84",
  greenBg: "#eaf6e8",
  greenBorder: "#6dba84",
  amber: "#ffcf4d",
  amberText: "#8a6400",
  amberBg: "#fff4d7",
  amberBorder: "#ffcf4d",
  red: "#cf4044",
  redBg: "#faecec",
  redBorder: "#cf4044",
  accent: "#f1666a",
  accentBg: "#ffecea",
  accentBorder: "#f9d5d3",
};

// Breakroom spacing tokens — /assets/css/shared/helpers/_spacing.scss
const S = { xs: 4, s: 8, s2: 12, m: 16, m2: 24, l: 32, l2: 40, xl: 64, xxl: 96 };

// Breakroom type scale — /assets/css/shared/helpers/_typography.scss
// Using mobile sizes throughout; desktop variants applied via isDesktop check
const T = {
  heading2:  { fontSize: 24, lineHeight: "32px", fontWeight: 700 },
  heading2Lg:{ fontSize: 34, lineHeight: "42px", fontWeight: 700 },
  lead1:     { fontSize: 20, lineHeight: "24px", fontWeight: 700 },
  lead2:     { fontSize: 18, lineHeight: "24px", fontWeight: 700 },
  body1:     { fontSize: 16, lineHeight: "22px", fontWeight: 400 },
  body1Bold: { fontSize: 16, lineHeight: "22px", fontWeight: 700 },
  body2:     { fontSize: 14, lineHeight: "20px", fontWeight: 400 },
  body2Bold: { fontSize: 14, lineHeight: "20px", fontWeight: 700 },
  smallcaps: { fontSize: 11, lineHeight: "16px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" },
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

// ─── Rating dial — ported from lib/poplar_web/helpers/formatting_helpers.ex ───
// build_radial_svg/3 with @rating_thresholds [okay: 5.5, good: 7.0]
const RatingDial = ({ score, displaySize = 62 }) => {
  // All SVG maths in 100×100 coordinate space, then scaled via CSS width/height
  const svgStrokeWidth = 14;
  const halfSize = 50;
  const halfWidth = Math.round((100 - svgStrokeWidth) / 2); // 43
  const circumference = Math.round((2 * Math.PI * halfWidth - svgStrokeWidth) * 1000) / 1000; // ≈256.177

  // radial_rating_position/1
  const position = 1 - ((score - 1) / 9.0 * 0.9 + 0.1);
  const strokeOffset = Math.round(circumference * position * 1000) / 1000;

  const color = score >= 7.0 ? COLORS.green : score >= 5.5 ? COLORS.amber : COLORS.red;

  const [intPart, decPart] = score.toFixed(1).split(".");
  const fontSize = displaySize >= 90 ? 24 : displaySize >= 62 ? 18 : 14;
  const decSize = fontSize * 0.78;

  return (
    <div style={{ position: "relative", width: displaySize, height: displaySize, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <svg viewBox="0 0 100 100" width={displaySize} height={displaySize} style={{ position: "absolute", top: 0, left: 0 }}>
        {/* Background disc — matches .background-disc { stroke: rgba(50,50,50,0.1) } */}
        <circle cx={halfSize} cy={halfSize} r={halfWidth} fill="none" stroke="rgba(50,50,50,0.1)" strokeWidth={svgStrokeWidth} />
        {/* Rating arc */}
        <circle
          cx={halfSize} cy={halfSize} r={halfWidth}
          fill="none"
          stroke={color}
          strokeWidth={svgStrokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeOffset}
          strokeLinecap="round"
          transform={`rotate(-82,${halfSize},${halfSize})`}
        />
      </svg>
      {/* .rating__score overlay */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "baseline", fontWeight: 700, color: COLORS.text, fontFamily: FONT }}>
        <span style={{ fontSize }}>{intPart}</span>
        <span style={{ fontSize: decSize }}>.{decPart}</span>
      </div>
    </div>
  );
};

// ─── Vacancy highlight pill — matches .vacancy-highlights__highlight ───────────
const VacancyHighlight = ({ label }) => (
  <span style={{ ...T.body2Bold, borderRadius: 20, border: `2px solid ${COLORS.green}`, color: COLORS.green, display: "inline-block", padding: "2px 10px", whiteSpace: "nowrap", fontFamily: FONT }}>
    👍 {label}
  </span>
);

// ─── Finding row — matches .finding-statement with GOOD/OKAY/NEEDS IMPROVING ──
const FindingRow = ({ status, statement }) => {
  const dot   = status === "good" ? COLORS.green : status === "okay" ? COLORS.amber : COLORS.red;
  const label = status === "good" ? "GOOD" : status === "okay" ? "OKAY" : "NEEDS IMPROVING";
  return (
    <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: `${S.s}px 0` }}>
      <div style={{ ...T.smallcaps, color: COLORS.muted, marginBottom: S.xs }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: S.s }}>
        {/* .finding-statement::before — 15px colored dot with 2px white border */}
        <span style={{ width: 12, height: 12, borderRadius: "50%", background: dot, border: "2px solid white", outline: `1px solid ${dot}`, flexShrink: 0, display: "inline-block" }} />
        <span style={{ ...T.body1, color: COLORS.text, fontFamily: FONT }}>{statement}</span>
      </div>
    </div>
  );
};

// ─── Signal card (prototype-specific) ─────────────────────────────────────────
const Signal = ({ status, label, detail, subtext }) => {
  const c = status === "good"
    ? { bg: COLORS.greenBg, border: COLORS.greenBorder, dot: COLORS.green, textColor: COLORS.green, icon: "✓" }
    : status === "warning"
    ? { bg: COLORS.amberBg, border: COLORS.amberBorder, dot: COLORS.amber, textColor: COLORS.amberText, icon: "~" }
    : { bg: COLORS.redBg, border: COLORS.redBorder, dot: COLORS.red, textColor: COLORS.red, icon: "✕" };
  return (
    <div style={{ padding: `${S.s2}px ${S.m}px`, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 5, display: "flex", gap: S.s2, alignItems: "flex-start" }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: c.dot, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{c.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{label}</div>
        <div style={{ ...T.body2, color: COLORS.muted, marginTop: S.xs, fontFamily: FONT }}>{detail}</div>
        {subtext && <div style={{ ...T.body2, color: c.textColor, marginTop: S.xs, fontWeight: 500, fontFamily: FONT }}>{subtext}</div>}
      </div>
    </div>
  );
};

// ─── Collapsible section ───────────────────────────────────────────────────────
const Section = ({ title, icon, children, defaultOpen = false, badge }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: `${S.m}px 0`, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: S.s, fontFamily: FONT }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ ...T.body1Bold, color: COLORS.text, flex: 1, textAlign: "left", fontFamily: FONT }}>{title}</span>
        {badge && <span style={{ ...T.smallcaps, padding: `${S.xs}px ${S.s}px`, borderRadius: 100, background: badge.bg, color: badge.textColor }}>{badge.text}</span>}
        <span style={{ ...T.body2, color: COLORS.muted, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}>▾</span>
      </button>
      <div style={{ maxHeight: open ? 2000 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ paddingBottom: S.m, display: "flex", flexDirection: "column", gap: S.s }}>{children}</div>
      </div>
    </div>
  );
};

// ─── Review snippet ────────────────────────────────────────────────────────────
const ReviewSnippet = ({ quote, score, role, date, best }) => (
  <div style={{ padding: `${S.s2}px ${S.m}px`, background: COLORS.bg, borderRadius: 5, border: `1px solid ${COLORS.border}` }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: S.s }}>
      <span style={{ ...T.body2Bold, color: COLORS.text, fontFamily: FONT }}>{best ? "👍 Best:" : "👎 Worst:"}</span>
      <span style={{ ...T.body2Bold, color: score >= 6 ? COLORS.green : score >= 4 ? COLORS.amberText : COLORS.red, fontFamily: FONT }}>{score}/10</span>
    </div>
    <div style={{ ...T.body2, color: COLORS.muted, fontStyle: "italic", fontFamily: FONT }}>"{quote}"</div>
    <div style={{ ...T.body2, color: COLORS.muted, marginTop: S.xs, fontFamily: FONT }}>{role} · {date}</div>
  </div>
);

// ─── Alternative job card ──────────────────────────────────────────────────────
const AltJob = ({ title, company, pay, rating, location, badge, highlight }) => (
  <div
    style={{ padding: `${S.s2}px ${S.m}px`, border: `1px solid ${COLORS.border}`, borderRadius: 5, cursor: "pointer", transition: "border-color 0.15s", background: COLORS.card, position: "relative", boxShadow: SHADOW }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accent; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; }}
  >
    {badge && <div style={{ position: "absolute", top: -8, right: S.s2, ...T.smallcaps, padding: `${S.xs}px ${S.s}px`, borderRadius: 100, background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>{badge.text}</div>}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: S.s2, paddingTop: badge ? S.s : 0 }}>
      <div style={{ flex: 1 }}>
        <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{title}</div>
        <div style={{ ...T.body2, color: COLORS.muted, marginTop: S.xs, fontFamily: FONT }}>{company} · {location}</div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{pay}</div>
        <div style={{ ...T.body2Bold, color: rating >= 7 ? COLORS.green : rating >= 5.5 ? COLORS.amberText : COLORS.muted, fontFamily: FONT }}>{rating}/10</div>
      </div>
    </div>
    {highlight && <div style={{ ...T.body2Bold, color: COLORS.muted, marginTop: S.s, fontFamily: FONT }}>{highlight}</div>}
  </div>
);

// ─── Onboarding drawer ─────────────────────────────────────────────────────────
const OnboardingDrawer = ({ open, onClose, onSubmit }) => {
  const [postcode, setPostcode] = useState("");
  const [currentPay, setCurrentPay] = useState("");
  const [travel, setTravel] = useState("");
  const [priorities, setPriorities] = useState(new Set());
  const togglePriority = (p) => setPriorities((s) => { const n = new Set(s); n.has(p) ? n.delete(p) : n.add(p); return n; });

  const inputStyle = { width: "100%", padding: `${S.s2}px ${S.m}px`, borderRadius: 4, border: `1px solid ${COLORS.border}`, ...T.body1, fontFamily: FONT, marginBottom: S.m, background: COLORS.card, color: COLORS.text, outline: "none", boxSizing: "border-box" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s", zIndex: 100 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "85vh", background: COLORS.bg, borderRadius: "16px 16px 0 0", padding: `${S.m2}px ${S.m2}px ${S.l}px`, transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform 0.35s ease", zIndex: 101, overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border, margin: `0 auto ${S.m}px` }} />
        <h3 style={{ ...T.lead1, margin: 0, color: COLORS.text, fontFamily: FONT, marginBottom: S.s }}>Help us find you better jobs</h3>
        <p style={{ ...T.body2, color: COLORS.muted, margin: `0 0 ${S.m2}px`, fontFamily: FONT }}>Answer a few quick ones and we'll show you jobs that actually fit your life. Takes 30 seconds.</p>

        <label style={{ ...T.body2Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>Your postcode (for commute times)</label>
        <input value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="e.g. TW1 3QS" style={inputStyle} />

        <label style={{ ...T.body2Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>What do you currently earn? (per hour)</label>
        <input value={currentPay} onChange={(e) => setCurrentPay(e.target.value)} placeholder="e.g. £12.00" style={inputStyle} />

        <label style={{ ...T.body2Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>How do you get to work?</label>
        <div style={{ display: "flex", gap: S.s, marginBottom: S.m, flexWrap: "wrap" }}>
          {["🚗 Drive", "🚌 Bus", "🚂 Train", "🚲 Cycle", "🚶 Walk"].map((t) => (
            <button key={t} onClick={() => setTravel(t)}
              style={{ padding: `${S.s}px ${S.m}px`, borderRadius: 100, border: `1px solid ${travel === t ? COLORS.accent : COLORS.border}`, background: travel === t ? COLORS.accentBg : COLORS.card, ...T.body2, cursor: "pointer", fontFamily: FONT, color: travel === t ? COLORS.accent : COLORS.text, fontWeight: travel === t ? 700 : 400 }}>
              {t}
            </button>
          ))}
        </div>

        <label style={{ ...T.body2Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>What matters most to you? (pick up to 3)</label>
        <div style={{ display: "flex", gap: S.xs, flexWrap: "wrap", marginBottom: S.m2 }}>
          {["Better pay", "Short commute", "No heavy lifting", "Daytime only", "Paid breaks", "Sick pay", "Friendly team", "Career progression"].map((p) => (
            <button key={p} onClick={() => { if (priorities.has(p) || priorities.size < 3) togglePriority(p); }}
              style={{ padding: `${S.xs}px ${S.s2}px`, borderRadius: 100, border: `1px solid ${priorities.has(p) ? COLORS.green : COLORS.border}`, background: priorities.has(p) ? COLORS.greenBg : COLORS.card, ...T.body2, cursor: "pointer", fontFamily: FONT, color: priorities.has(p) ? COLORS.green : COLORS.muted, fontWeight: priorities.has(p) ? 700 : 400 }}>
              {p}
            </button>
          ))}
        </div>

        <button onClick={() => onSubmit({ postcode, currentPay, travel, priorities: [...priorities] })}
          style={{ width: "100%", padding: S.m, borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", ...T.body1Bold, cursor: "pointer", fontFamily: FONT }}>
          Show me better matches →
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: `${S.s2}px`, background: "none", border: "none", ...T.body2, color: COLORS.muted, cursor: "pointer", marginTop: S.s, fontFamily: FONT }}>
          Not now, I'll keep browsing
        </button>
      </div>
    </>
  );
};

// ─── Shared sub-components ─────────────────────────────────────────────────────

const AlternativesList = ({ personalised, onOpenDrawer }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: S.xs }}>
      <h2 style={{ ...T.lead1, margin: 0, fontFamily: FONT, color: COLORS.text }}>Similar jobs nearby</h2>
      <button onClick={onOpenDrawer} style={{ ...T.body2Bold, color: COLORS.accent, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, textDecoration: "underline" }}>
        Match me ✎
      </button>
    </div>
    <p style={{ ...T.body2, color: COLORS.muted, margin: `0 0 ${S.m}px`, fontFamily: FONT }}>
      {personalised ? "Sorted by your preferences" : "Based on this job's location and pay range. Tell us more to get better matches."}
    </p>
    <div style={{ display: "flex", flexDirection: "column", gap: S.s2 }}>
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
    <div style={{ marginTop: S.m, padding: `${S.s2}px ${S.m}px`, background: COLORS.greenBg, borderRadius: 5, border: `1px solid ${COLORS.greenBorder}`, textAlign: "center" }}>
      <div style={{ ...T.body2Bold, color: COLORS.green, fontFamily: FONT }}>✓ Showing personalised matches</div>
      <div style={{ ...T.body2, color: COLORS.muted, marginTop: S.xs, fontFamily: FONT }}>
        Based on your commute, pay, and preferences ·{" "}
        <span onClick={onOpenDrawer} style={{ textDecoration: "underline", cursor: "pointer", color: COLORS.accent }}>Edit</span>
      </div>
    </div>
  ) : (
    <button onClick={onOpenDrawer} style={{ width: "100%", marginTop: S.m2, padding: S.m, borderRadius: 5, border: `1.5px dashed ${COLORS.accent}`, background: COLORS.accentBg, cursor: "pointer", fontFamily: FONT, textAlign: "center" }}>
      <div style={{ ...T.body1Bold, color: COLORS.accent, fontFamily: FONT }}>🎯 Get jobs that match your life</div>
      <div style={{ ...T.body2, color: COLORS.muted, marginTop: S.xs, fontFamily: FONT }}>Tell us your postcode, current pay, and what matters — we'll filter out the noise</div>
    </button>
  );

// ─── Desktop sidebar ───────────────────────────────────────────────────────────

const DesktopSidebar = ({ personalised, onOpenDrawer }) => (
  <div style={{ position: "sticky", top: 48, alignSelf: "start", display: "flex", flexDirection: "column", gap: S.m }}>
    {/* CTA card */}
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 5, padding: `${S.m}px ${S.m2}px ${S.m}px`, boxShadow: SHADOW }}>
      <div style={{ padding: `${S.s2}px ${S.s2}px`, background: COLORS.amberBg, border: `1px solid ${COLORS.amberBorder}`, borderRadius: 4, ...T.body2, color: COLORS.amberText, marginBottom: S.m, fontFamily: FONT }}>
        ⚠ <strong>Rated below average by workers.</strong> Pay and working conditions have mixed reviews — read the full picture before applying.
      </div>

      <button style={{ width: "100%", padding: S.s2, borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", ...T.body1Bold, cursor: "pointer", fontFamily: FONT, marginBottom: S.s }}
        onMouseEnter={(e) => e.target.style.opacity = "0.85"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
        Apply on external site →
      </button>
      <div style={{ display: "flex", gap: S.s }}>
        <button style={{ flex: 1, padding: S.s2, borderRadius: 4, border: `1.5px solid ${COLORS.border}`, background: COLORS.card, ...T.body2Bold, cursor: "pointer", fontFamily: FONT, color: COLORS.text }}>
          ☆ Save for later
        </button>
        <button onClick={onOpenDrawer} style={{ flex: 1, padding: S.s2, borderRadius: 4, border: `1.5px solid ${COLORS.accent}`, background: COLORS.accentBg, ...T.body2Bold, cursor: "pointer", fontFamily: FONT, color: COLORS.accent }}>
          Match me ✎
        </button>
      </div>
    </div>

    {/* Alternatives card */}
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 5, padding: S.m2, boxShadow: SHADOW }}>
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
    <div style={{ paddingTop: S.m2, paddingBottom: S.m }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: S.s2, marginBottom: S.m }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: S.xs, flexShrink: 0 }}>
          <RatingDial score={5.2} displaySize={isDesktop ? 52 : 44} />
          <div style={{ ...T.smallcaps, color: COLORS.muted, fontFamily: FONT, textAlign: "center" }}>Breakroom<br/>Rating</div>
        </div>
        <div>
          <div style={{ ...T.body2, color: COLORS.text, fontFamily: FONT }}>
            The Best Connection <span style={{ color: COLORS.muted }}>· Agency</span>
          </div>
          <div style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, marginTop: S.xs }}>
            Rated 5.2 out of 10, based on 53 employees who took the Breakroom Quiz
          </div>
        </div>
      </div>

      <h1 style={{ ...( isDesktop ? T.heading2Lg : T.heading2), margin: `0 0 ${S.s2}px`, fontFamily: FONT, color: COLORS.text }}>Warehouse Operative</h1>

      <div style={{ display: "flex", gap: S.m, flexWrap: "wrap", marginBottom: S.m }}>
        {[
          { icon: "💷", text: "£12.58/hr" },
          { icon: "📍", text: "Hounslow" },
          { icon: "🕐", text: "Full time", sub: "4 on / 4 off" },
          { icon: "📋", text: "12hr shifts" },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: S.xs }}>
            <span>{f.icon}</span>
            <span style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{f.text}</span>
            {f.sub && <span style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT }}>({f.sub})</span>}
          </div>
        ))}
      </div>

      {/* Vacancy highlights — matches .vacancy-highlights */}
      <div style={{ display: "flex", gap: S.s, flexWrap: "wrap" }}>
        <VacancyHighlight label="Respectful managers" />
        <VacancyHighlight label="Proper breaks" />
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
        {/* Red flags group */}
        <div style={{ ...T.smallcaps, color: COLORS.red, marginBottom: S.xs, fontFamily: FONT }}>Red flags</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: S.xs }}>
          {[
            { pct: 86, label: "No sick pay" },
            { pct: 71, label: "Stressful work" },
            { pct: 70, label: "Unpaid breaks" },
            { pct: 80, label: "Disconnected management" },
          ].map((v) => (
            <div key={v.label} style={{ padding: `${S.s}px ${S.s2}px`, borderRadius: 4, background: COLORS.redBg, border: `1px solid ${COLORS.redBorder}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: S.xs, marginBottom: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.red, flexShrink: 0, display: "inline-block" }} />
                <span style={{ ...T.body2Bold, color: COLORS.red, fontFamily: FONT }}>{v.pct}%</span>
              </div>
              <div style={{ ...T.body2, color: COLORS.muted, lineHeight: 1.3, fontFamily: FONT }}>{v.label}</div>
            </div>
          ))}
        </div>

        {/* Good things group */}
        <div style={{ ...T.smallcaps, color: COLORS.green, marginTop: S.s2, marginBottom: S.xs, fontFamily: FONT }}>Good things</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: S.xs }}>
          {[
            { pct: 72, label: "Respectful managers" },
            { pct: 82, label: "Proper breaks" },
            { pct: 83, label: "Easy to book holiday" },
            { pct: 69, label: "Stable shift patterns" },
          ].map((v) => (
            <div key={v.label} style={{ padding: `${S.s}px ${S.s2}px`, borderRadius: 4, background: COLORS.greenBg, border: `1px solid ${COLORS.greenBorder}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: S.xs, marginBottom: 2 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.green, flexShrink: 0, display: "inline-block" }} />
                <span style={{ ...T.body2Bold, color: COLORS.green, fontFamily: FONT }}>{v.pct}%</span>
              </div>
              <div style={{ ...T.body2, color: COLORS.muted, lineHeight: 1.3, fontFamily: FONT }}>{v.label}</div>
            </div>
          ))}
        </div>

        <div style={{ ...T.body2Bold, color: COLORS.accent, cursor: "pointer", textAlign: "center", padding: `${S.xs}px 0`, fontFamily: FONT, marginTop: S.xs }}>
          See all findings from workers →
        </div>
      </Section>

      <Section title="What workers actually said" icon="💬">
        <ReviewSnippet best={true} quote="Flexible when needed" score={8.2} role="Agency worker" date="Sep 2024" />
        <ReviewSnippet best={true} quote="Good team and good training" score={8.0} role="Branch manager" date="Jun 2024" />
        <ReviewSnippet best={false} quote="The managers, the stress levels" score={1.8} role="Administrator" date="Jul 2023" />
        <div style={{ ...T.body2Bold, color: COLORS.accent, cursor: "pointer", textAlign: "center", padding: `${S.xs}px 0`, fontFamily: FONT }}>See all 53 reviews →</div>
      </Section>

      <Section title="Full job details" icon="📄">
        <div style={{ ...T.body1, color: COLORS.muted, lineHeight: 1.7, fontFamily: FONT }}>
          <p style={{ margin: `0 0 ${S.s}px` }}><strong style={{ color: COLORS.text }}>What you'll do:</strong> Sorting, scanning, and processing mail bags for international dispatch. Heavy lifting up to 30kg.</p>
          <p style={{ margin: `0 0 ${S.s}px` }}><strong style={{ color: COLORS.text }}>Shifts:</strong> 4 on / 4 off rotation. Starts 6am–6pm, 8am–8pm, or 10am–10pm (12-hour shifts).</p>
          <p style={{ margin: `0 0 ${S.s}px` }}><strong style={{ color: COLORS.text }}>You'll need:</strong> Valid photo ID, 5-year address history, DBS check and Aviation Security Course (both paid by employer).</p>
          <p style={{ margin: 0 }}><strong style={{ color: COLORS.text }}>Regulated by:</strong> Civil Aviation Authority (CAA) — that's why the background checks are strict.</p>
        </div>
      </Section>
    </>
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONT, color: COLORS.text }}>
      {/* Top nav */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: COLORS.bg, borderBottom: `1px solid ${COLORS.border}`, padding: `${S.s2}px ${S.m}px`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...T.body2Bold, color: COLORS.text, fontFamily: FONT }}>← Back to results</span>
        <span style={{ ...T.body1Bold, color: COLORS.accent, fontFamily: FONT }}>Breakroom</span>
      </div>

      {isDesktop ? (
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: `0 ${S.l}px ${S.xl}px`, display: "grid", gridTemplateColumns: "1fr 400px", gap: S.xl, alignItems: "start" }}>
          <div>
            {heroBlock}
            {sectionsBlock}
          </div>
          <DesktopSidebar personalised={personalised} onOpenDrawer={() => setDrawerOpen(true)} />
        </div>
      ) : (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: `0 ${S.m}px ${S.xxl}px` }}>
          {heroBlock}
          {sectionsBlock}
          <div style={{ marginTop: S.m2, marginBottom: S.s }}>
            <AlternativesList personalised={personalised} onOpenDrawer={() => setDrawerOpen(true)} />
            <PersonaliseNudge personalised={personalised} onOpenDrawer={() => setDrawerOpen(true)} />
          </div>
        </div>
      )}

      {/* Mobile sticky bottom bar */}
      {!isDesktop && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, background: "rgba(250,248,244,0.95)", backdropFilter: "blur(12px)", borderTop: `1px solid ${COLORS.border}`, padding: `${S.s2}px ${S.m}px` }}>
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", gap: S.s2 }}>
            <button style={{ flex: 1, padding: S.s2, borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", ...T.body1Bold, cursor: "pointer", fontFamily: FONT }}
              onMouseEnter={(e) => e.target.style.opacity = "0.85"} onMouseLeave={(e) => e.target.style.opacity = "1"}>
              Apply →
            </button>
            <button style={{ padding: `${S.s2}px ${S.m}px`, borderRadius: 4, border: `1.5px solid ${COLORS.border}`, background: COLORS.card, ...T.body2Bold, cursor: "pointer", fontFamily: FONT, color: COLORS.text }}>
              ☆ Save
            </button>
            <button onClick={() => setDrawerOpen(true)} style={{ padding: `${S.s2}px ${S.m}px`, borderRadius: 4, border: `1.5px solid ${COLORS.accent}`, background: COLORS.accentBg, ...T.body2Bold, cursor: "pointer", fontFamily: FONT, color: COLORS.accent, whiteSpace: "nowrap" }}>
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
