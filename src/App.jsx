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
  smallcaps: { fontSize: 14, lineHeight: "20px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" },
};

// ─── Utility ────────────────────────────────────────────────────────────────
const toHourly = (pay, type) => (type === "annual" ? pay / 2080 : pay);

const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

// Transport mode icons — inline SVGs from priv/static/src/images/
const IconPublicTransport = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <circle cx="4" cy="11.9971" r="1.35" stroke={color} strokeWidth="1.3"/>
    <circle cx="12" cy="11.9971" r="1.35" stroke={color} strokeWidth="1.3"/>
    <path d="M2.61879 11.5H1.75V6.63886M5.53707 11.5H10.4629M13.3215 11.5H14.25V6.63886M1.75 6.63886V2.75002L5.75 2.75M1.75 6.63886L5.75 6.63884M14.25 6.63886V2.75002H10.2479M14.25 6.63886H10.2479M5.75 2.75V6.63884M5.75 2.75L10.2479 2.75002M5.75 6.63884L10.2479 6.63886M10.2479 2.75002V6.63886" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconCar = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <circle cx="4.01685" cy="10.8831" r="1.35" stroke={color} strokeWidth="1.3"/>
    <circle cx="12" cy="10.8831" r="1.35" stroke={color} strokeWidth="1.3"/>
    <path d="M11.5001 6.636C13.9977 6.636 14.5 8.73602 14.5 10.3852H13.5344M11.5001 6.636L10 3.11694H6.50925M11.5001 6.636H6.50924M2.60003 10.3852H1.50005C1.50005 9.56301 1.30944 6.636 3.49592 6.636M5.4386 10.3852H10.5615M3.49592 6.636L3.99839 3.11694H6.50925M3.49592 6.636H6.50924M6.50925 3.11694L6.50924 6.636" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconBicycle = ({ color = COLORS.text }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", flexShrink: 0 }}>
    <circle cx="3.46118" cy="10.4612" r="1.86118" stroke={color} strokeWidth="1.2"/>
    <circle cx="12.5388" cy="10.4612" r="1.86118" stroke={color} strokeWidth="1.2"/>
    <circle cx="7.16956" cy="9.90857" r="0.768921" stroke={color} strokeWidth="0.5"/>
    <path d="M4.31506 8.19701L5.77454 5.96208M5.77454 5.96208H10.8869M5.77454 5.96208L6.83875 8.89794M5.77454 5.96208L5.2266 4.54783M10.8869 5.96208C10.7902 5.68781 10.6258 5.07505 10.7418 4.81818C10.8869 4.49709 11.5942 3.91515 10.8869 3.71447C10.3211 3.55392 9.70812 3.46024 9.47237 3.43347M10.8869 5.96208L11.1476 6.9249M11.5701 8.19701L11.1476 6.9249M5.2266 4.54783H5.70888M5.2266 4.54783H4.80714M11.1476 6.9249L8.00273 9.31568" stroke={color} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Work style preference questions — paged quiz in the work style drawer
const WORK_STYLE_QUESTIONS = [
  { id: "activity", question: "How active do you want to be at work?", options: [["sitting", "Mostly sitting down"], ["feet", "On my feet"], ["active", "Very physically active"]] },
  { id: "teamwork", question: "Do you prefer working in a team or on your own?", options: [["team", "In a team"], ["solo", "On my own"], ["either", "Either is fine"]] },
  { id: "public",   question: "Are you happy working with customers or the public?", options: [["yes", "Yes, I enjoy it"], ["no", "Prefer not to"], ["either", "Don't mind"]] },
  { id: "outdoors", question: "Do you prefer working indoors or outdoors?", options: [["indoors", "Indoors"], ["outdoors", "Outdoors"], ["either", "Either is fine"]] },
  { id: "children", question: "Are you comfortable working with children or young people?", options: [["yes", "Yes"], ["no", "Prefer not to"], ["na", "Not applicable"]] },
];

const PRIORITIES = ["No heavy lifting", "Daytime only", "Paid breaks", "Sick pay", "Friendly team", "Career progression", "Good shift notice"];

// Three transport modes — matches Breakroom onboarding options
const TRANSPORT_MODES = [
  { id: "walk-transit", label: "Walk or public transport", Icon: IconPublicTransport, speedKph: 20 },
  { id: "car",          label: "Car or motorbike",         Icon: IconCar,             speedKph: 48 },
  { id: "bike",         label: "Bike",                     Icon: IconBicycle,         speedKph: 16 },
];
const commuteMin = (km, modeId) => {
  const speed = TRANSPORT_MODES.find(m => m.id === modeId)?.speedKph ?? 30;
  return Math.round(km / speed * 60);
};
const formatCommute = (mins) => {
  if (mins < 60) return `~${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `~${h} hr` : `~${h} hr ${m} min`;
};
const modeLabelShort = (modeId) => ({ "walk-transit": "Transit", "car": "Car", "bike": "Bike" }[modeId] ?? modeId);

// Groups bad+good findings into Pay / Hours / Workplace sections for the modal
const PAY_LABELS = new Set(["No sick pay","Some sick pay","No paid breaks","No unpaid overtime","Living wage","Above average pay","Below average pay","Only some sick pay","Some sick pay available","Some unpaid breaks","Unpaid breaks for some","Proper breaks not guaranteed","Proper breaks","Pay is around average"]);
const HOURS_LABELS = new Set(["Short shift notice","Hours security","No choice of shifts","No last-minute shift changes","Easy holiday booking","Holiday booking can be tricky","Shift changes can happen","Shift notice varies","Easy to book holiday","Easy to take sick leave","Sick leave isn't always easy","Some choice of shifts","Hours can exceed contract","Hours can match contract","Hours match contract"]);
const buildAllFindings = (bad, okay, good) => {
  const all = [
    ...bad.map(f => ({ ...f, opinion: "bad" })),
    ...(okay ?? []).map(f => ({ ...f, opinion: "okay" })),
    ...good.map(f => ({ ...f, opinion: "good" })),
  ];
  const pay = all.filter(f => PAY_LABELS.has(f.label));
  const hours = all.filter(f => HOURS_LABELS.has(f.label));
  const workplace = all.filter(f => !PAY_LABELS.has(f.label) && !HOURS_LABELS.has(f.label));
  return [
    { section: "Pay", findings: pay },
    { section: "Hours and flexibility", findings: hours },
    { section: "Workplace", findings: workplace },
  ].filter(s => s.findings.length > 0);
};

// Jobs data — the current listing plus nine alternatives
const JOBS = [
  // ── 0: Main job — GXO Logistics ─────────────────────────────────────────────
  {
    id: 0,
    isCustomer: true,
    title: "Warehouse Operative",
    occupationDesc: "Warehouse operatives take delivery of goods, and pick, pack and dispatch products.",
    company: "GXO Logistics",
    companyUrl: "https://www.breakroom.cc/companies/gxo-logistics",
    companyType: "Employer",
    pay: "£25,958/yr",
    payType: "annual",
    payAlt: "≈ £12.48/hr",
    location: "Corby, NN18",
    coords: [52.490, -0.684],
    hours: "Full time",
    hoursSub: null,
    shifts: "Rotating day shifts",
    rating: 6.7,
    quizCount: 918,
    highlights: ["No last-minute shift changes", "Hours security"],
    listingUrl: "https://www.breakroom.cc/en-gb/jobs/listing/89531552-gxo-logistics-warehouse-operative-corby-northamptonshire",
    altBadge: null,
    altReason: null,
    payBenchmark: { rangeLow: 27000, rangeHigh: 32000, roleLabel: "warehouse operatives in Northamptonshire" },
    matchCriteria: {
      licences: [],
      qualifications: [],
      experience: { preferred: true, required: false, keywords: ["warehouse", "logistics", "picking", "packing", "distribution", "stock", "forklift"] },
      note: "Warehouse or logistics experience is preferred but not essential — GXO train you on the job.",
    },
    findingDiffs: [],
    requiresFltLicence: false,
    workStyle: { activity: "active", teamwork: "team", public: false, outdoors: false, children: false },
    findings: {
      bad: [
        { pct: 71, label: "No sick pay", subtext: "Based on 918 Breakroom Quiz responses", heading: "Most people don't get sick pay", primary: "Most people don't get sick pay.", secondary: "71% of people say they wouldn't get paid if they were sick but scheduled to work.", why: "Everyone gets sick sometimes. You should be able to take time off without worrying. At a good job you should still get paid if you're scheduled to work but can't due to sickness." },
        { pct: 68, label: "No choice of shifts", subtext: "Based on 918 Breakroom Quiz responses", heading: "Most people don't get any choice of shifts", primary: "Most people don't get any choice of shifts.", secondary: "68% report that their manager doesn't give them enough choice over which shifts they work.", why: "A good job is flexible around your personal life. This means you get a say in when you prefer to work." },
        { pct: 80, label: "Disconnected management", subtext: "Based on 918 Breakroom Quiz responses", heading: "Head office doesn't understand what's happening", primary: "Most people think head office doesn't understand what's happening.", secondary: "80% of people think that this employer's head office or owners don't have a good understanding of what's really happening where they work.", why: "At a good job, the role of head office should be to support the people on the frontline serving customers. To do that properly, the company's owners or head office need to have a good understanding of what's really happening on the frontline." },
      ],
      okay: [
        { pct: 34, label: "Holiday booking can be tricky", subtext: "Based on 918 Breakroom Quiz responses", heading: "Some people find it hard to book holiday", primary: "Some people find it hard to book holiday.", secondary: "Around a third of people say they find it hard to book time off.", why: "A good job should let you take time off when you need it without jumping through hoops." },
        { pct: 40, label: "Shift changes can happen", subtext: "Based on 918 Breakroom Quiz responses", heading: "Shifts can get changed at short notice", primary: "Shifts can get changed at short notice.", secondary: "Some people say their shifts are occasionally changed at the last minute.", why: "Predictable shifts make it easier to plan your life. Short-notice changes are disruptive." },
        { pct: 35, label: "Sick leave isn't always easy", subtext: "Based on 918 Breakroom Quiz responses", heading: "Some people find it hard to take sick leave", primary: "Some people find it hard to take sick leave.", secondary: "Around a third of people say taking sick leave isn't straightforward.", why: "Being able to take sick leave when you need it is important for your health and wellbeing." },
        { pct: 52, label: "Job satisfaction is mixed", subtext: "Based on 918 Breakroom Quiz responses", heading: "Only some people enjoy their job", primary: "Only some people enjoy their job.", secondary: "Just over half of people say they enjoy working here.", why: "Enjoying your work matters. It affects your health, motivation, and how long you stay in a job." },
        { pct: 34, label: "Training could be better", subtext: "Based on 918 Breakroom Quiz responses", heading: "Some people didn't get enough training when they started", primary: "Some people didn't get enough training when they started.", secondary: "Around a third of people felt they didn't get enough training when they joined.", why: "Good training from day one helps you do your job well and feel confident at work." },
        { pct: 34, label: "Some stress at work", subtext: "Based on 918 Breakroom Quiz responses", heading: "Some people feel stressed here", primary: "Some people feel stressed here.", secondary: "Around a third of people say they often feel stressed at work.", why: "Work isn't always easy, but if you're frequently stressed, that's not good. Your employer should support you." },
        { pct: 47, label: "Mixed support for carers", subtext: "Based on 918 Breakroom Quiz responses", heading: "Only some parents and carers say this is a good place to work", primary: "Only some parents and carers say this is a good place to work.", secondary: "Less than two thirds of parents and carers say GXO is a good place to work.", why: "If you have caring responsibilities, flexibility and understanding from your employer is essential." },
        { pct: 48, label: "Some unpaid breaks", subtext: "Based on 918 Breakroom Quiz responses", heading: "Only some people get paid breaks", primary: "Only some people get paid breaks.", secondary: "Just over half of people here get paid breaks.", why: "You should be paid for all the time you spend at work, including breaks." },
        { pct: 38, label: "Support to progress is limited", subtext: "Based on 918 Breakroom Quiz responses", heading: "Only some people are given support to progress", primary: "Only some people are given support to progress.", secondary: "Just over a third of people say they're given support to learn new skills or take on more responsibility.", why: "A good job should help you progress at work, if you want to." },
        { pct: 37, label: "Team recommendation is mixed", subtext: "Based on 918 Breakroom Quiz responses", heading: "Only some people recommend working with their team", primary: "Only some people recommend working with their team.", secondary: "Just over a third of people would recommend working with their immediate team.", why: "The people you work with every day really matter. A good team makes a big difference." },
        { pct: 42, label: "Shift notice varies", subtext: "Based on 918 Breakroom Quiz responses", heading: "Only some people get 4 weeks notice of when they're working", primary: "Only some people get 4 weeks notice of when they're working.", secondary: "Less than half of people get 4 weeks notice of their shifts.", why: "Plenty of notice about when you're working makes it easier to plan the rest of your life." },
        { pct: 45, label: "Respect from managers varies", subtext: "Based on 918 Breakroom Quiz responses", heading: "Some people don't feel treated with respect by their managers", primary: "Some people don't feel treated with respect by their managers.", secondary: "Around half of people don't feel treated with full respect by their managers.", why: "Everyone deserves to be treated with respect at work. It's a basic standard all employers should meet." },
        { pct: 44, label: "Communication could be better", subtext: "Based on 918 Breakroom Quiz responses", heading: "Only some people feel well informed about how the company is doing", primary: "Only some people feel well informed about how the company is doing.", secondary: "Less than half of people feel well informed about how the company is doing.", why: "Being kept informed about the company helps you feel like a valued part of the business." },
      ],
      good: [
        { pct: 94, label: "No last-minute shift changes", subtext: "Based on 918 Breakroom Quiz responses", heading: "Shifts don't get changed at short notice", primary: "Shifts don't get changed at short notice.", secondary: "94% of people say their manager doesn't change their shifts at the last minute.", why: "If your manager is often changing your shifts at short notice that's a sign of poor planning. At a good job you won't be messed around at the last minute." },
        { pct: 96, label: "Hours security", subtext: "Based on 918 Breakroom Quiz responses", heading: "Most people don't worry about their hours", primary: "Most people don't worry about their hours.", secondary: "96% of people report they don't worry about getting enough hours.", why: "At a good job, you shouldn't have to worry about getting enough hours each week. A good job should guarantee you a minimum number of hours in a contract, if you want it." },
        { pct: 90, label: "Proper breaks", subtext: "Based on 918 Breakroom Quiz responses", heading: "Most people get proper breaks", primary: "Most people get proper breaks.", secondary: "90% of people report that they get to take proper breaks.", why: "When you take a break it should be a proper rest. It should last the full duration and you shouldn't get pulled off it." },
        { pct: 83, label: "No unpaid overtime", subtext: "Based on 918 Breakroom Quiz responses", heading: "Most people don't do unpaid extra work", primary: "Most people don't do unpaid extra work.", secondary: "83% of people report that they don't do extra unpaid work.", why: "Everyone should get paid for any extra work they do, even if it is outside your contracted hours. At a good job, you should be paid for all the time you spend at work." },
        { pct: 77, label: "Living wage", subtext: "Based on 918 Breakroom Quiz responses", heading: "Most people are paid a living wage", primary: "Most people are paid a living wage.", secondary: "77% of people say they are paid at or above the Real Living Wage for where they live.", why: "Everyone should be paid enough to live on. The Real Living Wage is a voluntary rate based on the real cost of living." },
        { pct: 70, label: "Above average pay", subtext: "Based on 918 Breakroom Quiz responses", heading: "Most people are paid above average for their job", primary: "Most people are paid above average for their job.", secondary: "70% of people say they are paid above average for the type of work they do.", why: "Pay can vary a lot between similar jobs. Being paid above average means this employer is competitive on pay." },
        { pct: 75, label: "Safe workplace", subtext: "Based on 918 Breakroom Quiz responses", heading: "Most people think their workplace is safe", primary: "Most people think their workplace is safe.", secondary: "75% of people think their workplace is safe.", why: "Everyone has the right to work in a safe environment. Safety should always come first." },
        { pct: 79, label: "Hours match contract", subtext: "Based on 918 Breakroom Quiz responses", heading: "Most people work the same hours as their contract", primary: "Most people work the same hours as their contract.", secondary: "79% of people say they work the same number of hours as stated in their contract.", why: "Your contract should accurately reflect the hours you work. Working significantly more than your contracted hours without pay is unfair." },
      ],
    },
    reviews: [
      { best: "Shifts are reliable — you always know when you're working and they don't get moved around on you", worst: "Head office have no idea what it's like on the floor. The stress levels are hard to deal with day to day", role: "Warehouse Operative", date: "Jan 2025" },
      { best: "Good team on my shift, we look out for each other", worst: "No sick pay, so people come in ill because they can't afford not to", role: "Warehouse Operative", date: "Oct 2024" },
    ],
    signals: [
      { status: "good", label: "No qualifications required — warehouse experience preferred but not essential", detail: "GXO ask for warehouse experience and inventory process knowledge, but this is 'preferred' rather than a hard requirement.", subtext: null, findingLabel: null, isBackgroundSignal: true },
      { status: "good", label: "Rotating day shifts Mon–Fri — no nights, no weekends", detail: "Shifts rotate between 06:00–14:00 and 14:00–22:00, Monday to Friday. No night shifts or weekend work.", subtext: null, findingLabel: null },
      { status: "bad", label: "71% of GXO workers don't get sick pay", detail: "71% of workers say they wouldn't be paid if they were sick but scheduled to work.", subtext: "Based on 918 Breakroom Quiz responses", findingLabel: "No sick pay" },
    ],
    jd: [
      { label: "Job title", text: "Warehouse Operative" },
      { label: "Employer", text: "GXO Logistics (Direct Employer)" },
      { label: "Pay", text: "£25,958/yr base + £945/yr shift premium — total approx. £26,904/yr" },
      { label: "Location", text: "Corby, Northamptonshire, NN18 8EY" },
      { label: "Hours", text: "Full time, Monday–Friday, rotating shifts: 06:00–14:00 and 14:00–22:00" },
      { label: "Role description", text: "GXO Logistics is one of the world's largest contract logistics companies. At our Corby site, you'll play a central role in the smooth and efficient running of the warehouse — accurately picking customer orders and ensuring goods are processed to the highest standard." },
      { label: "Responsibilities", text: "Accurately picking customer orders to meet daily targets; Loading and unloading vehicles using counterbalance and electric pump trucks; Working at heights to retrieve and store pallets; Identifying quality issues and reporting incidents; Complying with health and safety procedures at all times." },
      { label: "Requirements", text: "Warehouse experience and knowledge of inventory processes (preferred, not essential); Material handling equipment (MHE) driving experience desirable but not required; Team-orientated with a positive attitude; Computer literate; Strong commitment to health and safety." },
      { label: "Benefits", text: "Holiday pay; Workplace pension; My Benefits platform — high street discounts, cycle-to-work scheme, cashback cards and savings programmes." },
    ],
  },
  // ── 1: Amazon Warehouse Associate ───────────────────────────────────────────
  {
    id: 1,
    title: "Warehouse Associate",
    company: "Amazon",
    companyUrl: "https://www.breakroom.cc/companies/amazon",
    companyType: "Employer",
    pay: "£13.00/hr",
    payType: "hourly",
    payAlt: "≈ £27,040/yr",
    location: "Corby, NN18",
    coords: [52.490, -0.684],
    hours: "Full time",
    hoursSub: null,
    shifts: "Various shifts",
    rating: 7.5,
    quizCount: 3798,
    highlights: ["No last-minute shift changes", "Living wage", "No unpaid overtime"],
    listingUrl: "https://www.amazon.jobs/en-gb",
    altBadge: "Better rated",
    altReason: null,
    payBenchmark: { rangeLow: 12, rangeHigh: 14, roleLabel: "warehouse associates in Northamptonshire" },
    findingDiffs: ["No experience required", "Better rated employer"],
    requiresFltLicence: false,
    workStyle: { activity: "active", teamwork: "team", public: false, outdoors: false, children: false },
    findings: {
      bad: [
        { pct: 84, label: "No sick pay", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people don't get sick pay", primary: "Most people don't get sick pay.", secondary: "84% of people say they wouldn't get paid if they were sick but scheduled to work.", why: "Everyone gets sick sometimes. You should be able to take time off without worrying. At a good job you should still get paid if you're scheduled to work but can't due to sickness." },
        { pct: 75, label: "Short shift notice", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people don't get 4 weeks notice of when they're working", primary: "Most people don't get 4 weeks notice of when they're working.", secondary: "75% of people with changing schedules don't get 4 weeks notice of their shifts.", why: "At a good job, you get plenty of notice about when you're working. This makes it easy for you to plan the rest of your life and your finances." },
        { pct: 69, label: "Disconnected management", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Head office doesn't understand what's happening", primary: "Most people think head office doesn't understand what's happening.", secondary: "69% of people think that Amazon's head office doesn't have a good understanding of what's really happening where they work.", why: "At a good job, the role of head office should be to support the people on the frontline. To do that properly, they need a good understanding of what's really happening day to day." },
      ],
      okay: [
        { pct: 41, label: "Shift changes can happen", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Shifts can get changed at short notice", primary: "Shifts can get changed at short notice.", secondary: "Some people say their shifts are occasionally changed at the last minute.", why: "Predictable shifts make it easier to plan your life. Short-notice changes are disruptive." },
        { pct: 37, label: "Job satisfaction is mixed", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Only some people enjoy their job", primary: "Only some people enjoy their job.", secondary: "Around two thirds of people say they enjoy working here.", why: "Enjoying your work matters. It affects your health, motivation, and how long you stay in a job." },
        { pct: 46, label: "No choice of shifts", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Some people don't get enough choice over which shifts they work", primary: "Some people don't get enough choice over which shifts they work.", secondary: "Just over half of people say they get enough choice over their shifts.", why: "A good job is flexible around your personal life. This means you get a say in when you prefer to work." },
        { pct: 38, label: "Some stress at work", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Some people feel stressed here", primary: "Some people feel stressed here.", secondary: "Around half of people say they sometimes feel stressed at work.", why: "Your employer should support you with enough people and resources so you're not regularly feeling overwhelmed." },
        { pct: 39, label: "Support to progress is limited", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Only some people are given support to progress", primary: "Only some people are given support to progress.", secondary: "Around half of people say they're given support to learn new skills or take on more responsibility.", why: "A good job should help you progress at work, if you want to." },
        { pct: 39, label: "Unpaid breaks for some", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Only some people get paid breaks", primary: "Only some people get paid breaks.", secondary: "Just over half of people here get paid breaks.", why: "You should be paid for all the time you spend at work, including breaks." },
        { pct: 47, label: "Team recommendation is mixed", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Only some people recommend working with their team", primary: "Only some people recommend working with their team.", secondary: "Around half of people would recommend working with their immediate team.", why: "The people you work with every day really matter. A good team makes a big difference." },
        { pct: 42, label: "Communication could be better", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Only some people feel well informed about how the company is doing", primary: "Only some people feel well informed about how the company is doing.", secondary: "Less than two thirds of people feel well informed about how the company is doing.", why: "Being kept informed about the company helps you feel like a valued part of the business." },
      ],
      good: [
        { pct: 93, label: "Living wage", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people are paid a living wage", primary: "Most people are paid a living wage.", secondary: "93% of people say they are paid at or above the Real Living Wage for where they live.", why: "Everyone should be paid enough to live on. The Real Living Wage is a voluntary rate based on the real cost of living." },
        { pct: 92, label: "No last-minute shift changes", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Shifts don't get changed at short notice", primary: "Shifts don't get changed at short notice.", secondary: "92% of people say their manager doesn't change their shifts at the last minute.", why: "If your manager is often changing your shifts at short notice that's a sign of poor planning. At a good job you won't be messed around at the last minute." },
        { pct: 91, label: "Hours security", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people don't worry about their hours", primary: "Most people don't worry about their hours.", secondary: "91% of people report they don't worry about getting enough hours.", why: "At a good job, you shouldn't have to worry about getting enough hours each week." },
        { pct: 85, label: "No unpaid overtime", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people don't do unpaid extra work", primary: "Most people don't do unpaid extra work.", secondary: "85% of people report that they don't do extra unpaid work.", why: "Everyone should get paid for any extra work they do, even if it is outside your contracted hours." },
        { pct: 80, label: "Proper breaks", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people get proper breaks", primary: "Most people get proper breaks.", secondary: "80% of people report that they get to take proper breaks.", why: "When you take a break it should be a proper rest. It should last the full duration and you shouldn't get pulled off it." },
        { pct: 90, label: "Above average pay", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people are paid above average for their job", primary: "Most people are paid above average for their job.", secondary: "90% of people say they are paid above average for the type of work they do.", why: "Pay can vary a lot between similar jobs. Being paid above average means this employer is competitive on pay." },
        { pct: 84, label: "Safe workplace", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people think their workplace is safe", primary: "Most people think their workplace is safe.", secondary: "84% of people think their workplace is safe.", why: "Everyone has the right to work in a safe environment. Safety should always come first." },
        { pct: 75, label: "Good for carers", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most parents and carers say this is a good place to work", primary: "Most parents and carers say this is a good place to work.", secondary: "67% of parents and carers say Amazon is a good place to work.", why: "If you have caring responsibilities, flexibility and understanding from your employer is essential." },
        { pct: 75, label: "Treated with respect", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people feel treated with respect by their managers", primary: "Most people feel treated with respect by their managers.", secondary: "75% of people feel treated with respect by their managers.", why: "Everyone deserves to be treated with respect at work. It's a basic standard all employers should meet." },
        { pct: 75, label: "Good training", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people got enough training when they started", primary: "Most people got enough training when they started.", secondary: "75% of people say they got enough training when they started.", why: "Good training from day one helps you do your job well and feel confident at work." },
        { pct: 85, label: "Easy to book holiday", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people find it easy to book holiday", primary: "Most people find it easy to book holiday.", secondary: "85% of people say it's easy to book holiday.", why: "A good job should let you take time off when you need it, and it shouldn't be a nightmare to arrange." },
        { pct: 85, label: "Easy to take sick leave", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people find it easy to take sick leave", primary: "Most people find it easy to take sick leave.", secondary: "85% of people say it's easy to take sick leave when they need it.", why: "Being able to take sick leave when you need it is important for your health and wellbeing." },
        { pct: 83, label: "Hours match contract", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people work the same hours as their contract", primary: "Most people work the same hours as their contract.", secondary: "83% of people say they work the same number of hours as stated in their contract.", why: "Your contract should accurately reflect the hours you work. Working significantly more than your contracted hours without pay is unfair." },
      ],
    },
    reviews: [
      { best: "Pay is decent and your hours are always guaranteed — I never worry about getting enough work", worst: "It's relentless. You're walking the whole shift and the targets never stop. Your body knows about it by Friday", role: "Warehouse Associate", date: "Feb 2025" },
      { best: "No experience needed — they trained me properly from day one", worst: "They track everything. Every minute is monitored and it creates a lot of pressure", role: "Fulfilment Centre Operative", date: "Nov 2024" },
    ],
    signals: [
      { status: "good", label: "No experience required — Amazon trains you from day one", detail: "Amazon specifically say no prior warehouse experience is needed. Full paid training is provided from your first day.", subtext: null, findingLabel: null, isBackgroundSignal: true },
      { status: "warning", label: "Physically demanding — walking 10–15 miles per shift, lifting up to 23kg", detail: "Amazon warehouse roles are high-activity roles. Workers stand and walk for the full shift and are expected to hit productivity targets.", subtext: null, findingLabel: null },
      { status: "bad", label: "84% of Amazon workers don't get sick pay", detail: "Despite Amazon's higher rating, sick pay is still a major gap — consistent across all Amazon roles.", subtext: "Based on 3,798 Breakroom Quiz responses", findingLabel: null },
    ],
    jd: [
      { label: "Job title", text: "Warehouse Associate (Fulfilment Centre)" },
      { label: "Employer", text: "Amazon (Direct Employer)" },
      { label: "Pay", text: "From £13.00/hr (plus overnight and weekend premiums where applicable)" },
      { label: "Location", text: "Corby, Northamptonshire, NN18" },
      { label: "Hours", text: "Full time and part time available — fixed shifts including days, nights, and weekends" },
      { label: "Role description", text: "Amazon's fulfilment centres are where customer orders come to life. As a Warehouse Associate you'll receive products, pick orders, pack and ship — helping ensure every customer gets their order on time. No experience needed — we'll train you from day one." },
      { label: "Responsibilities", text: "Receiving and storing incoming stock; Picking orders accurately from shelves and bins; Packing and labelling orders for dispatch; Sorting parcels; Meeting daily productivity targets; Following all safety procedures." },
      { label: "Requirements", text: "No previous warehouse experience required; Ability to stand and walk for your full shift; Able to lift and carry items up to 23kg; Reliable and punctual; Right to work in the UK." },
      { label: "Benefits", text: "Pay from £13.00/hr; Pension scheme; Employee discount on Amazon purchases; 24/7 on-site support; Career development pathways." },
    ],
  },
  // ── 2: DHL Supply Chain ──────────────────────────────────────────────────────
  {
    id: 2,
    title: "Warehouse Operative",
    company: "DHL Supply Chain",
    companyUrl: "https://www.breakroom.cc/companies/dhl-supply-chain",
    companyType: "Employer",
    pay: "£12.75/hr",
    payType: "hourly",
    payAlt: "≈ £26,520/yr",
    location: "Northampton, NN4",
    coords: [52.232, -0.907],
    hours: "Full time",
    hoursSub: null,
    shifts: "Day shifts",
    rating: 6.7,
    quizCount: 364,
    highlights: ["Hours security", "No last-minute shift changes"],
    listingUrl: "https://www.dhl.com/gb-en/home/careers.html",
    altBadge: "↑ £0.27/hr",
    altReason: null,
    payBenchmark: { rangeLow: 12, rangeHigh: 14, roleLabel: "warehouse operatives in Northamptonshire" },
    findingDiffs: ["Better sick pay cover", "Less unpaid overtime"],
    requiresFltLicence: false,
    workStyle: { activity: "active", teamwork: "team", public: false, outdoors: false, children: false },
    findings: {
      bad: [
        { pct: 69, label: "No paid breaks", subtext: "Based on 364 Breakroom Quiz responses", heading: "Most people don't get paid breaks", primary: "Most people don't get paid breaks.", secondary: "69% of people say they don't get paid breaks.", why: "A good job should have paid breaks. You should be paid for all your time at work, whether you're on a break or not." },
        { pct: 70, label: "No choice of shifts", subtext: "Based on 364 Breakroom Quiz responses", heading: "Most people don't get any choice of shifts", primary: "Most people don't get any choice of shifts.", secondary: "70% report that their manager doesn't give them enough choice over which shifts they work.", why: "A good job is flexible around your personal life. This means you get a say in when you prefer to work." },
        { pct: 82, label: "Disconnected management", subtext: "Based on 364 Breakroom Quiz responses", heading: "Head office doesn't understand what's happening", primary: "Most people think head office doesn't understand what's happening.", secondary: "82% of people think that DHL's head office doesn't have a good understanding of what's really happening where they work.", why: "At a good job, the role of head office should be to support the people on the frontline. They need a good understanding of what's really happening day to day." },
      ],
      okay: [
        { pct: 60, label: "Only some sick pay", subtext: "Based on 364 Breakroom Quiz responses", heading: "Only some people get sick pay", primary: "Only some people get sick pay.", secondary: "Only around four in ten people say they would be paid if sick but scheduled to work.", why: "Everyone gets sick sometimes. At a good job you should still get paid if you're scheduled to work but can't due to sickness." },
        { pct: 36, label: "Holiday booking can be tricky", subtext: "Based on 364 Breakroom Quiz responses", heading: "Some people find it hard to book holiday", primary: "Some people find it hard to book holiday.", secondary: "Around a third of people say they find it hard to book time off.", why: "A good job should let you take time off when you need it without jumping through hoops." },
        { pct: 40, label: "Shift changes can happen", subtext: "Based on 364 Breakroom Quiz responses", heading: "Shifts can get changed at short notice", primary: "Shifts can get changed at short notice.", secondary: "Some people say their shifts are occasionally changed at the last minute.", why: "Predictable shifts make it easier to plan your life. Short-notice changes are disruptive." },
        { pct: 38, label: "Sick leave isn't always easy", subtext: "Based on 364 Breakroom Quiz responses", heading: "Some people find it hard to take sick leave", primary: "Some people find it hard to take sick leave.", secondary: "Around a third of people say taking sick leave isn't straightforward.", why: "Being able to take sick leave when you need it is important for your health and wellbeing." },
        { pct: 50, label: "Job satisfaction is mixed", subtext: "Based on 364 Breakroom Quiz responses", heading: "Only some people enjoy their job", primary: "Only some people enjoy their job.", secondary: "Around half of people say they enjoy working here.", why: "Enjoying your work matters. It affects your health, motivation, and how long you stay in a job." },
        { pct: 40, label: "Training could be better", subtext: "Based on 364 Breakroom Quiz responses", heading: "Some people didn't get enough training when they started", primary: "Some people didn't get enough training when they started.", secondary: "Around two fifths of people felt they didn't get enough training when they joined.", why: "Good training from day one helps you do your job well and feel confident at work." },
        { pct: 38, label: "Some stress at work", subtext: "Based on 364 Breakroom Quiz responses", heading: "Some people feel stressed here", primary: "Some people feel stressed here.", secondary: "Around a third of people say they often feel stressed at work.", why: "Your employer should support you so you're not regularly feeling overwhelmed at work." },
        { pct: 48, label: "Mixed support for carers", subtext: "Based on 364 Breakroom Quiz responses", heading: "Only some parents and carers say this is a good place to work", primary: "Only some parents and carers say this is a good place to work.", secondary: "Less than two thirds of parents and carers say DHL is a good place to work.", why: "If you have caring responsibilities, flexibility and understanding from your employer is essential." },
        { pct: 42, label: "Pay is around average", subtext: "Based on 364 Breakroom Quiz responses", heading: "Only some people are paid above average for their job", primary: "Only some people are paid above average for their job.", secondary: "Less than two thirds of people say they are paid above average for the type of work they do.", why: "Pay can vary a lot between similar jobs. Check what other employers in the area are paying." },
        { pct: 38, label: "Support to progress is limited", subtext: "Based on 364 Breakroom Quiz responses", heading: "Only some people are given support to progress", primary: "Only some people are given support to progress.", secondary: "Around a third of people say they're given support to learn new skills or take on more responsibility.", why: "A good job should help you progress at work, if you want to." },
        { pct: 45, label: "Team recommendation is mixed", subtext: "Based on 364 Breakroom Quiz responses", heading: "Only some people recommend working with their team", primary: "Only some people recommend working with their team.", secondary: "Around half of people would recommend working with their immediate team.", why: "The people you work with every day really matter. A good team makes a big difference." },
        { pct: 38, label: "Shift notice varies", subtext: "Based on 364 Breakroom Quiz responses", heading: "Only some people get 4 weeks notice of when they're working", primary: "Only some people get 4 weeks notice of when they're working.", secondary: "Around two fifths of people get 4 weeks notice of their shifts.", why: "Plenty of notice about when you're working makes it easier to plan the rest of your life." },
        { pct: 42, label: "Respect from managers varies", subtext: "Based on 364 Breakroom Quiz responses", heading: "Some people don't feel treated with respect by their managers", primary: "Some people don't feel treated with respect by their managers.", secondary: "Around two fifths of people don't feel treated with full respect by their managers.", why: "Everyone deserves to be treated with respect at work." },
        { pct: 40, label: "Communication could be better", subtext: "Based on 364 Breakroom Quiz responses", heading: "Only some people feel well informed about how the company is doing", primary: "Only some people feel well informed about how the company is doing.", secondary: "Around two fifths of people feel well informed about how the company is doing.", why: "Being kept informed about the company helps you feel like a valued part of the business." },
        { pct: 40, label: "Some unpaid extra work", subtext: "Based on 364 Breakroom Quiz responses", heading: "Some people do unpaid extra work", primary: "Some people do unpaid extra work.", secondary: "Around two fifths of people say they do unpaid extra work.", why: "Everyone should get paid for any extra work they do." },
      ],
      good: [
        { pct: 94, label: "Hours security", subtext: "Based on 364 Breakroom Quiz responses", heading: "Most people don't worry about their hours", primary: "Most people don't worry about their hours.", secondary: "94% of people report they don't worry about getting enough hours.", why: "At a good job, you shouldn't have to worry about getting enough hours each week. A good job should guarantee you a minimum number of hours in a contract, if you want it." },
        { pct: 87, label: "No last-minute shift changes", subtext: "Based on 364 Breakroom Quiz responses", heading: "Shifts don't get changed at short notice", primary: "Shifts don't get changed at short notice.", secondary: "87% of people say their manager doesn't change their shifts at the last minute.", why: "If your manager is often changing your shifts at short notice that's a sign of poor planning. At a good job you won't be messed around at the last minute." },
        { pct: 84, label: "Living wage", subtext: "Based on 364 Breakroom Quiz responses", heading: "Most people are paid a living wage", primary: "Most people are paid a living wage.", secondary: "84% of people say they are paid at or above the Real Living Wage for where they live.", why: "Everyone should be paid enough to live on." },
        { pct: 78, label: "Proper breaks", subtext: "Based on 364 Breakroom Quiz responses", heading: "Most people get proper breaks", primary: "Most people get proper breaks.", secondary: "78% of people report that they get to take proper breaks.", why: "When you take a break it should be a proper rest. It should last the full duration and you shouldn't get pulled off it." },
        { pct: 74, label: "Safe workplace", subtext: "Based on 364 Breakroom Quiz responses", heading: "Most people think their workplace is safe", primary: "Most people think their workplace is safe.", secondary: "74% of people think their workplace is safe.", why: "Everyone has the right to work in a safe environment. Safety should always come first." },
        { pct: 78, label: "Hours match contract", subtext: "Based on 364 Breakroom Quiz responses", heading: "Most people work the same hours as their contract", primary: "Most people work the same hours as their contract.", secondary: "78% of people say they work the same number of hours as stated in their contract.", why: "Your contract should accurately reflect the hours you work. Working significantly more than your contracted hours without pay is unfair." },
      ],
    },
    reviews: [
      { best: "Hours are secure and shifts rarely get moved around. I've worked here two years and it's been consistent", worst: "Breaks aren't paid and you don't get much say in your shifts. It's take it or leave it", role: "Warehouse Operative", date: "Mar 2025" },
      { best: "Decent site, management on the floor are fair", worst: "Some people are doing unpaid extra work at the end of shifts and it just gets normalised", role: "Picker", date: "Dec 2024" },
    ],
    signals: [
      { status: "good", label: "No formal qualifications required", detail: "DHL ask for previous warehouse experience as a preference, but no licences or certificates are required to apply.", subtext: null, findingLabel: null, isBackgroundSignal: true },
      { status: "warning", label: "40% of DHL workers do unpaid extra work", detail: "Four in ten DHL workers report doing work they're not paid for. Worth asking about overtime expectations at interview.", subtext: "Based on 364 Breakroom Quiz responses", findingLabel: null },
      { status: "warning", label: "60% don't get sick pay — better than most logistics employers", detail: "A majority still lack sick pay, but this compares favourably to GXO (71%), XPO (83%) and Clipper (90%).", subtext: "Based on 364 Breakroom Quiz responses", findingLabel: null },
    ],
    jd: [
      { label: "Job title", text: "Warehouse Operative" },
      { label: "Employer", text: "DHL Supply Chain (Direct Employer)" },
      { label: "Pay", text: "£12.75/hr" },
      { label: "Location", text: "Northampton, NN4 (approx. 20 miles from Corby)" },
      { label: "Hours", text: "Full time, day shifts (Monday–Friday)" },
      { label: "Role description", text: "DHL Supply Chain is one of the world's leading logistics providers. We're looking for Warehouse Operatives to join our busy Northampton site, supporting a key retail client with efficient movement, storage, and distribution of goods." },
      { label: "Responsibilities", text: "Picking and packing customer orders; Loading and unloading vehicles; Operating RF scanners; Stock replenishment and rotation; Maintaining a clean and safe working environment; Meeting daily KPIs." },
      { label: "Requirements", text: "Previous warehouse or logistics experience preferred; Good attention to detail; Comfortable standing for long periods and lifting up to 25kg; Team player; Right to work in the UK." },
      { label: "Benefits", text: "Company pension; 25 days holiday (pro rata); DHL employee discount programme; Career development opportunities." },
    ],
  },
  // ── 3: Wincanton ─────────────────────────────────────────────────────────────
  {
    id: 3,
    title: "Warehouse Operative",
    company: "Wincanton",
    companyUrl: "https://www.breakroom.cc/companies/wincanton",
    companyType: "Employer",
    pay: "£12.00/hr",
    payType: "hourly",
    payAlt: null,
    location: "Kettering, NN16",
    coords: [52.397, -0.727],
    hours: "Full time",
    hoursSub: null,
    shifts: "Mixed shifts",
    rating: 6.1,
    quizCount: 659,
    highlights: ["Hours security", "No last-minute shift changes"],
    listingUrl: "https://www.wincanton.co.uk/careers",
    altBadge: null,
    altReason: null,
    payBenchmark: { rangeLow: 12, rangeHigh: 14, roleLabel: "warehouse operatives in Northamptonshire" },
    findingDiffs: [],
    requiresFltLicence: false,
    workStyle: { activity: "active", teamwork: "team", public: false, outdoors: false, children: false },
    findings: {
      bad: [
        { pct: 72, label: "Short shift notice", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people don't get 4 weeks notice of when they're working", primary: "Most people don't get 4 weeks notice of when they're working.", secondary: "72% of people don't get 4 weeks notice of their shifts.", why: "At a good job, you get plenty of notice about when you're working. This makes it easy for you to plan the rest of your life and your finances." },
        { pct: 68, label: "No choice of shifts", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people don't get any choice of shifts", primary: "Most people don't get any choice of shifts.", secondary: "68% report that their manager doesn't give them enough choice over which shifts they work.", why: "A good job is flexible around your personal life. This means you get a say in when you prefer to work." },
        { pct: 68, label: "Stressful work", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people feel stressed here", primary: "Most people feel stressed here.", secondary: "68% of people say they often feel stressed at work.", why: "Your employer should support you with enough people and resources so you're not regularly feeling overwhelmed." },
        { pct: 68, label: "Poor team atmosphere", subtext: "Based on 659 Breakroom Quiz responses", heading: "Not many people recommend working with their team", primary: "Not many people recommend working with their team.", secondary: "68% of people would not recommend working with their immediate team to a friend.", why: "The people you work with every day really matter. A good team can be the difference between a terrible day and a great one." },
        { pct: 69, label: "No support to progress", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people aren't given support to progress", primary: "Most people aren't given support to progress.", secondary: "69% of people report not being given an opportunity to get better at their job or learn new skills.", why: "A good job should help you progress at work, if you want to." },
        { pct: 88, label: "Disconnected management", subtext: "Based on 659 Breakroom Quiz responses", heading: "Head office doesn't understand what's happening", primary: "Most people think head office doesn't understand what's happening.", secondary: "88% of people think that Wincanton's head office doesn't have a good understanding of what's really happening where they work.", why: "At a good job, the role of head office should be to support the people on the frontline." },
        { pct: 70, label: "Poor company communication", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people don't feel well informed about how the company is doing", primary: "Most people don't feel well informed about how the company is doing.", secondary: "70% of people feel they aren't kept well informed about how the company is doing.", why: "You should be kept informed about how the company is doing, both in good times and when things get tough." },
        { pct: 74, label: "Below average pay", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people are paid less than average for their job", primary: "Most people are paid less than average for their job.", secondary: "74% of people say they are paid below average for the type of work they do.", why: "Pay can vary a lot between similar jobs. Many employers in this area pay more for warehouse work." },
        { pct: 68, label: "No sick pay", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people don't get sick pay", primary: "Most people don't get sick pay.", secondary: "68% of people say they wouldn't be paid if they were sick but scheduled to work.", why: "Everyone gets sick sometimes. At a good job you should still get paid if you're scheduled to work but can't due to sickness." },
      ],
      okay: [
        { pct: 38, label: "Holiday booking can be tricky", subtext: "Based on 659 Breakroom Quiz responses", heading: "Some people find it hard to book holiday", primary: "Some people find it hard to book holiday.", secondary: "Around a third of people say they find it hard to book time off.", why: "A good job should let you take time off when you need it without jumping through hoops." },
        { pct: 36, label: "Shift changes can happen", subtext: "Based on 659 Breakroom Quiz responses", heading: "Shifts can get changed at short notice", primary: "Shifts can get changed at short notice.", secondary: "Some people say their shifts are occasionally changed at the last minute.", why: "Predictable shifts make it easier to plan your life. Short-notice changes are disruptive." },
        { pct: 48, label: "Sick leave isn't always easy", subtext: "Based on 659 Breakroom Quiz responses", heading: "Some people find it hard to take sick leave", primary: "Some people find it hard to take sick leave.", secondary: "Around half of people say taking sick leave isn't straightforward.", why: "Being able to take sick leave when you need it is important for your health and wellbeing." },
        { pct: 42, label: "Job satisfaction is mixed", subtext: "Based on 659 Breakroom Quiz responses", heading: "Only some people enjoy their job", primary: "Only some people enjoy their job.", secondary: "Around two fifths of people say they enjoy working here.", why: "Enjoying your work matters. It affects your health, motivation, and how long you stay in a job." },
        { pct: 50, label: "Training could be better", subtext: "Based on 659 Breakroom Quiz responses", heading: "Some people didn't get enough training when they started", primary: "Some people didn't get enough training when they started.", secondary: "Around half of people felt they didn't get enough training when they joined.", why: "Good training from day one helps you do your job well and feel confident at work." },
        { pct: 42, label: "Mixed support for carers", subtext: "Based on 659 Breakroom Quiz responses", heading: "Only some parents and carers say this is a good place to work", primary: "Only some parents and carers say this is a good place to work.", secondary: "Less than two thirds of parents and carers say Wincanton is a good place to work.", why: "If you have caring responsibilities, flexibility and understanding from your employer is essential." },
        { pct: 38, label: "Unpaid breaks for some", subtext: "Based on 659 Breakroom Quiz responses", heading: "Only some people get paid breaks", primary: "Only some people get paid breaks.", secondary: "Around a third of people here get paid breaks.", why: "You should be paid for all the time you spend at work, including breaks." },
        { pct: 52, label: "Respect from managers varies", subtext: "Based on 659 Breakroom Quiz responses", heading: "Some people don't feel treated with respect by their managers", primary: "Some people don't feel treated with respect by their managers.", secondary: "Around half of people don't feel treated with full respect by their managers.", why: "Everyone deserves to be treated with respect at work." },
        { pct: 36, label: "Hours can match contract", subtext: "Based on 659 Breakroom Quiz responses", heading: "Some people work a lot more hours than their contract", primary: "Some people work a lot more hours than their contract.", secondary: "Around a third of people work significantly more hours than stated in their contract.", why: "Your contract should accurately reflect the hours you work. Working significantly more than your contracted hours without pay is unfair." },
      ],
      good: [
        { pct: 95, label: "Hours security", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people don't worry about their hours", primary: "Most people don't worry about their hours.", secondary: "95% of people report they don't worry about getting enough hours.", why: "At a good job, you shouldn't have to worry about getting enough hours each week." },
        { pct: 84, label: "No last-minute shift changes", subtext: "Based on 659 Breakroom Quiz responses", heading: "Shifts don't get changed at short notice", primary: "Shifts don't get changed at short notice.", secondary: "84% of people say their manager doesn't change their shifts at the last minute.", why: "If your manager is often changing your shifts at short notice that's a sign of poor planning. At a good job you won't be messed around at the last minute." },
        { pct: 79, label: "No unpaid overtime", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people don't do unpaid extra work", primary: "Most people don't do unpaid extra work.", secondary: "79% of people report that they don't do extra unpaid work.", why: "Everyone should get paid for any extra work they do, even if it is outside your contracted hours." },
        { pct: 78, label: "Proper breaks", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people get proper breaks", primary: "Most people get proper breaks.", secondary: "78% of people report that they get to take proper breaks.", why: "When you take a break it should be a proper rest. It should last the full duration and you shouldn't get pulled off it." },
        { pct: 68, label: "Living wage", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people are paid a living wage", primary: "Most people are paid a living wage.", secondary: "68% of people say they are paid at or above the Real Living Wage for where they live.", why: "Everyone should be paid enough to live on." },
        { pct: 70, label: "Safe workplace", subtext: "Based on 659 Breakroom Quiz responses", heading: "Most people think their workplace is safe", primary: "Most people think their workplace is safe.", secondary: "70% of people think their workplace is safe.", why: "Everyone has the right to work in a safe environment. Safety should always come first." },
      ],
    },
    reviews: [
      { best: "Hours are always there if you want them, and they don't chase you for unpaid overtime", worst: "Pay is low for what you're doing and communication from above is basically non-existent", role: "Warehouse Operative", date: "Jan 2025" },
      { best: "The site itself is well run and breaks are respected", worst: "Team morale isn't great. People don't really pull together here like other places I've worked", role: "Warehouse Operative", date: "Sep 2024" },
    ],
    signals: [
      { status: "good", label: "No specific qualifications required", detail: "Wincanton ask for warehouse or logistics experience as a preference. No licences or certificates are needed for this role.", subtext: null, findingLabel: null, isBackgroundSignal: true },
      { status: "bad", label: "74% of Wincanton workers are paid below average for the role", detail: "Pay is the biggest concern at Wincanton — almost three quarters of workers say they earn below average for warehouse work.", subtext: "Based on 659 Breakroom Quiz responses", findingLabel: null },
      { status: "bad", label: "72% don't get 4 weeks notice of shifts", detail: "Short notice makes it hard to plan childcare, travel, or other commitments around work.", subtext: "Based on 659 Breakroom Quiz responses", findingLabel: null },
    ],
    jd: [
      { label: "Job title", text: "Warehouse Operative" },
      { label: "Employer", text: "Wincanton (Direct Employer)" },
      { label: "Pay", text: "£12.00/hr" },
      { label: "Location", text: "Kettering, Northamptonshire, NN16" },
      { label: "Hours", text: "Full time, mixed day and afternoon shifts" },
      { label: "Role description", text: "Wincanton is one of the UK's leading supply chain businesses. We're recruiting Warehouse Operatives to join our Kettering site, supporting a major retail client with picking, packing, and processing orders in a fast-paced environment." },
      { label: "Responsibilities", text: "Picking and packing orders accurately; Receiving and put-away of inbound stock; Operating handheld RF scanners; Stock counting and inventory checks; Ensuring the warehouse is clean and tidy; Working to daily throughput targets." },
      { label: "Requirements", text: "Previous warehouse or distribution experience preferred; Good numeracy and attention to detail; Comfortable with physical work and lifting up to 25kg; Reliable attendance record; Right to work in the UK." },
      { label: "Benefits", text: "Company pension; 28 days holiday (including bank holidays); Employee assistance programme; On-site parking; Opportunities for progression." },
    ],
  },
  // ── 4: XPO Logistics FLT Driver ──────────────────────────────────────────────
  {
    id: 4,
    title: "FLT Driver",
    company: "XPO Logistics",
    companyUrl: "https://www.breakroom.cc/companies/xpo-logistics",
    companyType: "Employer",
    pay: "£14.50/hr",
    payType: "hourly",
    payAlt: "≈ £30,160/yr",
    location: "Northampton, NN4",
    coords: [52.232, -0.907],
    hours: "Full time",
    hoursSub: null,
    shifts: "Day shifts",
    rating: 5.8,
    quizCount: 372,
    highlights: ["Hours security", "No unpaid overtime"],
    listingUrl: "https://www.xpo.com/en-gb/careers",
    altBadge: "↑ £2.02/hr",
    altReason: { text: "FLT licence required" },
    payBenchmark: { rangeLow: 14, rangeHigh: 17, roleLabel: "FLT drivers in Northamptonshire" },
    findingDiffs: ["Higher pay rate"],
    requiresFltLicence: true,
    workStyle: { activity: "active", teamwork: "solo", public: false, outdoors: false, children: false },
    findings: {
      bad: [
        { pct: 75, label: "No paid breaks", subtext: "Based on 372 Breakroom Quiz responses", heading: "Most people don't get paid breaks", primary: "Most people don't get paid breaks.", secondary: "75% of people say they don't get paid breaks.", why: "A good job should have paid breaks. You should be paid for all your time at work, whether you're on a break or not." },
        { pct: 83, label: "No sick pay", subtext: "Based on 372 Breakroom Quiz responses", heading: "Most people don't get sick pay", primary: "Most people don't get sick pay.", secondary: "83% of people say they wouldn't get paid if they were sick but scheduled to work.", why: "Everyone gets sick sometimes. At a good job you should still get paid if you're scheduled to work but can't due to sickness." },
        { pct: 74, label: "Short shift notice", subtext: "Based on 372 Breakroom Quiz responses", heading: "Most people don't get 4 weeks notice of when they're working", primary: "Most people don't get 4 weeks notice of when they're working.", secondary: "74% of people don't get 4 weeks notice of their shifts.", why: "At a good job, you get plenty of notice about when you're working. This makes it easy to plan the rest of your life and your finances." },
        { pct: 68, label: "No support to progress", subtext: "Based on 372 Breakroom Quiz responses", heading: "Most people aren't given support to progress", primary: "Most people aren't given support to progress.", secondary: "68% of people report not being given an opportunity to get better at their job or learn new skills.", why: "A good job should help you progress at work, if you want to." },
        { pct: 85, label: "Disconnected management", subtext: "Based on 372 Breakroom Quiz responses", heading: "Head office doesn't understand what's happening", primary: "Most people think head office doesn't understand what's happening.", secondary: "85% of people think that XPO's head office doesn't have a good understanding of what's really happening where they work.", why: "At a good job, the role of head office should be to support the people on the frontline." },
        { pct: 82, label: "Poor company communication", subtext: "Based on 372 Breakroom Quiz responses", heading: "Most people don't feel well informed about how the company is doing", primary: "Most people don't feel well informed about how the company is doing.", secondary: "82% of people feel they aren't kept well informed about how the company is doing.", why: "You should be kept informed about how the company is doing, both in good times and when things get tough." },
      ],
      okay: [
        { pct: 45, label: "Hours can exceed contract", subtext: "Based on 372 Breakroom Quiz responses", heading: "Some people work a lot more hours than their contract", primary: "Some people work a lot more hours than their contract.", secondary: "Around half of people work significantly more hours than stated in their contract.", why: "Your contract should accurately reflect the hours you work." },
        { pct: 38, label: "Shift changes can happen", subtext: "Based on 372 Breakroom Quiz responses", heading: "Shifts can get changed at short notice", primary: "Shifts can get changed at short notice.", secondary: "Some people say their shifts are occasionally changed at the last minute.", why: "Predictable shifts make it easier to plan your life." },
        { pct: 48, label: "Sick leave isn't always easy", subtext: "Based on 372 Breakroom Quiz responses", heading: "Some people find it hard to take sick leave", primary: "Some people find it hard to take sick leave.", secondary: "Around half of people say taking sick leave isn't straightforward.", why: "Being able to take sick leave when you need it is important for your health and wellbeing." },
        { pct: 46, label: "Job satisfaction is mixed", subtext: "Based on 372 Breakroom Quiz responses", heading: "Only some people enjoy their job", primary: "Only some people enjoy their job.", secondary: "Around half of people say they enjoy working here.", why: "Enjoying your work matters. It affects your health, motivation, and how long you stay in a job." },
        { pct: 34, label: "Some choice of shifts", subtext: "Based on 372 Breakroom Quiz responses", heading: "Some people don't get enough choice over which shifts they work", primary: "Some people don't get enough choice over which shifts they work.", secondary: "Around two thirds of people say they get enough choice over their shifts.", why: "A good job is flexible around your personal life. This means you get a say in when you prefer to work." },
        { pct: 48, label: "Training could be better", subtext: "Based on 372 Breakroom Quiz responses", heading: "Some people didn't get enough training when they started", primary: "Some people didn't get enough training when they started.", secondary: "Around half of people felt they didn't get enough training when they joined.", why: "Good training from day one helps you do your job well and feel confident at work." },
        { pct: 36, label: "Some stress at work", subtext: "Based on 372 Breakroom Quiz responses", heading: "Some people feel stressed here", primary: "Some people feel stressed here.", secondary: "Around a third of people say they often feel stressed at work.", why: "Your employer should support you so you're not regularly feeling overwhelmed." },
        { pct: 38, label: "Mixed support for carers", subtext: "Based on 372 Breakroom Quiz responses", heading: "Only some parents and carers say this is a good place to work", primary: "Only some parents and carers say this is a good place to work.", secondary: "Less than two thirds of parents and carers say XPO is a good place to work.", why: "If you have caring responsibilities, flexibility and understanding from your employer is essential." },
        { pct: 38, label: "Pay is around average", subtext: "Based on 372 Breakroom Quiz responses", heading: "Only some people are paid above average for their job", primary: "Only some people are paid above average for their job.", secondary: "Less than two thirds of people say they are paid above average for the type of work they do.", why: "Check what other FLT employers in the area are paying." },
        { pct: 38, label: "Team recommendation is mixed", subtext: "Based on 372 Breakroom Quiz responses", heading: "Only some people recommend working with their team", primary: "Only some people recommend working with their team.", secondary: "Around two fifths of people would recommend working with their immediate team.", why: "The people you work with every day really matter." },
        { pct: 55, label: "Respect from managers varies", subtext: "Based on 372 Breakroom Quiz responses", heading: "Some people don't feel treated with respect by their managers", primary: "Some people don't feel treated with respect by their managers.", secondary: "Around half of people don't feel treated with full respect by their managers.", why: "Everyone deserves to be treated with respect at work." },
        { pct: 60, label: "Proper breaks not guaranteed", subtext: "Based on 372 Breakroom Quiz responses", heading: "Some people don't get proper breaks", primary: "Some people don't get proper breaks.", secondary: "Around two fifths of people say they don't get to take proper breaks.", why: "When you take a break it should be a proper rest." },
      ],
      good: [
        { pct: 86, label: "Hours security", subtext: "Based on 372 Breakroom Quiz responses", heading: "Most people don't worry about their hours", primary: "Most people don't worry about their hours.", secondary: "86% of people report they don't worry about getting enough hours.", why: "At a good job, you shouldn't have to worry about getting enough hours each week." },
        { pct: 81, label: "Living wage", subtext: "Based on 372 Breakroom Quiz responses", heading: "Most people are paid a living wage", primary: "Most people are paid a living wage.", secondary: "81% of people say they are paid at or above the Real Living Wage for where they live.", why: "Everyone should be paid enough to live on." },
        { pct: 73, label: "Easy holiday booking", subtext: "Based on 372 Breakroom Quiz responses", heading: "Most people find it easy to book holiday", primary: "Most people find it easy to book holiday.", secondary: "73% of people say it's easy to book holiday.", why: "A good job should let you take time off when you need it, and it shouldn't be a nightmare to arrange." },
        { pct: 70, label: "No unpaid overtime", subtext: "Based on 372 Breakroom Quiz responses", heading: "Most people don't do unpaid extra work", primary: "Most people don't do unpaid extra work.", secondary: "70% of people report that they don't do extra unpaid work.", why: "Everyone should get paid for any extra work they do." },
        { pct: 78, label: "No last-minute shift changes", subtext: "Based on 372 Breakroom Quiz responses", heading: "Shifts don't get changed at short notice", primary: "Shifts don't get changed at short notice.", secondary: "78% of people say their manager doesn't change their shifts at the last minute.", why: "If your manager is often changing your shifts at short notice that's a sign of poor planning." },
        { pct: 70, label: "Safe workplace", subtext: "Based on 372 Breakroom Quiz responses", heading: "Most people think their workplace is safe", primary: "Most people think their workplace is safe.", secondary: "70% of people think their workplace is safe.", why: "Everyone has the right to work in a safe environment. Safety should always come first." },
      ],
    },
    reviews: [
      { best: "Decent pay if you've got your licence — hours are always there and you're not asked to do unpaid overtime", worst: "You find out your shifts last minute. It's really hard to plan your life around it, especially with kids", role: "FLT Driver", date: "Feb 2025" },
      { best: "Good site, the FLT work itself is satisfying", worst: "Management at the top have no idea what it's like on the floor. There's a real disconnect", role: "FLT Driver", date: "Nov 2024" },
    ],
    signals: [
      { status: null, label: null, detail: null, subtext: null, findingLabel: null, isFltLicenceSignal: true },
      { status: "warning", label: "Minimum 1 year counterbalance FLT experience required", detail: "XPO require at least a year of documented forklift operating experience. Reach truck experience is desirable but not essential.", subtext: null, findingLabel: null },
      { status: "bad", label: "74% don't get 4 weeks notice of shifts", detail: "Short notice of shifts is the strongest worker complaint at XPO.", subtext: "Based on 372 Breakroom Quiz responses", findingLabel: null },
    ],
    jd: [
      { label: "Job title", text: "FLT Driver (Counterbalance / Reach)" },
      { label: "Employer", text: "XPO Logistics (Direct Employer)" },
      { label: "Pay", text: "£14.50/hr" },
      { label: "Location", text: "Northampton, NN4" },
      { label: "Hours", text: "Full time, day shifts (Monday–Friday)" },
      { label: "Role description", text: "XPO Logistics is a global provider of transport and logistics solutions. We're looking for an experienced FLT Driver to join our Northampton distribution centre, operating counterbalance and reach trucks to support daily warehouse operations." },
      { label: "Responsibilities", text: "Operating counterbalance and reach forklift trucks safely; Loading and unloading HGV trailers; Moving and placing palletised stock; Completing vehicle pre-use checks; Maintaining accurate stock movement records; Adhering to health and safety procedures." },
      { label: "Requirements", text: "Valid RTITB or ITSSAR forklift licence — counterbalance essential, reach desirable; Minimum 1 year documented FLT operating experience; Good attention to detail; Physically fit; Right to work in the UK." },
      { label: "Benefits", text: "Competitive hourly rate; Pension scheme; 25 days holiday; Potential for overtime; Career development within a global business." },
    ],
  },
  // ── 5: Amazon Warehouse Team Leader ──────────────────────────────────────────
  {
    id: 5,
    title: "Warehouse Team Leader",
    company: "Amazon",
    companyUrl: "https://www.breakroom.cc/companies/amazon",
    companyType: "Employer",
    pay: "£34,320/yr",
    payType: "annual",
    payAlt: "≈ £16.50/hr",
    location: "Corby, NN18",
    coords: [52.490, -0.684],
    hours: "Full time",
    hoursSub: null,
    shifts: "Various shifts",
    rating: 7.5,
    quizCount: 3798,
    highlights: ["Living wage", "No last-minute shift changes", "No unpaid overtime"],
    listingUrl: "https://www.amazon.jobs/en-gb",
    altBadge: "↑ £4.02/hr",
    altReason: { text: "Leadership experience required" },
    payBenchmark: { rangeLow: 30000, rangeHigh: 38000, roleLabel: "warehouse team leaders in Northamptonshire" },
    findingDiffs: ["Higher pay", "Better rated employer"],
    requiresFltLicence: false,
    workStyle: { activity: "feet", teamwork: "team", public: false, outdoors: false, children: false },
    findings: {
      bad: [
        { pct: 84, label: "No sick pay", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people don't get sick pay", primary: "Most people don't get sick pay.", secondary: "84% of people say they wouldn't get paid if they were sick but scheduled to work.", why: "Everyone gets sick sometimes. At a good job you should still get paid if you're scheduled to work but can't due to sickness." },
        { pct: 75, label: "Short shift notice", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people don't get 4 weeks notice of when they're working", primary: "Most people don't get 4 weeks notice of when they're working.", secondary: "75% of people don't get 4 weeks notice of their shifts.", why: "At a good job, you get plenty of notice about when you're working. This makes it easy to plan the rest of your life and your finances." },
        { pct: 69, label: "Disconnected management", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Head office doesn't understand what's happening", primary: "Most people think head office doesn't understand what's happening.", secondary: "69% of people think that Amazon's head office doesn't have a good understanding of what's really happening where they work.", why: "At a good job, the role of head office should be to support the people on the frontline." },
      ],
      okay: [
        { pct: 41, label: "Shift changes can happen", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Shifts can get changed at short notice", primary: "Shifts can get changed at short notice.", secondary: "Some people say their shifts are occasionally changed at the last minute.", why: "Predictable shifts make it easier to plan your life." },
        { pct: 37, label: "Job satisfaction is mixed", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Only some people enjoy their job", primary: "Only some people enjoy their job.", secondary: "Around two thirds of people say they enjoy working here.", why: "Enjoying your work matters. It affects your health, motivation, and how long you stay in a job." },
        { pct: 46, label: "No choice of shifts", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Some people don't get enough choice over which shifts they work", primary: "Some people don't get enough choice over which shifts they work.", secondary: "Just over half of people say they get enough choice over their shifts.", why: "A good job is flexible around your personal life. This means you get a say in when you prefer to work." },
        { pct: 38, label: "Some stress at work", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Some people feel stressed here", primary: "Some people feel stressed here.", secondary: "Around half of people say they sometimes feel stressed at work.", why: "Your employer should support you with enough people and resources so you're not regularly feeling overwhelmed." },
        { pct: 39, label: "Support to progress is limited", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Only some people are given support to progress", primary: "Only some people are given support to progress.", secondary: "Around half of people say they're given support to learn new skills or take on more responsibility.", why: "A good job should help you progress at work, if you want to." },
        { pct: 39, label: "Unpaid breaks for some", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Only some people get paid breaks", primary: "Only some people get paid breaks.", secondary: "Just over half of people here get paid breaks.", why: "You should be paid for all the time you spend at work, including breaks." },
        { pct: 47, label: "Team recommendation is mixed", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Only some people recommend working with their team", primary: "Only some people recommend working with their team.", secondary: "Around half of people would recommend working with their immediate team.", why: "The people you work with every day really matter." },
        { pct: 42, label: "Communication could be better", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Only some people feel well informed about how the company is doing", primary: "Only some people feel well informed about how the company is doing.", secondary: "Less than two thirds of people feel well informed about how the company is doing.", why: "Being kept informed about the company helps you feel like a valued part of the business." },
      ],
      good: [
        { pct: 93, label: "Living wage", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people are paid a living wage", primary: "Most people are paid a living wage.", secondary: "93% of people say they are paid at or above the Real Living Wage for where they live.", why: "Everyone should be paid enough to live on." },
        { pct: 92, label: "No last-minute shift changes", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Shifts don't get changed at short notice", primary: "Shifts don't get changed at short notice.", secondary: "92% of people say their manager doesn't change their shifts at the last minute.", why: "If your manager is often changing your shifts at short notice that's a sign of poor planning." },
        { pct: 91, label: "Hours security", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people don't worry about their hours", primary: "Most people don't worry about their hours.", secondary: "91% of people report they don't worry about getting enough hours.", why: "At a good job, you shouldn't have to worry about getting enough hours each week." },
        { pct: 85, label: "No unpaid overtime", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people don't do unpaid extra work", primary: "Most people don't do unpaid extra work.", secondary: "85% of people report that they don't do extra unpaid work.", why: "Everyone should get paid for any extra work they do." },
        { pct: 80, label: "Proper breaks", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people get proper breaks", primary: "Most people get proper breaks.", secondary: "80% of people report that they get to take proper breaks.", why: "When you take a break it should be a proper rest." },
        { pct: 90, label: "Above average pay", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people are paid above average for their job", primary: "Most people are paid above average for their job.", secondary: "90% of people say they are paid above average for the type of work they do.", why: "Pay can vary a lot between similar jobs. Being paid above average means this employer is competitive on pay." },
        { pct: 84, label: "Safe workplace", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people think their workplace is safe", primary: "Most people think their workplace is safe.", secondary: "84% of people think their workplace is safe.", why: "Everyone has the right to work in a safe environment." },
        { pct: 75, label: "Good for carers", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most parents and carers say this is a good place to work", primary: "Most parents and carers say this is a good place to work.", secondary: "67% of parents and carers say Amazon is a good place to work.", why: "If you have caring responsibilities, flexibility and understanding from your employer is essential." },
        { pct: 75, label: "Treated with respect", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people feel treated with respect by their managers", primary: "Most people feel treated with respect by their managers.", secondary: "75% of people feel treated with respect by their managers.", why: "Everyone deserves to be treated with respect at work." },
        { pct: 75, label: "Good training", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people got enough training when they started", primary: "Most people got enough training when they started.", secondary: "75% of people say they got enough training when they started.", why: "Good training from day one helps you do your job well and feel confident at work." },
        { pct: 85, label: "Easy to book holiday", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people find it easy to book holiday", primary: "Most people find it easy to book holiday.", secondary: "85% of people say it's easy to book holiday.", why: "A good job should let you take time off when you need it." },
        { pct: 85, label: "Easy to take sick leave", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people find it easy to take sick leave", primary: "Most people find it easy to take sick leave.", secondary: "85% of people say it's easy to take sick leave when they need it.", why: "Being able to take sick leave when you need it is important for your health and wellbeing." },
        { pct: 83, label: "Hours match contract", subtext: "Based on 3,798 Breakroom Quiz responses", heading: "Most people work the same hours as their contract", primary: "Most people work the same hours as their contract.", secondary: "83% of people say they work the same number of hours as stated in their contract.", why: "Your contract should accurately reflect the hours you work." },
      ],
    },
    reviews: [
      { best: "Real responsibility, good pay, and the hours are always guaranteed — I'd recommend it to anyone with leadership experience", worst: "The targets trickle down relentlessly from above. You're always being pushed harder regardless of how well you're doing", role: "Team Leader", date: "Jan 2025" },
      { best: "Amazon look after their people better than most logistics employers I've worked for", worst: "Sick pay is still non-existent — for a company this size, there's no excuse", role: "Process Guide", date: "Oct 2024" },
    ],
    signals: [
      { status: "warning", label: "Team leader or supervisory experience required", detail: "Amazon require evidence of leading a team, coaching others, or first-line management. Promote-from-within candidates are welcome.", subtext: null, findingLabel: null, isBackgroundSignal: true },
      { status: "warning", label: "Working supervisor role — you manage a team while meeting your own targets", detail: "Amazon Team Leaders are hands-on. You'll be on the warehouse floor managing a team while also hitting your own productivity metrics.", subtext: null, findingLabel: null },
      { status: "good", label: "Amazon scores 7.5/10 — one of the better-rated warehouse employers", detail: "75% feel respected by managers, 90% earn above average for their role.", subtext: "Based on 3,798 Breakroom Quiz responses", findingLabel: null },
    ],
    jd: [
      { label: "Job title", text: "Warehouse Team Leader (Process Guide)" },
      { label: "Employer", text: "Amazon (Direct Employer)" },
      { label: "Pay", text: "£34,320/yr (approx. £16.50/hr)" },
      { label: "Location", text: "Corby, Northamptonshire, NN18" },
      { label: "Hours", text: "Full time — fixed shifts including days, nights, and weekends" },
      { label: "Role description", text: "Amazon Team Leaders (Process Guides) are working supervisors in our fulfilment centres. You'll lead a team of associates, drive productivity, and help maintain the standards that keep our customers happy. If you've led a team before and want to take the next step, this could be the role for you." },
      { label: "Responsibilities", text: "Leading and motivating a team of 15–20 warehouse associates; Monitoring team productivity and identifying improvements; Coaching associates on processes and safety; Managing attendance and escalating HR issues; Completing end-of-shift reporting." },
      { label: "Requirements", text: "Previous team leader, supervisor, or first-line management experience required; Strong communication and coaching skills; Confident with warehouse management systems; Comfortable on the warehouse floor for full shifts; Flexible to work a range of shifts." },
      { label: "Benefits", text: "Salary from £34,320/yr; Pension scheme; Employee discount; Career development and internal progression; Access to Amazon's learning and development programmes." },
    ],
  },
  // ── 6: Greencore Production Operative ────────────────────────────────────────
  {
    id: 6,
    title: "Production Operative",
    company: "Greencore",
    companyUrl: "https://www.breakroom.cc/companies/greencore",
    companyType: "Employer",
    pay: "£13.25/hr",
    payType: "hourly",
    payAlt: "≈ £27,560/yr",
    location: "Corby, NN17",
    coords: [52.475, -0.697],
    hours: "Full time",
    hoursSub: null,
    shifts: "Rotating shifts",
    rating: 7.2,
    quizCount: 320,
    highlights: ["No last-minute shift changes", "Hours security", "Proper breaks"],
    listingUrl: "https://www.greencore.com/careers",
    altBadge: "Better rated",
    altReason: null,
    payBenchmark: { rangeLow: 12, rangeHigh: 15, roleLabel: "production operatives in Northamptonshire" },
    findingDiffs: ["Better rated employer", "Above average pay"],
    requiresFltLicence: false,
    workStyle: { activity: "active", teamwork: "team", public: false, outdoors: false, children: false },
    findings: {
      bad: [
        { pct: 84, label: "No sick pay", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people don't get sick pay", primary: "Most people don't get sick pay.", secondary: "84% of people say they wouldn't get paid if they were sick but scheduled to work.", why: "Everyone gets sick sometimes. At a good job you should still get paid if you're scheduled to work but can't due to sickness." },
        { pct: 68, label: "Short shift notice", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people don't get 4 weeks notice of when they're working", primary: "Most people don't get 4 weeks notice of when they're working.", secondary: "68% of people don't get 4 weeks notice of their shifts.", why: "At a good job, you get plenty of notice about when you're working. This makes it easy to plan the rest of your life and your finances." },
        { pct: 79, label: "Disconnected management", subtext: "Based on 320 Breakroom Quiz responses", heading: "Head office doesn't understand what's happening", primary: "Most people think head office doesn't understand what's happening.", secondary: "79% of people think that Greencore's head office doesn't have a good understanding of what's really happening where they work.", why: "At a good job, the role of head office should be to support the people on the frontline." },
      ],
      okay: [
        { pct: 23, label: "Holiday booking can be tricky", subtext: "Based on 320 Breakroom Quiz responses", heading: "Some people find it hard to book holiday", primary: "Some people find it hard to book holiday.", secondary: "Around a quarter of people say they find it hard to book time off.", why: "A good job should let you take time off when you need it without jumping through hoops." },
        { pct: 50, label: "Shift changes can happen", subtext: "Based on 320 Breakroom Quiz responses", heading: "Shifts can get changed at short notice", primary: "Shifts can get changed at short notice.", secondary: "Around half of people say their shifts are occasionally changed at the last minute.", why: "Predictable shifts make it easier to plan your life." },
        { pct: 29, label: "Sick leave isn't always easy", subtext: "Based on 320 Breakroom Quiz responses", heading: "Some people find it hard to take sick leave", primary: "Some people find it hard to take sick leave.", secondary: "Around a third of people say taking sick leave isn't straightforward.", why: "Being able to take sick leave when you need it is important for your health and wellbeing." },
        { pct: 48, label: "Job satisfaction is mixed", subtext: "Based on 320 Breakroom Quiz responses", heading: "Only some people enjoy their job", primary: "Only some people enjoy their job.", secondary: "Around half of people say they enjoy working here.", why: "Enjoying your work matters. It affects your health, motivation, and how long you stay in a job." },
        { pct: 39, label: "Some choice of shifts", subtext: "Based on 320 Breakroom Quiz responses", heading: "Some people don't get enough choice over which shifts they work", primary: "Some people don't get enough choice over which shifts they work.", secondary: "Around two fifths of people say they don't get enough choice over their shifts.", why: "A good job is flexible around your personal life." },
        { pct: 46, label: "Training could be better", subtext: "Based on 320 Breakroom Quiz responses", heading: "Some people didn't get enough training when they started", primary: "Some people didn't get enough training when they started.", secondary: "Around half of people felt they didn't get enough training when they joined.", why: "Good training from day one helps you do your job well and feel confident at work." },
        { pct: 37, label: "Some stress at work", subtext: "Based on 320 Breakroom Quiz responses", heading: "Some people feel stressed here", primary: "Some people feel stressed here.", secondary: "Around a third of people say they often feel stressed at work.", why: "Your employer should support you so you're not regularly feeling overwhelmed." },
        { pct: 37, label: "Mixed support for carers", subtext: "Based on 320 Breakroom Quiz responses", heading: "Only some parents and carers say this is a good place to work", primary: "Only some parents and carers say this is a good place to work.", secondary: "Less than two thirds of parents and carers say Greencore is a good place to work.", why: "If you have caring responsibilities, flexibility and understanding from your employer is essential." },
        { pct: 48, label: "Unpaid breaks for some", subtext: "Based on 320 Breakroom Quiz responses", heading: "Only some people get paid breaks", primary: "Only some people get paid breaks.", secondary: "Just over half of people here get paid breaks.", why: "You should be paid for all the time you spend at work, including breaks." },
        { pct: 42, label: "Support to progress is limited", subtext: "Based on 320 Breakroom Quiz responses", heading: "Only some people are given support to progress", primary: "Only some people are given support to progress.", secondary: "Around two fifths of people say they're given support to learn new skills or take on more responsibility.", why: "A good job should help you progress at work, if you want to." },
        { pct: 45, label: "Team recommendation is mixed", subtext: "Based on 320 Breakroom Quiz responses", heading: "Only some people recommend working with their team", primary: "Only some people recommend working with their team.", secondary: "Around half of people would recommend working with their immediate team.", why: "The people you work with every day really matter." },
        { pct: 41, label: "Communication could be better", subtext: "Based on 320 Breakroom Quiz responses", heading: "Only some people feel well informed about how the company is doing", primary: "Only some people feel well informed about how the company is doing.", secondary: "Around two fifths of people feel well informed about how the company is doing.", why: "Being kept informed about the company helps you feel like a valued part of the business." },
      ],
      good: [
        { pct: 93, label: "No last-minute shift changes", subtext: "Based on 320 Breakroom Quiz responses", heading: "Shifts don't get changed at short notice", primary: "Shifts don't get changed at short notice.", secondary: "93% of people say their manager doesn't change their shifts at the last minute.", why: "If your manager is often changing your shifts at short notice that's a sign of poor planning." },
        { pct: 91, label: "Living wage", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people are paid a living wage", primary: "Most people are paid a living wage.", secondary: "91% of people say they are paid at or above the Real Living Wage for where they live.", why: "Everyone should be paid enough to live on." },
        { pct: 89, label: "Hours security", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people don't worry about their hours", primary: "Most people don't worry about their hours.", secondary: "89% of people report they don't worry about getting enough hours.", why: "At a good job, you shouldn't have to worry about getting enough hours each week." },
        { pct: 81, label: "Proper breaks", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people get proper breaks", primary: "Most people get proper breaks.", secondary: "81% of people report that they get to take proper breaks.", why: "When you take a break it should be a proper rest." },
        { pct: 83, label: "No unpaid overtime", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people don't do unpaid extra work", primary: "Most people don't do unpaid extra work.", secondary: "83% of people report that they don't do extra unpaid work.", why: "Everyone should get paid for any extra work they do." },
        { pct: 74, label: "Above average pay", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people are paid above average for their job", primary: "Most people are paid above average for their job.", secondary: "74% of people say they are paid above average for the type of work they do.", why: "Pay can vary a lot between similar jobs. Being paid above average means this employer is competitive on pay." },
        { pct: 80, label: "Safe workplace", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people think their workplace is safe", primary: "Most people think their workplace is safe.", secondary: "80% of people think their workplace is safe.", why: "Everyone has the right to work in a safe environment." },
        { pct: 77, label: "Easy to book holiday", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people find it easy to book holiday", primary: "Most people find it easy to book holiday.", secondary: "77% of people say it's easy to book holiday.", why: "A good job should let you take time off when you need it." },
        { pct: 71, label: "Easy to take sick leave", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people find it easy to take sick leave", primary: "Most people find it easy to take sick leave.", secondary: "71% of people say it's easy to take sick leave when they need it.", why: "Being able to take sick leave when you need it is important for your health and wellbeing." },
        { pct: 80, label: "Hours match contract", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people work the same hours as their contract", primary: "Most people work the same hours as their contract.", secondary: "80% of people say they work the same number of hours as stated in their contract.", why: "Your contract should accurately reflect the hours you work." },
        { pct: 69, label: "Treated with respect", subtext: "Based on 320 Breakroom Quiz responses", heading: "Most people feel treated with respect by their managers", primary: "Most people feel treated with respect by their managers.", secondary: "69% of people feel treated with respect by their managers.", why: "Everyone deserves to be treated with respect at work." },
      ],
    },
    reviews: [
      { best: "Breaks are proper breaks, shifts don't change on you, and the pay is decent for the area. It's a good place to work", worst: "The lines can be really physical and repetitive, and head office doesn't really understand what it's like on the floor", role: "Production Operative", date: "Mar 2025" },
      { best: "Team atmosphere here is genuinely good — people look out for each other", worst: "No sick pay is a real problem. When people come in ill it affects the whole team", role: "Production Operative", date: "Dec 2024" },
    ],
    signals: [
      { status: "good", label: "No experience required — full training provided from day one", detail: "Greencore train you on food safety and production processes from day one. A Level 2 Food Hygiene certificate is preferred but Greencore can support you to get it.", subtext: null, findingLabel: null, isBackgroundSignal: true },
      { status: "good", label: "74% of Greencore workers earn above average for their role", detail: "Pay is genuinely competitive for production work in this area — one of Greencore's strongest Breakroom findings.", subtext: "Based on 320 Breakroom Quiz responses", findingLabel: null },
    ],
    jd: [
      { label: "Job title", text: "Production Operative" },
      { label: "Employer", text: "Greencore (Direct Employer)" },
      { label: "Pay", text: "£13.25/hr" },
      { label: "Location", text: "Corby, Northamptonshire, NN17" },
      { label: "Hours", text: "Full time, rotating shifts (days, afternoons, and nights)" },
      { label: "Role description", text: "Greencore is one of the UK's leading manufacturers of convenience food. At our Corby site we produce chilled meals for major supermarkets. We're looking for Production Operatives to join our teams — no prior food production experience is needed, just a positive attitude and willingness to learn." },
      { label: "Responsibilities", text: "Working on production lines making chilled food products; Operating food processing equipment; Ensuring products meet quality and safety standards; Following hygiene and food safety procedures at all times; Assisting with cleaning and changeovers; Maintaining accurate production records." },
      { label: "Requirements", text: "No previous food production experience required — full training provided; Level 2 Food Hygiene certificate preferred (Greencore can support you to obtain this); Able to work in a chilled environment; Physically fit and able to stand for extended periods; Team player with reliable attendance." },
      { label: "Benefits", text: "Competitive pay; Company pension; 33 days holiday (including bank holidays); Free on-site meals during shifts; Colleague discounts; Opportunities for skill development and promotion." },
    ],
  },
  // ── 7: Royal Mail Parcel Sorter ───────────────────────────────────────────────
  {
    id: 7,
    title: "Parcel Sorter",
    company: "Royal Mail",
    companyUrl: "https://www.breakroom.cc/companies/royal-mail",
    companyType: "Employer",
    pay: "£13.15/hr",
    payType: "hourly",
    payAlt: "≈ £27,352/yr",
    location: "Wellingborough, NN8",
    coords: [52.297, -0.691],
    hours: "Full time",
    hoursSub: null,
    shifts: "Early mornings",
    rating: 5.5,
    quizCount: 3650,
    highlights: ["Living wage", "Hours security", "No unpaid overtime"],
    listingUrl: "https://www.royalmailgroup.com/en/careers",
    altBadge: "↑ £0.67/hr",
    altReason: null,
    payBenchmark: { rangeLow: 11.5, rangeHigh: 14, roleLabel: "parcel sorters in Northamptonshire" },
    findingDiffs: ["Better sick pay cover"],
    requiresFltLicence: false,
    workStyle: { activity: "active", teamwork: "team", public: false, outdoors: false, children: false },
    findings: {
      bad: [
        { pct: 88, label: "Short shift notice", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Most people don't get 4 weeks notice of when they're working", primary: "Most people don't get 4 weeks notice of when they're working.", secondary: "88% of people don't get 4 weeks notice of their shifts.", why: "At a good job, you get plenty of notice about when you're working. This makes it easy to plan the rest of your life and your finances." },
        { pct: 77, label: "No support to progress", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Most people aren't given support to progress", primary: "Most people aren't given support to progress.", secondary: "77% of people report not being given an opportunity to get better at their job or learn new skills.", why: "A good job should help you progress at work, if you want to." },
        { pct: 87, label: "Disconnected management", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Head office doesn't understand what's happening", primary: "Most people think head office doesn't understand what's happening.", secondary: "87% of people think that Royal Mail's head office doesn't have a good understanding of what's really happening where they work.", why: "At a good job, the role of head office should be to support the people on the frontline." },
      ],
      okay: [
        { pct: 47, label: "Hours can exceed contract", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Some people work a lot more hours than their contract", primary: "Some people work a lot more hours than their contract.", secondary: "Around half of people work significantly more hours than stated in their contract.", why: "Your contract should accurately reflect the hours you work." },
        { pct: 42, label: "Holiday booking can be tricky", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Some people find it hard to book holiday", primary: "Some people find it hard to book holiday.", secondary: "Around two fifths of people say they find it hard to book time off.", why: "A good job should let you take time off when you need it without jumping through hoops." },
        { pct: 42, label: "Shift changes can happen", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Shifts can get changed at short notice", primary: "Shifts can get changed at short notice.", secondary: "Around two fifths of people say their shifts are occasionally changed at the last minute.", why: "Predictable shifts make it easier to plan your life." },
        { pct: 36, label: "Some sick pay available", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Only some people get sick pay", primary: "Only some people get sick pay.", secondary: "Just over half of people say they would be paid if sick but scheduled to work.", why: "Everyone gets sick sometimes. At a good job you should still get paid if you're scheduled to work but can't due to sickness." },
        { pct: 36, label: "Sick leave isn't always easy", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Some people find it hard to take sick leave", primary: "Some people find it hard to take sick leave.", secondary: "Around a third of people say taking sick leave isn't straightforward.", why: "Being able to take sick leave when you need it is important for your health and wellbeing." },
        { pct: 47, label: "No choice of shifts", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Some people don't get enough choice over which shifts they work", primary: "Some people don't get enough choice over which shifts they work.", secondary: "Around half of people say they don't get enough choice over their shifts.", why: "A good job is flexible around your personal life." },
        { pct: 41, label: "Training could be better", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Some people didn't get enough training when they started", primary: "Some people didn't get enough training when they started.", secondary: "Around two fifths of people felt they didn't get enough training when they joined.", why: "Good training from day one helps you do your job well and feel confident at work." },
        { pct: 47, label: "Some stress at work", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Some people feel stressed here", primary: "Some people feel stressed here.", secondary: "Around half of people say they sometimes feel stressed at work.", why: "Your employer should support you so you're not regularly feeling overwhelmed." },
        { pct: 49, label: "Mixed support for carers", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Only some parents and carers say this is a good place to work", primary: "Only some parents and carers say this is a good place to work.", secondary: "Around half of parents and carers say Royal Mail is a good place to work.", why: "If you have caring responsibilities, flexibility and understanding from your employer is essential." },
        { pct: 44, label: "Unpaid breaks for some", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Only some people get paid breaks", primary: "Only some people get paid breaks.", secondary: "Around half of people here get paid breaks.", why: "You should be paid for all the time you spend at work, including breaks." },
        { pct: 60, label: "Pay is around average", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Only some people are paid above average for their job", primary: "Only some people are paid above average for their job.", secondary: "Around two thirds of people say they are paid below average for the type of work they do.", why: "Check what other employers in the area are paying for similar work." },
        { pct: 40, label: "Team recommendation is mixed", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Only some people recommend working with their team", primary: "Only some people recommend working with their team.", secondary: "Around two fifths of people would recommend working with their immediate team.", why: "The people you work with every day really matter." },
        { pct: 48, label: "Proper breaks not guaranteed", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Some people don't get proper breaks", primary: "Some people don't get proper breaks.", secondary: "Around half of people say they don't always get to take proper breaks.", why: "When you take a break it should be a proper rest." },
        { pct: 37, label: "Respect from managers varies", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Some people don't feel treated with respect by their managers", primary: "Some people don't feel treated with respect by their managers.", secondary: "Around a third of people don't feel treated with full respect by their managers.", why: "Everyone deserves to be treated with respect at work." },
        { pct: 40, label: "Communication could be better", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Only some people feel well informed about how the company is doing", primary: "Only some people feel well informed about how the company is doing.", secondary: "Around two fifths of people feel well informed about how the company is doing.", why: "Being kept informed about the company helps you feel like a valued part of the business." },
      ],
      good: [
        { pct: 90, label: "Living wage", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Most people are paid a living wage", primary: "Most people are paid a living wage.", secondary: "90% of people say they are paid at or above the Real Living Wage for where they live.", why: "Everyone should be paid enough to live on." },
        { pct: 82, label: "Hours security", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Most people don't worry about their hours", primary: "Most people don't worry about their hours.", secondary: "82% of people report they don't worry about getting enough hours.", why: "At a good job, you shouldn't have to worry about getting enough hours each week." },
        { pct: 79, label: "No unpaid overtime", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Most people don't do unpaid extra work", primary: "Most people don't do unpaid extra work.", secondary: "79% of people report that they don't do extra unpaid work.", why: "Everyone should get paid for any extra work they do." },
        { pct: 68, label: "No last-minute shift changes", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Shifts don't get changed at short notice", primary: "Shifts don't get changed at short notice.", secondary: "68% of people say their manager doesn't change their shifts at the last minute.", why: "If your manager is often changing your shifts at short notice that's a sign of poor planning." },
        { pct: 74, label: "Safe workplace", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Most people think their workplace is safe", primary: "Most people think their workplace is safe.", secondary: "74% of people think their workplace is safe.", why: "Everyone has the right to work in a safe environment." },
        { pct: 67, label: "Most people enjoy their job", subtext: "Based on 3,650 Breakroom Quiz responses", heading: "Most people enjoy their job", primary: "Most people enjoy their job.", secondary: "67% of people say they enjoy working here.", why: "Enjoying your work matters. It affects your health, motivation, and how long you stay in a job." },
      ],
    },
    reviews: [
      { best: "You're done by early afternoon which suits my life. The job is what they say it is — no surprises", worst: "The early starts every day wear on you, especially in winter. And management at the top have completely lost touch with what it's like on the ground", role: "Parcel Sorter", date: "Feb 2025" },
      { best: "Hours are always there and you're not expected to stay late or do unpaid work", worst: "There's very little support for progressing. I've been here three years and nothing has changed", role: "Mail Sorter", date: "Sep 2024" },
    ],
    signals: [
      { status: "good", label: "No qualifications required — Royal Mail trains you", detail: "No previous experience needed. Royal Mail provide a full induction and on-the-job training.", subtext: null, findingLabel: null, isBackgroundSignal: true },
      { status: "warning", label: "Unsocial hours — shifts typically start at 05:00 or earlier", detail: "Parcel sorting operations run in the early hours to meet delivery schedules. Reliable transport at unsocial hours is essential.", subtext: null, findingLabel: null },
      { status: "good", label: "54% of Royal Mail workers would get paid if sick — better than most", detail: "Royal Mail is one of the few logistics employers where over half of workers have access to sick pay.", subtext: "Based on 3,650 Breakroom Quiz responses", findingLabel: null },
    ],
    jd: [
      { label: "Job title", text: "Parcel Sorter (Delivery Office)" },
      { label: "Employer", text: "Royal Mail (Direct Employer)" },
      { label: "Pay", text: "£13.15/hr" },
      { label: "Location", text: "Wellingborough Delivery Office, Northamptonshire, NN8" },
      { label: "Hours", text: "Full time, early start (typically 05:00–13:00)" },
      { label: "Role description", text: "Royal Mail is the UK's postal service, delivering letters and parcels across the country every day. At our Wellingborough delivery office, Parcel Sorters play a vital role in getting the mail ready for delivery — physical, fast-paced work that makes a real difference." },
      { label: "Responsibilities", text: "Sorting incoming parcels and letters by delivery route; Preparing mail for delivery rounds; Operating scanning equipment; Loading and unloading delivery vehicles; Keeping the sorting area clean and organised; Meeting daily throughput targets." },
      { label: "Requirements", text: "No previous experience required; Must be able to lift and carry items up to 20kg; Reliable attendance — early starts are essential; Comfortable working in a busy, fast-paced environment; Right to work in the UK." },
      { label: "Benefits", text: "Competitive hourly rate; Pension scheme; 25 days holiday plus bank holidays; Sick pay scheme (eligibility criteria apply); Employee discount and perks." },
    ],
  },
  // ── 8: Evri Parcel Hub Operative ─────────────────────────────────────────────
  {
    id: 8,
    title: "Parcel Hub Operative",
    company: "Evri",
    companyUrl: "https://www.breakroom.cc/companies/evri",
    companyType: "Employer",
    pay: "£11.85/hr",
    payType: "hourly",
    payAlt: null,
    location: "Corby, NN18",
    coords: [52.490, -0.684],
    hours: "Various",
    hoursSub: null,
    shifts: "Various shifts",
    rating: 4.9,
    quizCount: 609,
    highlights: ["Hours security", "No unpaid overtime"],
    listingUrl: "https://careers.evri.com",
    altBadge: null,
    altReason: null,
    payBenchmark: { rangeLow: 12, rangeHigh: 14, roleLabel: "parcel hub operatives in Northamptonshire" },
    findingDiffs: [],
    requiresFltLicence: false,
    workStyle: { activity: "active", teamwork: "team", public: false, outdoors: false, children: false },
    findings: {
      bad: [
        { pct: 88, label: "Short shift notice", subtext: "Based on 609 Breakroom Quiz responses", heading: "Most people don't get 4 weeks notice of when they're working", primary: "Most people don't get 4 weeks notice of when they're working.", secondary: "88% of people don't get 4 weeks notice of their shifts.", why: "At a good job, you get plenty of notice about when you're working. This makes it easy to plan the rest of your life and your finances." },
        { pct: 77, label: "No support to progress", subtext: "Based on 609 Breakroom Quiz responses", heading: "Most people aren't given support to progress", primary: "Most people aren't given support to progress.", secondary: "77% of people report not being given an opportunity to get better at their job or learn new skills.", why: "A good job should help you progress at work, if you want to." },
        { pct: 87, label: "Disconnected management", subtext: "Based on 609 Breakroom Quiz responses", heading: "Head office doesn't understand what's happening", primary: "Most people think head office doesn't understand what's happening.", secondary: "87% of people think that the head office doesn't have a good understanding of what's really happening where they work.", why: "At a good job, the role of head office should be to support the people on the frontline." },
      ],
      okay: [
        { pct: 47, label: "Hours can exceed contract", subtext: "Based on 609 Breakroom Quiz responses", heading: "Some people work a lot more hours than their contract", primary: "Some people work a lot more hours than their contract.", secondary: "Around half of people work significantly more hours than stated in their contract.", why: "Your contract should accurately reflect the hours you work." },
        { pct: 42, label: "Holiday booking can be tricky", subtext: "Based on 609 Breakroom Quiz responses", heading: "Some people find it hard to book holiday", primary: "Some people find it hard to book holiday.", secondary: "Around two fifths of people say they find it hard to book time off.", why: "A good job should let you take time off when you need it without jumping through hoops." },
        { pct: 42, label: "Shift changes can happen", subtext: "Based on 609 Breakroom Quiz responses", heading: "Shifts can get changed at short notice", primary: "Shifts can get changed at short notice.", secondary: "Around two fifths of people say their shifts are occasionally changed at the last minute.", why: "Predictable shifts make it easier to plan your life." },
        { pct: 36, label: "Some sick pay available", subtext: "Based on 609 Breakroom Quiz responses", heading: "Only some people get sick pay", primary: "Only some people get sick pay.", secondary: "Just over half of people say they would be paid if sick but scheduled to work.", why: "Everyone gets sick sometimes. At a good job you should still get paid if you're scheduled to work but can't due to sickness." },
        { pct: 36, label: "Sick leave isn't always easy", subtext: "Based on 609 Breakroom Quiz responses", heading: "Some people find it hard to take sick leave", primary: "Some people find it hard to take sick leave.", secondary: "Around a third of people say taking sick leave isn't straightforward.", why: "Being able to take sick leave when you need it is important for your health and wellbeing." },
        { pct: 47, label: "No choice of shifts", subtext: "Based on 609 Breakroom Quiz responses", heading: "Some people don't get enough choice over which shifts they work", primary: "Some people don't get enough choice over which shifts they work.", secondary: "Around half of people say they don't get enough choice over their shifts.", why: "A good job is flexible around your personal life." },
        { pct: 41, label: "Training could be better", subtext: "Based on 609 Breakroom Quiz responses", heading: "Some people didn't get enough training when they started", primary: "Some people didn't get enough training when they started.", secondary: "Around two fifths of people felt they didn't get enough training when they joined.", why: "Good training from day one helps you do your job well and feel confident at work." },
        { pct: 47, label: "Some stress at work", subtext: "Based on 609 Breakroom Quiz responses", heading: "Some people feel stressed here", primary: "Some people feel stressed here.", secondary: "Around half of people say they sometimes feel stressed at work.", why: "Your employer should support you so you're not regularly feeling overwhelmed." },
        { pct: 49, label: "Mixed support for carers", subtext: "Based on 609 Breakroom Quiz responses", heading: "Only some parents and carers say this is a good place to work", primary: "Only some parents and carers say this is a good place to work.", secondary: "Around half of parents and carers say this is a good place to work.", why: "If you have caring responsibilities, flexibility and understanding from your employer is essential." },
        { pct: 44, label: "Unpaid breaks for some", subtext: "Based on 609 Breakroom Quiz responses", heading: "Only some people get paid breaks", primary: "Only some people get paid breaks.", secondary: "Around half of people here get paid breaks.", why: "You should be paid for all the time you spend at work, including breaks." },
        { pct: 60, label: "Pay is around average", subtext: "Based on 609 Breakroom Quiz responses", heading: "Only some people are paid above average for their job", primary: "Only some people are paid above average for their job.", secondary: "Around two thirds of people say they are paid below average for the type of work they do.", why: "Check what other employers in the area are paying for similar work." },
        { pct: 40, label: "Team recommendation is mixed", subtext: "Based on 609 Breakroom Quiz responses", heading: "Only some people recommend working with their team", primary: "Only some people recommend working with their team.", secondary: "Around two fifths of people would recommend working with their immediate team.", why: "The people you work with every day really matter." },
        { pct: 48, label: "Proper breaks not guaranteed", subtext: "Based on 609 Breakroom Quiz responses", heading: "Some people don't get proper breaks", primary: "Some people don't get proper breaks.", secondary: "Around half of people say they don't always get to take proper breaks.", why: "When you take a break it should be a proper rest." },
        { pct: 37, label: "Respect from managers varies", subtext: "Based on 609 Breakroom Quiz responses", heading: "Some people don't feel treated with respect by their managers", primary: "Some people don't feel treated with respect by their managers.", secondary: "Around a third of people don't feel treated with full respect by their managers.", why: "Everyone deserves to be treated with respect at work." },
        { pct: 40, label: "Communication could be better", subtext: "Based on 609 Breakroom Quiz responses", heading: "Only some people feel well informed about how the company is doing", primary: "Only some people feel well informed about how the company is doing.", secondary: "Around two fifths of people feel well informed about how the company is doing.", why: "Being kept informed about the company helps you feel like a valued part of the business." },
      ],
      good: [
        { pct: 90, label: "Living wage", subtext: "Based on 609 Breakroom Quiz responses", heading: "Most people are paid a living wage", primary: "Most people are paid a living wage.", secondary: "90% of people say they are paid at or above the Real Living Wage for where they live.", why: "Everyone should be paid enough to live on." },
        { pct: 82, label: "Hours security", subtext: "Based on 609 Breakroom Quiz responses", heading: "Most people don't worry about their hours", primary: "Most people don't worry about their hours.", secondary: "82% of people report they don't worry about getting enough hours.", why: "At a good job, you shouldn't have to worry about getting enough hours each week." },
        { pct: 79, label: "No unpaid overtime", subtext: "Based on 609 Breakroom Quiz responses", heading: "Most people don't do unpaid extra work", primary: "Most people don't do unpaid extra work.", secondary: "79% of people report that they don't do extra unpaid work.", why: "Everyone should get paid for any extra work they do." },
        { pct: 68, label: "No last-minute shift changes", subtext: "Based on 609 Breakroom Quiz responses", heading: "Shifts don't get changed at short notice", primary: "Shifts don't get changed at short notice.", secondary: "68% of people say their manager doesn't change their shifts at the last minute.", why: "If your manager is often changing your shifts at short notice that's a sign of poor planning." },
        { pct: 74, label: "Safe workplace", subtext: "Based on 609 Breakroom Quiz responses", heading: "Most people think their workplace is safe", primary: "Most people think their workplace is safe.", secondary: "74% of people think their workplace is safe.", why: "Everyone has the right to work in a safe environment." },
        { pct: 67, label: "Most people enjoy their job", subtext: "Based on 609 Breakroom Quiz responses", heading: "Most people enjoy their job", primary: "Most people enjoy their job.", secondary: "67% of people say they enjoy working here.", why: "Enjoying your work matters. It affects your health, motivation, and how long you stay in a job." },
      ],
    },
    reviews: [
      { best: "You can pick up extra hours when you need them, and holiday booking isn't a nightmare like at other places I've worked", worst: "80% of us are stressed — it genuinely gets to you after a while. The pace never lets up and there's no support", role: "Parcel Hub Operative", date: "Jan 2025" },
      { best: "The hours are always there if you want them", worst: "No sick pay, no breaks that are paid, short notice of shifts — it all adds up. You feel like a number not a person", role: "Hub Operative", date: "Nov 2024" },
    ],
    signals: [
      { status: "bad", label: "37% of Evri workers are on zero-hours contracts — check before accepting", detail: "Over a third of Evri workers have no guaranteed hours. Make sure you understand what contract type you're being offered before accepting.", subtext: "Based on 609 Breakroom Quiz responses", findingLabel: null },
      { status: "warning", label: "Physical role — parcels up to 31.5kg, standing for the full shift", detail: "Parcel hub work involves continuous lifting and sorting. A basic level of physical fitness is required.", subtext: null, findingLabel: null },
      { status: "bad", label: "88% of workers here don't get 4 weeks notice of shifts", detail: "Short shift notice is among the worst findings here — almost nine in ten workers don't get 4 weeks notice.", subtext: "Based on 609 Breakroom Quiz responses", findingLabel: null },
    ],
    jd: [
      { label: "Job title", text: "Parcel Hub Operative" },
      { label: "Employer", text: "Evri (Direct Employer)" },
      { label: "Pay", text: "£11.85/hr" },
      { label: "Location", text: "Corby, Northamptonshire, NN18" },
      { label: "Hours", text: "Flexible hours — full time and part time available; days, nights, and weekends" },
      { label: "Role description", text: "Evri is one of the UK's largest parcel delivery businesses. At our Corby hub, you'll be part of the team that keeps parcels moving through our network — sorting, scanning, and loading in a fast-paced environment." },
      { label: "Responsibilities", text: "Sorting and scanning parcels on a moving belt; Loading and unloading trailers; Using handheld scanning equipment; Meeting hourly throughput targets; Following health and safety procedures." },
      { label: "Requirements", text: "No previous experience required; Able to lift parcels up to 31.5kg; Comfortable standing and moving for the full shift; Flexible with shift times; Right to work in the UK." },
      { label: "Please note", text: "Contract types vary — full time, part time, and zero-hours contracts are offered. Please check the contract type before accepting any offer." },
      { label: "Benefits", text: "Flexible hours; Weekly pay; Staff discount on Evri deliveries; Free on-site parking." },
    ],
  },
  // ── 9: Clipper Logistics Pick & Pack ──────────────────────────────────────────
  {
    id: 9,
    title: "Pick & Pack Operative",
    company: "Clipper Logistics",
    companyUrl: "https://www.breakroom.cc/companies/clipper-logistics",
    companyType: "Employer",
    pay: "£12.10/hr",
    payType: "hourly",
    payAlt: null,
    location: "Corby, NN17",
    coords: [52.475, -0.697],
    hours: "Full time",
    hoursSub: null,
    shifts: "Day shifts",
    rating: 6.0,
    quizCount: 107,
    highlights: ["No last-minute shift changes", "Hours security"],
    listingUrl: "https://www.clipperlogistics.com/careers",
    altBadge: null,
    altReason: null,
    payBenchmark: { rangeLow: 12, rangeHigh: 14, roleLabel: "pick & pack operatives in Northamptonshire" },
    findingDiffs: [],
    requiresFltLicence: false,
    workStyle: { activity: "active", teamwork: "team", public: false, outdoors: false, children: false },
    findings: {
      bad: [
        { pct: 74, label: "Below average pay", subtext: "Based on 107 Breakroom Quiz responses", heading: "Most people are paid less than average for their job", primary: "Most people are paid less than average for their job.", secondary: "74% of people are paid below average for the type of work they do.", why: "Pay can vary a lot between similar jobs. Many employers in this area pay more for pick & pack work." },
        { pct: 90, label: "No sick pay", subtext: "Based on 107 Breakroom Quiz responses", heading: "Most people don't get sick pay", primary: "Most people don't get sick pay.", secondary: "90% of people say they wouldn't get paid if they were sick but scheduled to work.", why: "Everyone gets sick sometimes. At a good job you should still get paid if you're scheduled to work but can't due to sickness." },
        { pct: 65, label: "Short shift notice", subtext: "Based on 107 Breakroom Quiz responses", heading: "Most people don't get 4 weeks notice of when they're working", primary: "Most people don't get 4 weeks notice of when they're working.", secondary: "65% of people don't get 4 weeks notice of their shifts.", why: "At a good job, you get plenty of notice about when you're working. This makes it easy to plan the rest of your life and your finances." },
        { pct: 69, label: "Stressful work", subtext: "Based on 107 Breakroom Quiz responses", heading: "Most people feel stressed here", primary: "Most people feel stressed here.", secondary: "69% of people say they often feel stressed at work.", why: "Your employer should support you with enough people and resources so you're not regularly feeling overwhelmed." },
        { pct: 88, label: "Disconnected management", subtext: "Based on 107 Breakroom Quiz responses", heading: "Head office doesn't understand what's happening", primary: "Most people think head office doesn't understand what's happening.", secondary: "88% of people think that Clipper's head office doesn't have a good understanding of what's really happening where they work.", why: "At a good job, the role of head office should be to support the people on the frontline." },
      ],
      okay: [
        { pct: 38, label: "Holiday booking can be tricky", subtext: "Based on 107 Breakroom Quiz responses", heading: "Some people find it hard to book holiday", primary: "Some people find it hard to book holiday.", secondary: "Around a third of people say they find it hard to book time off.", why: "A good job should let you take time off when you need it without jumping through hoops." },
        { pct: 38, label: "Shift changes can happen", subtext: "Based on 107 Breakroom Quiz responses", heading: "Shifts can get changed at short notice", primary: "Shifts can get changed at short notice.", secondary: "Some people say their shifts are occasionally changed at the last minute.", why: "Predictable shifts make it easier to plan your life." },
        { pct: 48, label: "Sick leave isn't always easy", subtext: "Based on 107 Breakroom Quiz responses", heading: "Some people find it hard to take sick leave", primary: "Some people find it hard to take sick leave.", secondary: "Around half of people say taking sick leave isn't straightforward.", why: "Being able to take sick leave when you need it is important for your health and wellbeing." },
        { pct: 44, label: "Job satisfaction is mixed", subtext: "Based on 107 Breakroom Quiz responses", heading: "Only some people enjoy their job", primary: "Only some people enjoy their job.", secondary: "Around half of people say they enjoy working here.", why: "Enjoying your work matters. It affects your health, motivation, and how long you stay in a job." },
        { pct: 34, label: "Some choice of shifts", subtext: "Based on 107 Breakroom Quiz responses", heading: "Some people don't get enough choice over which shifts they work", primary: "Some people don't get enough choice over which shifts they work.", secondary: "Around two thirds of people say they get enough choice over their shifts.", why: "A good job is flexible around your personal life." },
        { pct: 50, label: "Training could be better", subtext: "Based on 107 Breakroom Quiz responses", heading: "Some people didn't get enough training when they started", primary: "Some people didn't get enough training when they started.", secondary: "Around half of people felt they didn't get enough training when they joined.", why: "Good training from day one helps you do your job well and feel confident at work." },
        { pct: 40, label: "Mixed support for carers", subtext: "Based on 107 Breakroom Quiz responses", heading: "Only some parents and carers say this is a good place to work", primary: "Only some parents and carers say this is a good place to work.", secondary: "Less than two thirds of parents and carers say Clipper is a good place to work.", why: "If you have caring responsibilities, flexibility and understanding from your employer is essential." },
        { pct: 36, label: "Unpaid breaks for some", subtext: "Based on 107 Breakroom Quiz responses", heading: "Only some people get paid breaks", primary: "Only some people get paid breaks.", secondary: "Around a third of people here get paid breaks.", why: "You should be paid for all the time you spend at work, including breaks." },
        { pct: 36, label: "Support to progress is limited", subtext: "Based on 107 Breakroom Quiz responses", heading: "Only some people are given support to progress", primary: "Only some people are given support to progress.", secondary: "Around a third of people say they're given support to learn new skills or take on more responsibility.", why: "A good job should help you progress at work, if you want to." },
        { pct: 42, label: "Team recommendation is mixed", subtext: "Based on 107 Breakroom Quiz responses", heading: "Only some people recommend working with their team", primary: "Only some people recommend working with their team.", secondary: "Around two fifths of people would recommend working with their immediate team.", why: "The people you work with every day really matter." },
        { pct: 44, label: "Respect from managers varies", subtext: "Based on 107 Breakroom Quiz responses", heading: "Some people don't feel treated with respect by their managers", primary: "Some people don't feel treated with respect by their managers.", secondary: "Around half of people don't feel treated with full respect by their managers.", why: "Everyone deserves to be treated with respect at work." },
        { pct: 38, label: "Hours can exceed contract", subtext: "Based on 107 Breakroom Quiz responses", heading: "Some people work a lot more hours than their contract", primary: "Some people work a lot more hours than their contract.", secondary: "Around a third of people work significantly more hours than stated in their contract.", why: "Your contract should accurately reflect the hours you work." },
        { pct: 35, label: "Communication could be better", subtext: "Based on 107 Breakroom Quiz responses", heading: "Only some people feel well informed about how the company is doing", primary: "Only some people feel well informed about how the company is doing.", secondary: "Around a third of people feel well informed about how the company is doing.", why: "Being kept informed about the company helps you feel like a valued part of the business." },
      ],
      good: [
        { pct: 90, label: "No last-minute shift changes", subtext: "Based on 107 Breakroom Quiz responses", heading: "Shifts don't get changed at short notice", primary: "Shifts don't get changed at short notice.", secondary: "90% of people say their manager doesn't change their shifts at the last minute.", why: "If your manager is often changing your shifts at short notice that's a sign of poor planning." },
        { pct: 77, label: "Living wage", subtext: "Based on 107 Breakroom Quiz responses", heading: "Most people are paid a living wage", primary: "Most people are paid a living wage.", secondary: "77% of people say they are paid at or above the Real Living Wage for where they live.", why: "Everyone should be paid enough to live on." },
        { pct: 77, label: "Proper breaks", subtext: "Based on 107 Breakroom Quiz responses", heading: "Most people get proper breaks", primary: "Most people get proper breaks.", secondary: "77% of people report that they get to take proper breaks.", why: "When you take a break it should be a proper rest." },
        { pct: 75, label: "No unpaid overtime", subtext: "Based on 107 Breakroom Quiz responses", heading: "Most people don't do unpaid extra work", primary: "Most people don't do unpaid extra work.", secondary: "75% of people report that they don't do extra unpaid work.", why: "Everyone should get paid for any extra work they do." },
        { pct: 73, label: "Hours security", subtext: "Based on 107 Breakroom Quiz responses", heading: "Most people don't worry about their hours", primary: "Most people don't worry about their hours.", secondary: "73% of people report they don't worry about getting enough hours.", why: "At a good job, you shouldn't have to worry about getting enough hours each week." },
        { pct: 72, label: "Safe workplace", subtext: "Based on 107 Breakroom Quiz responses", heading: "Most people think their workplace is safe", primary: "Most people think their workplace is safe.", secondary: "72% of people think their workplace is safe.", why: "Everyone has the right to work in a safe environment." },
        { pct: 62, label: "Hours match contract", subtext: "Based on 107 Breakroom Quiz responses", heading: "Most people work the same hours as their contract", primary: "Most people work the same hours as their contract.", secondary: "62% of people say they work the same number of hours as stated in their contract.", why: "Your contract should accurately reflect the hours you work." },
      ],
    },
    reviews: [
      { best: "Shifts are predictable and they don't mess you around at the last minute. Breaks are respected too", worst: "The pick rate targets are stressful and there's no sick pay — you feel you can't afford to be ill", role: "Pick & Pack Operative", date: "Feb 2025" },
      { best: "Steady work, close to home, and the team on my shift is decent", worst: "Head office are completely out of touch. No one at the top understands what it's actually like doing this job", role: "Warehouse Operative", date: "Oct 2024" },
    ],
    signals: [
      { status: "good", label: "No experience required — good entry-level role", detail: "Clipper welcome applicants without prior warehouse experience. Full training is provided on the job.", subtext: null, findingLabel: null, isBackgroundSignal: true },
      { status: "warning", label: "Target-driven picking role — performance is monitored", detail: "Pick & pack operatives are expected to meet hourly pick rates. Performance monitoring is a standard part of the role.", subtext: null, findingLabel: null },
      { status: "bad", label: "90% of Clipper workers don't get sick pay — the worst in this comparison", detail: "Sick pay is Clipper's single most striking Breakroom finding — significantly worse than any other employer shown here.", subtext: "Based on 107 Breakroom Quiz responses", findingLabel: null },
    ],
    jd: [
      { label: "Job title", text: "Pick & Pack Operative" },
      { label: "Employer", text: "Clipper Logistics (Direct Employer)" },
      { label: "Pay", text: "£12.10/hr" },
      { label: "Location", text: "Corby, Northamptonshire, NN17" },
      { label: "Hours", text: "Full time, day shifts (Monday–Friday)" },
      { label: "Role description", text: "Clipper Logistics provides supply chain solutions for some of the UK's biggest fashion and retail brands. At our Corby site you'll be picking and packing orders for online customers, helping ensure every order arrives on time and in perfect condition." },
      { label: "Responsibilities", text: "Picking individual customer orders accurately from warehouse locations; Packing and labelling items to brand standards; Using handheld RF scanners; Meeting hourly pick rate targets; Replenishing stock as needed; Maintaining a clean work area." },
      { label: "Requirements", text: "No previous experience required; Comfortable with repetitive work and meeting targets; Good attention to detail; Physically fit — role involves standing and walking all shift; Reliable and punctual; Right to work in the UK." },
      { label: "Benefits", text: "Competitive hourly rate; Pension scheme; 28 days holiday (including bank holidays); Staff discount at client retail brands; Opportunities for overtime." },
    ],
  },
];

// Build allFindings for each job from their findings.bad + findings.good
JOBS.forEach(job => { job.allFindings = buildAllFindings(job.findings.bad, job.findings.okay, job.findings.good); });

// Synthesises rating tier into a dot colour + plain-text verdict
const ratingVerdict = (score) =>
  score >= 7.0
    ? { dotColor: COLORS.green,     text: "Well rated by workers — good conditions across pay, hours, and the workplace." }
    : score >= 5.5
    ? { dotColor: COLORS.amber,     text: "Workers have mixed views here — some concerns about pay, hours, or conditions to know." }
    : {  dotColor: COLORS.red,      text: "Poorly rated by workers — significant concerns about pay, hours, and working conditions." };

// Synthesises a signal combining a worker quote with the most notable finding
const synthSignal = (job) => {
  const score = job.rating;
  const status = score >= 7.0 ? "good" : score >= 5.5 ? "warning" : "bad";
  const review = (job.reviews || [])[0];

  // Good rating: positive quote + best finding. Mixed/poor: worst quote + top concern.
  const quote = status === "good" ? review?.best : review?.worst;

  const badFindings = job.findings.bad || [];
  const goodFindings = job.findings.good || [];
  const topBad = badFindings.reduce((best, f) => !best || f.pct > best.pct ? f : best, null);
  const topGood = goodFindings.reduce((best, f) => !best || f.pct > best.pct ? f : best, null);

  const finding = status === "good"
    ? (topGood ? `${topGood.pct}% say: ${topGood.heading.toLowerCase()}` : null)
    : (topBad ? `${topBad.pct}% say: ${topBad.heading.toLowerCase()}` : null);

  // Finding leads, quote backs it up
  const quoteText = quote ? `"${quote}" — ${review.role}, ${review.date}` : null;

  return { status, label: finding || null, detail: quoteText || null };
};

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
const Signal = ({ status, label, detail, subtext, subtextClick, labelClick, isLast, badge }) => {
  const dot = status === "good" ? COLORS.green : status === "warning" ? COLORS.amber : COLORS.red;
  const badgeBg = status === "good" ? COLORS.greenBg : COLORS.amberBg;
  const badgeColor = status === "good" ? COLORS.greenText : COLORS.amberText;
  return (
    <div style={{ fontSize: 16, lineHeight: "22px", fontWeight: 500, color: COLORS.text, padding: `${S.m}px 0`, borderBottom: isLast ? "none" : "1px solid rgba(50,50,50,0.1)", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: S.s }}>
        <span style={{ width: 15, height: 15, borderRadius: "50%", background: dot, border: "2px solid #fff", flexShrink: 0, marginTop: 3 }} />
        <div style={{ flex: 1, fontFamily: FONT }}>
          <div onClick={labelClick} style={labelClick ? { cursor: "pointer", color: COLORS.accent, fontWeight: 700 } : {}}>
            {label}
            {badge && <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3px", padding: "2px 7px", borderRadius: 10, background: badgeBg, color: badgeColor, marginLeft: S.s, display: "inline-block", verticalAlign: "middle", lineHeight: "18px" }}>{badge}</span>}
          </div>
          {detail && <div style={{ ...T.body1, color: COLORS.muted, marginTop: S.xs, fontWeight: 400 }}>{detail}</div>}
          {subtext && (
            <div onClick={subtextClick} style={{ ...T.body2Bold, color: subtextClick ? COLORS.accent : COLORS.muted, marginTop: S.xs, cursor: subtextClick ? "pointer" : "default" }}>
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
const AltJob = ({ job, onClick }) => {
  const { title, company, pay, rating, location, altBadge, altReason: reason, findingDiffs } = job;
  const showPayBadge = altBadge && altBadge !== "Better rated";
  const visibleDiffs = (findingDiffs ?? []).filter(d => {
    const l = d.toLowerCase();
    if (l.includes("better rated")) return false;
    if (showPayBadge && (l.includes("pay") || l.includes("wage") || l.includes("salary"))) return false;
    return true;
  });
  const hasDiffs = visibleDiffs.length > 0;
  const hasReason = !!reason;
  const badgeStyle = { ...T.body2Bold, border: `2px solid ${COLORS.green}`, color: COLORS.greenText, background: COLORS.card, borderRadius: 20, padding: "2px 8px", whiteSpace: "nowrap", fontFamily: FONT };
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
      {/* Title row with optional pay badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: S.s, marginBottom: S.xs }}>
        <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{title}</div>
        {showPayBadge && <span style={badgeStyle}>{altBadge}</span>}
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
          {visibleDiffs.map((diff, i) => (
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
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "85vh", background: COLORS.bg, borderRadius: "16px 16px 0 0", padding: `${S.m2}px ${S.m2}px ${S.l}px`, transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform 0.35s ease", zIndex: 101, overflowY: "auto", boxShadow: open ? "0 -8px 40px rgba(0,0,0,0.15)" : "none" }}>
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
          Save
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
  const [payType, setPayType] = useState(initialValues.payType || "hourly");
  const [travel, setTravel] = useState(Array.isArray(initialValues.travel) ? initialValues.travel : []);
  const [priorities, setPriorities] = useState(new Set(initialValues.priorities || []));
  const [rolePrefs, setRolePrefs] = useState(initialValues.rolePrefs || {});
  useEffect(() => {
    if (open) {
      setPostcode(initialValues.postcode || "");
      setCurrentPay(initialValues.currentPay || "");
      setPayType(initialValues.payType || "hourly");
      setTravel(Array.isArray(initialValues.travel) ? initialValues.travel : []);
      setPriorities(new Set(initialValues.priorities || []));
      setRolePrefs(initialValues.rolePrefs || {});
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps
  const togglePriority = (p) => setPriorities((s) => { const n = new Set(s); n.has(p) ? n.delete(p) : n.add(p); return n; });
  const toggleTravel = (m) => setTravel(t => t.includes(m) ? t.filter(x => x !== m) : [...t, m]);
  const toggleRolePref = (id, val) => setRolePrefs(p => ({ ...p, [id]: p[id] === val ? null : val }));

  const inputStyle = { width: "100%", padding: `${S.s2}px ${S.m}px`, borderRadius: 4, border: `1px solid ${COLORS.border}`, ...T.body1, fontFamily: FONT, marginBottom: S.m, background: COLORS.card, color: COLORS.text, outline: "none", boxSizing: "border-box" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s", zIndex: 100 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "85vh", background: COLORS.bg, borderRadius: "16px 16px 0 0", padding: `${S.m2}px ${S.m2}px ${S.l}px`, transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform 0.35s ease", zIndex: 101, overflowY: "auto", boxShadow: open ? "0 -8px 40px rgba(0,0,0,0.15)" : "none" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border, margin: `0 auto ${S.m}px` }} />
        <h3 style={{ ...T.lead1, margin: 0, color: COLORS.text, fontFamily: FONT, marginBottom: S.s }}>Help us find you better jobs</h3>
        <p style={{ ...T.body1, color: COLORS.muted, margin: `0 0 ${S.m2}px`, fontFamily: FONT }}>Answer a few quick ones and we'll show you jobs that actually fit your life. Takes 30 seconds.</p>

        <label style={{ ...T.body1Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>Your postcode</label>
        <input value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="e.g. NN18 8ET" style={{ ...inputStyle, maxWidth: 200 }} />

        <label style={{ ...T.body1Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>How do you get there? <span style={{ fontWeight: 400, color: COLORS.muted }}>(pick all that apply)</span></label>
        <div style={{ display: "flex", gap: S.xs, flexWrap: "wrap", marginBottom: S.s }}>
          {TRANSPORT_MODES.map(({ id, label, Icon }) => {
            const sel = travel.includes(id);
            return (
              <button key={id} onClick={() => toggleTravel(id)}
                style={{ display: "flex", alignItems: "center", gap: S.xs, padding: `${S.xs}px ${S.s2}px`, borderRadius: 100, border: `1px solid ${sel ? COLORS.accent : COLORS.border}`, background: sel ? COLORS.accentBg : COLORS.card, ...T.body2, cursor: "pointer", fontFamily: FONT, color: sel ? COLORS.accent : COLORS.text, fontWeight: sel ? 700 : 400 }}>
                <Icon color={sel ? COLORS.accent : COLORS.text} />{label}
              </button>
            );
          })}
        </div>
        {(!postcode || travel.length === 0) && (
          <p style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, margin: `0 0 ${S.m}px` }}>
            {!postcode && travel.length === 0 ? "Fill in your postcode and travel mode to see commute times on listings." : !postcode ? "Add your postcode to see commute times." : "Pick a travel mode to see commute times."}
          </p>
        )}
        {postcode && travel.length > 0 && <div style={{ marginBottom: S.m }} />}

        <label style={{ ...T.body1Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>What do you currently earn?</label>
        <div style={{ display: "flex", gap: S.s, alignItems: "center", marginBottom: S.m }}>
          <input value={currentPay} onChange={(e) => setCurrentPay(e.target.value)} placeholder={payType === "hourly" ? "e.g. £12.50" : "e.g. £26,000"} style={{ ...inputStyle, flex: "0 0 auto", width: 160, marginBottom: 0 }} />
          <div style={{ display: "flex", gap: S.xs }}>
            {[["per hour", "hourly"], ["per year", "annual"]].map(([label, val]) => (
              <button key={val} onClick={() => setPayType(val)}
                style={{ ...T.body2Bold, fontFamily: FONT, padding: "3px 10px", borderRadius: 20, border: `2px solid ${payType === val ? COLORS.accent : COLORS.border}`, background: payType === val ? COLORS.accentBg : "transparent", color: payType === val ? COLORS.accent : COLORS.muted, cursor: "pointer" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <label style={{ ...T.body1Bold, color: COLORS.text, display: "block", marginBottom: S.s, fontFamily: FONT }}>What matters most to you? <span style={{ fontWeight: 400, color: COLORS.muted }}>(pick up to 3)</span></label>
        <div style={{ display: "flex", gap: S.xs, flexWrap: "wrap", marginBottom: S.m2 }}>
          {PRIORITIES.map((p) => (
            <button key={p} onClick={() => { if (priorities.has(p) || priorities.size < 3) togglePriority(p); }}
              style={{ padding: `${S.xs}px ${S.s2}px`, borderRadius: 100, border: `1px solid ${priorities.has(p) ? COLORS.green : COLORS.border}`, background: priorities.has(p) ? COLORS.greenBg : COLORS.card, ...T.body1, cursor: "pointer", fontFamily: FONT, color: priorities.has(p) ? COLORS.green : COLORS.muted, fontWeight: priorities.has(p) ? 700 : 400 }}>
              {p}
            </button>
          ))}
        </div>

        <button onClick={() => onSubmit({ postcode, currentPay, payType, travel: [...travel], priorities: [...priorities] })}
          style={{ width: "100%", padding: S.m, borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", ...T.body1Bold, cursor: "pointer", fontFamily: FONT }}>
          Show me better matches
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: `${S.s2}px`, background: "none", border: "none", ...T.body1, color: COLORS.muted, cursor: "pointer", marginTop: S.s, fontFamily: FONT }}>
          Not now, I'll keep browsing
        </button>
      </div>
    </>
  );
};

// ─── Background drawer ─────────────────────────────────────────────────────────
const QUALIFICATIONS = [
  "Food hygiene certificate (Level 2)",
  "CSCS card",
  "First aid certificate",
  "SIA licence",
  "NVQ Level 2 or above",
  "GCSE English & Maths (grade C/4 or above)",
];

const BackgroundDrawer = ({ open, onClose, onSubmit, initialValues = {} }) => {
  const [prevJobs, setPrevJobs] = useState(initialValues.prevJobs || [{ title: "", employer: "" }]);
  const [experience, setExperience] = useState(initialValues.experience || null);
  const [qualifications, setQualifications] = useState(new Set(initialValues.qualifications || []));

  useEffect(() => {
    if (open) {
      setPrevJobs(initialValues.prevJobs || [{ title: "", employer: "" }]);
      setExperience(initialValues.experience || null);
      setQualifications(new Set(initialValues.qualifications || []));
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleQual = (q) => setQualifications(s => { const n = new Set(s); n.has(q) ? n.delete(q) : n.add(q); return n; });
  const updateJob = (i, field, val) => setPrevJobs(jobs => jobs.map((j, idx) => idx === i ? { ...j, [field]: val } : j));
  const removeJob = (i) => setPrevJobs(jobs => jobs.filter((_, idx) => idx !== i));
  const inputStyle = { width: "100%", padding: `${S.s2}px ${S.m}px`, borderRadius: 4, border: `1px solid ${COLORS.border}`, ...T.body1, fontFamily: FONT, background: COLORS.card, color: COLORS.text, outline: "none", boxSizing: "border-box" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s", zIndex: 100 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "88vh", background: COLORS.bg, borderRadius: "16px 16px 0 0", padding: `${S.m2}px ${S.m2}px ${S.l}px`, transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform 0.35s ease", zIndex: 101, overflowY: "auto", boxShadow: open ? "0 -8px 40px rgba(0,0,0,0.15)" : "none" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border, margin: `0 auto ${S.m}px` }} />
        <h3 style={{ ...T.lead1, margin: 0, color: COLORS.text, fontFamily: FONT, marginBottom: S.xs }}>Your background</h3>
        <p style={{ ...T.body1, color: COLORS.muted, margin: `0 0 ${S.m2}px`, fontFamily: FONT }}>Tell us about your experience and qualifications — we'll show how well you fit every job you look at.</p>

        {/* Work history */}
        <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT, marginBottom: S.xs }}>Work history <span style={{ fontWeight: 400, color: COLORS.muted }}>(optional)</span></div>
        <p style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, margin: `0 0 ${S.m}px` }}>Add your most recent roles. Leave blank if you're new to work.</p>
        {prevJobs.map((job, i) => (
          <div key={i} style={{ marginBottom: S.m }}>
            <div style={{ display: "flex", gap: S.m, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 140px" }}>
                <label style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, display: "block", marginBottom: S.xs }}>Job title</label>
                <input value={job.title} onChange={e => updateJob(i, "title", e.target.value)} placeholder="e.g. Warehouse Operative" style={{ ...inputStyle, marginBottom: 0 }} />
              </div>
              <div style={{ flex: "1 1 140px" }}>
                <label style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, display: "block", marginBottom: S.xs }}>Employer</label>
                <input value={job.employer} onChange={e => updateJob(i, "employer", e.target.value)} placeholder="e.g. Amazon" style={{ ...inputStyle, marginBottom: 0 }} />
              </div>
            </div>
            {prevJobs.length > 1 && (
              <div onClick={() => removeJob(i)} style={{ ...T.body2, color: COLORS.muted, textDecoration: "underline", cursor: "pointer", fontFamily: FONT, marginTop: S.xs }}>
                Remove
              </div>
            )}
          </div>
        ))}
        {prevJobs.length < 3 && (
          <div onClick={() => setPrevJobs(jobs => [...jobs, { title: "", employer: "" }])} style={{ ...T.body2, color: COLORS.accent, textDecoration: "underline", cursor: "pointer", fontFamily: FONT, marginBottom: S.m2 }}>
            + Add another role
          </div>
        )}

        <label style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, display: "block", marginBottom: S.xs }}>How much experience do you have in this kind of work?</label>
        <div style={{ display: "flex", gap: S.xs, flexWrap: "wrap", marginBottom: S.m2 }}>
          {[["none", "None — this is new to me"], ["some", "Some — a year or two"], ["lots", "Lots — several years"]].map(([val, label]) => (
            <button key={val} onClick={() => setExperience(experience === val ? null : val)}
              style={{ ...T.body2, padding: `${S.xs}px ${S.s2}px`, borderRadius: 100, border: `1px solid ${experience === val ? COLORS.green : COLORS.border}`, background: experience === val ? COLORS.greenBg : COLORS.card, color: experience === val ? COLORS.green : COLORS.muted, fontWeight: experience === val ? 700 : 400, cursor: "pointer", fontFamily: FONT }}>
              {label}
            </button>
          ))}
        </div>

        {/* Qualifications */}
        <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT, marginBottom: S.xs }}>Qualifications <span style={{ fontWeight: 400, color: COLORS.muted }}>(optional)</span></div>
        <p style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, margin: `0 0 ${S.m}px` }}>Tick any you have. Driving licences can be added separately from the job page.</p>
        <div style={{ background: COLORS.card, borderRadius: 8, padding: `0 ${S.m}px`, marginBottom: S.m2 }}>
          {QUALIFICATIONS.map((q, i) => {
            const sel = qualifications.has(q);
            return (
              <div key={q} onClick={() => toggleQual(q)} style={{ display: "flex", alignItems: "center", gap: S.m, padding: `${S.s2}px 0`, borderBottom: i < QUALIFICATIONS.length - 1 ? `1px solid ${COLORS.border}` : "none", cursor: "pointer" }}>
                <span style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${sel ? COLORS.green : COLORS.border}`, background: sel ? COLORS.green : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {sel && <span style={{ color: "#fff", fontSize: 12, lineHeight: 1, fontWeight: 700 }}>✓</span>}
                </span>
                <span style={{ ...T.body1, color: COLORS.text, fontFamily: FONT }}>{q}</span>
              </div>
            );
          })}
        </div>

        <button onClick={() => onSubmit({ prevJobs, experience, qualifications: [...qualifications] })}
          style={{ width: "100%", padding: S.m, borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", ...T.body1Bold, cursor: "pointer", fontFamily: FONT }}>
          Save
        </button>
        <button onClick={onClose} style={{ width: "100%", padding: S.s2, background: "none", border: "none", ...T.body1, color: COLORS.muted, cursor: "pointer", marginTop: S.s, fontFamily: FONT }}>
          Not now
        </button>
      </div>
    </>
  );
};

