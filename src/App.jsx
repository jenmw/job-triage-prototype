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
  greenText: "#008728",
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
    jd: [
      { label: "Job title", text: "Warehouse Operative" },
      { label: "Employer", text: "The Best Connection (Employment Agency)" },
      { label: "Pay", text: "£12.58 per hour" },
      { label: "Location", text: "Hounslow, TW6 (near Heathrow Airport)" },
      { label: "Hours", text: "Full time — 4 on / 4 off rotation, 12-hour shifts (6am–6pm, 8am–8pm, or 10am–10pm)" },
      { label: "Role description", text: "We are recruiting Warehouse Operatives on behalf of a major international logistics facility based near Heathrow Airport. You will be responsible for sorting, scanning, and processing mail bags and parcels for international dispatch. Working in a fast-paced, physically demanding environment, you'll be part of a team that keeps global supply chains moving." },
      { label: "Responsibilities", text: "Sort and scan incoming and outgoing mail bags; Process items for international dispatch using handheld scanners; Maintain a safe and organised work area; Meet daily throughput targets; Report any discrepancies or damaged items." },
      { label: "Requirements", text: "Valid photo ID; 5-year address history (for security vetting); Must be able to pass a DBS check and CAA Aviation Security Course (funded by employer); Comfortable with heavy lifting up to 30kg; Ability to work rotating 12-hour shifts." },
      { label: "Please note", text: "Due to the location's proximity to Heathrow Airport, this role is regulated by the Civil Aviation Authority (CAA). All candidates must successfully complete an Aviation Security background check before starting." },
    ],
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
    altBadge: "↑ £0.67/hr",
    altReason: { text: "Better rated (7.4 vs 5.2) · More pay" },
    jd: [
      { label: "Job title", text: "Warehouse Operative" },
      { label: "Employer", text: "Gap Personnel (Employment Agency)" },
      { label: "Pay", text: "£13.25–£17.25 per hour (including shift premiums)" },
      { label: "Location", text: "London (various sites)" },
      { label: "Hours", text: "Full time, 8-hour shifts — days and nights available" },
      { label: "Role description", text: "Gap Personnel are recruiting Warehouse Operatives for immediate start positions across multiple sites in London. Whether you're experienced in a warehouse environment or looking for your first role, we want to hear from you. We offer weekly pay and ongoing placements." },
      { label: "Responsibilities", text: "Picking and packing orders to meet accuracy and speed targets; Loading and unloading vehicles; Using RF scanners; Stock replenishment and rotation; Keeping work areas clean and tidy." },
      { label: "Requirements", text: "Previous warehouse experience preferred but not essential; Able to work in a team environment; Comfortable standing for long periods; Reliable and punctual; Must have the right to work in the UK." },
      { label: "Benefits", text: "Competitive hourly rate with shift premiums; Weekly pay; Holiday pay accrual; Opportunity for temp-to-perm positions." },
    ],
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
    altBadge: "↑ £1.66/hr",
    altReason: null,
    jd: [
      { label: "Job title", text: "Logistics Operator" },
      { label: "Employer", text: "Shorterm Group (Employment Agency)" },
      { label: "Pay", text: "£14.24–£18.37 per hour" },
      { label: "Location", text: "London SE25" },
      { label: "Hours", text: "Full time, day shifts" },
      { label: "Role description", text: "Shorterm Group are looking for experienced Logistics Operators to join a busy distribution centre in south-east London. This is a fast-paced role requiring attention to detail and the ability to work to tight deadlines. Immediate start available for the right candidates." },
      { label: "Responsibilities", text: "Receiving, processing, and dispatching stock; Operating warehouse management systems (WMS); Coordinating with drivers and third-party logistics partners; Ensuring accurate inventory records; Participating in stock takes." },
      { label: "Requirements", text: "Previous logistics or warehouse experience essential; Familiarity with WMS software desirable; Strong numeracy and communication skills; Ability to work independently and as part of a team; Forklift licence advantageous but not required." },
      { label: "Benefits", text: "Enhanced hourly rate; Daytime hours only; 28 days holiday (pro rata); Consistent shifts." },
    ],
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
    altBadge: "↑ £2.11/hr",
    altReason: { text: "Part time available · £2.11/hr more" },
    jd: [
      { label: "Job title", text: "Warehouse Operative (Part Time)" },
      { label: "Employer", text: "Gi Group (Employment Agency)" },
      { label: "Pay", text: "£14.69 per hour" },
      { label: "Location", text: "London" },
      { label: "Hours", text: "Part time, day shifts — flexible hours to suit" },
      { label: "Role description", text: "Gi Group are recruiting part-time Warehouse Operatives for a well-established client based in London. This is an ideal opportunity for those who need flexible working arrangements. Positions are available immediately with the potential to increase hours." },
      { label: "Responsibilities", text: "Manual handling of goods and materials; Picking orders to specification; Maintaining stock accuracy; Assisting with deliveries and collections; General warehouse housekeeping." },
      { label: "Requirements", text: "Previous warehouse experience an advantage; Must be physically fit — role involves lifting; Flexible and adaptable approach to work; Good communication skills; Right to work in the UK required." },
      { label: "Benefits", text: "Competitive part-time pay rate; Flexible shift patterns; Weekly pay; Holiday pay; Ongoing work with potential for increased hours." },
    ],
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
    altBadge: "Better rated",
    altReason: { text: "Top rated employer in this area (7.7/10)" },
    jd: [
      { label: "Job title", text: "Warehouse Operator (Night Shift)" },
      { label: "Employer", text: "DSV UK Ltd (Direct Employer)" },
      { label: "Pay", text: "Competitive — discussed at interview" },
      { label: "Location", text: "Hounslow, TW4" },
      { label: "Hours", text: "Full time, night shifts (10pm–6am or similar rotation)" },
      { label: "Role description", text: "DSV is a leading global transport and logistics company and we're looking for Warehouse Operators to join our night shift team at our Hounslow facility. As part of our warehouse team, you'll play a key role in ensuring goods are processed accurately and on time, ready for next-day delivery." },
      { label: "Responsibilities", text: "Processing inbound and outbound freight; Loading and unloading HGVs; Sorting and scanning parcels; Operating warehouse equipment; Ensuring health and safety compliance at all times." },
      { label: "Requirements", text: "Previous warehouse or logistics experience preferred; Ability to work unsupervised on night shifts; Good attention to detail; Physically fit and able to lift up to 25kg; Counter-balance forklift licence desirable." },
      { label: "About DSV", text: "DSV operates a global network of more than 75,000 employees across over 90 countries. We are committed to creating a positive working environment with strong career development opportunities." },
      { label: "Benefits", text: "Competitive salary; Night shift allowance; 25 days holiday; Company pension; Career development and training." },
    ],
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
    altBadge: "↑ £0.42/hr",
    altReason: { text: "Same location · £0.42/hr more (£13.00 vs £12.58)" },
    jd: [
      { label: "Job title", text: "FLT Driver (Counterbalance / Reach)" },
      { label: "Employer", text: "Manpower (Employment Agency)" },
      { label: "Pay", text: "£13.00 per hour" },
      { label: "Location", text: "Hounslow, Middlesex" },
      { label: "Hours", text: "Full time, day shifts (Monday–Friday)" },
      { label: "Role description", text: "Manpower are looking for an experienced FLT Driver to join a busy warehouse operation in Hounslow. You will be operating counterbalance and reach trucks in a fast-paced distribution environment. This is a temp-to-perm opportunity for the right candidate." },
      { label: "Responsibilities", text: "Operating counterbalance and reach forklift trucks safely; Loading and unloading vehicles; Moving stock around the warehouse; Checking goods in and out; Maintaining accurate records." },
      { label: "Requirements", text: "Valid RTITB or ITSSAR forklift licence (counterbalance essential, reach desirable); Minimum 1 year's FLT experience; Ability to work in a team; Good attention to detail; Physically fit; No criminal convictions." },
      { label: "Benefits", text: "Competitive pay rate; Monday–Friday days — no weekend work; Weekly pay; Holiday pay; Temp-to-perm opportunity." },
    ],
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

