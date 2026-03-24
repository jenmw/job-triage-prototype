import { useState, useEffect, useRef } from "react";

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

// Jobs data — the current listing plus the five alternatives
const JOBS = [
  {
    id: 0,
    title: "Warehouse Operative",
    company: "The Best Connection",
    companyType: "Agency",
    pay: "£12.58/hr",
    location: "Hounslow",
    hours: "Full time",
    hoursSub: "4 on / 4 off",
    shifts: "12hr shifts",
    rating: 5.2,
    quizCount: 53,
    highlights: ["Respectful managers", "Proper breaks"],
    listingUrl: "https://www.reed.co.uk/jobs/warehouse-operative/56629861",
    altBadge: null,
    altHighlight: null,
  },
  {
    id: 1,
    title: "Warehouse Operative",
    company: "Gap Personnel",
    companyType: "Agency",
    pay: "£13.25–17.25/hr",
    location: "London",
    hours: "Full time",
    hoursSub: null,
    shifts: "8hr shifts",
    rating: 7.4,
    quizCount: 121,
    highlights: ["Proper breaks", "Respectful managers"],
    listingUrl: "https://www.reed.co.uk/jobs/warehouse-operative/67890",
    altReason: { text: "Better rated by workers (7.4 vs 5.2) · £0.67–4.67/hr more", variant: "green" },
  },
  {
    id: 2,
    title: "Logistics Operator",
    company: "Shorterm Group",
    companyType: "Agency",
    pay: "£14.24–18.37/hr",
    location: "London SE25",
    hours: "Full time",
    hoursSub: null,
    shifts: "Day shifts",
    rating: 6.3,
    quizCount: 44,
    highlights: ["Paid breaks", "Regular hours"],
    listingUrl: "https://www.reed.co.uk/jobs/logistics-operator/11111",
    altReason: { text: "£1.66/hr more than this job (£14.24 vs £12.58)", variant: "amber" },
  },
  {
    id: 3,
    title: "Warehouse Operative",
    company: "Gi Group",
    companyType: "Agency",
    pay: "£14.69/hr",
    location: "London",
    hours: "Part time",
    hoursSub: null,
    shifts: "Day shifts",
    rating: 6.0,
    quizCount: 67,
    highlights: ["Proper breaks", "Respectful managers"],
    listingUrl: "https://www.reed.co.uk/jobs/warehouse-operative/22222",
    altReason: { text: "Part time available · £2.11/hr more (£14.69 vs £12.58)", variant: "muted" },
  },
  {
    id: 4,
    title: "Warehouse Operator (Nights)",
    company: "DSV",
    companyType: "Employer",
    pay: "TBC",
    location: "Hounslow",
    hours: "Full time",
    hoursSub: null,
    shifts: "Night shifts",
    rating: 7.7,
    quizCount: 89,
    highlights: ["People enjoy this job", "Learn new skills"],
    listingUrl: "https://www.reed.co.uk/jobs/warehouse-operator/33333",
    altReason: { text: "Top rated employer in this area (7.7/10)", variant: "green" },
  },
  {
    id: 5,
    title: "FLT Driver",
    company: "Manpower",
    companyType: "Agency",
    pay: "£13/hr",
    location: "Hounslow",
    hours: "Full time",
    hoursSub: null,
    shifts: "Day shifts",
    rating: 6.2,
    quizCount: 38,
    highlights: ["Same location", "Higher employer score"],
    listingUrl: "https://www.reed.co.uk/jobs/flt-driver/44444",
    altReason: { text: "Same location · £0.42/hr more (£13.00 vs £12.58) · Higher employer score (6.2 vs 5.2)", variant: "muted" },
  },
];

// Returns badge colours matching the rating dial thresholds
const ratingBadge = (score) =>
  score >= 7.0
    ? { bg: COLORS.greenBg, textColor: COLORS.green }
    : score >= 5.5
    ? { bg: COLORS.amberBg, textColor: COLORS.amberText }
    : { bg: COLORS.redBg, textColor: COLORS.red };

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

