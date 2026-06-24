import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { auth } from "./firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// ── Icons ─────────────────────────────────────────────────────────────────────
const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);
const MicIcon = ({ active }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const LabIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v11l-5 5h16l-5-5V3" />
  </svg>
);
const ScanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
  </svg>
);
const PillIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" /><path d="m8.5 8.5 7 7" />
  </svg>
);
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const BotIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" />
    <path d="M12 7v4" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="16" y1="16" x2="16" y2="16" />
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 17z" />
  </svg>
);
const HistoryIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.95" />
  </svg>
);
const NewChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="10" y1="11" x2="14" y2="11" />
  </svg>
);

// ── API ────────────────────────────────────────────────────────────────────────
const API_URL = "https://anbu-health-ai.kindrock-2ca528ff.centralindia.azurecontainerapps.io";

async function callAnbuAPI(message, uploadedFile, mode, phone, chatId, authToken, chatHistory, fileContext) {
  const formData = new FormData();
  formData.append("question", message);
  formData.append("mode", (uploadedFile && mode) ? mode : "general");
  if (uploadedFile) formData.append("image", uploadedFile);
  if (fileContext) formData.append("file_context", fileContext);
  if (phone) formData.append("phone", phone);
  if (chatId) formData.append("chat_id", chatId);
  if (chatHistory && chatHistory.length > 0) formData.append("chat_history", JSON.stringify(chatHistory));
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
  const response = await fetch(`${API_URL}/api/analyze`, { method: "POST", headers, body: formData });
  if (response.status === 429) {
    const errBody = await response.json().catch(() => ({}));
    const err = new Error("DAILY_LIMIT");
    err.prompts = errBody?.detail?.prompts || null;
    err.message_ta = errBody?.detail?.message;
    throw err;
  }
  if (!response.ok) throw new Error(`Server error: ${response.status}`);
  const data = await response.json();
  const answer = data.final_answer || data.sakshi?.final_answer || data.buddhi?.draft_answer || "பதில் கிடைக்கவில்லை. மீண்டும் try பண்ணுங்க.";
  const structured = data.buddhi?.structured_response || null;
  return {
    mode: data.mode,
    answer,
    structured,
    prompts: data.prompts || null,
    compliance_disclaimer: data.compliance_disclaimer || null,
    emergency_alert: data.emergency_alert || null,
  };
}