// ─── Work Style Drawer ─────────────────────────────────────────────────────────
const WorkStyleDrawer = ({ open, onClose, onSubmit, initialValues = {} }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(initialValues);

  useEffect(() => {
    if (open) { setStep(0); setAnswers(initialValues); }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const q = WORK_STYLE_QUESTIONS[step];
  const isLast = step === WORK_STYLE_QUESTIONS.length - 1;
  const current = answers[q.id] || null;

  const select = (val) => setAnswers(a => ({ ...a, [q.id]: val }));
  const next = () => isLast ? onSubmit(answers) : setStep(s => s + 1);
  const skip = () => isLast ? onSubmit(answers) : setStep(s => s + 1);

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", opacity: open ? 1 : 0, pointerEvents: open ? "auto" : "none", transition: "opacity 0.3s", zIndex: 100 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: COLORS.bg, borderRadius: "16px 16px 0 0", padding: `${S.m2}px ${S.m2}px ${S.l}px`, transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform 0.35s ease", zIndex: 101, boxShadow: open ? "0 -8px 40px rgba(0,0,0,0.15)" : "none" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border, margin: `0 auto ${S.m}px` }} />

        {/* Progress dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: S.xs, marginBottom: S.m2 }}>
          {WORK_STYLE_QUESTIONS.map((_, i) => (
            <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i === step ? COLORS.text : COLORS.border, transition: "background 0.2s" }} />
          ))}
        </div>

        {/* Question */}
        <div style={{ ...T.lead1, color: COLORS.text, fontFamily: FONT, marginBottom: S.m2, minHeight: 60 }}>{q.question}</div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: S.s, marginBottom: S.m2 }}>
          {q.options.map(([val, label]) => {
            const sel = current === val;
            return (
              <button key={val} onClick={() => select(val)}
                style={{ padding: `${S.s2}px ${S.m}px`, borderRadius: 8, border: `2px solid ${sel ? COLORS.green : COLORS.border}`, background: sel ? COLORS.greenBg : COLORS.card, color: sel ? COLORS.green : COLORS.text, ...T.body1, fontWeight: sel ? 700 : 400, cursor: "pointer", fontFamily: FONT, textAlign: "left", transition: "all 0.15s" }}>
                {label}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <button onClick={next} disabled={!current}
          style={{ width: "100%", padding: S.m, borderRadius: 4, border: "none", background: current ? COLORS.accent : COLORS.border, color: "#fff", ...T.body1Bold, cursor: current ? "pointer" : "default", fontFamily: FONT, marginBottom: S.s, transition: "background 0.2s" }}>
          {isLast ? "Save →" : "Next →"}
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {step > 0
            ? <span onClick={() => setStep(s => s - 1)} style={{ ...T.body2, color: COLORS.muted, textDecoration: "underline", cursor: "pointer", fontFamily: FONT }}>← Back</span>
            : <span />}
          <span onClick={skip} style={{ ...T.body2, color: COLORS.muted, textDecoration: "underline", cursor: "pointer", fontFamily: FONT }}>
            {isLast ? "Save without answering" : "Skip"}
          </span>
        </div>
      </div>
    </>
  );
};

// ─── Profile hub ───────────────────────────────────────────────────────────────
const ProfileHub = ({ open, onClose, isSignedIn, userEmail, onSignIn, postcode, currentPay, currentPayType = "hourly", travel, priorities, rolePrefs: initialRolePrefs = {}, userLicences, onSavePrefs, onOpenLicenceModal, onOpenDrawer, onOpenBackgroundDrawer, onOpenWorkStyleDrawer, background = {}, workStyle = {}, hasPersonalisation }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [lPostcode, setLPostcode] = useState(postcode);
  const [lPay, setLPay] = useState(currentPay);
  const [lPayType, setLPayType] = useState(currentPayType);
  const [lTravel, setLTravel] = useState(Array.isArray(travel) ? travel : []);
  const [lPriorities, setLPriorities] = useState(new Set(priorities));
  const [lRolePrefs, setLRolePrefs] = useState(initialRolePrefs);
  const toggleLTravel = (m) => setLTravel(t => t.includes(m) ? t.filter(x => x !== m) : [...t, m]);
  const toggleLRolePref = (id, val) => setLRolePrefs(p => ({ ...p, [id]: p[id] === val ? null : val }));

  useEffect(() => {
    if (open) {
      setEmail("");
      setEmailError(false);
      setLPostcode(postcode);
      setLPay(currentPay);
      setLPayType(currentPayType);
      setLTravel(Array.isArray(travel) ? travel : []);
      setLPriorities(new Set(priorities));
      setLRolePrefs(initialRolePrefs);
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
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "90vh", background: COLORS.bg, borderRadius: "16px 16px 0 0", padding: `${S.m2}px ${S.m2}px ${S.l}px`, transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform 0.35s ease", zIndex: 111, overflowY: "auto", boxShadow: open ? "0 -8px 40px rgba(0,0,0,0.15)" : "none" }}>
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
              Create a free account
            </button>
            <button style={{ width: "100%", padding: S.s2, borderRadius: 4, border: `2px solid #323232`, background: COLORS.card, ...T.body1Bold, cursor: "pointer", fontFamily: FONT, color: COLORS.text }}>
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
              const formatPay = (v) => { if (!v) return null; const n = parseFloat(String(v).replace(/[^0-9.]/g, "")); if (isNaN(n)) return v; return currentPayType === "annual" ? `£${Math.round(n).toLocaleString()}/yr` : `£${n.toFixed(2)}/hr`; };
              const hasLicences = userLicences.size > 0;
              const hasPriorities = priorities.length > 0;
              const hasTravel = Array.isArray(travel) ? travel.length > 0 : !!travel;
              const hasBackground = Object.keys(background).length > 0;
              const hasWorkStyle = Object.keys(workStyle).length > 0;

              // Format background for receipt
              const expLabels = { none: "No experience", some: "1–2 years' experience", lots: "Several years' experience" };
              const firstJobTitle = (background.prevJobs || []).find(j => j.title)?.title;
              const backgroundDisplay = hasBackground ? [
                firstJobTitle,
                background.experience ? expLabels[background.experience] : null,
                (background.qualifications || []).length > 0 ? `${background.qualifications.length} qualification${background.qualifications.length > 1 ? "s" : ""}` : null,
              ].filter(Boolean).join(" · ") || "Added" : null;

              // Format work style for receipt
              const activityLabels = { sitting: "Desk-based", feet: "On my feet", active: "Very active" };
              const teamLabels = { team: "Team", solo: "Solo", either: "Flexible" };
              const envLabels = { indoors: "Indoors", outdoors: "Outdoors", either: "Either" };
              const workStyleDisplay = hasWorkStyle ? [
                workStyle.activity ? activityLabels[workStyle.activity] : null,
                workStyle.teamwork ? teamLabels[workStyle.teamwork] : null,
                workStyle.outdoors ? envLabels[workStyle.outdoors] : null,
              ].filter(Boolean).join(" · ") || "Added" : null;

              const lastField = hasWorkStyle ? "workstyle" : hasBackground ? "background" : hasLicences ? "licences" : hasPriorities ? "priorities" : hasTravel ? "travel" : currentPay ? "pay" : "postcode";
              const travelDisplay = Array.isArray(travel) ? travel.map(id => TRANSPORT_MODES.find(m => m.id === id)?.label ?? id).join(", ") || null : travel || null;
              return (
                <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: `0 ${S.m}px`, marginBottom: S.m2 }}>
                  <SummaryRow label="Postcode" value={postcode || null} onClick={() => { onClose(); onOpenDrawer(); }} isLast={lastField === "postcode"} />
                  <SummaryRow label="Current pay" value={formatPay(currentPay)} onClick={() => { onClose(); onOpenDrawer(); }} isLast={lastField === "pay"} />
                  <SummaryRow label="Travel" value={travelDisplay} onClick={() => { onClose(); onOpenDrawer(); }} isLast={lastField === "travel"} />
                  <SummaryRow label="Priorities" value={hasPriorities ? priorities.join(", ") : null} onClick={() => { onClose(); onOpenDrawer(); }} isLast={lastField === "priorities"} />
                  {hasLicences && <SummaryRow label="Licences" value={[...userLicences].map(l => licenceLabels[l] || l).join(", ")} onClick={() => { onClose(); onOpenLicenceModal(); }} isLast={lastField === "licences"} />}
                  {hasBackground && <SummaryRow label="Background" value={backgroundDisplay} onClick={() => { onClose(); onOpenBackgroundDrawer(); }} isLast={lastField === "background"} />}
                  {hasWorkStyle && <SummaryRow label="Work style" value={workStyleDisplay} onClick={() => { onClose(); onOpenWorkStyleDrawer(); }} isLast={lastField === "workstyle"} />}
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
              {/* Commute — 2-up on wider viewports */}
              <div style={{ display: "flex", gap: S.m, flexWrap: "wrap", marginBottom: S.s, alignItems: "center" }}>
                <div style={{ flex: "1 1 160px" }}>
                  <label style={sectionLabel}>Your postcode</label>
                  <input value={lPostcode} onChange={e => setLPostcode(e.target.value)} placeholder="e.g. NN18 8ET" style={{ ...inputStyle, marginBottom: 0 }} />
                </div>
                <div style={{ flex: "2 1 220px" }}>
                  <label style={sectionLabel}>How do you get there? <span style={{ fontWeight: 400, color: COLORS.muted }}>(pick all that apply)</span></label>
                  <div style={{ display: "flex", gap: S.xs, flexWrap: "wrap" }}>
                    {TRANSPORT_MODES.map(({ id, label, Icon }) => {
                      const sel = lTravel.includes(id);
                      return (
                        <button key={id} onClick={() => toggleLTravel(id)}
                          style={{ display: "flex", alignItems: "center", gap: S.xs, padding: `${S.xs}px ${S.s2}px`, borderRadius: 100, border: `1px solid ${sel ? COLORS.accent : COLORS.border}`, background: sel ? COLORS.accentBg : COLORS.card, ...T.body2, cursor: "pointer", fontFamily: FONT, color: sel ? COLORS.accent : COLORS.text, fontWeight: sel ? 700 : 400 }}>
                          <Icon color={sel ? COLORS.accent : COLORS.text} />{label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {(!lPostcode || lTravel.length === 0) && (
                <p style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, margin: `0 0 ${S.m}px` }}>
                  {!lPostcode && lTravel.length === 0 ? "Fill in your postcode and travel mode to see commute times on listings." : !lPostcode ? "Add your postcode to see commute times." : "Pick a travel mode to see commute times."}
                </p>
              )}
              {lPostcode && lTravel.length > 0 && <div style={{ marginBottom: S.m }} />}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: S.s }}>
                <label style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>What do you currently earn?</label>
                <div style={{ display: "flex", gap: S.xs }}>
                  {[["per hour", "hourly"], ["per year", "annual"]].map(([lab, val]) => (
                    <button key={val} onClick={() => setLPayType(val)}
                      style={{ ...T.body2Bold, fontFamily: FONT, padding: "3px 10px", borderRadius: 20, border: `2px solid ${lPayType === val ? COLORS.accent : COLORS.border}`, background: lPayType === val ? COLORS.accentBg : "transparent", color: lPayType === val ? COLORS.accent : COLORS.muted, cursor: "pointer" }}>
                      {lab}
                    </button>
                  ))}
                </div>
              </div>
              <input value={lPay} onChange={e => setLPay(e.target.value)} placeholder={lPayType === "hourly" ? "e.g. £12.50" : "e.g. £26,000"} style={inputStyle} />
              <label style={sectionLabel}>What matters most to you? <span style={{ fontWeight: 400, color: COLORS.muted }}>(pick up to 3)</span></label>
              <div style={{ display: "flex", gap: S.xs, flexWrap: "wrap", marginBottom: S.m2 }}>
                {PRIORITIES.map(p => (
                  <button key={p} onClick={() => { if (lPriorities.has(p) || lPriorities.size < 3) toggleP(p); }}
                    style={{ padding: `${S.xs}px ${S.s2}px`, borderRadius: 100, border: `1px solid ${lPriorities.has(p) ? COLORS.green : COLORS.border}`, background: lPriorities.has(p) ? COLORS.greenBg : COLORS.card, ...T.body1, cursor: "pointer", fontFamily: FONT, color: lPriorities.has(p) ? COLORS.green : COLORS.muted, fontWeight: lPriorities.has(p) ? 700 : 400 }}>
                    {p}
                  </button>
                ))}
              </div>
              <button onClick={() => onSavePrefs({ postcode: lPostcode, currentPay: lPay, payType: lPayType, travel: [...lTravel], priorities: [...lPriorities] })}
                style={{ width: "100%", padding: S.s2, borderRadius: 4, border: "none", background: COLORS.accent, color: "#fff", ...T.body1Bold, cursor: "pointer", fontFamily: FONT }}>
                Save preferences
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
                style={{ background: "none", border: "none", padding: 0, ...T.body1, color: COLORS.text, textDecoration: "underline", cursor: "pointer", fontFamily: FONT }}>
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
  const altJobs = JOBS.filter((j) => j.id !== currentJobIdx).sort((a, b) => b.rating - a.rating).slice(0, 5);
  const sep = <span style={{ color: COLORS.border, margin: `0 ${S.xs}px` }}>·</span>;
  return (
    <div>
      <h2 style={{ ...T.lead1, margin: `0 0 ${S.xs}px`, fontFamily: FONT, color: COLORS.text }}>Similar jobs nearby</h2>
      <p style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, margin: `0 0 ${S.s}px` }}>Sorted by Breakroom Rating</p>
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
          </button>
        )}
        {altJobs.map((j) => (
          <AltJob key={j.id} job={j} onClick={() => onJobSelect(j.id)} />
        ))}
      </div>
    </div>
  );
};

// ─── Desktop sidebar ───────────────────────────────────────────────────────────

const DesktopSidebar = ({ currentJobIdx, rating, personalised, isSignedIn, onOpenDrawer, onJobSelect, onOpenProfile, coords, location, onMapExpand }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: S.l2, paddingTop: S.m2 }}>
    {/* CTA card — sticky below header (70px) + S.m gap */}
    <div style={{ position: "sticky", top: 70 + S.m, zIndex: 10 }}>
      {/* Fade above — reaches full opacity before the header boundary so the whole gap is solidly masked */}
      <div style={{ position: "absolute", bottom: "100%", left: 0, right: 0, height: 48, background: `linear-gradient(to bottom, transparent, ${COLORS.bg} ${S.m}px)`, pointerEvents: "none" }} />
      {/* Fade below — at zIndex 1 so the card's box-shadow (at zIndex 2) paints on top of it cleanly */}
      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, height: 40, background: `linear-gradient(to bottom, ${COLORS.bg}, transparent)`, pointerEvents: "none", zIndex: 1 }} />