// ─── Tiny rating dial — matches rating--tiny (19px, score displayed to the right) ─
const TinyRatingDial = ({ score }) => {
  const displaySize = 19;
  const svgStrokeWidth = 16;
  const halfSize = 50;
  const halfWidth = Math.round((100 - svgStrokeWidth) / 2); // 42
  const circumference = Math.round((2 * Math.PI * halfWidth - svgStrokeWidth) * 1000) / 1000;
  const position = 1 - ((score - 1) / 9.0 * 0.9 + 0.1);
  const strokeOffset = Math.round(circumference * position * 1000) / 1000;
  const color = score >= 7.0 ? COLORS.green : score >= 5.5 ? COLORS.amber : COLORS.red;
  return (
    <svg viewBox="0 0 100 100" width={displaySize} height={displaySize} style={{ flexShrink: 0, display: "block" }}>
      <circle cx={halfSize} cy={halfSize} r={halfWidth} fill="none" stroke="rgba(50,50,50,0.1)" strokeWidth={svgStrokeWidth} />
      <circle cx={halfSize} cy={halfSize} r={halfWidth} fill="none" stroke={color} strokeWidth={svgStrokeWidth}
        strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={strokeOffset}
        strokeLinecap="round" transform={`rotate(-82,${halfSize},${halfSize})`} />
    </svg>
  );
};

// ─── Breakroom UI icons (inline SVG, semibold weight) ──────────────────────────
const IconAlertCircle = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <path d="M7.99997 11H8.00664M7.99997 4.75449V8.25449M14.2538 8.00378C14.2538 11.4556 11.4556 14.2538 8.00378 14.2538C4.552 14.2538 1.75378 11.4556 1.75378 8.00378C1.75378 4.552 4.552 1.75378 8.00378 1.75378C11.4556 1.75378 14.2538 4.552 14.2538 8.00378Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconRanking = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <path d="M1.75 12.25L6.5 7L9 9.5L14.25 3.75M14.25 3.75H11.0001M14.25 3.75V6.96198" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconMessageCircle = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <path d="M14.25 7.18057C14.2522 8.02381 14.0552 8.85566 13.675 9.60834C13.2242 10.5103 12.5312 11.2689 11.6736 11.7993C10.8161 12.3296 9.82775 12.6107 8.81943 12.6111C7.97619 12.6133 7.14434 12.4163 6.39166 12.0361L2.75 13.25L3.96389 9.60834C3.5837 8.85566 3.38669 8.02381 3.38889 7.18057C3.38928 6.17225 3.67039 5.18395 4.20073 4.32637C4.73108 3.46879 5.48971 2.7758 6.39166 2.32502C7.14434 1.94484 7.97619 1.74782 8.81943 1.75002H9.13888C10.4705 1.82349 11.7283 2.38556 12.6714 3.32862C13.6144 4.27168 14.1765 5.52946 14.25 6.86112V7.18057Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconApply = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <path d="M8.31887 9.43707L9.76855 10.8863M8.31887 9.43707L7.57812 11.6271L9.76855 10.8863M8.31887 9.43707L12.4949 5.26054C12.8952 4.86035 13.5442 4.86035 13.9446 5.26054C14.3449 5.66074 14.3449 6.3096 13.9446 6.7098L9.76855 10.8863" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M11.2673 6.61119V3.7514C11.2673 2.64683 10.3719 1.7514 9.26733 1.7514H3.75061C2.64604 1.7514 1.75061 2.64683 1.75061 3.7514V12.248C1.75061 13.3526 2.64604 14.248 3.75061 14.248H9.26733C10.3719 14.248 11.2673 13.3526 11.2673 12.248V9.3882" stroke={color} strokeWidth="1.5"/>
    <path d="M4 4.5784H6.66667M4 7.24507H8M4 9.91173H6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Hero detail field icons ────────────────────────────────────────────────────