// ── Firebase Auth API ──────────────────────────────────────────────────────────
async function apiFirebaseSession(idToken) {
  const r = await fetch(`${API_URL}/api/auth/firebase-session`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${idToken}`, "Content-Type": "application/json" },
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.detail || "Firebase session failed");
  return data; // { phone, prompts }
}

async function apiUserStatus(phone, authToken) {
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
  const r = await fetch(`${API_URL}/api/user/status?phone=${encodeURIComponent(phone)}`, { headers });
  if (!r.ok) return null;
  return r.json();
}

async function apiUserHistory(phone, authToken) {
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : undefined;
  const r = await fetch(`${API_URL}/api/user/history?phone=${encodeURIComponent(phone)}`, { headers });
  if (!r.ok) return [];
  const data = await r.json();
  return data.messages || [];
}

// ── Token quota (5000 tokens/day, resets every 12 hours) ──────────────────────
const MAX_TOKENS_PER_DAY = 5000;
const RESET_HOURS = 12; // hours between resets

function getTokenData() {
  try {
    const data = JSON.parse(localStorage.getItem("anbu_tokens_v2") || "{}");
    const now = Date.now();
    const resetMs = RESET_HOURS * 60 * 60 * 1000;
    if (!data.resetAt || now >= data.resetAt) {
      const nextReset = now + resetMs;
      return { tokens: 0, resetAt: nextReset };
    }
    return data;
  } catch { return { tokens: 0, resetAt: Date.now() + RESET_HOURS * 3600000 }; }
}

function saveTokenData(data) {
  try { localStorage.setItem("anbu_tokens_v2", JSON.stringify(data)); } catch {}
}

function incrementTokens(tokensUsed) {
  const data = getTokenData();
  const updated = { ...data, tokens: (data.tokens || 0) + Math.max(tokensUsed || 1, 1) };
  saveTokenData(updated);
  return updated;
}

function getTimeUntilReset(resetAt) {
  const diff = Math.max(0, resetAt - Date.now());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  return `${h}h ${m}m`;
}

// Keep MAX_PROMPTS as alias so sidebar progress bar still works
const MAX_PROMPTS = MAX_TOKENS_PER_DAY;

// ── 1. StructuredLabResult ────────────────────────────────────────────────────
function StructuredLabResult({ data, onFollowUp }) {
  const [lang, setLang] = useState("en");
  if (!data) return null;
  const findings   = data.findings || [];
  const abnormal   = data.abnormal_findings || findings.filter(f => /HIGH|LOW/i.test(f));
  const normalF    = data.normal_findings  || findings.filter(f => !/HIGH|LOW/i.test(f));
  const borderline = data.borderline_findings || [];
  const summary    = data.summary || "Lab report analysis complete.";
  const summaryTa  = data.summary_tamil || summary;
  const rec        = data.recommendation || "";
  const patient    = data.patient_name || "";
  const age        = data.age || "";
  const reportDate = data.report_date || "";
  const labName    = data.lab_name || "";
  const reportType = data.report_type || "";
  const doctorName = data.doctor_name || "";
  const keyPoints  = data.key_points || [];
  const disclaimer = data.disclaimer || "This is for educational purposes only. Always consult a qualified doctor.";
  const catMap = {
    "Glucose":"Blood Sugar","HbA1c":"Blood Sugar","Sugar":"Blood Sugar",
    "Cholesterol":"Lipid Profile","HDL":"Lipid Profile","LDL":"Lipid Profile","Triglyceride":"Lipid Profile",
    "Haemoglobin":"Blood Count","WBC":"Blood Count","RBC":"Blood Count","Platelet":"Blood Count","PCV":"Blood Count",
    "Creatinine":"Kidney","Urea":"Kidney","Uric":"Kidney",
    "SGOT":"Liver","SGPT":"Liver","Bilirubin":"Liver","ALT":"Liver","AST":"Liver",
    "TSH":"Thyroid","T3":"Thyroid","T4":"Thyroid",
  };
  function getCategory(str) {
    const catEmoji = {"Blood Sugar":"🩸","Lipid Profile":"❤️","Blood Count":"🫀","Kidney":"🫘","Liver":"🫁","Thyroid":"🦋"};
    for (const [k, v] of Object.entries(catMap)) {
      if (str.toLowerCase().includes(k.toLowerCase())) return (catEmoji[v]||"🔬") + " " + v;
    }
    return "🔬 Other Tests";
  }
  const grouped = {};
  findings.forEach(f => { const cat = getCategory(f); if (!grouped[cat]) grouped[cat] = []; grouped[cat].push(f); });
  const S = {
    sec:  { background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.09)",borderRadius:12,padding:"12px 14px",marginBottom:10 },
    secD: { background:"rgba(239,68,68,0.05)",border:"0.5px solid rgba(239,68,68,0.22)",borderRadius:12,padding:"12px 14px",marginBottom:10 },
    lbl:  { fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8,display:"block" },
    lb:   (a) => ({ fontSize:11,padding:"3px 10px",borderRadius:6,border:`0.5px solid ${a?"rgba(96,165,250,0.4)":"rgba(255,255,255,0.15)"}`,background:a?"rgba(96,165,250,0.12)":"transparent",color:a?"#60a5fa":"rgba(255,255,255,0.4)",cursor:"pointer" }),
    fq:   { fontSize:12,padding:"5px 12px",borderRadius:8,border:"0.5px solid rgba(255,255,255,0.12)",background:"transparent",color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit" },
  };
  const followUps = [];
  if (abnormal.some(f => /Glucose|HbA1c|Sugar/i.test(f))) followUps.push("Diabetes control பண்றது எப்படி?");
  if (abnormal.some(f => /Cholesterol|HDL|LDL/i.test(f))) followUps.push("Cholesterol கம்மி பண்ண diet என்ன?");
  if (abnormal.length > 0) followUps.push("இந்த results என்ன mean?");
  followUps.push("Doctor கிட்ட என்ன சொல்லணும்?");
  return (
    <div style={{ marginTop:14 }}>
      {(patient||reportDate||labName||doctorName) && (
        <div style={S.sec}>
          <span style={S.lbl}>Patient Info</span>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
            {[["Name",patient],["Age / Gender",age],["Report Date",reportDate],["Lab",labName],["Report Type",reportType],["Doctor",doctorName]].filter(([,v])=>v).map(([k,v])=>(
              <div key={k} style={{ background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"7px 10px" }}>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:2 }}>{k}</div>
                <div style={{ fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.85)" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={S.sec}>
        <div style={{ display:"flex",gap:6,marginBottom:10 }}>
          <button onClick={()=>setLang("en")} style={S.lb(lang==="en")}>English</button>
          <button onClick={()=>setLang("ta")} style={S.lb(lang==="ta")}>Tamil</button>
        </div>
        <p style={{ fontSize:14,lineHeight:1.7,color:"rgba(255,255,255,0.85)",margin:"0 0 10px" }}>{lang==="ta"?summaryTa:summary}</p>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
          {abnormal.length>0&&<span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:500,background:"rgba(248,113,113,0.1)",color:"#f87171" }}>⚠ {abnormal.length} abnormal</span>}
          {normalF.length>0&&<span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:500,background:"rgba(52,211,153,0.1)",color:"#34d399" }}>✓ {normalF.length} normal</span>}
          {borderline.length>0&&<span style={{ display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:12,fontWeight:500,background:"rgba(251,191,36,0.1)",color:"#fbbf24" }}>◉ {borderline.length} borderline</span>}
        </div>
      </div>
      {keyPoints.length>0&&(
        <div style={S.sec}>
          <span style={S.lbl}>🔑 Key Points</span>
          {keyPoints.map((p,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",fontSize:13,color:"rgba(255,255,255,0.8)",borderBottom:i<keyPoints.length-1?"0.5px solid rgba(255,255,255,0.05)":"none" }}>
              <span style={{ flexShrink:0 }}>•</span><span style={{ lineHeight:1.55 }}>{p}</span>
            </div>
          ))}
        </div>
      )}
      {Object.keys(grouped).length>0&&(
        <div style={S.sec}>
          <span style={S.lbl}>Test Results</span>
          {Object.entries(grouped).map(([cat,items])=>(
            <div key={cat}>
              <span style={{ fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",background:"rgba(255,255,255,0.06)",borderRadius:6,padding:"3px 8px",display:"inline-block",margin:"6px 0 4px" }}>{cat}</span>
              {items.map((f,i)=>{
                const isH=/HIGH/i.test(f),isL=/LOW/i.test(f),isB=/BORDER|MONITOR/i.test(f);
                return(
                  <div key={i} style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",borderBottom:"0.5px solid rgba(255,255,255,0.05)",gap:8 }}>
                    <span style={{ fontSize:13,fontWeight:500,flex:1,color:"rgba(255,255,255,0.85)" }}>{f.replace(/\s*(HIGH|LOW|NORMAL|BORDER|MONITOR).*/i,"").trim()}</span>
                    <span style={{ fontSize:12,color:"rgba(255,255,255,0.4)",minWidth:80 }}>{(f.match(/[\d.]+\s*(?:mg|g|%|mmol|mEq|IU|cells|mm)[^\s,]*/i)||[""])[0]}</span>
                    <span>
                      {isH&&<span style={{ fontSize:11,padding:"2px 7px",borderRadius:20,background:"rgba(248,113,113,0.12)",color:"#f87171",border:"0.5px solid rgba(248,113,113,0.3)" }}>HIGH</span>}
                      {isL&&<span style={{ fontSize:11,padding:"2px 7px",borderRadius:20,background:"rgba(251,191,36,0.12)",color:"#fbbf24",border:"0.5px solid rgba(251,191,36,0.3)" }}>LOW</span>}
                      {isB&&<span style={{ fontSize:11,padding:"2px 7px",borderRadius:20,background:"rgba(251,191,36,0.12)",color:"#fbbf24",border:"0.5px solid rgba(251,191,36,0.3)" }}>MONITOR</span>}
                      {!isH&&!isL&&!isB&&<span style={{ fontSize:11,padding:"2px 7px",borderRadius:20,background:"rgba(52,211,153,0.1)",color:"#34d399",border:"0.5px solid rgba(52,211,153,0.25)" }}>NORMAL</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
      {abnormal.length>0&&(
        <div style={S.secD}>
          <span style={{ ...S.lbl,color:"#f87171" }}>Attention — Abnormal Values</span>
          {abnormal.map((f,i)=>(
            <div key={i} style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"7px 0",borderBottom:i<abnormal.length-1?"0.5px solid rgba(239,68,68,0.1)":"none" }}>
              <div>
                <div style={{ fontSize:13,fontWeight:500,color:"#f87171" }}>⚠ {f.replace(/\s*(HIGH|LOW|NORMAL).*/i,"").trim()}</div>
                <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2 }}>{/HIGH/i.test(f)?"Above normal range":"Below normal range"} — doctor review needed</div>
              </div>
              <span style={{ fontSize:11,padding:"2px 7px",borderRadius:20,flexShrink:0,marginLeft:8,background:/HIGH/i.test(f)?"rgba(248,113,113,0.12)":"rgba(251,191,36,0.12)",color:/HIGH/i.test(f)?"#f87171":"#fbbf24",border:`0.5px solid ${/HIGH/i.test(f)?"rgba(248,113,113,0.3)":"rgba(251,191,36,0.3)"}` }}>{/HIGH/i.test(f)?"Critical":"Attention"}</span>
            </div>
          ))}
        </div>
      )}
      {rec&&(
        <div style={S.sec}>
          <span style={S.lbl}>Doctor Advice</span>
          {rec.split(/[.;]/).filter(Boolean).map((item,i,arr)=>(
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",fontSize:13,color:"rgba(255,255,255,0.8)",borderBottom:i<arr.length-1?"0.5px solid rgba(255,255,255,0.05)":"none" }}>
              <span style={{ flexShrink:0 }}>💡</span><span style={{ lineHeight:1.55 }}>{item.trim()}</span>
            </div>
          ))}
        </div>
      )}
      <div style={S.sec}>
        <span style={S.lbl}>💬 இதை கேளுங்க</span>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
          {followUps.map((p,i)=><button key={i} onClick={()=>onFollowUp&&onFollowUp(p)} style={S.fq}>{p} ↗</button>)}
        </div>
      </div>
      <p style={{ fontSize:12,color:"rgba(255,255,255,0.25)",textAlign:"center",paddingTop:4 }}>⚕ {disclaimer}</p>
    </div>
  );
}

// ── 2. StructuredScanResult ───────────────────────────────────────────────────
function StructuredScanResult({ data, onFollowUp }) {
  const [lang, setLang] = useState("en");
  if (!data) return null;
  const scanType  = data.scan_type  || data.scanType  || "Scan";
  const bodyPart  = data.body_part  || data.bodyPart  || "";
  const patient   = data.patient_name || "";
  const scanDate  = data.scan_date  || data.scanDate  || "";
  const scanProvider = data.scan_provider || "";
  const doctorName   = data.doctor_name || "";
  const keyPoints     = data.key_points || [];
  const side      = data.side || "";
  const findings  = data.findings   || [];
  const summary   = data.summary    || "Scan analysis complete.";
  const summaryTa = data.summary_tamil || summary;
  const rec       = data.recommendation || "";
  const implants  = data.implants_detected || data.implantDetected || false;
  const implantD  = data.implant_details  || data.implantDetails  || "";
  const fracture  = data.fracture_visible || data.fractureVisible || false;
  const urgency   = data.urgency    || "routine";
  const limitations = data.limitations || ["Nerve damage (needs clinical exam)","Tendon/ligament tears (needs MRI)","Cartilage quality","Pain severity","Infection (needs blood tests)"];
  const disclaimer= data.disclaimer || "This analysis is AI-generated for educational guidance only — not a radiologist's report.";
  const urgencyMap = {
    emergency:{ color:"#f87171",bg:"rgba(248,113,113,0.1)",icon:"🚨",label:"Emergency — go to hospital now" },
    urgent:   { color:"#f87171",bg:"rgba(248,113,113,0.08)",icon:"⚠️",label:"Urgent — within 24–48 hrs" },
    followup: { color:"#fbbf24",bg:"rgba(251,191,36,0.08)",icon:"📋",label:"Follow-up required — consult surgeon" },
    routine:  { color:"#34d399",bg:"rgba(52,211,153,0.08)",icon:"✅",label:"Routine review — no immediate action" },
    normal:   { color:"#34d399",bg:"rgba(52,211,153,0.08)",icon:"✅",label:"No immediate action needed" },
  };
  const uc = urgencyMap[urgency] || urgencyMap.routine;
  const defaultChecklist = [
    { label:"Bone cortex",       status:fracture?"Disrupted (fracture)":"Normal",ok:!fracture },
    { label:"Implant / hardware",status:implants?"Detected":"None",ok:true },
    { label:"Joint space",       status:"Not clearly evaluable",ok:null },
    { label:"Soft tissue",       status:"No gross abnormality",ok:true },
    { label:"Bone density",      status:"Normal",ok:true },
  ];
  const S = {
    card:  { background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.09)",borderRadius:12,padding:"12px 14px",marginBottom:10 },
    cardD: { background:"rgba(239,68,68,0.05)",border:"0.5px solid rgba(239,68,68,0.22)",borderRadius:12,padding:"12px 14px",marginBottom:10 },
    cardW: { background:"rgba(245,158,11,0.05)",border:"0.5px solid rgba(245,158,11,0.2)",borderRadius:12,padding:"12px 14px",marginBottom:10 },
    lbl:   { fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8,display:"block" },
    lb:    (a)=>({ fontSize:11,padding:"3px 10px",borderRadius:6,border:`0.5px solid ${a?"rgba(96,165,250,0.4)":"rgba(255,255,255,0.15)"}`,background:a?"rgba(96,165,250,0.12)":"transparent",color:a?"#60a5fa":"rgba(255,255,255,0.4)",cursor:"pointer" }),
    fq:    { fontSize:12,padding:"5px 12px",borderRadius:8,border:"0.5px solid rgba(255,255,255,0.12)",background:"transparent",color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit" },
  };
  const followUps = [];
  if (implants) followUps.push("Can I do MRI with metal implant?");
  if (fracture)  followUps.push("Fracture healing எவ்வளவு time?");
  followUps.push("இந்த scan என்ன சொல்கிறது?");
  followUps.push("Doctor கிட்ட என்ன கேக்கணும்?");
  return (
    <div style={{ marginTop:14 }}>
      <div style={S.card}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
          <div style={{ width:40,height:40,borderRadius:10,background:"rgba(96,165,250,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>🩻</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16,fontWeight:500,color:"rgba(255,255,255,0.9)" }}>{scanType}{bodyPart?` — ${bodyPart}`:""}</div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)" }}>{side?`${side} side`:"Medical Imaging Analysis"}</div>
          </div>
          {implants&&<span style={{ fontSize:11,padding:"2px 8px",borderRadius:6,background:"rgba(248,113,113,0.12)",color:"#f87171",border:"0.5px solid rgba(248,113,113,0.3)",flexShrink:0 }}>Post-op</span>}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:8 }}>
          {[["Scan type",scanType],["Body part",bodyPart||"—"],["Patient",patient||"—"],["Date",scanDate||"—"]].map(([k,v])=>(
            <div key={k} style={{ background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"7px 10px" }}>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:2 }}>{k}</div>
              <div style={{ fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.85)" }}>{v}</div>
            </div>
          ))}
          {[["Scan centre",scanProvider],["Doctor",doctorName]].filter(([,v])=>v).map(([k,v])=>(
            <div key={k} style={{ background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"7px 10px" }}>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:2 }}>{k}</div>
              <div style={{ fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.85)" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <span style={S.lbl}>Detected Modality</span>
        <span style={{ fontSize:12,padding:"3px 10px",borderRadius:20,background:"rgba(96,165,250,0.1)",color:"#60a5fa",border:"0.5px solid rgba(96,165,250,0.25)",fontWeight:500 }}>🔬 {scanType}</span>
      </div>
      <div style={S.card}>
        <div style={{ display:"flex",gap:6,marginBottom:10 }}>
          <button onClick={()=>setLang("en")} style={S.lb(lang==="en")}>English</button>
          <button onClick={()=>setLang("ta")} style={S.lb(lang==="ta")}>Tamil</button>
        </div>
        <p style={{ fontSize:14,lineHeight:1.7,color:"rgba(255,255,255,0.85)",margin:0 }}>{lang==="ta"?summaryTa:summary}</p>
      </div>
      {keyPoints.length>0&&(
        <div style={S.card}>
          <span style={S.lbl}>🔑 Key Points</span>
          {keyPoints.map((p,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",fontSize:13,color:"rgba(255,255,255,0.8)",borderBottom:i<keyPoints.length-1?"0.5px solid rgba(255,255,255,0.05)":"none" }}>
              <span style={{ flexShrink:0 }}>•</span><span style={{ lineHeight:1.55 }}>{p}</span>
            </div>
          ))}
        </div>
      )}
      <div style={{ display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,marginBottom:10,background:uc.bg,border:`0.5px solid ${uc.color}33` }}>
        <span style={{ fontSize:18,flexShrink:0 }}>{uc.icon}</span>
        <span style={{ fontSize:13,fontWeight:500,color:uc.color }}>{uc.label}</span>
      </div>
      {findings.length>0&&(
        <div style={S.card}>
          <span style={S.lbl}>Key Findings</span>
          {findings.map((f,i)=>{
            const fStr=typeof f==="string"?f:(f.title||"");
            const isA=/abnormal|fracture|damage|hardware|implant|disrupted/i.test(fStr);
            const isN=/normal|intact|no abnormality|satisfactory|maintained/i.test(fStr);
            const dotC=isA?"#f87171":isN?"#34d399":"#fbbf24";
            return(
              <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:i<findings.length-1?"0.5px solid rgba(255,255,255,0.05)":"none" }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:dotC,flexShrink:0,marginTop:5 }}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13,color:"rgba(255,255,255,0.82)",lineHeight:1.5,fontWeight:isA?500:400 }}>{fStr}</div>
                  {typeof f==="object"&&f.detail&&<div style={{ fontSize:12,color:"rgba(255,255,255,0.4)",marginTop:2 }}>{f.detail}</div>}
                </div>
                {isA&&<span style={{ fontSize:11,padding:"2px 7px",borderRadius:20,flexShrink:0,background:"rgba(251,191,36,0.1)",color:"#fbbf24",border:"0.5px solid rgba(251,191,36,0.25)" }}>Review</span>}
                {isN&&!isA&&<span style={{ fontSize:11,padding:"2px 7px",borderRadius:20,flexShrink:0,background:"rgba(52,211,153,0.1)",color:"#34d399",border:"0.5px solid rgba(52,211,153,0.25)" }}>Normal</span>}
              </div>
            );
          })}
        </div>
      )}
      <div style={S.card}>
        <span style={S.lbl}>Structure Checklist</span>
        {defaultChecklist.map((item,i)=>(
          <div key={i} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<defaultChecklist.length-1?"0.5px solid rgba(255,255,255,0.05)":"none",fontSize:13 }}>
            <span style={{ flex:1,color:"rgba(255,255,255,0.6)" }}>{item.label}</span>
            <span style={{ fontWeight:500,color:item.ok===false?"#f87171":item.ok===null?"rgba(255,255,255,0.4)":"#34d399" }}>{item.status}</span>
          </div>
        ))}
      </div>
      {implants&&(
        <div style={S.cardD}>
          <div style={{ display:"flex",gap:8,alignItems:"center",marginBottom:implantD?8:0,fontSize:13,color:"#fca5a5",fontWeight:500 }}>
            <span style={{ flexShrink:0 }}>⚠️</span>
            Metal implant detected — inform all future doctors, especially before MRI
          </div>
          {implantD&&<div style={{ fontSize:12,color:"rgba(255,255,255,0.5)",paddingLeft:24 }}>{implantD}</div>}
        </div>
      )}
      <div style={S.card}>
        <span style={S.lbl}>What this scan cannot show</span>
        <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:8 }}>
          {limitations.map((l,i)=><span key={i} style={{ fontSize:12,padding:"3px 10px",borderRadius:20,background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.4)",border:"0.5px solid rgba(255,255,255,0.1)" }}>{l}</span>)}
        </div>
        <p style={{ fontSize:12,color:"rgba(255,255,255,0.3)",margin:0 }}>CT/X-ray shows bone and hardware only. Soft tissue, nerve, and vascular status require additional investigation.</p>
      </div>
      {rec&&(
        <div style={S.card}>
          <span style={S.lbl}>Next Steps</span>
          {rec.split(/[.;]/).filter(Boolean).map((item,i,arr)=>(
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",fontSize:13,color:"rgba(255,255,255,0.8)",borderBottom:i<arr.length-1?"0.5px solid rgba(255,255,255,0.05)":"none" }}>
              <span style={{ flexShrink:0 }}>→</span><span style={{ lineHeight:1.55 }}>{item.trim()}</span>
            </div>
          ))}
        </div>
      )}
      <div style={S.cardW}>
        <div style={{ display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:"#fbbf24" }}>
          <span style={{ flexShrink:0,marginTop:1 }}>ℹ️</span>
          <span style={{ lineHeight:1.55 }}>{disclaimer} <strong>Always get a formal radiology report</strong> from a qualified radiologist.</span>
        </div>
      </div>
      <div style={S.card}>
        <span style={S.lbl}>💬 இதை கேளுங்க</span>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
          {followUps.map((p,i)=><button key={i} onClick={()=>onFollowUp&&onFollowUp(p)} style={S.fq}>{p} ↗</button>)}
        </div>
      </div>
    </div>
  );
}

// ── 3. StructuredMedicineResult ───────────────────────────────────────────────
function StructuredMedicineResult({ data, onFollowUp }) {
  const [lang, setLang] = useState("en");
  if (!data) return null;
  const drugName    = data.drug_name   || data.drugName   || "";
  const drugCat     = data.drug_category||data.drugCategory||"";
  const salt        = data.salt        || drugCat         || "";
  const manufacturer= data.manufacturer|| "";
  const mfgDate     = data.mfg_date   || data.mfgDate    || "";
  const expDate     = data.exp_date   || data.expDate     || "";
  const expiryStatus= data.expiry_status || null;
  const keyPoints   = data.key_points || [];
  const mrp         = data.mrp        || "";
  const uses        = data.uses        || [];
  const dosage      = data.dosage      || "";
  const dosageAdult = data.dosage_adult|| "";
  const dosageChild = data.dosage_child|| "";
  const whenToTake  = data.when_to_take|| "";
  const howToTake   = data.how_to_take || "";
  const duration    = data.duration    || "";
  const sideEffects = data.side_effects||data.sideEffects ||[];
  const warnings    = data.warnings    || [];
  const interactions= data.interactions|| [];
  const alternatives= data.alternatives|| [];
  const summary     = data.summary     || "";
  const summaryTa   = data.summary_tamil||summary;
  const rec         = data.recommendation || "";
  const disclaimer  = data.disclaimer  || "Educational information only — always follow your doctor's prescription.";
  const isRx        = data.is_rx!==undefined?data.is_rx:true;
  const mid         = Math.ceil(sideEffects.length/2);
  const mildSE      = sideEffects.slice(0,mid);
  const seriousSE   = sideEffects.slice(mid);
  const populations = [
    { label:"Pregnancy",     val:data.pregnancy    ||"Use with caution",ok:false },
    { label:"Breastfeeding", val:data.breastfeeding||"Ask doctor",      ok:null  },
    { label:"Children",      val:data.children     ||"Weight-based",    ok:null  },
    { label:"Elderly",       val:data.elderly      ||"Lower dose",      ok:null  },
    { label:"Liver disease", val:warnings.some(w=>/liver/i.test(w))?"Avoid / doctor only":"Ask doctor",ok:false },
    { label:"Kidney disease",val:data.kidney       ||"Reduce dose",     ok:null  },
  ];
  const S = {
    card:  { background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.09)",borderRadius:12,padding:"12px 14px",marginBottom:10 },
    cardD: { background:"rgba(239,68,68,0.05)",border:"0.5px solid rgba(239,68,68,0.22)",borderRadius:12,padding:"12px 14px",marginBottom:10 },
    cardW: { background:"rgba(245,158,11,0.05)",border:"0.5px solid rgba(245,158,11,0.2)",borderRadius:12,padding:"12px 14px",marginBottom:10 },
    lbl:   { fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8,display:"block" },
    lb:    (a)=>({ fontSize:11,padding:"3px 10px",borderRadius:6,border:`0.5px solid ${a?"rgba(96,165,250,0.4)":"rgba(255,255,255,0.15)"}`,background:a?"rgba(96,165,250,0.12)":"transparent",color:a?"#60a5fa":"rgba(255,255,255,0.4)",cursor:"pointer" }),
    row:   (last)=>({ display:"flex",alignItems:"flex-start",gap:10,padding:"7px 0",borderBottom:last?"none":"0.5px solid rgba(255,255,255,0.05)",fontSize:13 }),
    rl:    { color:"rgba(255,255,255,0.4)",minWidth:130,flexShrink:0 },
    rv:    { color:"rgba(255,255,255,0.85)",fontWeight:500,flex:1 },
    fq:    { fontSize:12,padding:"5px 12px",borderRadius:8,border:"0.5px solid rgba(255,255,255,0.12)",background:"transparent",color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit" },
  };
  const followUps = [
    drugName?`Can I take ${drugName} during pregnancy?`:"Safe during pregnancy?",
    "What is maximum daily dose?",
    drugName?`${drugName} side effects in Tamil`:"Side effects in Tamil",
    "Doctor prescription தேவையா?",
  ];
  return (
    <div style={{ marginTop:14 }}>
      <div style={S.card}>
        <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:12 }}>
          <div style={{ width:40,height:40,borderRadius:10,background:"rgba(96,165,250,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0 }}>💊</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:16,fontWeight:500,color:"rgba(255,255,255,0.9)" }}>{drugName||"Medicine"}</div>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.4)" }}>{salt||drugCat}</div>
          </div>
          {isRx&&<span style={{ fontSize:11,padding:"2px 8px",borderRadius:6,background:"rgba(248,113,113,0.12)",color:"#f87171",border:"0.5px solid rgba(248,113,113,0.3)",fontWeight:700,flexShrink:0 }}>Rx</span>}
        </div>
        {salt        &&<div style={S.row(false)}><span style={S.rl}>Salt / molecule</span><span style={S.rv}>{salt}</span></div>}
        {manufacturer&&<div style={S.row(false)}><span style={S.rl}>Manufacturer</span><span style={S.rv}>{manufacturer}</span></div>}
        {drugCat     &&<div style={S.row(false)}><span style={S.rl}>Drug class</span><span style={S.rv}>{drugCat}</span></div>}
        {(mfgDate||expDate)&&<div style={S.row(false)}><span style={S.rl}>Mfg / Exp</span><span style={S.rv}>{mfgDate&&`Mfg: ${mfgDate}`}{mfgDate&&expDate&&" · "}{expDate&&`Exp: ${expDate}`}</span></div>}
        {mrp         &&<div style={S.row(true)}><span style={S.rl}>MRP</span><span style={S.rv}>{mrp}</span></div>}
      </div>
      {expiryStatus&&expiryStatus.status&&expiryStatus.status!=="unknown"&&(
        <div style={expiryStatus.status==="EXPIRED"?S.cardD:S.cardW}>
          <div style={{ display:"flex",gap:8,alignItems:"flex-start",fontSize:13,color:expiryStatus.status==="EXPIRED"?"#f87171":expiryStatus.status==="EXPIRING_SOON"?"#fbbf24":"#34d399" }}>
            <span style={{ flexShrink:0 }}>{expiryStatus.status==="EXPIRED"?"🚫":expiryStatus.status==="EXPIRING_SOON"?"⏰":"✅"}</span>
            <span style={{ lineHeight:1.55 }}>{expiryStatus.message || (expiryStatus.status==="EXPIRED"?"This medicine has expired — do not use.":"Expiry checked.")}</span>
          </div>
        </div>
      )}
      {summary&&(
        <div style={S.card}>
          <div style={{ display:"flex",gap:6,marginBottom:10 }}>
            <button onClick={()=>setLang("en")} style={S.lb(lang==="en")}>English</button>
            <button onClick={()=>setLang("ta")} style={S.lb(lang==="ta")}>Tamil</button>
          </div>
          <p style={{ fontSize:14,lineHeight:1.7,color:"rgba(255,255,255,0.85)",margin:0 }}>{lang==="ta"?summaryTa:summary}</p>
        </div>
      )}
      {keyPoints.length>0&&(
        <div style={S.card}>
          <span style={S.lbl}>🔑 Key Points</span>
          {keyPoints.map((p,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",fontSize:13,color:"rgba(255,255,255,0.8)",borderBottom:i<keyPoints.length-1?"0.5px solid rgba(255,255,255,0.05)":"none" }}>
              <span style={{ flexShrink:0 }}>•</span><span style={{ lineHeight:1.55 }}>{p}</span>
            </div>
          ))}
        </div>
      )}
      {uses.length>0&&(
        <div style={S.card}>
          <span style={S.lbl}>Uses / Indications</span>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
            {uses.map((u,i)=><span key={i} style={{ fontSize:12,padding:"3px 10px",borderRadius:20,background:"rgba(96,165,250,0.1)",color:"#60a5fa",border:"0.5px solid rgba(96,165,250,0.25)",fontWeight:500 }}>{u}</span>)}
          </div>
        </div>
      )}
      <div style={S.card}>
        <span style={S.lbl}>Dosage & How to Take</span>
        {dosageAdult&&<div style={S.row(false)}><span style={S.rl}>Adults</span><span style={S.rv}>{dosageAdult}</span></div>}
        {dosageChild&&<div style={S.row(false)}><span style={S.rl}>Children</span><span style={S.rv}>{dosageChild}</span></div>}
        {!dosageAdult&&dosage&&<div style={S.row(false)}><span style={S.rl}>Dosage</span><span style={S.rv}>{dosage}</span></div>}
        {whenToTake &&<div style={S.row(false)}><span style={S.rl}>When to take</span><span style={S.rv}>{whenToTake}</span></div>}
        {howToTake  &&<div style={S.row(false)}><span style={S.rl}>How to take</span><span style={S.rv}>{howToTake}</span></div>}
        {duration   &&<div style={S.row(true)}><span style={S.rl}>Duration</span><span style={S.rv}>{duration}</span></div>}
        {!dosage&&!dosageAdult&&<div style={S.row(true)}><span style={S.rl}>Dosage</span><span style={S.rv}>Doctor prescription follow பண்ணுங்க</span></div>}
      </div>
      {sideEffects.length>0&&(
        <div style={S.card}>
          <span style={S.lbl}>Side Effects</span>
          {mildSE.length>0&&<>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:6 }}>Common — may not need attention</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:10 }}>
              {mildSE.map((e,i)=><span key={i} style={{ fontSize:12,padding:"3px 10px",borderRadius:20,background:"rgba(251,191,36,0.1)",color:"#fbbf24",border:"0.5px solid rgba(251,191,36,0.25)",fontWeight:500 }}>{e}</span>)}
            </div>
          </>}
          {seriousSE.length>0&&<>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.35)",marginBottom:6 }}>Serious — stop and consult doctor</div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
              {seriousSE.map((e,i)=><span key={i} style={{ fontSize:12,padding:"3px 10px",borderRadius:20,background:"rgba(248,113,113,0.1)",color:"#f87171",border:"0.5px solid rgba(248,113,113,0.25)",fontWeight:500 }}>{e}</span>)}
            </div>
          </>}
        </div>
      )}
      {warnings.length>0&&(
        <div style={S.cardD}>
          <span style={{ ...S.lbl,color:"#f87171" }}>Warnings & Contraindications</span>
          {warnings.map((w,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",borderBottom:i<warnings.length-1?"0.5px solid rgba(239,68,68,0.1)":"none",fontSize:13,color:"#fca5a5" }}>
              <span style={{ flexShrink:0,marginTop:1 }}>⚠</span><span style={{ lineHeight:1.5 }}>{w}</span>
            </div>
          ))}
        </div>
      )}
      {interactions.length>0&&(
        <div style={S.card}>
          <span style={S.lbl}>Drug Interactions</span>
          {interactions.map((item,i)=>(
            <div key={i} style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",borderBottom:i<interactions.length-1?"0.5px solid rgba(255,255,255,0.05)":"none",fontSize:13,color:"rgba(255,255,255,0.75)" }}>
              <span style={{ flexShrink:0,color:"#fbbf24" }}>✕</span>
              <span style={{ lineHeight:1.5 }}>{typeof item==="string"?item:`${item.drug} — ${item.effect}`}</span>
            </div>
          ))}
        </div>
      )}
      <div style={S.card}>
        <span style={S.lbl}>Safety — Special Groups</span>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8 }}>
          {populations.map((p,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"7px 10px" }}>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)",marginBottom:3 }}>{p.label}</div>
              <div style={{ fontSize:12,fontWeight:600,color:p.ok===false?"#fbbf24":p.ok===true?"#34d399":"rgba(255,255,255,0.6)" }}>{p.val}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={S.card}>
        <span style={S.lbl}>Storage & Handling</span>
        <div style={S.row(false)}><span style={S.rl}>Store below</span><span style={S.rv}>30°C · Protect from light and moisture</span></div>
        <div style={S.row(false)}><span style={S.rl}>Children</span><span style={S.rv}>Keep out of reach</span></div>
        <div style={S.row(true)}><span style={S.rl}>Expired medicine</span><span style={S.rv}>Do not use — dispose safely</span></div>
      </div>
      <div style={S.cardW}>
        <span style={{ ...S.lbl,color:"#fbbf24" }}>Missed Dose / Overdose</span>
        <div style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",fontSize:13,color:"#fbbf24",borderBottom:"0.5px solid rgba(245,158,11,0.1)" }}>
          <span style={{ flexShrink:0 }}>⏰</span><span><strong>Missed:</strong> Take as soon as remembered. If next dose is near, skip — do not double up.</span>
        </div>
        <div style={{ display:"flex",alignItems:"flex-start",gap:8,padding:"5px 0",fontSize:13,color:"#f87171" }}>
          <span style={{ flexShrink:0 }}>🚨</span><span><strong>Overdose:</strong> Seek emergency care immediately — even without symptoms. Liver damage may appear 1–3 days later.</span>
        </div>
      </div>
      {rec&&(
        <div style={S.card}>
          <span style={S.lbl}>Doctor Advice</span>
          <p style={{ fontSize:13,lineHeight:1.7,color:"rgba(255,255,255,0.82)",margin:0 }}>{rec}</p>
        </div>
      )}
      {alternatives.length>0&&(
        <div style={S.card}>
          <span style={S.lbl}>Alternatives / Similar Medicines</span>
          <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginBottom:8 }}>
            {alternatives.map((a,i)=><span key={i} style={{ fontSize:12,padding:"3px 10px",borderRadius:20,background:"rgba(255,255,255,0.05)",color:"rgba(255,255,255,0.5)",border:"0.5px solid rgba(255,255,255,0.1)" }}>{a}</span>)}
          </div>
          <p style={{ fontSize:12,color:"rgba(255,255,255,0.3)",margin:0 }}>All contain the same active salt. Brand choice does not affect efficacy.</p>
        </div>
      )}
      <div style={S.card}>
        <span style={S.lbl}>💬 இதை கேளுங்க</span>
        <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
          {followUps.map((p,i)=><button key={i} onClick={()=>onFollowUp&&onFollowUp(p)} style={S.fq}>{p} ↗</button>)}
        </div>
      </div>
      <p style={{ fontSize:12,color:"rgba(255,255,255,0.25)",textAlign:"center",paddingTop:4 }}>⚕ {disclaimer}</p>
    </div>
  );
}

// ── MessageBubble ──────────────────────────────────────────────────────────────
function MessageBubble({ msg, isLast, onFollowUp }) {
  const isUser = msg.role === "user";
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef(null);

  const stopAudio = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setAudioPlaying(false);
    setAudioLoading(false);
  };

  const speakText = async () => {
    if (audioPlaying || audioLoading) { stopAudio(); return; }
    const text = msg.content.slice(0, 600);
    setAudioLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang: "ta-IN" }),
      });
      if (!res.ok) throw new Error("tts_failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setAudioPlaying(false); URL.revokeObjectURL(url); };
      audio.onerror = () => { setAudioPlaying(false); URL.revokeObjectURL(url); };
      setAudioLoading(false);
      setAudioPlaying(true);
      audio.play();
    } catch (e) {
      // Sarvam unreachable — fall back to browser voice so Listen still works
      setAudioLoading(false);
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "ta-IN"; utter.rate = 0.9;
      setAudioPlaying(true);
      utter.onend = () => setAudioPlaying(false);
      window.speechSynthesis.speak(utter);
    }
  };
  const hasLabOrScan = msg.structured && (msg.fileMode === "lab" || msg.fileMode === "scan") && (msg.structured.findings || msg.structured.urgency);
  const hasMedicine  = msg.structured && msg.fileMode === "medicine" && (msg.structured.uses || msg.structured.dosage || msg.structured.side_effects || msg.structured.sideEffects);
  const isScan       = msg.fileMode === "scan";
  return (
    <div style={{ display:"flex",gap:10,padding:"6px 0",flexDirection:isUser?"row-reverse":"row",alignItems:"flex-start",animation:isLast?"slideUp 0.3s ease":"none" }}>
      <div style={{ width:32,height:32,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:isUser?"linear-gradient(135deg, #6366f1, #8b5cf6)":"linear-gradient(135deg, #059669, #10b981)",boxShadow:isUser?"0 2px 8px rgba(99,102,241,0.4)":"0 2px 8px rgba(16,185,129,0.35)" }}>
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>
      <div style={{ maxWidth:"75%",minWidth:80 }}>
        {msg.file && (
          <div style={{ background:"rgba(255,255,255,0.06)",borderRadius:"12px 12px 0 0",padding:"8px 12px",border:"1px solid rgba(255,255,255,0.1)",borderBottom:"none",display:"flex",alignItems:"center",gap:8,fontSize:12,color:"rgba(255,255,255,0.6)" }}>
            <span style={{ fontSize:18 }}>{msg.fileMode==="lab"?"🧪":msg.fileMode==="scan"?"🩻":"💊"}</span>
            <span>{msg.file}</span>
          </div>
        )}
        <div style={{ background:isUser?"linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))":"rgba(255,255,255,0.05)",border:isUser?"1px solid rgba(99,102,241,0.35)":"1px solid rgba(255,255,255,0.08)",borderRadius:msg.file?"0 12px 12px 12px":(isUser?"16px 4px 16px 16px":"4px 16px 16px 16px"),padding:"11px 14px" }}>
          {!isUser && <EmergencyAlert message={msg.emergency_alert} />}
          <p style={{ margin:0,fontSize:14,lineHeight:1.65,color:"rgba(255,255,255,0.88)",whiteSpace:"pre-wrap" }}>{msg.content}</p>
          {hasLabOrScan && !hasMedicine && (isScan ? <StructuredScanResult data={msg.structured} onFollowUp={onFollowUp} /> : <StructuredLabResult data={msg.structured} onFollowUp={onFollowUp} />)}
          {hasMedicine && <StructuredMedicineResult data={msg.structured} onFollowUp={onFollowUp} />}
          {!isUser && <ComplianceDisclaimer text={msg.compliance_disclaimer} />}
        </div>
        {!isUser && (
          <div style={{ display:"flex",gap:8,marginTop:5,paddingLeft:4 }}>
            <button onClick={speakText} style={{ display:"flex",alignItems:"center",gap:4,fontSize:11,color:audioPlaying?"#10b981":"rgba(255,255,255,0.35)",background:"none",border:"none",cursor:"pointer",padding:"2px 6px",borderRadius:4,transition:"color 0.2s" }}>
              {audioLoading ? "⏳ Loading..." : audioPlaying ? "🔊 Playing..." : "🔈 Listen (Tamil)"}
            </button>
            <span style={{ color:"rgba(255,255,255,0.15)",fontSize:11 }}>
              {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour:"2-digit",minute:"2-digit" })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display:"flex",gap:10,padding:"6px 0",alignItems:"flex-start" }}>
      <div style={{ width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(135deg, #059669, #10b981)" }}><BotIcon /></div>
      <div style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:"4px 16px 16px 16px",padding:"14px 18px" }}>
        <div style={{ display:"flex",gap:5,alignItems:"center" }}>
          {[0,1,2].map(i=><div key={i} style={{ width:7,height:7,borderRadius:"50%",background:"#10b981",animation:`bounce 1.2s ${i*0.15}s infinite` }} />)}
        </div>
      </div>
    </div>
  );
}

function UploadModal({ mode, onClose, onUpload }) {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();
  const modeConfig = {
    lab:      { emoji:"🧪",title:"Lab Report Upload",  subtitle:"Blood test, urine test, sugar report",  color:"#60a5fa",accept:".pdf,.jpg,.jpeg,.png" },
    scan:     { emoji:"🩻",title:"X-Ray / Scan Upload",subtitle:"Chest X-ray, ultrasound, MRI scan",      color:"#a78bfa",accept:".jpg,.jpeg,.png,.dicom" },
    medicine: { emoji:"💊",title:"Medicine Photo",      subtitle:"Take a photo of medicine strip or box",  color:"#34d399",accept:".jpg,.jpeg,.png" },
  }[mode];
  const handleFile = (file) => setSelectedFile(file);
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); };
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:20 }}>
      <div style={{ background:"#1a1a2e",border:"1px solid rgba(255,255,255,0.12)",borderRadius:20,padding:28,width:"100%",maxWidth:400,animation:"slideUp 0.3s ease" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20 }}>
          <div>
            <div style={{ fontSize:28,marginBottom:4 }}>{modeConfig.emoji}</div>
            <h3 style={{ margin:0,fontSize:17,fontWeight:700,color:"white" }}>{modeConfig.title}</h3>
            <p style={{ margin:"4px 0 0",fontSize:12,color:"rgba(255,255,255,0.45)" }}>{modeConfig.subtitle}</p>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.08)",border:"none",borderRadius:"50%",width:32,height:32,cursor:"pointer",color:"rgba(255,255,255,0.6)",display:"flex",alignItems:"center",justifyContent:"center" }}><CloseIcon /></button>
        </div>
        <div onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={handleDrop} onClick={()=>fileInputRef.current?.click()}
          style={{ border:`2px dashed ${dragging?modeConfig.color:"rgba(255,255,255,0.15)"}`,borderRadius:14,padding:"30px 20px",textAlign:"center",cursor:"pointer",background:dragging?`${modeConfig.color}08`:"rgba(255,255,255,0.02)",transition:"all 0.2s",marginBottom:16 }}>
          <input ref={fileInputRef} type="file" accept={modeConfig.accept} style={{ display:"none" }} onChange={e=>handleFile(e.target.files[0])} />
          {selectedFile ? (
            <><div style={{ fontSize:36,marginBottom:8 }}>✅</div>
            <p style={{ margin:0,fontSize:14,color:modeConfig.color,fontWeight:600 }}>{selectedFile.name}</p>
            <p style={{ margin:"4px 0 0",fontSize:12,color:"rgba(255,255,255,0.4)" }}>{(selectedFile.size/1024).toFixed(0)} KB</p></>
          ) : (
            <><div style={{ color:"rgba(255,255,255,0.3)",marginBottom:10 }}><UploadIcon /></div>
            <p style={{ margin:0,fontSize:14,color:"rgba(255,255,255,0.5)" }}>Tap to upload or drag & drop</p>
            <p style={{ margin:"4px 0 0",fontSize:12,color:"rgba(255,255,255,0.25)" }}>{modeConfig.accept}</p></>
          )}
        </div>
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={onClose} style={{ flex:1,padding:"11px 0",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.6)",fontSize:14,cursor:"pointer" }}>Cancel</button>
          <button onClick={()=>selectedFile&&onUpload(selectedFile,mode)} disabled={!selectedFile}
            style={{ flex:2,padding:"11px 0",borderRadius:10,border:"none",background:selectedFile?`linear-gradient(135deg, ${modeConfig.color}, ${modeConfig.color}bb)`:"rgba(255,255,255,0.08)",color:selectedFile?"white":"rgba(255,255,255,0.3)",fontSize:14,fontWeight:600,cursor:selectedFile?"pointer":"default",transition:"all 0.2s" }}>
            Analyze {modeConfig.emoji}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ConsentModal — DPDP Act 2023 §6 consent capture ───────────────────────────
function ConsentModal({ onConsent }) {
  const handleAgree = async () => {
    try { localStorage.setItem("anbu_consent_v1", "true"); } catch {}
    try {
      const fd = new FormData();
      fd.append("phone", "anonymous");
      fd.append("consent_given", "true");
      fd.append("consent_version", "1.0");
      await fetch(`${API_URL}/api/consent`, { method: "POST", body: fd });
    } catch {}
    onConsent(true);
  };

  const handleDecline = () => {
    try { localStorage.setItem("anbu_consent_v1", "false"); } catch {}
    onConsent(false);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#1a1f2e", borderRadius: 16, padding: 28, maxWidth: 420, width: "100%",
        border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <span style={{ fontSize: 28 }}>🏥</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>Anbu Health AI</div>
            <div style={{ color: "#6ee7b7", fontSize: 12 }}>தகவல் & ஒப்புதல் / Data & Consent</div>
          </div>
        </div>

        <div style={{
          background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: 10, padding: 14, marginBottom: 16, fontSize: 13, color: "#a7f3d0", lineHeight: 1.6,
        }}>
          <strong>இந்த app பயன்படுத்த முன்:</strong><br />
          நாங்கள் collect பண்றோம்:
          <ul style={{ margin: "8px 0 0 0", paddingLeft: 16 }}>
            <li>உங்கள் phone number (login-க்கு)</li>
            <li>நீங்கள் கேட்கும் health questions</li>
            <li>Upload பண்ணும் images (lab reports, scans, medicines)</li>
          </ul>
        </div>

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: 16 }}>
          <strong style={{ color: "rgba(255,255,255,0.8)" }}>Data stored on:</strong> Azure Central India + Supabase (encrypted)<br />
          <strong style={{ color: "rgba(255,255,255,0.8)" }}>Your rights (DPDP Act 2023):</strong> Access, correct, or delete your data anytime via Settings.<br />
          <strong style={{ color: "rgba(255,255,255,0.8)" }}>Retention:</strong> Chat history kept for 90 days, then auto-deleted.<br />
          <strong style={{ color: "rgba(255,255,255,0.8)" }}>Purpose:</strong> Health information service only — not a diagnostic or prescription service.
        </div>

        <div style={{
          background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
          borderRadius: 10, padding: 12, marginBottom: 20, fontSize: 12, color: "#fca5a5", lineHeight: 1.6,
        }}>
          ⚠️ <strong>Anbu Health AI health information மட்டும் தரும்.</strong><br />
          இது medical diagnosis, prescription, அல்லது doctor advice இல்ல.<br />
          எந்த treatment-க்கும் Registered Doctor கிட்ட போங்க.
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={handleDecline}
            style={{
              flex: 1, padding: "11px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 14,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAgree}
            style={{
              flex: 2, padding: "11px 0", borderRadius: 10, border: "none",
              background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff",
              cursor: "pointer", fontSize: 14, fontWeight: 600,
            }}
          >
            ✓ புரிகிறது, தொடர்க (I Agree & Continue)
          </button>
        </div>
      </div>
    </div>
  );
}

// ── EmergencyAlert — Telemedicine Guidelines 2020, Clause 3.5.5 ───────────────
function EmergencyAlert({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "rgba(239,68,68,0.15)", border: "1.5px solid #ef4444",
      borderRadius: 10, padding: "12px 14px", margin: "0 0 8px 0",
      display: "flex", alignItems: "flex-start", gap: 10,
    }}>
      <span style={{ fontSize: 20, flexShrink: 0 }}>🚨</span>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#f87171", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
          EMERGENCY / அவசரம்
        </div>
        <div style={{ color: "#fca5a5", fontSize: 13, lineHeight: 1.5 }}>{message}</div>
      </div>
      <a
        href="tel:108"
        style={{
          flexShrink: 0, background: "#ef4444", color: "#fff", borderRadius: 8,
          padding: "6px 12px", textDecoration: "none", fontWeight: 700, fontSize: 14,
        }}
      >
        📞 108
      </a>
    </div>
  );
}

// ── ComplianceDisclaimer — mandatory disclaimer on every AI health answer ─────
function ComplianceDisclaimer({ text }) {
  if (!text) return null;
  return (
    <div style={{
      borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 10, paddingTop: 8,
      fontSize: 11, color: "rgba(255,255,255,0.3)", lineHeight: 1.5,
      display: "flex", alignItems: "flex-start", gap: 6,
    }}>
      <span style={{ flexShrink: 0, fontSize: 13 }}>ℹ️</span>
      <span>{text}</span>
    </div>
  );
}

// ── DeleteDataModal — DPDP Act 2023 §12, Right to Erasure ─────────────────────
// The backend's DELETE /api/data/delete requires a fresh OTP (sent via
// Firebase Phone Auth on the frontend). All OTP flows use Firebase.
function DeleteDataModal({ defaultPhone, onClose, onDeleted }) {
  const [phone, setPhone] = useState(defaultPhone || "");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("confirm"); // confirm | otp | deleting | done
  const [error, setError] = useState("");

  const sendOtp = async () => {
    if (phone.length !== 10) { setError("சரியான 10 எண் குறிப்பிடு"); return; }
    setError("");
    try {
      const fd = new FormData();
      fd.append("phone", phone);
      const r = await fetch(`${API_URL}/api/auth/send-otp`, { method: "POST", body: fd });
      if (!r.ok) { const b = await r.json().catch(()=>({})); throw new Error(b.detail || "OTP send failed"); }
      setStep("otp");
    } catch (e) {
      setError(e.message || "OTP send failed. Try again.");
    }
  };

  const confirmDelete = async () => {
    if (otp.length < 4) { setError("OTP குறிப்பிடு"); return; }
    setError(""); setStep("deleting");
    try {
      const fd = new FormData();
      fd.append("phone", phone);
      fd.append("otp", otp);
      const r = await fetch(`${API_URL}/api/data/delete`, { method: "DELETE", body: fd });
      if (!r.ok) { const b = await r.json().catch(()=>({})); throw new Error(b.detail || "Deletion failed"); }
      try { localStorage.clear(); } catch {}
      setStep("done");
      setTimeout(() => { onDeleted?.(); window.location.reload(); }, 1800);
    } catch (e) {
      setError(e.message || "Deletion failed. Try again.");
      setStep("otp");
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1100,
      background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}>
      <div style={{
        background: "#1a1f2e", borderRadius: 16, padding: 24, maxWidth: 380, width: "100%",
        border: "1px solid rgba(239,68,68,0.25)", boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 22 }}>🗑️</span>
          <div style={{ color: "#f87171", fontWeight: 700, fontSize: 15 }}>Delete My Data</div>
        </div>

        {step === "confirm" && (
          <>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: 14 }}>
              இது உங்கள் chat history, usage records மற்றும் account-ஐ <strong>நிரந்தரமாக</strong> delete செய்யும்.
              இதை மீட்க முடியாது. தொடர OTP verify பண்ணணும்.
            </p>
            <input
              value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,"").slice(0,10))}
              placeholder="10-digit phone number"
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.04)", color:"#fff", fontSize:14, marginBottom:10, fontFamily:"inherit" }}
            />
          </>
        )}

        {step === "otp" && (
          <>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 12 }}>
              +91 {phone} க்கு அனுப்பிய OTP-ஐ குறிப்பிடுங்க:
            </p>
            <input
              value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,"").slice(0,6))}
              placeholder="6-digit OTP" autoFocus
              style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.04)", color:"#fff", fontSize:14, marginBottom:10, fontFamily:"inherit", letterSpacing:4, textAlign:"center" }}
            />
          </>
        )}

        {step === "deleting" && (
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 10 }}>Deleting your data…</p>
        )}

        {step === "done" && (
          <p style={{ fontSize: 13, color: "#6ee7b7", marginBottom: 10 }}>
            ✓ உங்கள் எல்லா தகவல்களும் delete ஆகிவிட்டன. Reloading…
          </p>
        )}

        {error && <p style={{ fontSize: 12, color: "#fca5a5", marginBottom: 10 }}>{error}</p>}

        {step !== "done" && step !== "deleting" && (
          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex:1, padding:"10px 0", borderRadius:8, border:"1px solid rgba(255,255,255,0.15)", background:"transparent", color:"rgba(255,255,255,0.5)", cursor:"pointer", fontSize:13 }}>
              Cancel
            </button>
            <button
              onClick={step === "confirm" ? sendOtp : confirmDelete}
              style={{ flex:2, padding:"10px 0", borderRadius:8, border:"none", background:"#ef4444", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600 }}
            >
              {step === "confirm" ? "Send OTP" : "Confirm Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── BookingCard — Anbu Clinic appointment details ──────────────────────────────
function BookingCard({ onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:300,padding:20 }}>
      <div style={{ background:"#0f1117",border:"1px solid rgba(16,185,129,0.3)",borderRadius:20,padding:24,width:"100%",maxWidth:360,position:"relative" }}>
        <button onClick={onClose} style={{ position:"absolute",top:12,right:14,background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:20,cursor:"pointer" }}>✕</button>
        <div style={{ textAlign:"center",marginBottom:16 }}>
          <div style={{ fontSize:32,marginBottom:6 }}>🏥</div>
          <h3 style={{ margin:0,fontSize:17,fontWeight:800,color:"white" }}>Anbu Clinic</h3>
          <p style={{ margin:"4px 0 0",fontSize:12,color:"rgba(255,255,255,0.4)" }}>Pappakudi, Ariyalur District</p>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:10,fontSize:13 }}>
          <div style={{ background:"rgba(16,185,129,0.08)",borderRadius:10,padding:"10px 14px" }}>
            <div style={{ color:"rgba(255,255,255,0.45)",fontSize:11,marginBottom:6 }}>👨‍⚕️ DOCTORS</div>
            <div style={{ color:"rgba(255,255,255,0.85)",marginBottom:4 }}>Dr. Raghul M.D <span style={{ color:"rgba(255,255,255,0.35)",fontSize:11 }}>(Asst Professor)</span></div>
            <div style={{ color:"rgba(255,255,255,0.85)" }}>Dr. Rajeswari M.D <span style={{ color:"rgba(255,255,255,0.35)",fontSize:11 }}>(PHC Kattumannarkoil)</span></div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 14px" }}>
            <div style={{ color:"rgba(255,255,255,0.45)",fontSize:11,marginBottom:6 }}>🕐 TIMINGS</div>
            <div style={{ color:"rgba(255,255,255,0.75)",marginBottom:2 }}>Mon–Fri: 9–12am &amp; 5–9:30pm</div>
            <div style={{ color:"rgba(255,255,255,0.75)" }}>Sat–Sun: 9am–1pm &amp; 5–10pm</div>
          </div>
          <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:10,padding:"10px 14px" }}>
            <div style={{ color:"rgba(255,255,255,0.45)",fontSize:11,marginBottom:6 }}>🔬 FACILITIES</div>
            <div style={{ color:"rgba(255,255,255,0.75)" }}>Lab • Scan • Pharmacy</div>
          </div>
          <a href="tel:9176634174" style={{ display:"block",textAlign:"center",padding:"12px",borderRadius:10,background:"linear-gradient(135deg,#059669,#10b981)",color:"white",fontWeight:700,fontSize:14,textDecoration:"none" }}>
            📞 Call to Book: 9176634174
          </a>
        </div>
      </div>
    </div>
  );
}

// ── PrivacyLinks — Privacy Policy / Terms / Delete My Data (sidebar footer) ───
function PrivacyLinks({ user }) {
  const [showDelete, setShowDelete] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showDev, setShowDev] = useState(false);
  return (
    <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 6 }}>Legal</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <a
          href="/privacy-policy.html"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", textDecoration: "none" }}
        >
          🔒 Privacy Policy (DPDP Act 2023)
        </a>
        <button
          onClick={() => setShowBooking(true)}
          style={{ background:"none",border:"none",padding:0,cursor:"pointer",fontSize:12,color:"rgba(16,185,129,0.7)",textAlign:"left",fontFamily:"inherit" }}
        >
          🏥 Book Appointment
        </button>
        <button
          onClick={() => setShowDev(v => !v)}
          style={{ background:"none",border:"none",padding:0,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.35)",textAlign:"left",fontFamily:"inherit" }}
        >
          👨‍💻 Developer Contact
        </button>
        {showDev && (
          <div style={{ background:"rgba(255,255,255,0.04)",borderRadius:8,padding:"8px 10px",fontSize:11,color:"rgba(255,255,255,0.5)",lineHeight:1.7 }}>
            <div>Rajaganapathy M</div>
            <a href="mailto:rajaganaa@gmail.com" style={{ color:"rgba(99,102,241,0.8)",textDecoration:"none" }}>rajaganaa@gmail.com</a>
            <div><a href="tel:9176631419" style={{ color:"rgba(255,255,255,0.4)",textDecoration:"none" }}>📞 9176631419</a></div>
          </div>
        )}
        <button
          onClick={() => setShowDelete(true)}
          style={{ background:"none",border:"none",padding:0,cursor:"pointer",fontSize:12,color:"rgba(239,68,68,0.6)",textAlign:"left",fontFamily:"inherit" }}
        >
          🗑️ Delete My Data
        </button>
      </div>
      {showDelete && (
        <DeleteDataModal
          defaultPhone={user?.phone}
          onClose={() => setShowDelete(false)}
          onDeleted={() => setShowDelete(false)}
        />
      )}
      {showBooking && <BookingCard onClose={() => setShowBooking(false)} />}
    </div>
  );
}

// ── OTPModal — Firebase Phone Auth ────────────────────────────────────────────
function OTPModal({ onSuccess, onClose }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp]     = useState("");
  const [step, setStep]   = useState("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmResult, setConfirmResult] = useState(null);


  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try { window.recaptchaVerifier?.clear(); } catch {}
      window.recaptchaVerifier = null;
    };
  }, []);

  const sendOTP = async () => {
    if (phone.length !== 10) { setError("சரியான 10 எண் குறிப்பிடு"); return; }
    setLoading(true); setError("");
    // Always create fresh verifier — reusing causes auth/invalid-app-credential
    try { window.recaptchaVerifier?.clear(); } catch {}
    window.recaptchaVerifier = null;
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {},
          "expired-callback": () => { window.recaptchaVerifier = null; }
        }
      );
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, window.recaptchaVerifier);
      setConfirmResult(result);
      setStep("otp");
    } catch (e) {
      const msg = e.code === "auth/too-many-requests"
        ? "Too many attempts. Wait a few minutes and try again."
        : (e.message || "OTP send failed. Try again.");
      setError(msg);
      try { window.recaptchaVerifier?.clear(); } catch {}
      window.recaptchaVerifier = null;
    } finally { setLoading(false); }
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) { setError("தவறான OTP"); return; }
    setLoading(true); setError("");
    // Step 1: Verify OTP with Firebase only
    let firebaseResult;
    try {
      firebaseResult = await confirmResult.confirm(otp);
    } catch (e) {
      const msg = e.code === "auth/invalid-verification-code"
        ? "தவறான OTP. மீண்டும் முயற்சி செய.⊥"
        : (e.message || "OTP verification failed.");
      setError(msg);
      setLoading(false);
      return;
    }
    // Step 2: Go to chat IMMEDIATELY, sync backend in background
    const idToken = await firebaseResult.user.getIdToken();
    setStep("success");
    setLoading(false);
    // Open chat right away — dont wait for backend
    onSuccess({ phone, authToken: idToken, prompts: null });
    // Background sync
    apiFirebaseSession(idToken).catch(e => console.warn("Backend sync:", e));
  };

  const resendOTP = async () => {
    setLoading(true); setError("");
    try { window.recaptchaVerifier?.clear(); } catch {}
    window.recaptchaVerifier = null;
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {},
          "expired-callback": () => { window.recaptchaVerifier = null; }
        }
      );
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, window.recaptchaVerifier);
      setConfirmResult(result);
      setError("OTP resent ✓");
    } catch (e) {
      setError("Resend failed. Try again.");
      try { window.recaptchaVerifier?.clear(); } catch {}
      window.recaptchaVerifier = null;
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200,padding:20 }}>
      <div style={{ background:"#0f1117",border:"1px solid rgba(255,255,255,0.1)",borderRadius:24,padding:32,width:"100%",maxWidth:360,animation:"slideUp 0.4s ease" }}>
        <div style={{ textAlign:"center",marginBottom:28 }}>
          <div style={{ width:56,height:56,borderRadius:16,background:"linear-gradient(135deg, #059669, #10b981)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px",boxShadow:"0 8px 24px rgba(16,185,129,0.3)" }}>
            <HeartIcon />
          </div>
          <h2 style={{ margin:0,fontSize:22,fontWeight:800,color:"white" }}>Anbu Health AI</h2>
          <p style={{ margin:"6px 0 0",fontSize:13,color:"rgba(255,255,255,0.4)" }}>Anbu clinic Rural Healthcare</p>
        </div>

        {step === "success" ? (
          <div style={{ textAlign:"center",padding:"20px 0" }}>
            <div style={{ fontSize:48,marginBottom:12 }}>✅</div>
            <p style={{ margin:0,fontSize:16,color:"#10b981",fontWeight:700 }}>Login Success!</p>
            <p style={{ margin:"6px 0 0",fontSize:13,color:"rgba(255,255,255,0.4)" }}>Welcome to Anbu Health AI</p>
          </div>
        ) : step === "phone" ? (
          <>
            <p style={{ margin:"0 0 16px",fontSize:14,color:"rgba(255,255,255,0.6)",textAlign:"center" }}>Phone number போடுங்க — OTP வரும்</p>
            <div style={{ display:"flex",gap:8,marginBottom:12 }}>
              <div style={{ padding:"13px 12px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,fontSize:14,color:"rgba(255,255,255,0.6)",display:"flex",alignItems:"center",gap:4 }}>
                <PhoneIcon /> +91
              </div>
              <input type="tel" maxLength={10} value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,""))}
                placeholder="98765 43210"
                style={{ flex:1,padding:"13px 14px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,fontSize:16,color:"white",outline:"none",letterSpacing:2 }} />
            </div>
            {error && <p style={{ margin:"0 0 10px",fontSize:12,color:"#ef4444",textAlign:"center" }}>{error}</p>}
            <button onClick={sendOTP} disabled={loading || phone.length !== 10}
              style={{ width:"100%",padding:"14px",borderRadius:12,border:"none",background:phone.length===10?"linear-gradient(135deg, #059669, #10b981)":"rgba(255,255,255,0.07)",color:phone.length===10?"white":"rgba(255,255,255,0.3)",fontSize:15,fontWeight:700,cursor:phone.length===10?"pointer":"default",transition:"all 0.2s" }}>
              {loading ? "Sending..." : "OTP அனுப்பு →"}
            </button>
          </>
        ) : (
          <>
            <p style={{ margin:"0 0 6px",fontSize:14,color:"rgba(255,255,255,0.6)",textAlign:"center" }}>+91 {phone} க்கு OTP வந்தது</p>
            <input type="tel" maxLength={6} value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,""))}
              placeholder="• • • • • •"
              style={{ width:"100%",padding:"16px",background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.12)",borderRadius:10,fontSize:24,color:"white",outline:"none",letterSpacing:12,textAlign:"center",boxSizing:"border-box",marginBottom:12 }} />
            {error && <p style={{ margin:"0 0 10px",fontSize:12,color:error.includes("✓")?"#10b981":"#ef4444",textAlign:"center" }}>{error}</p>}
            <button onClick={verifyOTP} disabled={loading || otp.length !== 6}
              style={{ width:"100%",padding:"14px",borderRadius:12,border:"none",background:otp.length===6?"linear-gradient(135deg, #059669, #10b981)":"rgba(255,255,255,0.07)",color:otp.length===6?"white":"rgba(255,255,255,0.3)",fontSize:15,fontWeight:700,cursor:otp.length===6?"pointer":"default",transition:"all 0.2s" }}>
              {loading ? "Verifying..." : "Verify ✓"}
            </button>
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:8 }}>
              <button onClick={()=>setStep("phone")} style={{ flex:1,padding:"10px",borderRadius:10,border:"none",background:"none",color:"rgba(255,255,255,0.35)",fontSize:13,cursor:"pointer" }}>← Change number</button>
              <button onClick={resendOTP} disabled={loading} style={{ flex:1,padding:"10px",borderRadius:10,border:"none",background:"none",color:"rgba(255,255,255,0.35)",fontSize:13,cursor:"pointer" }}>Resend OTP</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, onLogout, user, promptCount, tokenResetAt, onClose, visible }) {
  const tokenPct = Math.min((promptCount / MAX_TOKENS_PER_DAY) * 100, 100);
  const exceeded = promptCount >= MAX_TOKENS_PER_DAY;
  const resetLabel = tokenResetAt ? getTimeUntilReset(tokenResetAt) : "";
  return (
    <>
      {visible && <div onClick={onClose} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:40 }} />}
      <div style={{ position:"fixed",left:0,top:0,height:"100%",width:260,background:"#0d1117",borderRight:"1px solid rgba(255,255,255,0.07)",display:"flex",flexDirection:"column",zIndex:50,transform:visible?"translateX(0)":"translateX(-100%)",transition:"transform 0.3s cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ padding:"20px 16px 12px",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
            <div style={{ width:36,height:36,borderRadius:10,background:"linear-gradient(135deg, #059669, #10b981)",display:"flex",alignItems:"center",justifyContent:"center" }}><HeartIcon /></div>
            <div>
              <div style={{ fontSize:14,fontWeight:800,color:"white" }}>Anbu Health AI</div>
              <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>Medical Assistant</div>
            </div>
          </div>
          <button onClick={onNewChat} style={{ width:"100%",padding:"9px 12px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"rgba(255,255,255,0.7)",fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:8,fontFamily:"inherit",transition:"background 0.15s" }}>
            <NewChatIcon /> New Chat
          </button>
        </div>
        <div style={{ padding:"10px 16px",borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5 }}>
            <span style={{ fontSize:11,color:"rgba(255,255,255,0.4)" }}>Tokens today</span>
            <span style={{ fontSize:11,color:exceeded?"#ef4444":"#10b981",fontWeight:600 }}>{promptCount}/{MAX_TOKENS_PER_DAY}</span>
          </div>
          <div style={{ height:4,background:"rgba(255,255,255,0.08)",borderRadius:2,overflow:"hidden",marginBottom:4 }}>
            <div style={{ height:"100%",width:`${tokenPct}%`,background:exceeded?"#ef4444":"linear-gradient(90deg, #059669, #10b981)",borderRadius:2,transition:"width 0.3s" }} />
          </div>
          {exceeded && resetLabel && (
            <div style={{ fontSize:10,color:"#ef4444",textAlign:"center" }}>🕐 Resets in {resetLabel}</div>
          )}
        </div>
        <div style={{ flex:1,overflowY:"auto",padding:"8px 8px" }}>
          <p style={{ margin:"8px 8px 6px",fontSize:10,color:"rgba(255,255,255,0.25)",textTransform:"uppercase",letterSpacing:1 }}>Recent Chats</p>
          {chats.map(chat=>(
            <div key={chat.id} style={{ display:"flex",alignItems:"center",marginBottom:2 }}>
              <button onClick={()=>{onSelectChat(chat.id);onClose();}} style={{ flex:1,padding:"8px 10px",borderRadius:8,border:"none",background:chat.id===activeChatId?"rgba(16,185,129,0.12)":"none",color:chat.id===activeChatId?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.5)",fontSize:13,cursor:"pointer",textAlign:"left",fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,transition:"all 0.15s",minWidth:0 }}>
                <HistoryIcon />
                <span style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{chat.title}</span>
              </button>
              <button onClick={()=>{ if(window.confirm("Delete this chat?")) onDeleteChat(chat.id); }} style={{ padding:"6px 8px",borderRadius:6,border:"1px solid rgba(239,68,68,0.25)",background:"rgba(239,68,68,0.08)",color:"rgba(239,68,68,0.7)",fontSize:13,cursor:"pointer",flexShrink:0,transition:"all 0.15s",marginRight:4 }} title="Delete chat">🗑</button>
            </div>
          ))}
        </div>
        {user && (
          <div style={{ padding:"10px 16px",borderTop:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg, #6366f1, #8b5cf6)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}><UserIcon /></div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:13,color:"rgba(255,255,255,0.8)",fontWeight:600 }}>+91 {user.phone}</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>Verified ✓</div>
              </div>
              <button
                onClick={()=>{ if(window.confirm("Logout ஆகணுமா?")) onLogout(); }}
                style={{ padding:"5px 9px",borderRadius:8,border:"1px solid rgba(239,68,68,0.3)",background:"rgba(239,68,68,0.08)",color:"rgba(239,120,120,0.9)",fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600,flexShrink:0,whiteSpace:"nowrap" }}
              >🚪 Logout</button>
            </div>
          </div>
        )}
        <div style={{ padding:"8px 16px",borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={()=>{ if(window.confirm("Clear all chats?")) onDeleteChat("all"); }} style={{ width:"100%",padding:"8px 12px",borderRadius:8,border:"1px solid rgba(239,68,68,0.2)",background:"rgba(239,68,68,0.05)",color:"rgba(239,68,68,0.6)",fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s" }}>🗑 Clear All Chats</button>
        </div>
        <PrivacyLinks user={user} />
      </div>
    </>
  );
}

function WelcomeScreen({ onQuickPrompt }) {
  const suggestions = [
    { icon:"🩸",text:"Sugar test result explain பண்ணு" },
    { icon:"💊",text:"Paracetamol dosage என்ன?" },
    { icon:"❤️",text:"BP high-ஆ இருக்கு, என்ன சாப்பிடணும்?" },
    { icon:"🤒",text:"Fever 3 days-ஆ இருக்கு, என்ன பண்றது?" },
  ];
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,padding:"20px 20px 0",textAlign:"center" }}>
      <div style={{ width:64,height:64,borderRadius:20,background:"linear-gradient(135deg, #059669, #10b981)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:18,boxShadow:"0 12px 32px rgba(16,185,129,0.3)",animation:"pulse 2.5s infinite" }}>
        <span style={{ fontSize:32 }}>🏥</span>
      </div>
      <h1 style={{ margin:"0 0 8px",fontSize:22,fontWeight:800,color:"white" }}>Anbu Health AI</h1>
      <p style={{ margin:"0 0 6px",fontSize:14,color:"rgba(255,255,255,0.5)",maxWidth:300,lineHeight:1.6 }}>Anbu Clinic Rural patients-க்கான AI medical assistant</p>
      <p style={{ margin:"0 0 28px",fontSize:12,color:"rgba(255,255,255,0.25)" }}>Lab reports • X-Rays • Medicine info • Health questions</p>
      <div style={{ width:"100%",maxWidth:500 }}>
        <p style={{ margin:"0 0 10px",fontSize:11,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:1 }}>இதை கேளுங்க</p>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8 }}>
          {suggestions.map((s,i)=>(
            <button key={i} onClick={()=>onQuickPrompt(s.text)} style={{ padding:"11px 12px",borderRadius:12,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.03)",color:"rgba(255,255,255,0.6)",fontSize:12,lineHeight:1.5,cursor:"pointer",textAlign:"left",fontFamily:"inherit",transition:"all 0.2s",display:"flex",alignItems:"flex-start",gap:8 }}>
              <span>{s.icon}</span><span>{s.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function AnbuHealthAI() {
  const [user, setUser] = useState(null);
  const [showConsent, setShowConsent] = useState(() => {
    try { return !localStorage.getItem("anbu_consent_v1"); } catch { return true; }
  });
  const [showOTP, setShowOTP] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [promptCount, setPromptCount] = useState(() => getTokenData().tokens);
  const [tokenResetAt, setTokenResetAt] = useState(() => getTokenData().resetAt);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingMode, setPendingMode] = useState(null);
  const [chats, setChats] = useState([{ id:"c1",title:"New Chat",messages:[] }]);
  const [activeChatId, setActiveChatId] = useState("c1");

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const recognitionRef = useRef(null);
  const handleSendRef  = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const messages = useMemo(() => activeChat?.messages || [], [activeChatId, chats]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, isLoading]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "ta-IN"; rec.continuous = false; rec.interimResults = false;
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const addMessage = useCallback((chatId, msg) => {
    setChats(prev => prev.map(c => c.id === chatId ? {
      ...c,
      title: c.messages.length === 0 ? (msg.content?.slice(0,30)||"Chat")+"..." : c.title,
      messages: [...c.messages, msg]
    } : c));
  }, []);

  const handleSend = useCallback(async (textOverride) => {
    const text = (typeof textOverride === "string" ? textOverride : inputText).trim();
    if (!text && !pendingFile) return;
    if (promptCount >= MAX_TOKENS_PER_DAY) return;

    const msgText = text || (pendingFile ? `${pendingFile.name} analyze பண்ணு` : "");

    // Booking keyword detection — must be SPECIFIC booking intent, not general doctor questions
    const bookingKeywords = ["book appointment", "booking appointment", "appointment book", "fix appointment", "அப்பாய்ண்ட்மென்ட்", "anbu clinic", "pappakudi clinic", "visit clinic", "clinic visit", "clinic appointment"];
    const isBookingQuery = bookingKeywords.some(k => msgText.toLowerCase().includes(k.toLowerCase()));

    const userMsg = { id:Date.now(),role:"user",content:msgText,file:pendingFile?.name,fileMode:pendingMode,timestamp:Date.now() };
    const fileForAPI = pendingFile;
    const modeForAPI = pendingMode;
    const phone      = user?.phone || null;
    const authToken  = user?.authToken || null;

    addMessage(activeChatId, userMsg);
    setInputText(""); setPendingFile(null); setPendingMode(null); setIsLoading(true);

    if (!phone) { const updated = incrementTokens(50); setPromptCount(updated.tokens); setTokenResetAt(updated.resetAt); }

    // Handle booking queries locally without calling the API
    if (isBookingQuery) {
      setIsLoading(false);
      addMessage(activeChatId, {
        id: Date.now()+1,
        role: "assistant",
        content: "🏥 **Anbu Clinic — Book an Appointment**\n\n**Doctors:**\n• Dr. Raghul M.D (Asst Professor)\n• Dr. Rajeswari M.D (PHC Kattumannarkoil)\n\n**Location:** Pappakudi, Ariyalur District\n\n**Timings:**\n• Mon–Fri: 9–12am & 5–9:30pm\n• Sat–Sun: 9am–1pm & 5–10pm\n\n**Facilities:** Lab • Scan • Pharmacy\n\n📞 **Call to book: [9176634174](tel:9176634174)**",
        timestamp: Date.now(),
      });
      return;
    }

    try {
      // Find the most recent fileContext from chat messages for follow-up accuracy
      const activeFileContext = (() => {
        if (fileForAPI) return null; // new file upload — no previous context needed
        const recentFile = [...messages].reverse().find(m => m.role === "assistant" && m.fileContext);
        return recentFile ? recentFile.fileContext : null;
      })();
      const result = await callAnbuAPI(msgText, fileForAPI, modeForAPI, phone, activeChatId, authToken, messages, activeFileContext);
      addMessage(activeChatId, {
        id: Date.now()+1,
        role: "assistant",
        content: result.answer,
        structured: result.structured,
        fileMode: modeForAPI,
        fileContext: result.file_context || null,  // store raw extracted file data
        timestamp: Date.now(),
        compliance_disclaimer: result.compliance_disclaimer,
        emergency_alert: result.emergency_alert,
      });
      // Track tokens from API response
      const usedTokens = result.usage?.total_tokens || result.prompts?.tokens_used || 50;
      if (phone) {
        const updated = incrementTokens(usedTokens);
        setPromptCount(updated.tokens);
        setTokenResetAt(updated.resetAt);
      }
    } catch (e) {
      if (e.message === "DAILY_LIMIT") {
        const updated2 = incrementTokens(50);
        setPromptCount(updated2.tokens); setTokenResetAt(updated2.resetAt);
        addMessage(activeChatId, { id:Date.now()+1,role:"assistant",content:e.message_ta||`Token limit (${MAX_TOKENS_PER_DAY}) exceeded. Try after ${getTimeUntilReset(tokenResetAt)}!`,timestamp:Date.now() });
      } else {
        addMessage(activeChatId, { id:Date.now()+1,role:"assistant",content:"Sorry, error ஆச்சு. Try again.",timestamp:Date.now() });
      }
    } finally { setIsLoading(false); }
  }, [inputText, pendingFile, pendingMode, promptCount, activeChatId, addMessage, user, messages]);

  handleSendRef.current = handleSend;

  const handleUpload = (file, mode) => { setPendingFile(file); setPendingMode(mode); setShowUploadModal(false); inputRef.current?.focus(); };

  const handleVoice = () => {
    if (!recognitionRef.current) { alert("Voice not supported in this browser"); return; }
    if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
    else {
      recognitionRef.current.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInputText(transcript); setIsListening(false);
        setTimeout(() => handleSendRef.current(transcript), 300);
      };
      recognitionRef.current.start(); setIsListening(true);
    }
  };

  const handleNewChat = () => {
    const newId = `c${Date.now()}`;
    setChats(prev => [{ id:newId,title:"New Chat",messages:[] }, ...prev]);
    setActiveChatId(newId); setSidebarOpen(false);
  };

  const handleLogout = async () => {
    try { await auth.signOut(); } catch(e) {}
    setUser(null);
    setShowOTP(true);
    const newId = `c${Date.now()}`;
    setChats([{ id:newId,title:"New Chat",messages:[] }]);
    setActiveChatId(newId);
    setPromptCount(0);
    setTokenResetAt(Date.now() + RESET_HOURS * 3600000);
    setSidebarOpen(false);
  };

  const handleDeleteChat = (chatId) => {
    if (chatId === "all") {
      const newId = `c${Date.now()}`;
      setChats([{ id:newId,title:"New Chat",messages:[] }]);
      setActiveChatId(newId);
    } else {
      setChats(prev => {
        const remaining = prev.filter(c => c.id !== chatId);
        if (remaining.length === 0) {
          const newId = `c${Date.now()}`;
          setActiveChatId(newId);
          return [{ id:newId,title:"New Chat",messages:[] }];
        }
        if (chatId === activeChatId) setActiveChatId(remaining[0].id);
        return remaining;
      });
    }
  };

  const handleLoginSuccess = useCallback(async (u) => {
    setUser(u); setShowOTP(false);

    // Always start with a fresh new chat on login
    const freshId = `c${Date.now()}`;
    setChats([{ id: freshId, title: "New Chat", messages: [] }]);
    setActiveChatId(freshId);
    setSidebarOpen(false);

    // Load token data from local storage
    const tokenData = getTokenData();
    setPromptCount(tokenData.tokens);
    setTokenResetAt(tokenData.resetAt);

    // Load previous chat history from server in background
    try {
      const history = await apiUserHistory(u.phone, u.authToken || null);
      if (history.length > 0) {
        const grouped = {};
        history.forEach((m, i) => {
          const cid = m.chat_id || "history";
          if (!grouped[cid]) grouped[cid] = [];
          grouped[cid].push({
            id: m.id || `${cid}_${i}`,
            role: m.role,
            content: m.content,
            structured: m.structured || null,
            fileMode: m.mode,
            fileContext: m.file_context || null,
            timestamp: m.created_at ? new Date(m.created_at).getTime() : Date.now()
          });
        });
        const restoredChats = Object.entries(grouped).map(([cid, msgs]) => ({
          id: cid,
          title: (msgs[0]?.content || "Chat").slice(0, 30) + "...",
          messages: msgs
        }));
        // Prepend restored chats but keep the fresh new chat active
        setChats(prev => [prev[0], ...restoredChats]);
      }
    } catch {}
  }, []);

  const plusMenuItems = [
    { icon:<LabIcon />,  label:"Lab Report",  sublabel:"Blood test, sugar, urine", color:"#60a5fa",mode:"lab" },
    { icon:<ScanIcon />, label:"X-Ray / Scan", sublabel:"Chest, abdomen, MRI",      color:"#a78bfa",mode:"scan" },
    { icon:<PillIcon />, label:"Medicine",     sublabel:"Photo of medicine strip",  color:"#34d399",mode:"medicine" },
  ];

  return (
    <div style={{ height:"100vh",background:"#0f1117",display:"flex",flexDirection:"column",fontFamily:"'Segoe UI', system-ui, sans-serif",overflow:"hidden",position:"relative" }}>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bounce { 0%,80%,100% { transform:scale(0.6); opacity:0.4; } 40% { transform:scale(1); opacity:1; } }
        @keyframes pulse { 0%,100% { box-shadow:0 12px 32px rgba(16,185,129,0.3); } 50% { box-shadow:0 12px 48px rgba(16,185,129,0.55); } }
        * { box-sizing:border-box; } input,button { font-family:inherit; } textarea:focus { outline:none; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
      `}</style>

      {/* reCAPTCHA must live outside any backdropFilter container */}
      <div id="recaptcha-container" style={{ display:"none" }} />
      {showConsent && <ConsentModal onConsent={() => setShowConsent(false)} />}
      {showOTP && <OTPModal onSuccess={handleLoginSuccess} onClose={() => setShowOTP(false)} />}

      <Sidebar visible={sidebarOpen} onClose={()=>setSidebarOpen(false)} chats={chats} activeChatId={activeChatId} onNewChat={handleNewChat} onSelectChat={setActiveChatId} onDeleteChat={handleDeleteChat} onLogout={handleLogout} user={user} promptCount={promptCount} tokenResetAt={tokenResetAt} />
      {showUploadModal && <UploadModal mode={uploadMode} onClose={()=>setShowUploadModal(false)} onUpload={handleUpload} />}
      {showPlusMenu && <div onClick={()=>setShowPlusMenu(false)} style={{ position:"fixed",inset:0,zIndex:20 }} />}

      {/* Header */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,0.07)",background:"#0f1117",flexShrink:0 }}>
        <button onClick={()=>setSidebarOpen(true)} style={{ background:"none",border:"none",cursor:"pointer",padding:8,borderRadius:8,color:"rgba(255,255,255,0.6)",display:"flex",alignItems:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ width:28,height:28,borderRadius:8,background:"linear-gradient(135deg, #059669, #10b981)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14 }}>🏥</div>
          <span style={{ fontSize:15,fontWeight:700,color:"white" }}>Anbu Health AI</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:6,background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)",borderRadius:20,padding:"4px 10px" }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:"#10b981" }} />
          <span style={{ fontSize:11,color:"#10b981",fontWeight:600 }}>Live</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1,overflowY:"auto",padding:"16px 16px 8px" }}>
        <div style={{ maxWidth:680,margin:"0 auto" }}>
          {messages.length === 0 ? (
            <WelcomeScreen onQuickPrompt={(text)=>{ setInputText(text); setTimeout(()=>handleSend(text),100); }} />
          ) : (
            <>
              {messages.map((msg,i)=>(
                <MessageBubble key={msg.id} msg={msg} isLast={i===messages.length-1} onFollowUp={(text)=>{ setInputText(text); setTimeout(()=>handleSend(text),100); }} />
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Pending file chip */}
      {pendingFile && (
        <div style={{ padding:"0 16px 8px",maxWidth:696,margin:"0 auto",width:"100%" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(16,185,129,0.12)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:20,padding:"5px 12px" }}>
            <span style={{ fontSize:13 }}>{pendingMode==="lab"?"🧪":pendingMode==="scan"?"🩻":"💊"}</span>
            <span style={{ fontSize:12,color:"rgba(255,255,255,0.7)" }}>{pendingFile.name}</span>
            <button onClick={()=>{ setPendingFile(null); setPendingMode(null); }} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",padding:0,display:"flex" }}><CloseIcon /></button>
          </div>
        </div>
      )}

      {/* Prompt limit warning */}
      {promptCount >= MAX_TOKENS_PER_DAY && (
        <div style={{ padding:"8px 16px",maxWidth:696,margin:"0 auto",width:"100%" }}>
          <div style={{ background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:10,padding:"8px 14px",fontSize:12,color:"#fca5a5",textAlign:"center" }}>
            ⚠️ Daily 5000 token limit reached. 🕐 Try after {getTimeUntilReset(tokenResetAt)}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div style={{ padding:"8px 16px 16px",flexShrink:0,maxWidth:696,margin:"0 auto",width:"100%" }}>
        <div style={{ background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:16,display:"flex",alignItems:"flex-end",gap:4,padding:"10px 12px" }}>
          <div style={{ position:"relative",flexShrink:0 }}>
            <button onClick={()=>setShowPlusMenu(p=>!p)}
              style={{ width:36,height:36,borderRadius:10,border:"none",background:showPlusMenu?"rgba(16,185,129,0.2)":"rgba(255,255,255,0.07)",color:showPlusMenu?"#10b981":"rgba(255,255,255,0.5)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",transform:showPlusMenu?"rotate(45deg)":"none" }}>
              <PlusIcon />
            </button>
            {showPlusMenu && (
              <div style={{ position:"absolute",bottom:"calc(100% + 8px)",left:0,background:"#1a1f2e",border:"1px solid rgba(255,255,255,0.12)",borderRadius:14,padding:8,minWidth:220,zIndex:30,animation:"slideUp 0.2s ease",boxShadow:"0 16px 48px rgba(0,0,0,0.5)" }}>
                {plusMenuItems.map(item=>(
                  <button key={item.mode} onClick={()=>{ setUploadMode(item.mode); setShowUploadModal(true); setShowPlusMenu(false); }}
                    style={{ width:"100%",padding:"10px 12px",borderRadius:10,border:"none",background:"none",color:"white",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:"inherit",transition:"background 0.15s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}
                    onMouseLeave={e=>e.currentTarget.style.background="none"}>
                    <span style={{ color:item.color }}>{item.icon}</span>
                    <div style={{ textAlign:"left" }}>
                      <div style={{ fontSize:14,fontWeight:600 }}>{item.label}</div>
                      <div style={{ fontSize:11,color:"rgba(255,255,255,0.35)" }}>{item.sublabel}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <textarea ref={inputRef} value={inputText} onChange={e=>setInputText(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); handleSend(); } }}
            placeholder={isListening?"🎤 Listening... (Tamil/English)":"கேள்வி கேளுங்க... (Tamil or English)"}
            rows={1} disabled={promptCount>=MAX_TOKENS_PER_DAY}
            style={{ flex:1,background:"none",border:"none",color:"rgba(255,255,255,0.9)",fontSize:14,lineHeight:1.5,resize:"none",padding:"8px 4px",maxHeight:120,overflowY:"auto",outline:"none",opacity:promptCount>=MAX_TOKENS_PER_DAY?0.4:1 }} />

          <button onClick={handleVoice}
            style={{ width:36,height:36,borderRadius:10,border:"none",background:isListening?"rgba(239,68,68,0.2)":"rgba(255,255,255,0.07)",color:isListening?"#ef4444":"rgba(255,255,255,0.5)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s" }}>
            <MicIcon active={isListening} />
          </button>

          <button onClick={()=>handleSend()} disabled={(!inputText.trim()&&!pendingFile)||isLoading||promptCount>=MAX_TOKENS_PER_DAY}
            style={{ width:36,height:36,borderRadius:10,border:"none",background:(inputText.trim()||pendingFile)&&!isLoading&&promptCount<MAX_TOKENS_PER_DAY?"linear-gradient(135deg, #059669, #10b981)":"rgba(255,255,255,0.07)",color:(inputText.trim()||pendingFile)&&!isLoading&&promptCount<MAX_TOKENS_PER_DAY?"white":"rgba(255,255,255,0.25)",cursor:(inputText.trim()||pendingFile)&&!isLoading&&promptCount<MAX_TOKENS_PER_DAY?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",boxShadow:(inputText.trim()||pendingFile)&&!isLoading?"0 4px 12px rgba(16,185,129,0.3)":"none" }}>
            <SendIcon />
          </button>
        </div>
        <p style={{ margin:"8px 0 0",fontSize:11,color:"rgba(255,255,255,0.2)",textAlign:"center" }}>
          Anbu AI is for information only • Doctor advice மட்டும் follow பண்ணுங்க
        </p>
      </div>
    </div>
  );
}