<div style={{ position: "relative", zIndex: 2, background: COLORS.card, borderRadius: 5, boxShadow: "0px 4px 4px rgba(0,0,0,0.05)", padding: `${S.m}px ${S.m2}px` }}>
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

    {/* Map — scrolls with page, sits above similar jobs */}
    <MapThumbnail coords={coords} onExpand={onMapExpand} height={180} label={location} />

    {/* Alternatives — not sticky, scrolls with page */}
    <AlternativesList currentJobIdx={currentJobIdx} personalised={personalised} isSignedIn={isSignedIn} onOpenDrawer={onOpenDrawer} onOpenProfile={onOpenProfile} onJobSelect={onJobSelect} />
  </div>
);

// ─── Pay benchmark helpers ──────────────────────────────────────────────────────

function parsePayValue(payStr) {
  // "£12.10/hr" → 12.10,  "£25,958/yr" → 25958
  return parseFloat(payStr.replace(/[£,]/g, "").replace(/\/.*/, ""));
}

function formatPayRange(low, high, payType) {
  const fmt = (n) => {
    const s = Number.isInteger(n) ? n.toLocaleString("en-GB") : n.toFixed(2).replace(/\.?0+$/, "");
    return `£${s}`;
  };
  const unit = payType === "annual" ? "/yr" : "/hr";
  return `${fmt(low)}–${fmt(high)}${unit} typical`;
}