const IconPay = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <path d="M13.5 13.1234H2.5M1.875 2.88135H14.125V10.1313H1.875V2.88135Z" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="6.4917" r="1.5" fill={color}/>
    <path d="M3.65002 3C3.65002 4.10457 2.85532 5 1.875 5M1.875 8C2.85532 8 3.65002 8.8954 3.65002 10M14.125 5C13.1447 5 12.35 4.10457 12.35 3M12.35 10C12.35 8.8954 13.1447 8 14.125 8" stroke={color} strokeWidth="2"/>
  </svg>
);
const IconLocation = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <path d="M12.9979 6.90747C12.9979 10.7244 7.99692 13.996 7.99692 13.996C7.99692 13.996 2.99597 10.7244 2.99597 6.90747C2.99597 5.60593 3.52286 4.35769 4.46071 3.43736C5.39857 2.51704 6.67058 2 7.99692 2C9.32325 2 10.5953 2.51704 11.5331 3.43736C12.471 4.35769 12.9979 5.60593 12.9979 6.90747Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7.99957 7.5C8.55186 7.5 8.99957 7.05228 8.99957 6.5C8.99957 5.94772 8.55186 5.5 7.99957 5.5C7.44729 5.5 6.99957 5.94772 6.99957 6.5C6.99957 7.05228 7.44729 7.5 7.99957 7.5Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconClock = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <path d="M8 5L8 8L10 10M2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Thumbs-up SVG icon (matches thumbs-up--16px-bold--green from site) ─────────
const IconThumbsUp = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
    <path d="M4.99686 8.00441L4.99687 14M4.99686 8.00441C4.99686 8.00441 5.61405 6.85734 6.05137 5.25823C6.4887 3.65913 6.55033 2.00281 6.55033 2.00281L7.24997 2.0028C7.24997 2.0028 8.36905 2.10084 8.85183 3.24997C9.33461 4.39912 9.00407 6.9988 9.00407 6.9988H13.0369C13.0369 6.9988 13.2863 6.98395 13.5358 7.08526C13.7853 7.18658 14.0015 7.58215 14.0015 7.83082C14.0015 8.07949 13.9682 8.41456 13.9682 8.41456L13.5217 12.9367C13.4718 13.2351 13.436 13.4081 13.2364 13.607C13.0368 13.8059 12.6826 14 12.35 14H4.99687M4.99686 8.00441L3.40049 8.00442C3.07112 8.00442 2.73261 8.00441 2.39997 8.33597C2.06733 8.66753 1.99997 9.01082 1.99997 9.34238L2.00719 12.6015C2.00719 12.9331 2.05967 13.2986 2.39231 13.6301C2.72495 13.9617 3.11387 14 3.44651 14H4.99687" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);

