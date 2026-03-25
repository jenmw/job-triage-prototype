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
  smallcaps: { fontSize: 16, lineHeight: "22px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" },
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
    payBenchmark: { verdict: "below", label: "below average for warehouse operatives in London", range: "£13.50–£16/hr typical" },
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
    altReason: null,
    payBenchmark: { verdict: "fair", label: "around average for warehouse operatives in London", range: "£13.50–£16/hr typical" },
    findingDiffs: ["More people get sick pay", "Better shift notice"],
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
    rating: 5.0,
    quizCount: 44,
    highlights: ["Paid breaks", "Regular hours"],
    listingUrl: "https://www.reed.co.uk/jobs/logistics-operator/11111",
    altBadge: "↑ £1.66/hr",
    altReason: null,
    payBenchmark: { verdict: "good", label: "above average for logistics operators in London", range: "£12.50–£15/hr typical" },
    findingDiffs: ["Easier to book holiday", "Fewer last-minute shift changes"],
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
    altReason: { text: "Part time available" },
    payBenchmark: { verdict: "good", label: "above average for warehouse operatives in London", range: "£13.50–£16/hr typical" },
    findingDiffs: ["More people get proper breaks", "Less people are stressed"],
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
    pay: "No pay info",
    location: "Hounslow",
    hours: "Full time",
    hoursSub: null,
    shifts: "Night shifts",
    rating: 7.7,
    quizCount: 89,
    highlights: ["People enjoy this job", "Learn new skills"],
    listingUrl: "https://www.reed.co.uk/jobs/warehouse-operator/33333",
    altBadge: "Better rated",
    altReason: null,
    findingDiffs: ["Less people are stressed", "More people feel respected at work"],
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
    altReason: { text: "FLT licence required" },
    payBenchmark: { verdict: "below", label: "below average for FLT drivers in London", range: "£14–£17/hr typical" },
    findingDiffs: [],
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
  {
    id: 6,
    title: "Warehouse Operative",
    company: "Brook Street",
    companyType: "Agency",
    pay: "£11.44/hr",
    location: "Hounslow",
    hours: "Full time",
    hoursSub: null,
    shifts: "Various shifts",
    rating: 4.1,
    quizCount: 29,
    highlights: [],
    listingUrl: "https://www.reed.co.uk/jobs/warehouse-operative/55555",
    altBadge: null,
    altReason: null,
    payBenchmark: { verdict: "below", label: "below average for warehouse operatives in Hounslow", range: "£13.50–£16/hr typical" },
    findingDiffs: [],
    jd: [
      { label: "Job title", text: "Warehouse Operative" },
      { label: "Employer", text: "Brook Street (Employment Agency)" },
      { label: "Pay", text: "£11.44 per hour (National Living Wage)" },
      { label: "Location", text: "Hounslow" },
      { label: "Hours", text: "Full time, various shifts including weekends" },
      { label: "Role description", text: "Brook Street are recruiting Warehouse Operatives for a general distribution warehouse in Hounslow. Duties include picking, packing, and general warehouse housekeeping. This is a short-term temporary position with no guarantee of ongoing work." },
      { label: "Requirements", text: "No experience necessary; Must be able to lift up to 25kg; Reliable and able to commit to shift schedule; Right to work in the UK." },
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

// ─── Animated rating dial — fills from empty on mount, colour transitions through thresholds ─
const AnimatedRatingDial = ({ score }) => {
  const arcRef = useRef(null);
  const displaySize = 19;
  const svgStrokeWidth = 16;
  const halfSize = 50;
  const halfWidth = Math.round((100 - svgStrokeWidth) / 2);
  const circumference = Math.round((2 * Math.PI * halfWidth - svgStrokeWidth) * 1000) / 1000;
  const targetOffset = Math.round(circumference * (1 - ((score - 1) / 9.0 * 0.9 + 0.1)) * 1000) / 1000;

  useEffect(() => {
    const el = arcRef.current;
    if (!el) return;
    const duration = 1400;
    let start = null;
    const animate = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const currentScore = eased * score;
      const color = currentScore >= 7.0 ? COLORS.green : currentScore >= 5.5 ? COLORS.amber : COLORS.red;
      el.style.strokeDashoffset = circumference - eased * (circumference - targetOffset);
      el.style.stroke = color;
      if (progress < 1) requestAnimationFrame(animate);
    };
    el.style.strokeDashoffset = circumference;
    el.style.stroke = COLORS.red;
    const id = setTimeout(() => requestAnimationFrame(animate), 200);
    return () => clearTimeout(id);
  }, [score]);

  return (
    <svg viewBox="0 0 100 100" width={displaySize} height={displaySize} style={{ flexShrink: 0, display: "block" }}>
      <circle cx={halfSize} cy={halfSize} r={halfWidth} fill="none" stroke="rgba(50,50,50,0.1)" strokeWidth={svgStrokeWidth} />
      <circle ref={arcRef}
        cx={halfSize} cy={halfSize} r={halfWidth} fill="none"
        stroke={COLORS.red} strokeWidth={svgStrokeWidth}
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={circumference}
        strokeLinecap="round"
        transform={`rotate(-82,${halfSize},${halfSize})`}
        style={{ transition: "stroke 0.25s ease" }} />
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

// ─── Header nav icons ─────────────────────────────────────────────────────────
const IconBreakroomLogo = () => (
  <svg fill="none" height="23" viewBox="0 0 245 38" width="145" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
    <g fill="#323232"><path d="m14.607 22.9224h-8.30705v10.1816h8.69725c4.0142 0 6.0212-1.7062 6.0212-5.1186 0-1.7433-.4646-3.023-1.3938-3.839s-2.6017-1.224-5.0176-1.224zm-.3345-14.57687h-7.97255v10.45977h7.58225c3.9398 0 5.9097-1.7804 5.9097-5.3412 0-1.8174-.4275-3.1156-1.2823-3.89455-.8177-.81601-2.2301-1.22402-4.2371-1.22402zm-14.2725 28.93117v-33.38212h13.9937c4.0513 0 7.0061.68619 8.8645 2.05857 1.8584 1.37237 2.7876 3.52367 2.7876 6.45385 0 4.3397-2.8433 6.899-8.53 7.6779v1.1684c3.6053.1855 6.1699.7789 7.6937 1.7804 1.5611 1.0014 2.3416 2.7262 2.3416 5.1742 0 6.0459-4.0327 9.0688-12.0981 9.0688z"/><path d="m36.8321 37.2767h-6.0212v-26.1493h5.4636v7.1215l.8921.0556c.8548-2.8189 1.9327-4.8033 3.2336-5.9531 1.3008-1.1869 2.8991-1.7804 4.7946-1.7804h.3345v6.7321h-.3345c-3.1221 0-5.2964.6491-6.5229 1.9473-1.2266 1.2611-1.8398 3.4309-1.8398 6.5095z"/><path d="m60.1513 14.6325c-4.0885 0-6.3557 2.4851-6.8017 7.4554h13.0459c-.0743-2.5223-.6133-4.3954-1.6168-5.6194-.9664-1.224-2.5088-1.836-4.6274-1.836zm.223 23.3119c-4.0885 0-7.2849-1.1313-9.5893-3.3939-2.3044-2.2996-3.4566-5.6379-3.4566-10.0146 0-4.4139 1.1336-7.8634 3.4008-10.3485 2.3045-2.4851 5.5009-3.7277 9.5894-3.7277 3.9026 0 6.8202 1.0386 8.753 3.1157 1.9327 2.04 2.8991 4.9331 2.8991 8.6794 0 1.0385-.0558 2.2069-.1673 3.5051h-18.5096c.3345 5.0815 2.7133 7.6222 7.1363 7.6222 1.9327 0 3.3451-.3523 4.2371-1.0571.892-.7418 1.5425-1.7989 1.9513-3.1713l5.0177 1.3353c-.6319 2.411-1.8213 4.2655-3.5682 5.5637-1.7097 1.2611-4.2743 1.8917-7.6937 1.8917z"/><path d="m84.4186 33.3821c2.1185 0 3.8282-.5563 5.1291-1.6691 1.3009-1.1127 1.9513-2.5407 1.9513-4.284v-1.2797h-6.6344c-3.3451 0-5.0177 1.2426-5.0177 3.7277 0 2.3368 1.5239 3.5051 4.5717 3.5051zm7.6937 3.8946v-5.8975h-.892c-1.8584 4.3026-4.9434 6.4539-9.2548 6.4539-5.1292 0-7.6938-2.3924-7.6938-7.1772 0-2.448.7806-4.3767 2.3416-5.7862 1.561-1.4466 3.9584-2.1698 7.192-2.1698h7.6937v-2.5037c0-1.7062-.3902-2.9859-1.1708-3.839-.7805-.8531-2.0628-1.2796-3.8468-1.2796-2.6761 0-4.4602 1.3167-5.3522 3.9502l-5.6309-1.7804c.6318-2.04 1.9141-3.672 3.8468-4.896 1.9699-1.2611 4.4044-1.8917 7.3035-1.8917 3.754 0 6.4858.816 8.1955 2.4481 1.7469 1.632 2.6204 4.0615 2.6204 7.2884v17.0805z"/><path d="m107.476 0v21.8653h4.349l6.467-10.7379h6.578v1.1127l-8.362 11.6281 9.087 12.2958v1.1127h-6.467l-7.248-10.9604h-4.404v10.9604h-6.021v-37.2767z"/><path d="m134.476 37.2767h-6.022v-26.1493h5.464v7.1215l.892.0556c.855-2.8189 1.933-4.8033 3.234-5.9531 1.301-1.1869 2.899-1.7804 4.794-1.7804h.335v6.7321h-.335c-3.122 0-5.296.6491-6.523 1.9473-1.226 1.2611-1.839 3.4309-1.839 6.5095z"/><path d="m158.188 38c-4.163 0-7.397-1.224-9.701-3.672-2.304-2.4852-3.457-5.879-3.457-10.1816s1.171-7.6593 3.513-10.0703c2.379-2.4109 5.594-3.6164 9.645-3.6164s7.248 1.224 9.589 3.6721c2.342 2.4109 3.512 5.7491 3.512 10.0146 0 4.3026-1.152 7.6964-3.456 10.1816-2.305 2.448-5.52 3.672-9.645 3.672zm7.136-13.9092c0-5.9346-2.379-8.9019-7.136-8.9019-4.758 0-7.136 2.9673-7.136 8.9019 0 3.0044.557 5.2855 1.672 6.8433 1.115 1.5208 2.918 2.2811 5.408 2.2811 2.528 0 4.349-.7603 5.464-2.2811 1.152-1.5578 1.728-3.8389 1.728-6.8433z"/><path d="m186.831 38c-4.162 0-7.396-1.224-9.7-3.672-2.305-2.4852-3.457-5.879-3.457-10.1816s1.171-7.6593 3.512-10.0703c2.379-2.4109 5.594-3.6164 9.645-3.6164 4.052 0 7.248 1.224 9.59 3.6721 2.341 2.4109 3.512 5.7491 3.512 10.0146 0 4.3026-1.152 7.6964-3.457 10.1816-2.304 2.448-5.519 3.672-9.645 3.672zm7.137-13.9092c0-5.9346-2.379-8.9019-7.137-8.9019-4.757 0-7.136 2.9673-7.136 8.9019 0 3.0044.558 5.2855 1.673 6.8433 1.115 1.5208 2.917 2.2811 5.408 2.2811 2.527 0 4.348-.7603 5.463-2.2811 1.152-1.5578 1.729-3.8389 1.729-6.8433z"/><path d="m209.033 23.1449v14.1318h-6.021v-26.1493h5.742v6.5651h1.06c.892-2.2254 2.137-3.9873 3.735-5.2855 1.635-1.2982 3.512-1.9473 5.631-1.9473 4.2 0 6.504 2.5037 6.913 7.511h1.171c.818-2.2625 2.026-4.08 3.624-5.4524s3.531-2.0586 5.798-2.0586c2.379 0 4.237.779 5.575 2.3368 1.375 1.5578 2.063 3.7648 2.063 6.6208v17.8594h-5.965v-16.3016c0-3.4124-1.487-5.1186-4.461-5.1186-2.155 0-3.902.6862-5.24 2.0586-1.301 1.3724-1.952 3.1156-1.952 5.2298v14.1318h-6.021v-16.3016c0-3.4124-1.486-5.1186-4.46-5.1186-2.081 0-3.81.7048-5.185 2.1142-1.338 1.3724-2.007 3.0971-2.007 5.1742z"/></g>
  </svg>
);
const IconSearchNav = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#323232" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="m11 19c4.4183 0 8-3.5817 8-8 0-4.41828-3.5817-8-8-8-4.41828 0-8 3.58172-8 8 0 4.4183 3.58172 8 8 8z"/>
      <path d="m21 21-4.35-4.35"/>
    </g>
  </svg>
);
const IconMenuNav = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#323232" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="m3 18h18"/><path d="m3 12h18"/><path d="m3 6h18"/>
    </g>
  </svg>
);
const IconUserNav = () => (
  <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
    <g stroke="#323232" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </g>
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

// ─── Car SVG icon (matches car--16px-semibold from site) ────────────────────────
const IconCar = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <circle cx="4.01685" cy="10.8831" r="1.35" stroke={color} strokeWidth="1.3"/>
    <circle cx="12" cy="10.8831" r="1.35" stroke={color} strokeWidth="1.3"/>
    <path d="M11.5001 6.636C13.9977 6.636 14.5 8.73602 14.5 10.3852H13.5344M11.5001 6.636L10 3.11694H6.50925M11.5001 6.636H6.50924M2.60003 10.3852H1.50005C1.50005 9.56301 1.30944 6.636 3.49592 6.636M5.4386 10.3852H10.5615M3.49592 6.636L3.99839 3.11694H6.50925M3.49592 6.636H6.50924M6.50925 3.11694L6.50924 6.636" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Heart SVG icon (matches heart-empty--16px-semibold from site) ──────────────
const IconHeart = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <path d="M12.8632 3.67828C12.5822 3.38399 12.2486 3.15053 11.8814 2.99126C11.5142 2.83198 11.1206 2.75 10.7231 2.75C10.3256 2.75 9.93206 2.83198 9.56485 2.99126C9.19765 3.15053 8.86402 3.38399 8.58302 3.67828L7.99985 4.28875L7.41669 3.67828C6.84909 3.08411 6.07927 2.75031 5.27657 2.75031C4.47388 2.75031 3.70406 3.08411 3.13646 3.67828C2.56887 4.27244 2.25 5.07831 2.25 5.91859C2.25 6.75887 2.56887 7.56473 3.13646 8.1589L3.71963 8.76937L7.99985 13.25L12.2801 8.76937L12.8632 8.1589C13.1444 7.86475 13.3674 7.5155 13.5195 7.1311C13.6717 6.7467 13.75 6.33468 13.75 5.91859C13.75 5.5025 13.6717 5.09048 13.5195 4.70608C13.3674 4.32168 13.1444 3.97243 12.8632 3.67828V3.67828Z" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
          <div style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT, marginBottom: S.s }}>{secondary}</div>
          <div style={{ ...T.smallcaps, color: COLORS.muted, fontFamily: FONT, marginBottom: S.xs }}>Why this matters</div>
          <div style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT, fontStyle: "italic", lineHeight: 1.5 }}>{why}</div>
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
          {detail && <div style={{ ...T.body1, color: COLORS.muted, marginTop: S.xs, fontWeight: 400 }}>{detail}</div>}
          {subtext && (
            <div onClick={subtextClick} style={{ ...T.body1, color: subtextClick ? COLORS.accent : COLORS.muted, marginTop: S.xs, fontWeight: 400, cursor: subtextClick ? "pointer" : "default" }}>
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
      <span style={{ ...T.body1, display: "inline-block", background: "rgba(50,50,50,0.05)", borderRadius: 20, padding: "10px 16px 8px", color: COLORS.muted, fontFamily: FONT }}>
        {role} · {date}
      </span>
    </div>
  </div>
);

// ─── Alternative job card ──────────────────────────────────────────────────────
const AltJob = ({ job, onClick, betterRated }) => {
  const { title, company, pay, rating, location, altBadge, altReason: reason, findingDiffs } = job;
  const hasDiffs = findingDiffs?.length > 0;
  const hasReason = !!reason;
  const showPayBadge = altBadge && altBadge !== "Better rated";
  const showRatingBadge = betterRated;
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
      {/* Title row with badge(s) top-right */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: S.s, marginBottom: S.xs }}>
        <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{title}</div>
        {(showPayBadge || showRatingBadge) && (
          <div style={{ display: "flex", gap: S.xs, flexShrink: 0, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {showPayBadge && (
              <span style={{ ...T.body2Bold, border: `2px solid ${COLORS.green}`, color: COLORS.greenText, background: COLORS.card, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap", fontFamily: FONT }}>
                {altBadge}
              </span>
            )}
            {showRatingBadge && (
              <span style={{ ...T.body2Bold, border: `2px solid ${COLORS.amberBorder}`, color: COLORS.amberText, background: COLORS.card, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap", fontFamily: FONT }}>
                ↑ Better rated
              </span>
            )}
          </div>
        )}
      </div>
      {/* .vacancy-card-list__rating-container — dial + score + employer name */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: S.xs }}>
        <TinyRatingDial score={rating} />
        <span style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{rating.toFixed(1)}</span>
        <span style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT }}>{company}</span>
      </div>
      {/* Pay + location */}
      <div style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT }}>
        {pay} · {location}
      </div>
      {/* Reason row: all items as uniform chips */}
      {(hasDiffs || hasReason) && (
        <div style={{ marginTop: S.s, display: "flex", flexWrap: "wrap", alignItems: "center", gap: S.xs }}>
          {findingDiffs?.map((diff, i) => (
            <span key={i} style={{ ...T.body2Bold, color: COLORS.text, background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "2px 8px", fontFamily: FONT, whiteSpace: "nowrap" }}>
              {diff}
            </span>
          ))}
          {hasReason && (
            <span style={{ ...T.body2Bold, color: COLORS.text, background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "2px 8px", fontFamily: FONT, whiteSpace: "nowrap" }}>
              {reason.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Licence modal — bottom sheet for declaring driving/forklift licences ──────
const LICENCE_OPTIONS = [
  { id: "flt",  label: "FLT / Forklift licence",    sub: "RTITB or ITSSAR (counterbalance, reach, etc.)" },
  { id: "car",  label: "Full UK driving licence",    sub: "Category B — car and light van" },
  { id: "c1",   label: "C1 licence",                 sub: "Minibus or vehicle up to 7.5 tonnes" },
  { id: "c",    label: "Cat C / HGV licence",        sub: "Large goods vehicle" },
  { id: "ce",   label: "Cat C+E / HGV with trailer", sub: "Articulated lorry" },
];

const LicenceModal = ({ open, onClose, userLicences, onSave }) => {
  const [selected, setSelected] = useState(() => new Set(userLicences));
  useEffect(() => { if (open) setSelected(new Set(userLicences)); }, [open]);
  const toggle = (id) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s", zIndex: 100 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "85vh", background: COLORS.bg, borderRadius: "16px 16px 0 0", padding: `${S.m2}px ${S.m2}px ${S.l}px`, transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform 0.35s ease", zIndex: 101, overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border, margin: `0 auto ${S.m}px` }} />
        <h3 style={{ ...T.lead1, margin: 0, color: COLORS.text, fontFamily: FONT, marginBottom: S.s }}>Do you hold a UK driving or forklift licence?</h3>
        <p style={{ ...T.body1, color: COLORS.muted, margin: `0 0 ${S.m2}px`, fontFamily: FONT }}>We'll use this to show you which jobs you're eligible for — including future listings.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: S.s, marginBottom: S.m2 }}>
          {LICENCE_OPTIONS.map(({ id, label, sub }) => {
            const on = selected.has(id);
            return (
              <button key={id} onClick={() => toggle(id)} style={{ display: "flex", alignItems: "center", gap: S.m, padding: `${S.s2}px ${S.m}px`, borderRadius: 8, border: `1.5px solid ${on ? COLORS.green : COLORS.border}`, background: on ? COLORS.greenBg : COLORS.card, cursor: "pointer", textAlign: "left", fontFamily: FONT, width: "100%" }}>
                <span style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${on ? COLORS.green : COLORS.border}`, background: on ? COLORS.green : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {on && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1 }}>✓</span>}
                </span>
                <div>
                  <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{label}</div>
                  <div style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT }}>{sub}</div>
                </div>
              </button>
            );
          })}
        </div>
        <button onClick={() => { onSave(selected); onClose(); }} style={{ width: "100%", padding: S.m, borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", ...T.body1Bold, cursor: "pointer", fontFamily: FONT }}>
          Save →
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: `${S.s2}px`, background: "none", border: "none", ...T.body1, color: COLORS.muted, cursor: "pointer", marginTop: S.s, fontFamily: FONT }}>
          Not now
        </button>
      </div>
    </>
  );
};

// ─── Onboarding drawer ─────────────────────────────────────────────────────────
const OnboardingDrawer = ({ open, onClose, onSubmit, initialValues = {} }) => {
  const [postcode, setPostcode] = useState(initialValues.postcode || "");
  const [currentPay, setCurrentPay] = useState(initialValues.currentPay || "");
  const [travel, setTravel] = useState(initialValues.travel || "");
  const [priorities, setPriorities] = useState(new Set(initialValues.priorities || []));
  useEffect(() => {
    if (open) {
      setPostcode(initialValues.postcode || "");
      setCurrentPay(initialValues.currentPay || "");
      setTravel(initialValues.travel || "");
      setPriorities(new Set(initialValues.priorities || []));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const togglePriority = (p) => setPriorities((s) => { const n = new Set(s); n.has(p) ? n.delete(p) : n.add(p); return n; });

  const inputStyle = { width: "100%", padding: `${S.s2}px ${S.m}px`, borderRadius: 4, border: `1px solid ${COLORS.border}`, ...T.body1, fontFamily: FONT, marginBottom: S.m, background: COLORS.card, color: COLORS.text, outline: "none", boxSizing: "border-box" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s", zIndex: 100 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "85vh", background: COLORS.bg, borderRadius: "16px 16px 0 0", padding: `${S.m2}px ${S.m2}px ${S.l}px`, transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform 0.35s ease", zIndex: 101, overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border, margin: `0 auto ${S.m}px` }} />
        <h3 style={{ ...T.lead1, margin: 0, color: COLORS.text, fontFamily: FONT, marginBottom: S.s }}>Help us find you better jobs</h3>
        <p style={{ ...T.body1, color: COLORS.muted, margin: `0 0 ${S.m2}px`, fontFamily: FONT }}>Answer a few quick ones and we'll show you jobs that actually fit your life. Takes 30 seconds.</p>

        <label style={{ ...T.body1Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>Your postcode (for commute times)</label>
        <input value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="e.g. TW1 3QS" style={inputStyle} />

        <label style={{ ...T.body1Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>What do you currently earn? (per hour)</label>
        <input value={currentPay} onChange={(e) => setCurrentPay(e.target.value)} placeholder="e.g. £12.00" style={inputStyle} />

        <label style={{ ...T.body1Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>How do you get to work?</label>
        <div style={{ display: "flex", gap: S.s, marginBottom: S.m, flexWrap: "wrap" }}>
          {["🚗 Drive", "🚌 Bus", "🚂 Train", "🚲 Cycle", "🚶 Walk"].map((t) => (
            <button key={t} onClick={() => setTravel(t)}
              style={{ padding: `${S.s}px ${S.m}px`, borderRadius: 100, border: `1px solid ${travel === t ? COLORS.accent : COLORS.border}`, background: travel === t ? COLORS.accentBg : COLORS.card, ...T.body1, cursor: "pointer", fontFamily: FONT, color: travel === t ? COLORS.accent : COLORS.text, fontWeight: travel === t ? 700 : 400 }}>
              {t}
            </button>
          ))}
        </div>

        <label style={{ ...T.body1Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>What matters most to you? (pick up to 3)</label>
        <div style={{ display: "flex", gap: S.xs, flexWrap: "wrap", marginBottom: S.m2 }}>
          {["Better pay", "Short commute", "No heavy lifting", "Daytime only", "Paid breaks", "Sick pay", "Friendly team", "Career progression"].map((p) => (
            <button key={p} onClick={() => { if (priorities.has(p) || priorities.size < 3) togglePriority(p); }}
              style={{ padding: `${S.xs}px ${S.s2}px`, borderRadius: 100, border: `1px solid ${priorities.has(p) ? COLORS.green : COLORS.border}`, background: priorities.has(p) ? COLORS.greenBg : COLORS.card, ...T.body1, cursor: "pointer", fontFamily: FONT, color: priorities.has(p) ? COLORS.green : COLORS.muted, fontWeight: priorities.has(p) ? 700 : 400 }}>
              {p}
            </button>
          ))}
        </div>

        <button onClick={() => onSubmit({ postcode, currentPay, travel, priorities: [...priorities] })}
          style={{ width: "100%", padding: S.m, borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", ...T.body1Bold, cursor: "pointer", fontFamily: FONT }}>
          Show me better matches →
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: `${S.s2}px`, background: "none", border: "none", ...T.body1, color: COLORS.muted, cursor: "pointer", marginTop: S.s, fontFamily: FONT }}>
          Not now, I'll keep browsing
        </button>
      </div>
    </>
  );
};

// ─── Profile hub ───────────────────────────────────────────────────────────────
const ProfileHub = ({ open, onClose, isSignedIn, userEmail, onSignIn, postcode, currentPay, travel, priorities, userLicences, onSavePrefs, onOpenLicenceModal, onOpenDrawer, hasPersonalisation }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [lPostcode, setLPostcode] = useState(postcode);
  const [lPay, setLPay] = useState(currentPay);
  const [lTravel, setLTravel] = useState(travel);
  const [lPriorities, setLPriorities] = useState(new Set(priorities));

  useEffect(() => {
    if (open) {
      setEmail("");
      setEmailError(false);
      setLPostcode(postcode);
      setLPay(currentPay);
      setLTravel(travel);
      setLPriorities(new Set(priorities));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleP = (p) => setLPriorities(s => { const n = new Set(s); n.has(p) ? n.delete(p) : n.add(p); return n; });
  const inputStyle = { width: "100%", padding: `${S.s2}px ${S.m}px`, borderRadius: 4, border: `1px solid ${COLORS.border}`, ...T.body1, fontFamily: FONT, marginBottom: S.m, background: COLORS.card, color: COLORS.text, outline: "none", boxSizing: "border-box" };
  const sectionLabel = { ...T.body1Bold, color: COLORS.text, fontFamily: FONT, display: "block", marginBottom: S.s };
  const licenceLabels = { flt: "FLT / Forklift licence", car: "UK car driving licence (category B)", hgv: "HGV licence (category C)", van: "Van / light goods licence (category B+E)" };

  // Summary row for read-only state
  const SummaryRow = ({ label, value, onClick, isLast }) => !value ? null : (
    <div onClick={onClick} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: `${S.s}px 0`, borderBottom: isLast ? "none" : `1px solid ${COLORS.border}`, cursor: onClick ? "pointer" : "default" }}>
      <span style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: S.s, flexShrink: 0 }}>
        <span style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT, textAlign: "right" }}>{value}</span>
        {onClick && <IconChevronDown color={COLORS.accent} rotated={false} style={{ transform: "rotate(-90deg)" }} />}
      </div>
    </div>
  );

  // State 1: no personalisation, not signed in → sign-up prompt
  const stateNoPersonalisation = !isSignedIn && !hasPersonalisation;
  // State 2: has personalisation, not signed in → read-only summary + save CTA
  const stateHasPersonalisation = !isSignedIn && hasPersonalisation;
  // State 3: signed in → full editable hub

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s", zIndex: 110 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "90vh", background: COLORS.bg, borderRadius: "16px 16px 0 0", padding: `${S.m2}px ${S.m2}px ${S.l}px`, transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform 0.35s ease", zIndex: 111, overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border, margin: `0 auto ${S.m}px` }} />
        <h3 style={{ ...T.lead1, margin: `0 0 ${S.s}px`, color: COLORS.text, fontFamily: FONT }}>
          {stateHasPersonalisation ? "Don't lose your preferences" : "Your Breakroom profile"}
        </h3>

        {/* ── State 1: no personalisation, not signed in ── */}
        {stateNoPersonalisation && (
          <>
            <p style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT, margin: `0 0 ${S.m2}px` }}>
              Create a free account to get personalised job matches, save jobs for later, and see how vacancies compare to your current job.
            </p>
            <button onClick={() => { if (!email) { setEmailError(true); } else { onSignIn(email); } }}
              style={{ width: "100%", padding: S.s2, borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", ...T.body1Bold, cursor: "pointer", fontFamily: FONT, marginBottom: S.m }}>
              Create a free account →
            </button>
            <button style={{ width: "100%", padding: S.s2, borderRadius: 4, border: `1.5px solid ${COLORS.border}`, background: COLORS.card, ...T.body1Bold, cursor: "pointer", fontFamily: FONT, color: COLORS.text }}>
              Sign in
            </button>
          </>
        )}

        {/* ── State 2: has personalisation, not signed in → read-only receipt ── */}
        {stateHasPersonalisation && (
          <>
            <p style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT, margin: `0 0 ${S.m2}px` }}>
              We'll remember what matters to you across every job you look at.
            </p>
            {(() => {
              const formatPay = (v) => { if (!v) return null; const n = parseFloat(String(v).replace(/[^0-9.]/g, "")); return isNaN(n) ? v : `£${n.toFixed(2)}/hr`; };
              const hasLicences = userLicences.size > 0;
              const hasPriorities = priorities.length > 0;
              const lastField = hasLicences ? "licences" : hasPriorities ? "priorities" : travel ? "travel" : currentPay ? "pay" : "postcode";
              return (
                <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: `0 ${S.m}px`, marginBottom: S.m2 }}>
                  <SummaryRow label="Postcode" value={postcode || null} onClick={() => { onClose(); onOpenDrawer(); }} isLast={lastField === "postcode"} />
                  <SummaryRow label="Current pay" value={formatPay(currentPay)} onClick={() => { onClose(); onOpenDrawer(); }} isLast={lastField === "pay"} />
                  <SummaryRow label="Travel" value={travel || null} onClick={() => { onClose(); onOpenDrawer(); }} isLast={lastField === "travel"} />
                  <SummaryRow label="Priorities" value={hasPriorities ? priorities.join(", ") : null} onClick={() => { onClose(); onOpenDrawer(); }} isLast={lastField === "priorities"} />
                  {hasLicences && (
                    <SummaryRow label="Licences" value={[...userLicences].map(l => licenceLabels[l] || l).join(", ")} onClick={() => { onClose(); onOpenLicenceModal(); }} isLast />
                  )}
                </div>
              );
            })()}
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError(false); }}
              style={{ width: "100%", padding: S.s2, borderRadius: 4, border: `1px solid ${emailError ? "#e53e3e" : COLORS.border}`, ...T.body1, fontFamily: FONT, marginBottom: emailError ? S.s : S.s2, boxSizing: "border-box", outline: "none" }}
            />
            {emailError && (
              <p style={{ ...T.body1, color: "#e53e3e", fontFamily: FONT, margin: `0 0 ${S.s2}px` }}>
                Please enter your email address.
              </p>
            )}
            <button onClick={() => { if (!email) { setEmailError(true); } else { onSignIn(email); } }}
              style={{ width: "100%", padding: S.s2, borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", ...T.body1Bold, cursor: "pointer", fontFamily: FONT }}>
              Create Breakroom account
            </button>
          </>
        )}

        {/* ── State 3: signed in → full editable hub ── */}
        {isSignedIn && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: S.s, ...T.body1, color: COLORS.green, fontFamily: FONT, marginBottom: S.m2, background: COLORS.greenBg, border: `1px solid ${COLORS.green}22`, borderRadius: 6, padding: `${S.s}px ${S.m}px` }}>
              ✓ Signed in as <strong>{userEmail}</strong>
            </div>

            {/* Preferences */}
            <div style={{ marginBottom: S.m2 }}>
              <div style={{ ...T.lead2, color: COLORS.text, fontFamily: FONT, marginBottom: S.m }}>Job preferences</div>
              <label style={sectionLabel}>Your postcode (for commute times)</label>
              <input value={lPostcode} onChange={e => setLPostcode(e.target.value)} placeholder="e.g. TW1 3QS" style={inputStyle} />
              <label style={sectionLabel}>What do you currently earn? (per hour)</label>
              <input value={lPay} onChange={e => setLPay(e.target.value)} placeholder="e.g. £12.00" style={inputStyle} />
              <label style={sectionLabel}>How do you get to work?</label>
              <div style={{ display: "flex", gap: S.s, marginBottom: S.m, flexWrap: "wrap" }}>
                {["🚗 Drive", "🚌 Bus", "🚂 Train", "🚲 Cycle", "🚶 Walk"].map(t => (
                  <button key={t} onClick={() => setLTravel(t)}
                    style={{ padding: `${S.s}px ${S.m}px`, borderRadius: 100, border: `1px solid ${lTravel === t ? COLORS.accent : COLORS.border}`, background: lTravel === t ? COLORS.accentBg : COLORS.card, ...T.body1, cursor: "pointer", fontFamily: FONT, color: lTravel === t ? COLORS.accent : COLORS.text, fontWeight: lTravel === t ? 700 : 400 }}>
                    {t}
                  </button>
                ))}
              </div>
              <label style={sectionLabel}>What matters most to you? (pick up to 3)</label>
              <div style={{ display: "flex", gap: S.xs, flexWrap: "wrap", marginBottom: S.m2 }}>
                {["Better pay", "Short commute", "No heavy lifting", "Daytime only", "Paid breaks", "Sick pay", "Friendly team", "Career progression"].map(p => (
                  <button key={p} onClick={() => { if (lPriorities.has(p) || lPriorities.size < 3) toggleP(p); }}
                    style={{ padding: `${S.xs}px ${S.s2}px`, borderRadius: 100, border: `1px solid ${lPriorities.has(p) ? COLORS.green : COLORS.border}`, background: lPriorities.has(p) ? COLORS.greenBg : COLORS.card, ...T.body1, cursor: "pointer", fontFamily: FONT, color: lPriorities.has(p) ? COLORS.green : COLORS.muted, fontWeight: lPriorities.has(p) ? 700 : 400 }}>
                    {p}
                  </button>
                ))}
              </div>
              <button onClick={() => onSavePrefs({ postcode: lPostcode, currentPay: lPay, travel: lTravel, priorities: [...lPriorities] })}
                style={{ width: "100%", padding: S.s2, borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", ...T.body1Bold, cursor: "pointer", fontFamily: FONT }}>
                Save preferences →
              </button>
            </div>

            {/* Licences */}
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: S.m2 }}>
              <div style={{ ...T.lead2, color: COLORS.text, fontFamily: FONT, marginBottom: S.s }}>Your licences</div>
              {userLicences.size === 0 ? (
                <div style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT, marginBottom: S.m }}>No licences added yet.</div>
              ) : (
                <div style={{ marginBottom: S.m }}>
                  {[...userLicences].map(l => (
                    <div key={l} style={{ ...T.body1, color: COLORS.text, fontFamily: FONT, display: "flex", alignItems: "center", gap: S.s, marginBottom: S.xs }}>
                      <span style={{ color: COLORS.green }}>✓</span> {licenceLabels[l] || l}
                    </div>
                  ))}
                </div>
              )}
              <button onClick={onOpenLicenceModal}
                style={{ background: "none", border: "none", padding: 0, ...T.body1Bold, color: COLORS.accent, cursor: "pointer", fontFamily: FONT, textDecoration: "underline" }}>
                {userLicences.size > 0 ? "Edit licences" : "+ Add a licence"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

// ─── Shared sub-components ─────────────────────────────────────────────────────

const AlternativesList = ({ currentJobIdx, personalised, isSignedIn, onOpenDrawer, onOpenProfile, onJobSelect }) => {
  const currentJob = JOBS.find((j) => j.id === currentJobIdx);
  const altJobs = JOBS.filter((j) => j.id !== currentJobIdx).sort((a, b) => b.rating - a.rating);
  const sep = <span style={{ color: COLORS.border, margin: `0 ${S.xs}px` }}>·</span>;
  return (
    <div>
      <h2 style={{ ...T.lead1, margin: `0 0 ${S.s}px`, fontFamily: FONT, color: COLORS.text }}>Similar jobs nearby</h2>
      {personalised && (
        <p style={{ ...T.body1, color: COLORS.muted, margin: `0 0 ${S.m}px`, fontFamily: FONT }}>
          ✓ Personalised for you
          {sep}
          <span onClick={onOpenDrawer} style={{ textDecoration: "underline", cursor: "pointer", color: COLORS.accent }}>Edit</span>
          {!isSignedIn && <>{sep}<span onClick={onOpenProfile} style={{ textDecoration: "underline", cursor: "pointer", color: COLORS.accent }}>Save your preferences</span></>}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: S.s2 }}>
        {!personalised && (
          <button onClick={onOpenDrawer} style={{
            background: COLORS.card, borderRadius: 5, boxShadow: "0px 4px 4px rgba(0,0,0,0.05)",
            padding: S.m, cursor: "pointer", border: "none", fontFamily: FONT, textAlign: "left", width: "100%",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT, marginBottom: S.xs }}>What matters most to you?</div>
              <div style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT }}>Set your priorities to see better-matched jobs</div>
            </div>
            <span style={{ ...T.body1Bold, color: COLORS.accent, fontFamily: FONT, flexShrink: 0, paddingLeft: S.m }}>→</span>
          </button>
        )}
        {altJobs.map((j) => (
          <AltJob key={j.id} job={j} onClick={() => onJobSelect(j.id)} betterRated={j.rating > currentJob.rating} />
        ))}
      </div>
    </div>
  );
};

// ─── Desktop sidebar ───────────────────────────────────────────────────────────

const DesktopSidebar = ({ currentJobIdx, personalised, isSignedIn, onOpenDrawer, onJobSelect, onOpenProfile }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: S.l2, paddingTop: S.m2 }}>
    {/* CTA card — sticky below header (70px) + S.m gap */}
    <div style={{ position: "sticky", top: 70 + S.m, zIndex: 10 }}>
      <div style={{ position: "absolute", top: -32, left: 0, right: 0, height: 32, background: `linear-gradient(to bottom, transparent, ${COLORS.bg})`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -32, left: 0, right: 0, height: 32, background: `linear-gradient(to top, transparent, ${COLORS.bg})`, pointerEvents: "none" }} />
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 5, padding: `${S.m}px ${S.m2}px` }}>
      <div style={{ padding: `${S.s2}px ${S.s2}px`, background: COLORS.amberBg, border: `1px solid ${COLORS.amberBorder}`, borderRadius: 4, ...T.body1, color: COLORS.amberText, marginBottom: S.m, fontFamily: FONT }}>
        ⚠ <strong>Rated below average by workers.</strong> Pay and working conditions have mixed reviews — read the full picture before applying.
      </div>
      <button style={{ width: "100%", padding: "6px 22px", borderRadius: 4, border: "2px solid transparent", background: COLORS.accent, color: "#fff", fontSize: 16, fontWeight: 700, lineHeight: "24px", cursor: "pointer", fontFamily: FONT, marginBottom: S.s, transition: "background-color 0.25s ease" }}>
        Apply on external site
      </button>
      <div style={{ display: "flex", gap: S.s }}>
        <button style={{ flex: 1, padding: "6px 22px", borderRadius: 4, border: `2px solid ${COLORS.text}`, background: "transparent", fontSize: 16, fontWeight: 700, lineHeight: "24px", cursor: "pointer", fontFamily: FONT, color: COLORS.text }}>
          Save for later
        </button>
        <button onClick={onOpenDrawer} style={{ flex: 1, padding: "6px 22px", borderRadius: 4, border: `2px solid ${COLORS.accent}`, background: COLORS.accentBg, fontSize: 16, fontWeight: 700, lineHeight: "24px", cursor: "pointer", fontFamily: FONT, color: COLORS.accent }}>
          Match me
        </button>
      </div>
    </div>
    </div>

    {/* Alternatives — not sticky, scrolls with page */}
    <AlternativesList currentJobIdx={currentJobIdx} personalised={personalised} isSignedIn={isSignedIn} onOpenDrawer={onOpenDrawer} onOpenProfile={onOpenProfile} onJobSelect={onJobSelect} />
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
  const [profileOpen, setProfileOpen] = useState(false);
  const [allFindingsModalOpen, setAllFindingsModalOpen] = useState(false);
  const [personalised, setPersonalised] = useState(false);
  const [selectedJobIdx, setSelectedJobIdx] = useState(0);
  const [findingsForceOpen, setFindingsForceOpen] = useState(false);
  const [highlightFinding, setHighlightFinding] = useState(null);
  const [licenceModalOpen, setLicenceModalOpen] = useState(false);
  const [userLicences, setUserLicences] = useState(new Set());
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [profilePostcode, setProfilePostcode] = useState("");
  const [profileCurrentPay, setProfileCurrentPay] = useState("");
  const [profileTravel, setProfileTravel] = useState("");
  const [profilePriorities, setProfilePriorities] = useState([]);

  const hasPersonalisation = personalised || userLicences.size > 0;

  const handleSavePrefs = ({ postcode, currentPay, travel, priorities }) => {
    setProfilePostcode(postcode);
    setProfileCurrentPay(currentPay);
    setProfileTravel(travel);
    setProfilePriorities(priorities);
    if (postcode || currentPay || travel || priorities.length > 0) setPersonalised(true);
  };

  const handleSignIn = (email) => {
    setIsSignedIn(true);
    setUserEmail(email);
  };
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
      <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT, marginBottom: S.xs }}>
        {job.company}
      </div>

      <h1 style={{ ...(isDesktop ? T.heading2Lg : T.heading2), margin: `0 0 ${S.s2}px`, fontFamily: FONT, color: COLORS.text }}>{job.title}</h1>

      {/* .vacancy-card__divider + .vacancy__details */}
      <div style={{ borderTop: "1px solid rgba(50,50,50,0.1)", borderBottom: "1px solid rgba(50,50,50,0.1)", marginTop: S.m, marginBottom: S.m, paddingTop: S.m, paddingBottom: S.s, maxWidth: 500 }}>
        {[
          { icon: <IconPay />, text: job.pay, benchmark: job.payBenchmark },
          { icon: <IconLocation />, text: job.location },
          { icon: <IconCar color={COLORS.accent} />, text: profilePostcode ? `Check commute from ${profilePostcode} →` : "Check your commute →", onClick: () => setDrawerOpen(true) },
          { icon: <IconClock />, text: `${job.hours}${job.hoursSub ? ` (${job.hoursSub})` : ""}` },
          { icon: <IconClock />, text: job.shifts },
        ].map((f, i) => (
          <div key={i} onClick={f.onClick} style={{ display: "flex", alignItems: "flex-start", marginBottom: S.s, cursor: f.onClick ? "pointer" : "default" }}>
            <span style={{ marginRight: S.s, marginTop: S.xs, flexShrink: 0, display: "flex" }}>{f.icon}</span>
            <div>
              <span style={{ ...T.body1, color: f.onClick ? COLORS.accent : COLORS.text, fontFamily: FONT, lineHeight: 1.5 }}>{f.text}</span>
              {f.benchmark && (() => {
                const { verdict, label, range } = f.benchmark;
                const color = verdict === "below" ? COLORS.red : verdict === "good" ? COLORS.green : COLORS.amberText;
                const arrow = verdict === "below" ? "↓" : verdict === "good" ? "↑" : "→";
                return <div style={{ ...T.body1, color, fontFamily: FONT, marginTop: 2 }}>{arrow} {label} · {range}</div>;
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* Breakroom Rating — matches rating--tiny pattern from employer pages */}
      <div style={{ marginBottom: S.s2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: S.s, marginBottom: S.xs }}>
          <span style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>Breakroom Rating</span>
          <AnimatedRatingDial score={rating} />
          <span style={{ fontFamily: FONT }}>
            <span style={{ ...T.body1Bold, color: COLORS.text }}>{rating.toFixed(1)}</span>
            <span style={{ ...T.body1, color: COLORS.muted }}> out of 10</span>
          </span>
        </div>
        <div style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT }}>
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
          {job.id === 5 ? (
            <>
              <Signal
                status={userLicences.has("flt") ? "good" : "bad"}
                label={userLicences.has("flt") ? "Forklift licence: you have the required licence" : "Forklift licence required (RTITB or ITSSAR)"}
                detail="A valid counterbalance forklift licence is required. Reach truck licence is desirable."
                subtext={userLicences.has("flt") ? "✓ You told us you have an FLT licence" : "Tell us if you have a forklift licence →"}
                subtextClick={userLicences.has("flt") ? null : () => setLicenceModalOpen(true)}
              />
              <Signal status="warning" label="Pay: below the London Living Wage"
                detail="At £13/hr this is below the London Living Wage of £14.80/hr."
                subtext="Based on ONS earnings data and Breakroom member reports" />
              <Signal status="warning" label="Minimum 1 year FLT experience required"
                detail="The listing asks for at least 1 year operating a counterbalance forklift."
                isLast={true} />
            </>
          ) : (
            <>
              <Signal status="warning" label="Pay is below the London Living Wage and most people don't get sick pay"
                detail="At £12.58/hr this is below the London Living Wage of £14.80/hr. 86% of workers say they wouldn't get paid if they were sick but scheduled to work."
                subtext={`Based on ${job.quizCount} Breakroom Quiz responses`} />
              <Signal status="warning" label="Requirements: 5-year background check + DBS"
                detail="You'll need 5 years of address history and references. CAA security clearance required (they pay for it). Must have valid photo ID."
                subtext="Heavy lifting up to 30kg required" />
              <Signal status="good" label="No prior warehouse experience mentioned"
                detail="The listing doesn't require previous warehouse experience — just that you're reliable and comfortable with physical work."
                isLast={true} />
            </>
          )}
        </div>
      </div>

      <Section title="What's it really like here?" badgeEl={<span style={{ display: "inline-flex", alignItems: "center", gap: S.xs }}><TinyRatingDial score={rating} /><span style={{ fontFamily: FONT }}><span style={{ ...T.body1Bold, color: COLORS.text }}>{rating.toFixed(1)}</span><span style={{ ...T.body1, color: COLORS.muted }}> out of 10</span></span></span>} forceOpen={findingsForceOpen} sectionRef={findingsSectionRef}>
        {/* Red flags group — .finding-group */}
        <div style={{ background: COLORS.card, borderRadius: 5, padding: `${S.s}px ${S.m}px 0`, marginBottom: S.m }}>
        <div style={{ ...T.smallcaps, color: COLORS.text, display: "inline-block", textTransform: "uppercase", fontFamily: FONT }}>Needs improving</div>
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
        <div style={{ ...T.smallcaps, color: COLORS.text, display: "inline-block", textTransform: "uppercase", marginTop: S.m, fontFamily: FONT }}>Good</div>
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

        <div onClick={() => setAllFindingsModalOpen(true)} style={{ ...T.body1Bold, color: COLORS.accent, cursor: "pointer", textAlign: "left", padding: `${S.xs}px 0`, fontFamily: FONT, marginTop: S.xs }}>
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
        <div style={{ ...T.body1Bold, color: COLORS.accent, cursor: "pointer", textAlign: "left", padding: `${S.xs}px 0`, fontFamily: FONT, marginTop: S.s }}>See all {job.quizCount} reviews →</div>
      </Section>

      <Section title={`Job description from ${job.company}`}>
        <div style={{ background: COLORS.card, borderRadius: 5, padding: `${S.m}px ${S.m}px ${S.xs}px` }}>
          <div style={{ ...T.body1, color: COLORS.muted, lineHeight: 1.7, fontFamily: FONT }}>
            {job.jd.map(({ label, text }, i) => (
              <p key={i} style={{ margin: `0 0 ${S.m}px` }}>
                <strong style={{ color: COLORS.text }}>{label}:</strong> {text}
              </p>
            ))}
          </div>
        </div>
      </Section>
    </>
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: FONT, color: COLORS.text }}>
      {/* .header — matches header.scss */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: COLORS.card, borderBottom: `1px solid ${COLORS.border}`, height: 70 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", maxWidth: 1032, margin: "0 auto", padding: `0 ${S.m}px` }}>
          {/* .header__identity */}
          <a href="#" onClick={e => { e.preventDefault(); handleJobSelect(0); }} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <IconBreakroomLogo />
          </a>
          {/* .header__buttons */}
          <div style={{ display: "flex", alignItems: "center", height: "100%", gap: 4 }}>
            {/* .header__btn .header__search */}
            <button style={{ height: "100%", minWidth: 48, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 5, padding: "14px 8px 0" }}>
              <IconSearchNav />
              <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, fontFamily: FONT, lineHeight: 1 }}>Search</span>
            </button>
            {/* .header__btn .header__profile */}
            <button onClick={() => setProfileOpen(true)} style={{ height: "100%", minWidth: 48, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 5, padding: "14px 8px 0", position: "relative" }}>
              <IconUserNav />
              {hasPersonalisation && !isSignedIn && (
                <span style={{ position: "absolute", top: 12, right: 6, width: 8, height: 8, borderRadius: "50%", background: COLORS.accent, border: `2px solid ${COLORS.card}` }} />
              )}
              <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, fontFamily: FONT, lineHeight: 1 }}>Profile</span>
            </button>
            {/* .header__btn .header__menu */}
            <button style={{ height: "100%", minWidth: 48, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 5, padding: "14px 8px 0" }}>
              <IconMenuNav />
              <span style={{ fontSize: 12, fontWeight: 700, color: COLORS.text, fontFamily: FONT, lineHeight: 1 }}>Menu</span>
            </button>
          </div>
        </div>
      </div>

      {isDesktop ? (
        <div style={{ maxWidth: 1032, margin: "0 auto", padding: `0 ${S.m}px ${S.xl}px`, display: "grid", gridTemplateColumns: "1fr 380px", gap: S.xl, alignItems: "start" }}>
          <div>
            {heroBlock}
            {sectionsBlock}
          </div>
          <DesktopSidebar currentJobIdx={selectedJobIdx} personalised={personalised} isSignedIn={isSignedIn} onOpenDrawer={() => setDrawerOpen(true)} onJobSelect={handleJobSelect} onOpenProfile={() => setProfileOpen(true)} />
        </div>
      ) : (
        <div style={{ padding: `0 ${S.m}px ${S.xxl}px` }}>
          {heroBlock}
          {sectionsBlock}
          <div style={{ marginTop: S.m2, marginBottom: S.s }}>
            <AlternativesList currentJobIdx={selectedJobIdx} personalised={personalised} isSignedIn={isSignedIn} onOpenDrawer={() => setDrawerOpen(true)} onOpenProfile={() => setProfileOpen(true)} onJobSelect={handleJobSelect} />
          </div>
        </div>
      )}

      {/* Mobile sticky bottom bar */}
      {!isDesktop && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, background: "rgba(250,248,244,0.95)", backdropFilter: "blur(12px)", borderTop: `1px solid ${COLORS.border}`, padding: `${S.s2}px ${S.m}px` }}>
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", gap: S.s2 }}>
            <button style={{ flex: 1, padding: "6px 22px", borderRadius: 4, border: "2px solid transparent", background: COLORS.accent, color: "#fff", fontSize: 16, fontWeight: 700, lineHeight: "24px", cursor: "pointer", fontFamily: FONT }}>
              Apply
            </button>
            <button style={{ padding: "6px 22px", borderRadius: 4, border: `2px solid ${COLORS.text}`, background: "transparent", fontSize: 16, fontWeight: 700, lineHeight: "24px", cursor: "pointer", fontFamily: FONT, color: COLORS.text }}>
              Save
            </button>
            <button onClick={() => setDrawerOpen(true)} style={{ padding: "6px 22px", borderRadius: 4, border: `2px solid ${COLORS.accent}`, background: COLORS.accentBg, fontSize: 16, fontWeight: 700, lineHeight: "24px", cursor: "pointer", fontFamily: FONT, color: COLORS.accent }}>
              Match me
            </button>
          </div>
        </div>
      )}

      <OnboardingDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        initialValues={{ postcode: profilePostcode, currentPay: profileCurrentPay, travel: profileTravel, priorities: profilePriorities }}
        onSubmit={(data) => { handleSavePrefs(data); setDrawerOpen(false); }} />

      <LicenceModal open={licenceModalOpen} onClose={() => setLicenceModalOpen(false)}
        userLicences={userLicences} onSave={(s) => setUserLicences(s)} />

      <ProfileHub
        open={profileOpen} onClose={() => setProfileOpen(false)}
        isSignedIn={isSignedIn} userEmail={userEmail} onSignIn={handleSignIn}
        postcode={profilePostcode} currentPay={profileCurrentPay} travel={profileTravel} priorities={profilePriorities}
        userLicences={userLicences} onSavePrefs={(data) => { handleSavePrefs(data); }} onOpenLicenceModal={() => { setProfileOpen(false); setLicenceModalOpen(true); }}
        hasPersonalisation={hasPersonalisation} onOpenDrawer={() => { setProfileOpen(false); setDrawerOpen(true); }}
      />

      {/* All findings modal */}
      {allFindingsModalOpen && (
        <>
          <div onClick={() => setAllFindingsModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }} />
          <div style={{ position: "fixed", inset: 0, zIndex: 101, overflow: "auto", padding: `${S.l}px ${S.m}px` }}>
            <div style={{ background: COLORS.bg, borderRadius: 5, maxWidth: 640, margin: "0 auto", padding: S.l, position: "relative" }}>
              <button onClick={() => setAllFindingsModalOpen(false)}
                style={{ position: "absolute", top: S.m, right: S.m, background: "none", border: "none", cursor: "pointer", ...T.body1Bold, color: COLORS.muted, fontFamily: FONT }}>
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

    </div>
  );
}