function computePayVerdict(payStr, payType, benchmark) {
  if (!benchmark) return null;
  const pay = parsePayValue(payStr);
  if (!pay) return null;
  const { rangeLow, rangeHigh, roleLabel } = benchmark;
  const range = formatPayRange(rangeLow, rangeHigh, payType);
  if (pay < rangeLow) {
    return { verdict: "below", label: `Underpays for ${roleLabel}`, range, arrow: "↓" };
  } else if (pay > rangeHigh) {
    return { verdict: "above", label: `Pays well for ${roleLabel}`, range, arrow: "↑" };
  } else {
    return { verdict: "fair", label: `Pays fairly for ${roleLabel}`, range, arrow: "→" };
  }
}

// ─── Map components ────────────────────────────────────────────────────────────

function MapThumbnail({ coords, onExpand, height = 180, label }) {
  const [lat, lon] = coords;
  // Tight bbox for thumbnail (~400 m radius). OSM bbox = west,south,east,north
  const dLat = 0.004, dLon = 0.006;
  const bbox = `${lon - dLon},${lat - dLat},${lon + dLon},${lat + dLat}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  return (
    <div
      onClick={onExpand}
      role="button"
      aria-label="View larger map"
      style={{
        position: "relative",
        height,
        borderRadius: 5,
        overflow: "hidden",
        cursor: "pointer",
        border: `1px solid ${COLORS.border}`,
      }}
    >
      <iframe
        title="Job location"
        src={src}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", pointerEvents: "none" }}
        loading="lazy"
      />
      {/* Transparent overlay prevents iframe swallowing click events */}
      <div style={{ position: "absolute", inset: 0 }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: `${S.xs}px ${S.s}px`,
        background: "rgba(255,255,255,0.88)",
        ...T.body2, color: COLORS.text, fontFamily: FONT,
        display: "flex", justifyContent: "space-between", alignItems: "center", gap: S.s,
      }}>
        {label && <span style={{ color: COLORS.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{label}</span>}
        <span style={{ textDecoration: "underline", flexShrink: 0 }}>View larger map</span>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function JobTriagePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [backgroundDrawerOpen, setBackgroundDrawerOpen] = useState(false);
  const [profileBackground, setProfileBackground] = useState({});
  const [matchWhyOpen, setMatchWhyOpen] = useState(false);
  const [workStyleDrawerOpen, setWorkStyleDrawerOpen] = useState(false);
  const [workStylePrefs, setWorkStylePrefs] = useState({});
  const [profileOpen, setProfileOpen] = useState(false);
  const [allFindingsModalOpen, setAllFindingsModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [personalised, setPersonalised] = useState(false);
  const [selectedJobIdx, setSelectedJobIdx] = useState(0);
  const [findingsForceOpen, setFindingsForceOpen] = useState(false);
  const [highlightFinding, setHighlightFinding] = useState(null);
  const [benchmarkPopoverOpen, setBenchmarkPopoverOpen] = useState(false);
  const [licenceModalOpen, setLicenceModalOpen] = useState(false);
  const [userLicences, setUserLicences] = useState(new Set());
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [profilePostcode, setProfilePostcode] = useState("");
  const [profileCoords, setProfileCoords] = useState(null);
  const [profileCurrentPay, setProfileCurrentPay] = useState("");
  const [profilePayType, setProfilePayType] = useState("hourly");
  const [profileTravel, setProfileTravel] = useState([]);
  const [profilePriorities, setProfilePriorities] = useState([]);
  const [profileRolePrefs, setProfileRolePrefs] = useState({});

  const hasPersonalisation = personalised || userLicences.size > 0 || Object.keys(profileBackground).length > 0 || Object.keys(workStylePrefs).length > 0;

  // Lock body scroll when any drawer or modal is open
  useEffect(() => {
    const anyOpen = drawerOpen || backgroundDrawerOpen || profileOpen || licenceModalOpen || allFindingsModalOpen || mapModalOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen, backgroundDrawerOpen, profileOpen, licenceModalOpen]);

  useEffect(() => {
    if (!profilePostcode) { setProfileCoords(null); return; }
    const clean = profilePostcode.trim().replace(/\s+/g, "");
    fetch(`https://api.postcodes.io/postcodes/${clean}`)
      .then(r => r.json())
      .then(d => {
        const coords = d.result?.latitude ? [d.result.latitude, d.result.longitude]
          : d.terminated?.latitude ? [d.terminated.latitude, d.terminated.longitude]
          : false; // geocoding failed
        setProfileCoords(coords);
      })
      .catch(() => setProfileCoords(false));
  }, [profilePostcode]);

  const handleSavePrefs = ({ postcode, currentPay, payType = "hourly", travel, priorities, rolePrefs = {} }) => {
    setProfileRolePrefs(rolePrefs);
    setProfilePostcode(postcode);
    setProfileCurrentPay(currentPay);
    setProfilePayType(payType);
    setProfileTravel(Array.isArray(travel) ? travel : travel ? [travel] : []);
    setProfilePriorities(priorities);
    if (postcode || currentPay || travel?.length > 0 || priorities.length > 0) setPersonalised(true);
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
        {job.companyUrl ? <a href={job.companyUrl} style={{ color: "inherit", fontWeight: "inherit", textDecoration: "underline" }}>{job.company}</a> : job.company}
      </div>

      <h1 style={{ ...(isDesktop ? T.heading2Lg : T.heading2), margin: `0 0 ${S.xs}px`, fontFamily: FONT, color: COLORS.text }}>{job.title}</h1>

      {job.occupationDesc && <p style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, margin: `0 0 ${S.s2}px` }}>{job.occupationDesc}</p>}

      {/* .vacancy-card__divider + .vacancy__details */}
      {(() => {
        const rowStyle = { display: "flex", alignItems: "flex-start", marginBottom: S.s };
        const iconStyle = { marginRight: S.s, marginTop: S.xs, flexShrink: 0, display: "flex" };
        const renderRow = (f) => (
          <div style={rowStyle}>
            <span style={iconStyle}>{f.icon}</span>
            <div>
              <span style={{ ...T.body1, color: COLORS.text, fontFamily: FONT, lineHeight: 1.5 }}>{f.text}</span>
              {f.benchmark && (() => {
                const computed = computePayVerdict(job.pay, job.payType, f.benchmark);
                if (!computed) return null;
                const { verdict, label, range, arrow } = computed;
                const color = verdict === "below" ? COLORS.red : COLORS.greenText;
                return <div style={{ ...T.body2, fontWeight: 500, color, fontFamily: FONT, marginTop: 2 }}>{arrow} {label} · {range}</div>;
              })()}
              {f.commuteRow && (() => {
                if (!profilePostcode) {
                  return <div onClick={() => setDrawerOpen(true)} style={{ ...T.body2, color: COLORS.text, textDecoration: "underline", fontFamily: FONT, marginTop: 2, cursor: "pointer" }}>Check your commute</div>;
                }
                if (profileCoords === null) {
                  return <div style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT, marginTop: 2 }}>Checking distance from {profilePostcode}…</div>;
                }
                if (profileCoords === false) {
                  return <div onClick={() => setDrawerOpen(true)} style={{ ...T.body2, color: COLORS.text, textDecoration: "underline", fontFamily: FONT, marginTop: 2, cursor: "pointer" }}>Check your commute</div>;
                }
                const distKm = haversineKm(profileCoords[0], profileCoords[1], job.coords[0], job.coords[1]);
                const distMi = (distKm * 0.621371).toFixed(1);
                if (!profileTravel || profileTravel.length === 0) {
                  return <div onClick={() => setDrawerOpen(true)} style={{ ...T.body2, color: COLORS.text, textDecoration: "underline", fontFamily: FONT, marginTop: 2, cursor: "pointer" }}>{distMi} miles · Add your travel mode</div>;
                }
                return (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: S.xs, marginTop: 4 }}>
                    {profileTravel.map(modeId => {
                      const m = TRANSPORT_MODES.find(t => t.id === modeId);
                      if (!m) return null;
                      return (
                        <span key={modeId} style={{ display: "inline-flex", alignItems: "center", gap: 4, ...T.body2, fontWeight: 500, color: COLORS.muted, fontFamily: FONT }}>
                          <m.Icon color={COLORS.muted} />{formatCommute(commuteMin(distKm, modeId))}
                        </span>
                      );
                    }).reduce((acc, el, i) => el === null ? acc : i === 0 || acc.length === 0 ? [...acc, el] : [...acc, <span key={`sep${i}`} style={{ ...T.body2, color: COLORS.border, fontFamily: FONT }}>·</span>, el], [])}
                  </div>
                );
              })()}
            </div>
          </div>
        );
        return (
          <div style={{ borderTop: "1px solid rgba(50,50,50,0.1)", borderBottom: isDesktop ? "1px solid rgba(50,50,50,0.1)" : "none", marginTop: S.m, marginBottom: S.m, paddingTop: S.m, paddingBottom: S.s }}>
            {renderRow({ icon: <IconPay />, text: job.pay, benchmark: job.payBenchmark })}
            {renderRow({ icon: <IconLocation />, text: job.location, commuteRow: true })}
            {renderRow({ icon: <IconClock />, text: [job.hours, job.hoursSub ? `(${job.hoursSub})` : null, job.shifts].filter(Boolean).join(" · ") })}
            {!isDesktop && (
              <div style={{ marginTop: S.s }}>
                <MapThumbnail coords={job.coords} onExpand={() => setMapModalOpen(true)} height={180} />
              </div>
            )}
          </div>
        );
      })()}

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
          Rating based on {job.quizCount} employees who took The Breakroom Quiz
        </div>
      </div>

      {/* Vacancy highlights — matches .vacancy-highlights */}
      <div style={{ display: "flex", gap: S.s, flexWrap: "wrap" }}>
        {job.highlights.map((h) => <VacancyHighlight key={h} label={h} onClick={() => handlePillClick(h)} />)}
      </div>
    </div>
  );

  // ── Personalised match card (customer vacancies only) ─────────────────────
  const matchReasons = (() => {
    if (!job.isCustomer || !job.matchCriteria) return [];
    const criteria = job.matchCriteria;
    const bg = profileBackground;
    const hasAnyBackground = Object.keys(bg).length > 0;
    if (!hasAnyBackground && userLicences.size === 0) return [];

    const reasons = [];

    // Licence match
    if (criteria.licences?.length > 0) {
      const matched = criteria.licences.filter(l => userLicences.has(l));
      matched.forEach(l => reasons.push({ label: `You hold the required ${l}`, detail: "This is a requirement for this role — you're eligible to apply." }));
    } else if (userLicences.size > 0 && criteria.licences?.length === 0) {
      // No licence required — candidate has one but it's not needed here, don't surface
    }

    // Qualification match
    if (criteria.qualifications?.length > 0 && bg.qualifications) {
      const bgQuals = new Set([...(bg.qualifications || [])].map(q => q.toLowerCase()));
      criteria.qualifications.forEach(q => {
        if (bgQuals.has(q.toLowerCase())) reasons.push({ label: `You have the required qualification: ${q}`, detail: "Listed as a requirement for this role." });
      });
    }

    // Experience match
    if (criteria.experience && bg.prevJobs) {
      const keywords = criteria.experience.keywords || [];
      const relevantJob = bg.prevJobs.find(j =>
        j.title && keywords.some(kw => j.title.toLowerCase().includes(kw))
      );
      const hasExperience = bg.experience === "some" || bg.experience === "lots";
      if (relevantJob) {
        reasons.push({ label: `Your experience as ${relevantJob.title} is relevant here`, detail: criteria.note || `${job.company} prefer candidates with relevant prior experience.` });
      } else if (hasExperience && criteria.experience.preferred) {
        reasons.push({ label: `You have relevant work experience`, detail: criteria.note || `${job.company} prefer candidates with prior experience in a similar role.` });
      }
    }

    return reasons;
  })();

  // Soft preference matches — work style and priorities vs. job characteristics
  const softReasons = (() => {
    if (!job.isCustomer) return [];
    const ws = job.workStyle || {};
    const reasons = [];

    if (workStylePrefs.activity === "sitting" && ws.activity === "sitting")
      reasons.push({ label: "Desk-based work — matches your preference", detail: "You said you prefer mostly sitting down. This role fits." });
    else if (workStylePrefs.activity === "feet" && (ws.activity === "feet" || ws.activity === "sitting"))
      reasons.push({ label: "On your feet but not physically demanding", detail: "You said you prefer to be on your feet. This role is active without being strenuous." });
    else if (workStylePrefs.activity === "active" && ws.activity === "active")
      reasons.push({ label: "Physically active role — matches your preference", detail: "You said you enjoy very active work. This role involves physical activity throughout the shift." });

    if (workStylePrefs.teamwork === "team" && ws.teamwork === "team")
      reasons.push({ label: "Team-based work — matches your preference", detail: "You said you prefer working in a team. This is a collaborative role." });
    else if (workStylePrefs.teamwork === "solo" && ws.teamwork === "solo")
      reasons.push({ label: "Mostly independent work — matches your preference", detail: "You said you prefer working on your own. This role suits that." });

    if (workStylePrefs.outdoors === "indoors" && ws.outdoors === false)
      reasons.push({ label: "Indoor role — matches your preference", detail: "You said you prefer working indoors. This role is based inside." });
    else if (workStylePrefs.outdoors === "outdoors" && ws.outdoors === true)
      reasons.push({ label: "Outdoor role — matches your preference", detail: "You said you prefer working outdoors. This role is based outside." });

    if (workStylePrefs.public === "yes" && ws.public === true)
      reasons.push({ label: "Customer-facing role — matches your preference", detail: "You said you enjoy working with the public. This role involves regular customer contact." });
    else if (workStylePrefs.public === "no" && ws.public === false)
      reasons.push({ label: "No customer contact — matches your preference", detail: "You said you prefer not to work with the public. This is a behind-the-scenes role." });

    // Priority matches against findings
    const goodByLabel = (kw) => job.findings.good.find(f => f.label.toLowerCase().includes(kw));
    const notBad = (kw) => !job.findings.bad.some(f => f.label.toLowerCase().includes(kw));

    if (profilePriorities.includes("Good shift notice")) {
      const f = goodByLabel("shift");
      if (f) reasons.push({ label: `${f.pct}% say shifts don't get changed at short notice`, detail: "You said good shift notice matters to you — this employer scores well here." });
    }
    if (profilePriorities.includes("Sick pay") && notBad("sick pay")) {
      const f = goodByLabel("sick pay");
      if (f) reasons.push({ label: `${f.pct}% of workers get sick pay`, detail: "You said sick pay matters to you — more workers here have it than at many similar employers." });
    }
    if (profilePriorities.includes("Paid breaks") && notBad("paid breaks")) {
      const f = goodByLabel("paid break");
      if (f) reasons.push({ label: `${f.pct}% get paid breaks`, detail: "You said paid breaks matter to you — this employer is above average here." });
    }
    if (profilePriorities.includes("Friendly team") && notBad("team")) {
      const f = goodByLabel("team");
      if (f) reasons.push({ label: `${f.pct}% would recommend working with their team`, detail: "You said a friendly team is important to you." });
    }
    if (profilePriorities.includes("Career progression") && notBad("progress")) {
      const f = goodByLabel("progress");
      if (f) reasons.push({ label: `${f.pct}% say they get support to progress`, detail: "You said career progression matters to you." });
    }

    return reasons;
  })();

  const matchCard = matchReasons.length > 0 ? (
    <div style={{ background: "#E5FFD9", border: `1px solid #C1FCA5`, borderRadius: 5, padding: `${S.s2}px ${S.m}px`, marginBottom: S.m, display: "flex", alignItems: "center", justifyContent: "space-between", gap: S.s }}>
      <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>This looks like a strong match for you</div>
      <span onClick={() => setMatchWhyOpen(true)} style={{ ...T.body2, color: COLORS.text, textDecoration: "underline", cursor: "pointer", fontFamily: FONT, whiteSpace: "nowrap", flexShrink: 0 }}>Why?</span>
    </div>
  ) : null;

  const matchWhyModal = matchWhyOpen ? (
    <>
      <div onClick={() => setMatchWhyOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 200 }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, maxHeight: "70vh", background: COLORS.bg, borderRadius: "16px 16px 0 0", padding: `${S.m2}px ${S.m2}px ${S.l}px`, zIndex: 201, overflowY: "auto", boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: COLORS.border, margin: `0 auto ${S.m}px` }} />
        <h3 style={{ ...T.lead1, margin: `0 0 ${S.xs}px`, color: COLORS.text, fontFamily: FONT }}>Why you're a strong match</h3>
        <p style={{ ...T.body1, color: COLORS.muted, margin: `0 0 ${S.m2}px`, fontFamily: FONT }}>Based on what you've told us about your background, here's why {job.company} looks like a good fit.</p>
        {matchReasons.length > 0 && (
          <>
            <div style={{ ...T.smallcaps, color: COLORS.muted, textTransform: "uppercase", fontFamily: FONT, marginBottom: S.s }}>Your background</div>
            <div style={{ display: "flex", flexDirection: "column", gap: S.m, marginBottom: softReasons.length > 0 ? S.m2 : 0 }}>
              {matchReasons.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: S.s2 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#E5FFD9", border: "1px solid #C1FCA5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 11, color: COLORS.greenText, fontWeight: 700 }}>✓</span>
                  </span>
                  <div>
                    <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{r.label}</div>
                    <div style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT, marginTop: S.xs }}>{r.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {softReasons.length > 0 && (
          <>
            <div style={{ ...T.smallcaps, color: COLORS.muted, textTransform: "uppercase", fontFamily: FONT, marginBottom: S.s }}>Your preferences</div>
            <div style={{ display: "flex", flexDirection: "column", gap: S.m }}>
              {softReasons.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: S.s2 }}>
                  <span style={{ width: 20, height: 20, borderRadius: "50%", background: COLORS.greenBg, border: `1px solid ${COLORS.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <span style={{ fontSize: 11, color: COLORS.greenText, fontWeight: 700 }}>✓</span>
                  </span>
                  <div>
                    <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{r.label}</div>
                    <div style={{ ...T.body1, color: COLORS.muted, fontFamily: FONT, marginTop: S.xs }}>{r.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  ) : null;

  const sectionsBlock = (
    <>
      {matchCard}
      {/* "What you need to know" — always visible, no accordion */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, paddingBottom: S.m }}>
        <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT, padding: `${S.m}px 0` }}>What you need to know</div>
        <div style={{ background: COLORS.card, borderRadius: 5, padding: `0 ${S.m}px` }}>
          {(() => {
            const hasBackground = Object.keys(profileBackground).length > 0;
            const hasWorkStyle = Object.keys(workStylePrefs).length > 0;

            // ── Card 1: Findings & reviews synthesis ────────────────────────────
            const synth = synthSignal(job);
            const synthCard = (
              <Signal
                status={synth.status}
                label={synth.label}
                detail={synth.detail}
                subtext={`Based on ${job.quizCount.toLocaleString()} Breakroom Quiz responses`}
                isLast={false}
              />
            );

            // ── Card 2: Experience & qualifications ─────────────────────────────
            const bgCard = hasBackground ? (() => {
              // FLT licence takes priority if the job requires it
              if (job.requiresFltLicence) {
                return (
                  <Signal
                    status={userLicences.has("flt") ? "good" : "bad"}
                    label={userLicences.has("flt") ? "You have the required forklift licence" : "Forklift licence required (RTITB or ITSSAR)"}
                    detail="A valid counterbalance forklift licence is required. Reach truck licence is desirable."
                    subtext={userLicences.has("flt") ? "✓ You told us you hold an FLT licence" : "Tell us if you have a forklift licence"}
                    subtextClick={userLicences.has("flt") ? null : () => setLicenceModalOpen(true)}
                    isLast={false}
                  />
                );
              }
              let bgSignal = { status: "good", label: "Your background suits this role", detail: "Based on what you've told us, this looks like a good fit." };
              if ((profileBackground.qualifications || []).includes("food-hygiene")) bgSignal = { status: "good", label: "Your food hygiene certificate is relevant here", detail: "Level 2 food hygiene certificates are valued in this type of role." };
              else if (profileBackground.experience === "none") bgSignal = { status: "good", label: "No prior experience required", detail: "This employer offers full training — your background fits." };
              else if (profileBackground.experience === "lots") {
                const firstJob = (profileBackground.prevJobs || [])[0];
                bgSignal = { status: "good", label: "Your experience suits this role", detail: firstJob?.title ? `Your background as ${firstJob.title} is directly relevant.` : "Several years of relevant experience — you're well placed for this." };
              }
              return <Signal status={bgSignal.status} label={bgSignal.label} detail={bgSignal.detail} subtext="Update your background" subtextClick={() => setBackgroundDrawerOpen(true)} isLast={false} />;
            })() : (
              <div style={{ fontSize: 16, lineHeight: "22px", fontWeight: 500, color: COLORS.text, padding: `${S.m}px 0`, borderBottom: `1px solid rgba(50,50,50,0.1)` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: S.s }}>
                  <span style={{ width: 15, height: 15, borderRadius: "50%", background: COLORS.border, border: "2px solid #fff", flexShrink: 0, marginTop: 3 }} />
                  <div style={{ flex: 1, fontFamily: FONT }}>
                    <div>Are you suited for this role?</div>
                    <div style={{ ...T.body1, color: COLORS.muted, marginTop: S.xs, fontWeight: 400 }}>
                      Tell us about your experience and qualifications — we'll flag your fit on every vacancy.
                    </div>
                    <div style={{ margin: `${S.s}px 0` }}>
                      {[
                        "Your experience level vs. what's required",
                        "Whether your qualifications are relevant",
                      ].map((text, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: S.s, padding: `${S.xs}px 0` }}>
                          <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.border, flexShrink: 0, marginTop: 3 }} />
                          <span style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT }}>{text}</span>
                        </div>
                      ))}
                    </div>
                    <div onClick={() => setBackgroundDrawerOpen(true)} style={{ ...T.body2, color: COLORS.text, textDecoration: "underline", cursor: "pointer", fontFamily: FONT, marginTop: S.xs }}>
                      Tell us about your background
                    </div>
                  </div>
                </div>
              </div>
            );

            // ── Card 2: Work style ──────────────────────────────────────────────
            const wsCard = hasWorkStyle ? (() => {
              const ws = job.workStyle || {};
              const prefs = workStylePrefs;
              const issues = [];
              let relevant = 0;
              let matches = 0;

              const check = (hasDim, isMismatch, issue) => {
                if (!hasDim) return;
                relevant++;
                if (isMismatch) issues.push(issue);
                else matches++;
              };

              check(ws.activity !== undefined,
                (prefs.activity === "sitting" && ws.activity === "active") ||
                (prefs.activity === "active" && ws.activity === "sitting") ||
                (prefs.activity === "feet" && ws.activity === "active"),
                prefs.activity === "sitting"
                  ? { label: "Very physical role — lifting and moving for the full shift", detail: "You said you prefer desk-based work" }
                  : prefs.activity === "feet"
                  ? { label: "Very physically demanding role", detail: "You said you prefer to be on your feet — this goes further than that" }
                  : { label: "Mainly desk-based work", detail: "You said you prefer very active work" });

              check(ws.teamwork !== undefined,
                prefs.teamwork === "solo" && ws.teamwork === "team",
                { label: "Team-based work — you'll work closely with others all shift", detail: "You said you prefer working on your own" });

              check(ws.public !== undefined,
                prefs.public === "no" && ws.public === true,
                { label: "Customer-facing role", detail: "You said you'd prefer not to work with the public" });

              check(ws.outdoors !== undefined,
                (prefs.outdoors === "outdoors" && ws.outdoors === false) || (prefs.outdoors === "indoors" && ws.outdoors === true),
                prefs.outdoors === "outdoors"
                  ? { label: "Mainly indoor work", detail: "You said you prefer working outdoors" }
                  : { label: "Mainly outdoor work", detail: "You said you prefer working indoors" });

              check(ws.children !== undefined,
                prefs.children === "no" && ws.children === true,
                { label: "Involves working with children", detail: "You said you'd rather not work with children" });

              const badge = relevant > 0 ? `${matches}/${relevant} match` : null;
              const wsSignal = issues.length === 0
                ? { status: "good", label: "The day-to-day work suits your preferences", detail: null }
                : { status: "warning", label: issues[0].label, detail: issues[0].detail + (issues.length > 1 ? ` · plus ${issues.length - 1} other thing${issues.length > 2 ? "s" : ""} to consider` : "") };

              return <Signal status={wsSignal.status} label={wsSignal.label} detail={wsSignal.detail} badge={badge} subtext="Update work style" subtextClick={() => setWorkStyleDrawerOpen(true)} isLast={true} />;
            })() : (
              <div style={{ fontSize: 16, lineHeight: "22px", fontWeight: 500, color: COLORS.text, padding: `${S.m}px 0` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: S.s }}>
                  <span style={{ width: 15, height: 15, borderRadius: "50%", background: COLORS.border, border: "2px solid #fff", flexShrink: 0, marginTop: 3 }} />
                  <div style={{ flex: 1, fontFamily: FONT }}>
                    <div>Does the day-to-day work suit you?</div>
                    <div style={{ ...T.body1, color: COLORS.muted, marginTop: S.xs, fontWeight: 400 }}>
                      Tell us your preferences and we'll flag them on every vacancy.
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: S.xs, margin: `${S.s}px 0` }}>
                      {["Activity level", "Working style", "Environment", "Children"].map((chip, j) => (
                        <span key={j} style={{ ...T.body2, fontFamily: FONT, color: COLORS.muted, background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: `2px ${S.s2}px`, fontSize: 13 }}>
                          {chip}
                        </span>
                      ))}
                    </div>
                    <div onClick={() => setWorkStyleDrawerOpen(true)} style={{ ...T.body2, color: COLORS.text, textDecoration: "underline", cursor: "pointer", fontFamily: FONT, marginTop: S.xs }}>
                      Tell us your work style
                    </div>
                  </div>
                </div>
              </div>
            );

            return (
              <>
                {synthCard}
                {bgCard}
                {wsCard}
</>
            );
          })()}
        </div>
      </div>

      <Section title="What it's really like here" badgeEl={<span style={{ display: "inline-flex", alignItems: "center", gap: S.xs }}><TinyRatingDial score={rating} /><span style={{ fontFamily: FONT }}><span style={{ ...T.body1Bold, color: COLORS.text }}>{rating.toFixed(1)}</span><span style={{ ...T.body1, color: COLORS.muted }}> out of 10</span></span></span>} forceOpen={findingsForceOpen} sectionRef={findingsSectionRef}>
        {/* Red flags group — .finding-group */}
        {(() => {
          const bad = job.findings.bad;
          const moreCount = bad.length - 3;
          return (
            <div style={{ background: COLORS.card, borderRadius: 5, padding: `${S.s}px ${S.m}px 0`, marginBottom: S.m }}>
              <div style={{ ...T.smallcaps, color: COLORS.text, display: "inline-block", textTransform: "uppercase", fontFamily: FONT }}>Needs improving</div>
              <div>
                {bad.slice(0, 3).map((v, i, arr) => (
                  <FindingTile key={v.label} {...v} variant="red" lit={highlightFinding === v.label} forceOpen={highlightFinding === v.label} isLast={i === arr.length - 1} />
                ))}
              </div>
              {moreCount > 0 && (
                <div onClick={() => setAllFindingsModalOpen(true)} style={{ ...T.body2, color: COLORS.text, textDecoration: "underline", cursor: "pointer", padding: `${S.s2}px 0`, fontFamily: FONT, borderTop: `1px solid ${COLORS.border}` }}>
                  See {moreCount} more {moreCount === 1 ? "thing" : "things"} that need improving
                </div>
              )}
            </div>
          );
        })()}

        {/* Good things group — .finding-group */}
        {(() => {
          const good = job.findings.good;
          const moreCount = good.length - 3;
          return (
            <div style={{ background: COLORS.card, borderRadius: 5, padding: `${S.s}px ${S.m}px 0` }}>
              <div style={{ ...T.smallcaps, color: COLORS.text, display: "inline-block", textTransform: "uppercase", fontFamily: FONT }}>Good</div>
              <div>
                {good.slice(0, 3).map((v, i, arr) => (
                  <FindingTile key={v.label} {...v} variant="green" lit={highlightFinding === v.label} forceOpen={highlightFinding === v.label} isLast={i === arr.length - 1} />
                ))}
              </div>
              {moreCount > 0 && (
                <div onClick={() => setAllFindingsModalOpen(true)} style={{ ...T.body2, color: COLORS.text, textDecoration: "underline", cursor: "pointer", padding: `${S.s2}px 0`, fontFamily: FONT, borderTop: `1px solid ${COLORS.border}` }}>
                  See {moreCount} more good {moreCount === 1 ? "thing" : "things"}
                </div>
              )}
            </div>
          );
        })()}

        {/* Full picture link — sits below both cards */}
        {(() => {
          const okayCount = (job.findings.okay ?? []).length;
          return (
            <div onClick={() => setAllFindingsModalOpen(true)} style={{ ...T.body2, color: COLORS.text, textDecoration: "underline", cursor: "pointer", padding: `${S.s2}px 0`, fontFamily: FONT, marginTop: S.s }}>
              {okayCount > 0
                ? `See the full picture including ${okayCount} ${okayCount === 1 ? "thing" : "things"} that ${okayCount === 1 ? "is" : "are"} okay`
                : "See the full picture"}
            </div>
          );
        })()}
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
        <div style={{ ...T.body1, color: COLORS.text, textDecoration: "underline", cursor: "pointer", textAlign: "left", padding: `${S.xs}px 0`, fontFamily: FONT, marginTop: S.s }}>See all {job.quizCount} reviews</div>
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
              {hasPersonalisation && !isSignedIn && (() => {
                const count = [profilePostcode, profileCurrentPay, profileTravel, profilePriorities.length > 0, userLicences.size > 0, Object.keys(profileBackground).length > 0, Object.keys(workStylePrefs).length > 0].filter(Boolean).length;
                return (
                  <span style={{ position: "absolute", top: 8, right: 2, minWidth: 16, height: 16, borderRadius: 8, background: COLORS.accent, border: `2px solid ${COLORS.card}`, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px", boxSizing: "border-box" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: FONT, lineHeight: 1 }}>{count}</span>
                  </span>
                );
              })()}
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
          <DesktopSidebar currentJobIdx={selectedJobIdx} rating={JOBS[selectedJobIdx].rating} personalised={personalised} isSignedIn={isSignedIn} onOpenDrawer={() => setDrawerOpen(true)} onJobSelect={handleJobSelect} onOpenProfile={() => setProfileOpen(true)} coords={JOBS[selectedJobIdx].coords} location={JOBS[selectedJobIdx].location} onMapExpand={() => setMapModalOpen(true)} />
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
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40, background: COLORS.bg, borderTop: `1px solid ${COLORS.border}`, padding: `${S.s2}px ${S.m}px` }}>
          <div style={{ maxWidth: 480, margin: "0 auto", display: "flex", gap: S.s2 }}>
            <button style={{ flex: 1, padding: "6px 22px", borderRadius: 4, border: "2px solid transparent", background: COLORS.accent, color: "#fff", fontSize: 16, fontWeight: 700, lineHeight: "24px", cursor: "pointer", fontFamily: FONT }}>
              Apply
            </button>
            <button style={{ padding: "6px 22px", borderRadius: 4, border: `2px solid ${COLORS.text}`, background: "transparent", fontSize: 16, fontWeight: 700, lineHeight: "24px", cursor: "pointer", fontFamily: FONT, color: COLORS.text }}>
              Save
            </button>
            <button onClick={() => setDrawerOpen(true)} style={{ padding: "6px 22px", borderRadius: 4, border: `2px solid ${COLORS.accent}`, background: COLORS.accentBg, fontSize: 16, fontWeight: 700, lineHeight: "24px", cursor: "pointer", fontFamily: FONT, color: COLORS.accent, whiteSpace: "nowrap" }}>
              Match me
            </button>
          </div>
        </div>
      )}

      <OnboardingDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}
        initialValues={{ postcode: profilePostcode, currentPay: profileCurrentPay, payType: profilePayType, travel: profileTravel, priorities: profilePriorities }}
        onSubmit={(data) => { handleSavePrefs(data); setDrawerOpen(false); }} />

      <BackgroundDrawer open={backgroundDrawerOpen} onClose={() => setBackgroundDrawerOpen(false)}
        initialValues={profileBackground}
        onSubmit={(data) => { setProfileBackground(data); setBackgroundDrawerOpen(false); }} />

      <WorkStyleDrawer open={workStyleDrawerOpen} onClose={() => setWorkStyleDrawerOpen(false)}
        initialValues={workStylePrefs}
        onSubmit={(data) => { setWorkStylePrefs(data); setWorkStyleDrawerOpen(false); }} />

      <LicenceModal open={licenceModalOpen} onClose={() => setLicenceModalOpen(false)}
        userLicences={userLicences} onSave={(s) => setUserLicences(s)} />

      {matchWhyModal}

      <ProfileHub
        open={profileOpen} onClose={() => setProfileOpen(false)}
        isSignedIn={isSignedIn} userEmail={userEmail} onSignIn={handleSignIn}
        postcode={profilePostcode} currentPay={profileCurrentPay} currentPayType={profilePayType} travel={profileTravel} priorities={profilePriorities} rolePrefs={profileRolePrefs}
        userLicences={userLicences} onSavePrefs={(data) => { handleSavePrefs(data); }} onOpenLicenceModal={() => { setProfileOpen(false); setLicenceModalOpen(true); }}
        background={profileBackground} workStyle={workStylePrefs}
        onOpenBackgroundDrawer={() => { setProfileOpen(false); setBackgroundDrawerOpen(true); }}
        onOpenWorkStyleDrawer={() => { setProfileOpen(false); setWorkStyleDrawerOpen(true); }}
        hasPersonalisation={hasPersonalisation} onOpenDrawer={() => { setProfileOpen(false); setDrawerOpen(true); }}
      />

      {/* All findings modal */}
      {allFindingsModalOpen && (
        <>
          <div onClick={() => setAllFindingsModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }} />
          <div onClick={() => setAllFindingsModalOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 101, overflow: "auto", padding: `${S.l}px ${S.m}px` }}>
            <div onClick={e => e.stopPropagation()} style={{ background: COLORS.bg, borderRadius: 5, maxWidth: 640, margin: "0 auto", padding: S.l, position: "relative" }}>
              <button onClick={() => setAllFindingsModalOpen(false)}
                style={{ position: "absolute", top: S.m, right: S.m, background: "none", border: "none", cursor: "pointer", ...T.body1Bold, color: COLORS.muted, fontFamily: FONT }}>
                ✕ Close
              </button>
              <h2 style={{ ...T.heading2, margin: `0 0 ${S.m2}px`, fontFamily: FONT, color: COLORS.text }}>All findings from workers</h2>
              {job.allFindings.map((group) => (
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

      {mapModalOpen && (() => {
        const [lat, lon] = job.coords;
        // Modal bbox (~1.5 km radius) — tighter but enough for neighbourhood context
        const dLat = 0.013, dLon = 0.018;
        const bbox = `${lon - dLon},${lat - dLat},${lon + dLon},${lat + dLat}`;
        const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
        return (
          <>
            <div onClick={() => setMapModalOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100 }} />
            <div onClick={() => setMapModalOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 101, overflow: "auto", padding: `${S.l}px ${S.m}px` }}>
              <div onClick={e => e.stopPropagation()} style={{ background: COLORS.bg, borderRadius: 5, maxWidth: 640, margin: "0 auto", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${S.m}px ${S.m}px ${S.s2}px` }}>
                  <div>
                    <div style={{ ...T.body1Bold, color: COLORS.text, fontFamily: FONT }}>{job.title} · {job.company}</div>
                    <div style={{ ...T.body2, color: COLORS.muted, fontFamily: FONT }}>{job.location}</div>
                  </div>
                  <button onClick={() => setMapModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", ...T.body1Bold, color: COLORS.muted, fontFamily: FONT, flexShrink: 0, marginLeft: S.m }}>✕</button>
                </div>
                <div style={{ height: "60vh" }}>
                  <iframe title="Job location map" src={src} style={{ width: "100%", height: "100%", border: "none", display: "block" }} />
                </div>
              </div>
            </div>
          </>
        );
      })()}

    </div>
  );
}