// ─── Vacancy highlight pill — matches .vacancy-highlights__highlight ───────────
const VacancyHighlight = ({ label, onClick }) => (
  <span
    onClick={onClick}
    style={{
      ...T.body2Bold, borderRadius: 20, border: `2px solid ${COLORS.green}`,
      color: COLORS.green, display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 10px", whiteSpace: "nowrap", fontFamily: FONT,
      cursor: onClick ? "pointer" : "default",
      textDecoration: onClick ? "underline" : "none",
      textDecorationColor: COLORS.greenBorder,
    }}
  >
    <IconThumbsUp /> {label}
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

// ─── Finding tile (expandable compact card for the findings grid) ──────────────
const FindingTile = ({ pct, label, heading, primary, secondary, why, variant, lit, forceOpen }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (forceOpen) setOpen(true); }, [forceOpen]);
  const isRed = variant === "red";
  const dotColor   = isRed ? COLORS.red   : COLORS.green;
  const pctColor   = isRed ? COLORS.red   : COLORS.green;
  const bgNormal   = isRed ? COLORS.redBg : COLORS.greenBg;
  const bgLit      = isRed ? COLORS.redBg : COLORS.green + "30";
  const borderNorm = isRed ? COLORS.redBorder : COLORS.greenBorder;
  const borderLit  = isRed ? COLORS.red   : COLORS.green;
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        padding: `${S.s}px ${S.s2}px`, borderRadius: 4, cursor: "pointer",
        background: lit ? bgLit : bgNormal,
        border: `1px solid ${lit ? borderLit : borderNorm}`,
        boxShadow: lit ? `0 0 0 2px ${dotColor}` : "none",
        transition: "background 0.3s, border-color 0.3s, box-shadow 0.3s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: S.xs, marginBottom: 2 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor, flexShrink: 0, display: "inline-block" }} />
        <span style={{ ...T.body2Bold, color: pctColor, fontFamily: FONT, flex: 1 }}>{pct}%</span>
        <span style={{ ...T.body2, color: COLORS.muted, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block" }}>▾</span>
      </div>
      <div style={{ ...T.body2, color: COLORS.muted, lineHeight: 1.3, fontFamily: FONT }}>{heading ?? label}</div>
      <div style={{ maxHeight: open ? 300 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <div style={{ borderTop: `1px solid ${borderNorm}`, marginTop: S.xs, paddingTop: S.s }}>
          <div style={{ ...T.body2Bold, color: COLORS.text, fontFamily: FONT, marginBottom: S.xs }}>{primary}</div>
          <div style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, marginBottom: S.s }}>{secondary}</div>
          <div style={{ ...T.smallcaps, color: COLORS.muted, fontFamily: FONT, marginBottom: S.xs }}>Why this matters</div>
          <div style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, fontStyle: "italic", lineHeight: 1.5 }}>{why}</div>
        </div>
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
const Section = ({ title, icon, children, defaultOpen = false, badge, badgeEl, number, forceOpen, sectionRef }) => {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => { if (forceOpen) setOpen(true); }, [forceOpen]);
  return (
    <div ref={sectionRef} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: `${S.m}px 0`, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: S.s, fontFamily: FONT }}>
        {number != null && (
          <span style={{ ...T.smallcaps, width: 20, height: 20, borderRadius: "50%", background: COLORS.border, color: COLORS.muted, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{number}</span>
        )}
        {icon}
        <span style={{ ...T.body1Bold, color: COLORS.text, flex: 1, textAlign: "left", fontFamily: FONT }}>{title}</span>
        {badgeEl ?? (badge && <span style={{ ...T.smallcaps, padding: `${S.xs}px ${S.s}px`, borderRadius: 100, background: badge.bg, color: badge.textColor }}>{badge.text}</span>)}
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
const AltJob = ({ job, onClick }) => {
  const { title, company, pay, rating, location, highlights, altReason: reason } = job;
  const reasonDot = reason?.variant === "green" ? COLORS.green : reason?.variant === "amber" ? COLORS.amber : COLORS.muted;
  return (
    <div
      onClick={onClick}
      style={{ padding: `${S.s2}px ${S.m}px`, border: `1px solid ${COLORS.border}`, borderRadius: 5, cursor: "pointer", transition: "border-color 0.15s", background: COLORS.card }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accent; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: S.s2 }}>
        <div style={{ flex: 1 }}>
          <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{title}</div>
          <div style={{ ...T.body2, color: COLORS.muted, marginTop: S.xs, fontFamily: FONT }}>{company} · {location}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{pay}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: S.xs, marginTop: 2 }}>
            <TinyRatingDial score={rating} />
            <span style={{ ...T.body2Bold, color: COLORS.text, fontFamily: FONT }}>{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
      {highlights && highlights.length > 0 && (
        <div style={{ display: "flex", gap: S.xs, flexWrap: "wrap", marginTop: S.s }}>
          {highlights.map((h) => <VacancyHighlight key={h} label={h} />)}
        </div>
      )}
      {reason && (
        <div style={{ marginTop: S.s, paddingTop: S.s, borderTop: `1px solid ${COLORS.border}` }}>
          <span style={{ ...T.body2, color: reasonDot === COLORS.muted ? COLORS.muted : reasonDot, fontFamily: FONT }}>{reason.text}</span>
        </div>
      )}
    </div>
  );
};

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