// ─── Chevron SVG (matches chevron-down--16px-bold from site) ────────────────────
const IconChevronDown = ({ color = COLORS.muted, rotated = false }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", flexShrink: 0, transition: "transform 0.2s", transform: rotated ? "rotate(180deg)" : "rotate(0deg)" }}>
    <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
      color: COLORS.greenText, background: COLORS.card,
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "2px 8px", whiteSpace: "nowrap", fontFamily: FONT,
      cursor: onClick ? "pointer" : "default",
      textDecoration: "none",
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
        <span style={{ width: 15, height: 15, borderRadius: "50%", background: dot, border: "2px solid white", flexShrink: 0, display: "inline-block" }} />
        <span style={{ ...T.body1, color: COLORS.text, fontFamily: FONT }}>{statement}</span>
      </div>
    </div>
  );
};

// ─── Finding tile — matches .finding-group__finding linear accordion ─────────────
// White card group container: bg white, borderRadius 5, padding "8px 16px 0", mb 16px
// Each row: padding 16px 0, borderBottom 1px solid rgba(50,50,50,0.1)
// Coloured circle (15px, 2px white border) + short_text, expands to primary/secondary/why
const FindingTile = ({ pct, label, heading, primary, secondary, why, variant, lit, forceOpen, isLast, opinionLabel }) => {
  const [open, setOpen] = useState(false);
  useEffect(() => { if (forceOpen) setOpen(true); }, [forceOpen]);
  const isRed   = variant === "red";
  const isAmber = variant === "amber";
  const dotColor = isRed ? COLORS.red : isAmber ? COLORS.amber : COLORS.green;
  const expandBg = isRed ? COLORS.redBg : isAmber ? COLORS.amberBg : COLORS.greenBg;
  // typography(16, 500) — matches .finding-group__finding
  const findingType = { fontSize: 16, lineHeight: "22px", fontWeight: 500 };
  return (
    <div
      onClick={() => setOpen(!open)}
      style={{
        ...findingType,
        color: COLORS.text,
        padding: `${S.m}px 0`,
        // .finding-group__finding:last-child { border-bottom: none }
        borderBottom: isLast ? "none" : "1px solid rgba(50,50,50,0.1)",
        cursor: "pointer",
        position: "relative",
        outline: lit ? `2px solid ${dotColor}` : "none",
        outlineOffset: -2,
        transition: "outline 0.3s",
      }}
    >
      {opinionLabel && (
        <div style={{ ...T.smallcaps, color: COLORS.text, textTransform: "uppercase", marginBottom: S.s, fontFamily: FONT }}>
          {opinionLabel}
        </div>
      )}
      {/* .finding-group__finding-description */}
      <div style={{ display: "flex", alignItems: "center", paddingRight: S.m }}>
        <span style={{ width: 15, height: 15, borderRadius: "50%", background: dotColor, border: "2px solid #fff", flexShrink: 0, marginRight: S.s }} />
        <span style={{ fontFamily: FONT, flex: 1 }}>{heading ?? label}</span>
        <IconChevronDown rotated={open} />
      </div>
      {/* .finding-group__finding-data */}
      <div style={{ maxHeight: open ? 400 : 0, overflow: "hidden", transition: "max-height 0.3s ease" }}>
        <div style={{ borderTop: "1px solid rgba(50,50,50,0.1)", margin: `${S.m}px 0 ${S.m2}px`, padding: S.m, background: expandBg }}>
          <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT, marginBottom: S.xs }}>{primary}</div>
          <div style={{ ...T.smallcaps, color: COLORS.muted, fontFamily: FONT, margin: `${S.s}px 0 ${S.xs}px` }}>How we know this</div>
          <div style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, marginBottom: S.s }}>{secondary}</div>
          <div style={{ ...T.smallcaps, color: COLORS.muted, fontFamily: FONT, marginBottom: S.xs }}>Why this matters</div>
          <div style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, fontStyle: "italic", lineHeight: 1.5 }}>{why}</div>
        </div>
      </div>
    </div>
  );
};

// ─── Signal row — matches .finding-group__finding linear style ─────────────────
// White card container wraps all signals in a section; each row has a coloured dot
const Signal = ({ status, label, detail, subtext, subtextClick, isLast }) => {
  const dot = status === "good" ? COLORS.green : status === "warning" ? COLORS.amber : COLORS.red;
  return (
    <div style={{ fontSize: 16, lineHeight: "22px", fontWeight: 500, color: COLORS.text, padding: `${S.m}px 0`, borderBottom: isLast ? "none" : "1px solid rgba(50,50,50,0.1)", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: S.s }}>
        <span style={{ width: 15, height: 15, borderRadius: "50%", background: dot, border: "2px solid #fff", flexShrink: 0, marginTop: 3 }} />
        <div style={{ flex: 1, fontFamily: FONT }}>
          <div>{label}</div>
          {detail && <div style={{ ...T.body2, color: COLORS.muted, marginTop: S.xs, fontWeight: 400 }}>{detail}</div>}
          {subtext && (
            <div onClick={subtextClick} style={{ ...T.body2, color: subtextClick ? COLORS.accent : COLORS.muted, marginTop: S.xs, fontWeight: 400, cursor: subtextClick ? "pointer" : "default" }}>
              {subtext}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Collapsible section ───────────────────────────────────────────────────────
const Section = ({ title, children, defaultOpen = false, badge, badgeEl, forceOpen, sectionRef }) => {
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => { if (forceOpen) setOpen(true); }, [forceOpen]);
  return (
    <div ref={sectionRef} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", padding: `${S.m}px 0`, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: S.s, fontFamily: FONT }}>
        <span style={{ ...T.body1Bold, color: COLORS.text, flex: 1, textAlign: "left", fontFamily: FONT }}>{title}</span>
        {badgeEl ?? (badge && <span style={{ ...T.smallcaps, padding: `${S.xs}px ${S.s}px`, borderRadius: 100, background: badge.bg, color: badge.textColor }}>{badge.text}</span>)}
        <IconChevronDown rotated={open} />
      </button>
      <div style={{ maxHeight: open ? 2000 : 0, overflow: "hidden", transition: "max-height 0.35s ease" }}>
        <div style={{ paddingBottom: S.m, display: "flex", flexDirection: "column", gap: S.s }}>{children}</div>
      </div>
    </div>
  );
};

// ─── Review card — matches .what-people-say__list__person .card ────────────────
// Paired best+worst in a single card, side-by-side divided by a hairline.
// RatingDial floats top-right (absolute, top -28, right 14, white bg + shadow).
// "Best thing" / "Worst thing" in body-1-bold, quote in body-1, job-info pill below.
const ReviewCard = ({ best, worst, score, role, date }) => (
  // .what-people-say__list__person — margin-top: l2 (40px), overflow unset
  <div style={{ position: "relative", marginTop: S.l2 }}>
    {/* .rating — position absolute, top -28, right 14, white bg, border-radius 56px, padding s */}
    <div style={{ position: "absolute", top: -28, right: 14, background: COLORS.card, borderRadius: 56, padding: S.s, zIndex: 1 }}>
      <RatingDial score={score} displaySize={44} />
    </div>
    {/* .card — box-shadow none (overridden by .what-people-say), overflow unset for speech bubble */}
    <div style={{ background: COLORS.card, borderRadius: 5, boxShadow: "0px 4px 4px rgba(0,0,0,0.05)", position: "relative", overflow: "unset" }}>
      <div style={{ display: "flex" }}>
        {/* .best-worst — padding 24px, 50% width */}
        <div style={{ flex: 1, padding: S.m2 }}>
          <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT, marginBottom: S.s }}>Best thing</div>
          <div style={{ ...T.body1, color: COLORS.text, fontFamily: FONT, lineHeight: 1.5 }}>{best}</div>
        </div>
        {/* .best-worst + .best-worst — border-left rgba(black, 0.04) on desktop */}
        <div style={{ flex: 1, padding: S.m2, borderLeft: "1px solid rgba(50,50,50,0.04)" }}>
          <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT, marginBottom: S.s }}>Worst thing</div>
          <div style={{ ...T.body1, color: COLORS.text, fontFamily: FONT, lineHeight: 1.5 }}>{worst}</div>
        </div>
      </div>
      {/* Speech bubble tail — ::after: white 23x23 diamond, bottom -12, left 30 */}
      <div style={{ position: "absolute", bottom: -12, left: 30, width: 23, height: 23, background: COLORS.card, transform: "rotate(45deg)", borderRadius: "0 0 5px 0" }} />
    </div>
    {/* .job-info — outside the card, inline-block, rgba(black,0.05) bg, border-radius 20, padding 10 16 8 */}
    <div style={{ marginTop: S.m }}>
      <span style={{ ...T.body2, display: "inline-block", background: "rgba(50,50,50,0.05)", borderRadius: 20, padding: "10px 16px 8px", color: COLORS.muted, fontFamily: FONT }}>
        {role} · {date}
      </span>
    </div>
  </div>
);