const AlternativesList = ({ currentJobIdx, personalised, onOpenDrawer, onJobSelect }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: S.xs }}>
      <h2 style={{ ...T.lead1, margin: 0, fontFamily: FONT, color: COLORS.text }}>Similar jobs nearby</h2>
      <button onClick={onOpenDrawer} style={{ ...T.body2Bold, color: COLORS.accent, background: "none", border: "none", cursor: "pointer", fontFamily: FONT, textDecoration: "underline" }}>
        Match me
      </button>
    </div>
    <p style={{ ...T.body2, color: COLORS.muted, margin: `0 0 ${S.m}px`, fontFamily: FONT }}>
      {personalised ? "Sorted by your preferences" : "Based on this job's location and pay range. Tell us more to get better matches."}
    </p>
    <div style={{ display: "flex", flexDirection: "column", gap: S.s2 }}>
      {JOBS.filter((j) => j.id !== currentJobIdx).map((j) => (
        <AltJob key={j.id} job={j} onClick={() => onJobSelect(j.id)} />
      ))}
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

const DesktopSidebar = ({ currentJobIdx, personalised, onOpenDrawer, onJobSelect }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: S.m }}>
    {/* CTA card — sticky so apply buttons stay visible while scrolling */}
    <div style={{ position: "sticky", top: 48, zIndex: 10, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 5, padding: `${S.m}px ${S.m2}px` }}>
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
          Match me
        </button>
      </div>
    </div>

    {/* Alternatives card — not sticky, scrolls with page */}
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 5, padding: S.m2 }}>
      <AlternativesList currentJobIdx={currentJobIdx} personalised={personalised} onOpenDrawer={onOpenDrawer} onJobSelect={onJobSelect} />
      <PersonaliseNudge personalised={personalised} onOpenDrawer={onOpenDrawer} />
    </div>
  </div>
);

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function JobTriagePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [personalised, setPersonalised] = useState(false);
  const [selectedJobIdx, setSelectedJobIdx] = useState(0);
  const [findingsForceOpen, setFindingsForceOpen] = useState(false);
  const [highlightFinding, setHighlightFinding] = useState(null);
  const findingsSectionRef = useRef(null);
  const isDesktop = useIsDesktop();

  const job = JOBS[selectedJobIdx];
  const { rating } = job;
  const ratingColors = ratingBadge(rating);

  const handleJobSelect = (idx) => {
    setSelectedJobIdx(idx);
    setFindingsForceOpen(false);
    setHighlightFinding(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePillClick = (label) => {
    setFindingsForceOpen(true);
    setHighlightFinding(label);
    // Wait for accordion to open (350ms transition) before scrolling
    setTimeout(() => {
      if (findingsSectionRef.current) {
        const y = findingsSectionRef.current.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 380);
    // Clear highlight after 2s
    setTimeout(() => setHighlightFinding(null), 2400);
  };

  const heroBlock = (
    <div style={{ paddingTop: S.m2, paddingBottom: S.m }}>
      <div style={{ ...T.body2Bold, color: COLORS.text, fontFamily: FONT, marginBottom: S.xs }}>
        {job.company} <span style={{ fontWeight: 400, color: COLORS.muted }}>· {job.companyType}</span>
      </div>

      <h1 style={{ ...(isDesktop ? T.heading2Lg : T.heading2), margin: `0 0 ${S.s2}px`, fontFamily: FONT, color: COLORS.text }}>{job.title}</h1>

      <div style={{ display: "flex", gap: S.m, flexWrap: "wrap", marginBottom: S.m }}>
        {[
          { icon: <IconPay />, text: job.pay },
          { icon: <IconLocation />, text: job.location },
          { icon: <IconClock />, text: job.hours, sub: job.hoursSub },
          { icon: <IconClock />, text: job.shifts },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: S.xs }}>
            {f.icon}
            <span style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{f.text}</span>
            {f.sub && <span style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT }}>({f.sub})</span>}
          </div>
        ))}
      </div>

      {/* Breakroom Rating — matches rating--tiny pattern from employer pages */}
      <div style={{ marginBottom: S.s2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: S.s, marginBottom: S.xs }}>
          <span style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>Breakroom Rating</span>
          <TinyRatingDial score={rating} />
          <span style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{rating.toFixed(1)}</span>
        </div>
        <div style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT }}>
          Rating based on {job.quizCount} employees who took the Breakroom Quiz
        </div>
      </div>

      {/* Vacancy highlights — matches .vacancy-highlights */}
      <div style={{ display: "flex", gap: S.s, flexWrap: "wrap" }}>
        {job.highlights.map((h) => <VacancyHighlight key={h} label={h} onClick={() => handlePillClick(h)} />)}
      </div>
    </div>
  );

  const sectionsBlock = (
    <>
      <Section number={1} title="Can you do this job?" icon={<IconAlertCircle />} defaultOpen={true} badge={{ text: "CHECK FIRST", bg: COLORS.amberBg, textColor: COLORS.amberText }}>
        <Signal status="warning" label="Pay: below London Living Wage"
          detail={`${job.pay} — the London Living Wage is £14.80/hr. 38% of workers here say they're paid below Living Wage.`}
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

      <Section number={2} title="What's it really like here?" icon={<IconRanking />} badgeEl={<span style={{ display: "inline-flex", alignItems: "center", gap: S.xs }}><TinyRatingDial score={rating} /><span style={{ ...T.body2Bold, color: COLORS.text, fontFamily: FONT }}>{rating.toFixed(1)}/10</span></span>} forceOpen={findingsForceOpen} sectionRef={findingsSectionRef}>
        {/* Red flags group */}
        <div style={{ ...T.smallcaps, color: COLORS.red, marginBottom: S.xs, fontFamily: FONT }}>Red flags</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: S.xs }}>
          {[
            {
              pct: 86, label: "No sick pay",
              heading: "Most people don't get sick pay",
              primary: "No. Most people don't get proper sick pay",
              secondary: "86% of people say they wouldn't get paid if they were sick but scheduled to work.",
              why: "Everyone gets sick sometimes. You should be able to take time off without worrying. At a good job you should still get paid if you're scheduled to work but can't due to sickness.",
            },
            {
              pct: 71, label: "Stressful work",
              heading: "Most people are stressed",
              primary: "Most people feel stressed here",
              secondary: "71% of people say they often feel stressed at work.",
              why: "Work isn't always easy, but if you're frequently stressed, that's not good. Your employer should support you with enough people and resources to get your job done without feeling overwhelmed.",
            },
            {
              pct: 70, label: "Unpaid breaks",
              heading: "Most people don't get paid breaks",
              primary: "No. Most people don't get paid breaks",
              secondary: "70% of people say they don't get paid breaks.",
              why: "A good job should have paid breaks. You should be paid for all your time at work, whether you're on a break or not.",
            },
            {
              pct: 80, label: "Disconnected management",
              heading: "Head office doesn't understand what's happening",
              primary: "Most people think head office doesn't understand what's happening where they work",
              secondary: "80% of people think that this employer's head office or owners don't have a good understanding of what's really happening where they work.",
              why: "At a good job, the role of head office should be to support the people on the frontline serving customers. To do that properly, the company's owners or head office need to have a good understanding of what's really happening on the frontline.",
            },
          ].map((v) => (
            <FindingTile key={v.label} {...v} variant="red" />
          ))}
        </div>

        {/* Good things group */}
        <div style={{ ...T.smallcaps, color: COLORS.green, marginTop: S.s2, marginBottom: S.xs, fontFamily: FONT }}>Good things</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: S.xs }}>
          {[
            {
              pct: 72, label: "Respectful managers",
              heading: "Most people feel treated with respect",
              primary: "Most people feel treated with respect by their managers",
              secondary: "72% of people say they're treated with respect by their managers.",
              why: "Everyone should get treated with respect by their managers. You shouldn't feel discriminated against or bullied, and if you have a problem you should be able to speak to someone about it.",
            },
            {
              pct: 82, label: "Proper breaks",
              heading: "Most people get proper breaks",
              primary: "Most people get proper breaks",
              secondary: "82% of people report that they get to take proper breaks.",
              why: "When you take a break it should be a proper rest. It should last the full duration and you shouldn't get pulled off it.",
            },
            {
              pct: 83, label: "Easy to book holiday",
              heading: "Easy to book holiday",
              primary: "Most people find it easy to book holiday",
              secondary: "83% of people report it's easy to book holidays.",
              why: "A good job should let you take time off when you need it, and it shouldn't be a nightmare to arrange.",
            },
            {
              pct: 69, label: "Stable shift patterns",
              heading: "4+ weeks notice of shifts",
              primary: "Most people get 4 weeks notice of when they're working",
              secondary: "69% of people with changing schedules report getting four weeks notice or more.",
              why: "At a good job, you get plenty of notice about when you're working. This makes it easy for you to plan the rest of your life, as well as your finances, because you know how much you'll be working and when.",
            },
          ].map((v) => (
            <FindingTile key={v.label} {...v} variant="green" lit={highlightFinding === v.label} forceOpen={highlightFinding === v.label} />
          ))}
        </div>

        <div style={{ ...T.body2Bold, color: COLORS.accent, cursor: "pointer", textAlign: "center", padding: `${S.xs}px 0`, fontFamily: FONT, marginTop: S.xs }}>
          See all findings from workers →
        </div>
      </Section>

      <Section number={3} title="What workers actually said" icon={<IconMessageCircle />}>
        <ReviewSnippet best={true} quote="Flexible when needed" score={8.2} role="Agency worker" date="Sep 2024" />
        <ReviewSnippet best={true} quote="Good team and good training" score={8.0} role="Branch manager" date="Jun 2024" />
        <ReviewSnippet best={false} quote="The managers, the stress levels" score={1.8} role="Administrator" date="Jul 2023" />
        <div style={{ ...T.body2Bold, color: COLORS.accent, cursor: "pointer", textAlign: "center", padding: `${S.xs}px 0`, fontFamily: FONT }}>See all {job.quizCount} reviews →</div>
      </Section>

      <Section number={4} title="Full job details" icon={<IconApply />}>
        <a href={job.listingUrl} target="_blank" rel="noopener noreferrer"
          style={{ ...T.body2Bold, color: COLORS.accent, fontFamily: FONT, display: "inline-flex", alignItems: "center", gap: S.xs, textDecoration: "none" }}>
          View full listing on employer site ↗
        </a>
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
        <span onClick={() => handleJobSelect(0)} style={{ ...T.body2Bold, color: COLORS.text, fontFamily: FONT, cursor: "pointer" }}>← Back to results</span>
        <span style={{ ...T.body1Bold, color: COLORS.accent, fontFamily: FONT }}>Breakroom</span>
      </div>

      {isDesktop ? (
        <div style={{ maxWidth: 1160, margin: "0 auto", padding: `0 ${S.l}px ${S.xl}px`, display: "grid", gridTemplateColumns: "1fr 400px", gap: S.xl, alignItems: "start" }}>
          <div>
            {heroBlock}
            {sectionsBlock}
          </div>
          <DesktopSidebar currentJobIdx={selectedJobIdx} personalised={personalised} onOpenDrawer={() => setDrawerOpen(true)} onJobSelect={handleJobSelect} />
        </div>
      ) : (
        <div style={{ maxWidth: 480, margin: "0 auto", padding: `0 ${S.m}px ${S.xxl}px` }}>
          {heroBlock}
          {sectionsBlock}
          <div style={{ marginTop: S.m2, marginBottom: S.s }}>
            <AlternativesList currentJobIdx={selectedJobIdx} personalised={personalised} onOpenDrawer={() => setDrawerOpen(true)} onJobSelect={handleJobSelect} />
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