// ─── Alternative job card ──────────────────────────────────────────────────────
const AltJob = ({ job, onClick }) => {
  const { title, company, companyType, pay, rating, location, altBadge, altReason: reason } = job;
  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.card,
        borderRadius: 5,
        boxShadow: "0px 4px 4px rgba(0,0,0,0.05)",
        padding: S.m,
        cursor: "pointer",
      }}
    >
      {/* Title row with badge top-right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: S.s, marginBottom: S.xs }}>
        <div style={{ ...T.body2Bold, color: COLORS.text, fontFamily: FONT }}>{title}</div>
        {altBadge && (
          <span style={{ ...T.body2Bold, border: `2px solid ${COLORS.green}`, color: COLORS.greenText, background: COLORS.card, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap", fontFamily: FONT, flexShrink: 0 }}>
            {altBadge}
          </span>
        )}
      </div>
      {/* .vacancy-card-list__rating-container — dial + score + employer name */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: S.xs }}>
        <TinyRatingDial score={rating} />
        <span style={{ ...T.body2Bold, color: COLORS.text, fontFamily: FONT }}>{rating.toFixed(1)}</span>
        <span style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT }}>{company} · {companyType}</span>
      </div>
      {/* Pay + location */}
      <div style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT }}>
        {pay} · {location}
      </div>
      {reason && (
        <div style={{ borderTop: "1px solid rgba(50,50,50,0.1)", paddingTop: S.s, marginTop: S.s }}>
          <span style={{ ...T.body2Bold, color: COLORS.text, fontFamily: FONT }}>{reason.text}</span>
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

const AlternativesList = ({ currentJobIdx, personalised, onOpenDrawer, onJobSelect }) => {
  const altJobs = JOBS.filter((j) => j.id !== currentJobIdx);
  return (
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
        {altJobs.map((j) => (
          <AltJob key={j.id} job={j} onClick={() => onJobSelect(j.id)} />
        ))}
      </div>
    </div>
  );
};

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

    {/* Alternatives — not sticky, scrolls with page */}
    <div>
      <AlternativesList currentJobIdx={currentJobIdx} personalised={personalised} onOpenDrawer={onOpenDrawer} onJobSelect={onJobSelect} />
      <PersonaliseNudge personalised={personalised} onOpenDrawer={onOpenDrawer} />
    </div>
  </div>
);

// ─── All findings data — used by "See all findings from workers" modal ─────────
const ALL_FINDINGS = [
  {
    section: "Pay",
    findings: [
      {
        heading: "Most people don't get sick pay",
        opinion: "bad",
        primary: "No. Most people don't get proper sick pay",
        secondary: "86% of people say they wouldn't get paid if they were sick but scheduled to work.",
        why: "Everyone gets sick sometimes. You should be able to take time off without worrying. At a good job you should still get paid if you're scheduled to work but can't due to sickness.",
      },
      {
        heading: "Pay is below the London Living Wage",
        opinion: "bad",
        primary: "This job pays below the London Living Wage",
        secondary: "At £12.58/hr this is below the London Living Wage of £14.80/hr. 38% of workers report being paid below Living Wage.",
        why: "The Living Wage is the minimum needed to meet the basic cost of living. Jobs that pay below it can make it hard to cover everyday expenses.",
      },
      {
        heading: "Most people get paid the same regardless of age",
        opinion: "good",
        primary: "Yes. Most people get equal pay regardless of age",
        secondary: "75% of people say they get paid the same as everyone else their age.",
        why: "Your age shouldn't affect your pay. Everyone doing the same job deserves the same rate.",
      },
    ],
  },
  {
    section: "Hours and flexibility",
    findings: [
      {
        heading: "Less than 4 weeks notice of shifts",
        opinion: "bad",
        primary: "Most people get less than 4 weeks notice of when they're working",
        secondary: "67% of people with changing schedules report getting less than four weeks notice.",
        why: "At a good job, you get plenty of notice about when you're working. This makes it easy for you to plan the rest of your life, as well as your finances, because you know how much you'll be working and when.",
      },
      {
        heading: "Only some people get a choice of shifts",
        opinion: "okay",
        primary: "Only some people get a say in which shifts they work",
        secondary: "52% of people say they get some choice over their shifts.",
        why: "Being able to choose or influence your shifts makes it much easier to balance work with your life outside of it.",
      },
      {
        heading: "Can be hard to change shifts",
        opinion: "okay",
        primary: "It can be hard to swap or change shifts",
        secondary: "49% of people say it's difficult to change a shift when they need to.",
        why: "Life is unpredictable. A good employer makes it reasonably easy to swap shifts when something comes up.",
      },
      {
        heading: "Easy to book holiday",
        opinion: "good",
        primary: "Most people find it easy to book holiday",
        secondary: "83% of people report it's easy to book holidays.",
        why: "A good job should let you take time off when you need it, and it shouldn't be a nightmare to arrange.",
      },
      {
        heading: "Shifts don't get changed at short notice",
        opinion: "good",
        primary: "Most people's shifts don't get changed at short notice",
        secondary: "71% of people say their shifts are rarely or never changed at short notice.",
        why: "Having your shifts changed at the last minute is really disruptive to your life. A good employer respects your time.",
      },
      {
        heading: "Some people find it hard to take sick leave",
        opinion: "okay",
        primary: "Some people find it hard to take time off sick",
        secondary: "44% of people say they find it difficult to take sick leave when they need it.",
        why: "When you're unwell, you should be able to take time off without fear of losing your job or facing consequences.",
      },
    ],
  },
  {
    section: "Workplace",
    findings: [
      {
        heading: "Most people are stressed",
        opinion: "bad",
        primary: "Most people feel stressed here",
        secondary: "71% of people say they often feel stressed at work.",
        why: "Work isn't always easy, but if you're frequently stressed, that's not good. Your employer should support you with enough people and resources to get your job done without feeling overwhelmed.",
      },
      {
        heading: "Most people don't get paid breaks",
        opinion: "bad",
        primary: "No. Most people don't get paid breaks",
        secondary: "70% of people say they don't get paid breaks.",
        why: "A good job should have paid breaks. You should be paid for all your time at work, whether you're on a break or not.",
      },
      {
        heading: "Head office doesn't understand what's happening",
        opinion: "bad",
        primary: "Most people think head office doesn't understand what's happening where they work",
        secondary: "80% of people think that this employer's head office or owners don't have a good understanding of what's really happening where they work.",
        why: "At a good job, the role of head office should be to support the people on the frontline serving customers. To do that properly, the company's owners or head office need to have a good understanding of what's really happening on the frontline.",
      },
      {
        heading: "Most people get proper breaks",
        opinion: "good",
        primary: "Most people get proper breaks",
        secondary: "82% of people report that they get to take proper breaks.",
        why: "When you take a break it should be a proper rest. It should last the full duration and you shouldn't get pulled off it.",
      },
      {
        heading: "Most people feel treated with respect",
        opinion: "good",
        primary: "Most people feel treated with respect by their managers",
        secondary: "72% of people say they're treated with respect by their managers.",
        why: "Everyone should get treated with respect by their managers. You shouldn't feel discriminated against or bullied, and if you have a problem you should be able to speak to someone about it.",
      },
      {
        heading: "Work can be physically demanding",
        opinion: "okay",
        primary: "Some people find the physical demands tough",
        secondary: "48% of people say the physical demands of the job are harder than expected.",
        why: "Warehouse work is physically demanding. A good employer provides the right equipment, training, and breaks to protect your health.",
      },
      {
        heading: "Some people experience bullying or harassment",
        opinion: "okay",
        primary: "Some people have experienced bullying or harassment",
        secondary: "32% of people say they've experienced bullying or harassment at work.",
        why: "No one should have to put up with bullying at work. Your employer should have clear policies and take action when people raise concerns.",
      },
      {
        heading: "Not everyone finds managers easy to talk to",
        opinion: "okay",
        primary: "Not everyone finds their manager approachable",
        secondary: "41% of people say they don't feel comfortable raising concerns with their manager.",
        why: "Being able to talk to your manager is important. If you have a problem, you should be able to speak to someone without fear of consequences.",
      },
    ],
  },
];

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function JobTriagePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [jdModalOpen, setJdModalOpen] = useState(false);
  const [allFindingsModalOpen, setAllFindingsModalOpen] = useState(false);
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

      {/* .vacancy-card__divider + .vacancy__details */}
      <div style={{ borderTop: "1px solid rgba(50,50,50,0.1)", borderBottom: "1px solid rgba(50,50,50,0.1)", marginTop: S.m, marginBottom: S.m, paddingTop: S.m, paddingBottom: S.s, maxWidth: 500 }}>
        {[
          { icon: <IconPay />, text: job.pay },
          { icon: <IconLocation />, text: job.location },
          { icon: <IconClock />, text: `${job.hours}${job.hoursSub ? ` (${job.hoursSub})` : ""}` },
          { icon: <IconClock />, text: job.shifts },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", marginBottom: S.s }}>
            <span style={{ marginRight: S.s, marginTop: S.xs, flexShrink: 0, display: "flex" }}>{f.icon}</span>
            <span style={{ ...T.body1, color: COLORS.text, fontFamily: FONT, lineHeight: 1.5 }}>{f.text}</span>
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
      {/* "Can you do this job?" — always visible, no accordion */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, paddingBottom: S.m }}>
        <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT, padding: `${S.m}px 0` }}>Can you do this job?</div>
        <div style={{ background: COLORS.card, borderRadius: 5, padding: `0 ${S.m}px` }}>
          <Signal status="warning" label="Pay: below average for warehouse work in London"
            detail={`${job.pay} — warehouse operatives in London typically earn £13.50–£16.00/hr. This role pays below the median and below the London Living Wage of £14.80/hr.`}
            subtext="Based on ONS earnings data and Breakroom member reports" />
          <Signal status="warning" label="Commute: Hounslow (near Heathrow)"
            detail="Shift times are 6am, 8am, or 10am starts — check early-morning transport from your area."
            subtext="Tap to check commute from your postcode →"
            subtextClick={() => setDrawerOpen(true)} />
          <Signal status="warning" label="Requirements: 5-year background check + DBS"
            detail="You'll need 5 years of address history and references. CAA security clearance required (they pay for it). Must have valid photo ID."
            subtext="Heavy lifting up to 30kg required" />
          <Signal status="good" label="No prior warehouse experience mentioned"
            detail="The listing doesn't require previous warehouse experience — just that you're reliable and comfortable with physical work."
            isLast={true} />
        </div>
      </div>

      <Section title="What's it really like here?" badgeEl={<span style={{ display: "inline-flex", alignItems: "center", gap: S.xs }}><TinyRatingDial score={rating} /><span style={{ ...T.body2Bold, color: COLORS.text, fontFamily: FONT }}>{rating.toFixed(1)}/10</span></span>} forceOpen={findingsForceOpen} sectionRef={findingsSectionRef}>
        {/* Red flags group — .finding-group */}
        <div style={{ background: COLORS.card, borderRadius: 5, padding: `${S.s}px ${S.m}px 0`, marginBottom: S.m }}>
        <div style={{ ...T.smallcaps, color: COLORS.text, display: "inline-block", textTransform: "uppercase", marginBottom: S.xs, fontFamily: FONT }}>Needs improving</div>
        <div>
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
          ].map((v, i, arr) => (
            <FindingTile key={v.label} {...v} variant="red" isLast={i === arr.length - 1} />
          ))}
        </div>
        </div>

        {/* Good things group — .finding-group */}
        <div style={{ background: COLORS.card, borderRadius: 5, padding: `${S.s}px ${S.m}px 0` }}>
        <div style={{ ...T.smallcaps, color: COLORS.text, display: "inline-block", textTransform: "uppercase", marginTop: S.m, marginBottom: S.xs, fontFamily: FONT }}>Good</div>
        <div>
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
          ].map((v, i, arr) => (
            <FindingTile key={v.label} {...v} variant="green" lit={highlightFinding === v.label} forceOpen={highlightFinding === v.label} isLast={i === arr.length - 1} />
          ))}
        </div>
        </div>

        <div onClick={() => setAllFindingsModalOpen(true)} style={{ ...T.body2Bold, color: COLORS.accent, cursor: "pointer", textAlign: "center", padding: `${S.xs}px 0`, fontFamily: FONT, marginTop: S.xs }}>
          See all findings from workers →
        </div>
      </Section>

      <Section title="What workers actually said">
        <ReviewCard
          best="Flexible when needed, good team atmosphere"
          worst="The managers, the stress levels — it gets to you"
          score={5.8} role="Agency worker" date="Sep 2024" />
        <ReviewCard
          best="Good training when you start, friendly team"
          worst="Long shifts and no overtime pay after 12 hours"
          score={6.5} role="Branch manager" date="Jun 2024" />
        <div style={{ ...T.body2Bold, color: COLORS.accent, cursor: "pointer", textAlign: "center", padding: `${S.xs}px 0`, fontFamily: FONT, marginTop: S.s }}>See all {job.quizCount} reviews →</div>
      </Section>

      <Section title="Full job details">
        <div style={{ ...T.body1, color: COLORS.muted, lineHeight: 1.7, fontFamily: FONT }}>
          <p style={{ margin: `0 0 ${S.s}px` }}><strong style={{ color: COLORS.text }}>What you'll do:</strong> Sorting, scanning, and processing mail bags for international dispatch. Heavy lifting up to 30kg.</p>
          <p style={{ margin: `0 0 ${S.s}px` }}><strong style={{ color: COLORS.text }}>Shifts:</strong> 4 on / 4 off rotation. Starts 6am–6pm, 8am–8pm, or 10am–10pm (12-hour shifts).</p>
          <p style={{ margin: `0 0 ${S.s}px` }}><strong style={{ color: COLORS.text }}>You'll need:</strong> Valid photo ID, 5-year address history, DBS check and Aviation Security Course (both paid by employer).</p>
          <p style={{ margin: 0 }}><strong style={{ color: COLORS.text }}>Regulated by:</strong> Civil Aviation Authority (CAA) — that's why the background checks are strict.</p>
        </div>
        <div style={{ ...T.body2Bold, color: COLORS.accent, cursor: "pointer", textAlign: "center", padding: `${S.xs}px 0`, fontFamily: FONT }}
          onClick={() => setJdModalOpen(true)}>
          See full job description →
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

      {/* All findings modal */}
      {allFindingsModalOpen && (
        <>
          <div onClick={() => setAllFindingsModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }} />
          <div style={{ position: "fixed", inset: 0, zIndex: 101, overflow: "auto", padding: `${S.l}px ${S.m}px` }}>
            <div style={{ background: COLORS.bg, borderRadius: 5, maxWidth: 640, margin: "0 auto", padding: S.l, position: "relative" }}>
              <button onClick={() => setAllFindingsModalOpen(false)}
                style={{ position: "absolute", top: S.m, right: S.m, background: "none", border: "none", cursor: "pointer", ...T.body2Bold, color: COLORS.muted, fontFamily: FONT }}>
                ✕ Close
              </button>
              <h2 style={{ ...T.heading2, margin: `0 0 ${S.m2}px`, fontFamily: FONT, color: COLORS.text }}>All findings from workers</h2>
              {ALL_FINDINGS.map((group) => (
                <div key={group.section} style={{ marginBottom: S.l }}>
                  <h3 style={{ ...T.lead2, margin: `0 0 ${S.s2}px`, fontFamily: FONT, color: COLORS.text }}>{group.section}</h3>
                  {/* .finding-group card */}
                  <div style={{ background: COLORS.card, borderRadius: 5, padding: `${S.s}px ${S.m}px 0` }}>
                    {group.findings.map((f, i) => {
                      const opinionLabel = f.opinion === "bad" ? "Needs improving" : f.opinion === "okay" ? "Okay" : "Good";
                      return (
                        <FindingTile
                          key={f.heading}
                          heading={f.heading}
                          label={f.heading}
                          primary={f.primary}
                          secondary={f.secondary}
                          why={f.why}
                          variant={f.opinion === "bad" ? "red" : f.opinion === "okay" ? "amber" : "green"}
                          isLast={i === group.findings.length - 1}
                          opinionLabel={opinionLabel}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Job description modal */}
      {jdModalOpen && (
        <>
          <div onClick={() => setJdModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }} />
          <div style={{ position: "fixed", inset: 0, zIndex: 101, overflow: "auto", padding: `${S.l}px ${S.m}px` }}>
            <div style={{ background: COLORS.card, borderRadius: 5, maxWidth: 600, margin: "0 auto", padding: S.l, position: "relative" }}>
              <button onClick={() => setJdModalOpen(false)}
                style={{ position: "absolute", top: S.m, right: S.m, background: "none", border: "none", cursor: "pointer", ...T.body2Bold, color: COLORS.muted, fontFamily: FONT }}>
                ✕ Close
              </button>
              <h2 style={{ ...T.heading2, margin: `0 0 ${S.m2}px`, fontFamily: FONT, color: COLORS.text }}>Full job description</h2>
              <div style={{ ...T.body1, color: COLORS.muted, lineHeight: 1.7, fontFamily: FONT }}>
                {job.jd.map(({ label, text }, i) => (
                  <p key={i} style={{ margin: `0 0 ${S.m}px` }}>
                    <strong style={{ color: COLORS.text }}>{label}:</strong> {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
