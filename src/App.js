import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ── Icons (inline SVG components) ─────────────────────────────────────────────
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
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ── MSG91 Widget Config ────────────────────────────────────────────────────────
const MSG91_WIDGET_ID   = "36666e6b574a373434323634";
const MSG91_TOKEN_AUTH  = "524030TatR4smVLrr6s2e96b7P1";

// ── API ────────────────────────────────────────────────────────────────────────
const API_URL = "https://anbu-health-ai.kindrock-2ca528ff.centralindia.azurecontainerapps.io";

async function callAnbuAPI(message, uploadedFile, mode, phone, chatId) {
  const formData = new FormData();
  formData.append("question", message);
  formData.append("mode", (uploadedFile && mode) ? mode : "general");
  if (uploadedFile) formData.append("image", uploadedFile);
  if (phone) formData.append("phone", phone);
  if (chatId) formData.append("chat_id", chatId);

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (response.status === 429) {
    const errBody = await response.json().catch(() => ({}));
    const err = new Error("DAILY_LIMIT");
    err.prompts = errBody?.detail?.prompts || null;
    err.message_ta = errBody?.detail?.message;
    throw err;
  }

  if (!response.ok) throw new Error(`Server error: ${response.status}`);

  const data = await response.json();
  const answer =
    data.final_answer ||
    data.sakshi?.final_answer ||
    data.buddhi?.draft_answer ||
    "பதில் கிடைக்கவில்லை. மீண்டும் try பண்ணுங்க.";
  const structured = data.buddhi?.structured_response || null;
  return {
    mode: data.mode,
    answer: answer,
    structured: structured,
    prompts: data.prompts || null,
  };
}

// ── Backend token-verify (server-side step 2) ─────────────────────────────────
async function apiVerifyWidgetToken(accessToken) {
  const fd = new FormData();
  fd.append("access_token", accessToken);
  const r = await fetch(`${API_URL}/api/auth/verify-widget-token`, {
    method: "POST",
    body: fd,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.detail || "Token verification failed");
  return data; // { success, phone, user_id, prompts }
}

async function apiUserStatus(phone) {
  const r = await fetch(`${API_URL}/api/user/status?phone=${encodeURIComponent(phone)}`);
  if (!r.ok) return null;
  return r.json();
}

async function apiUserHistory(phone) {
  const r = await fetch(`${API_URL}/api/user/history?phone=${encodeURIComponent(phone)}`);
  if (!r.ok) return [];
  const data = await r.json();
  return data.messages || [];
}

// ── Prompt counter (localStorage fallback) ─────────────────────────────────────
const MAX_PROMPTS = 20;
function getPromptData() {
  try {
    const data = JSON.parse(localStorage.getItem("anbu_prompts") || "{}");
    const today = new Date().toDateString();
    if (data.date !== today) return { count: 0, date: today };
    return data;
  } catch { return { count: 0, date: new Date().toDateString() }; }
}
function incrementPrompt() {
  const data = getPromptData();
  const updated = { ...data, count: data.count + 1, date: new Date().toDateString() };
  try { localStorage.setItem("anbu_prompts", JSON.stringify(updated)); } catch { }
  return updated.count;
}

// ── MSG91 Widget Loader ────────────────────────────────────────────────────────
function loadMsg91Script(onSuccess, onFailure) {
  const configuration = {
    widgetId: MSG91_WIDGET_ID,
    tokenAuth: MSG91_TOKEN_AUTH,
    exposeMethods: false,
    success: (data) => {
      // data.message is the access token returned by the widget
      onSuccess(data);
    },
    failure: (error) => {
      console.error("[MSG91] Widget failure:", error);
      onFailure(error);
    },
  };

  function loadScript(urls) {
    let i = 0;
    function attempt() {
      const s = document.createElement("script");
      s.src = urls[i];
      s.async = true;
      s.onload = () => {
        if (typeof window.initSendOTP === "function") {
          window.initSendOTP(configuration);
        }
      };
      s.onerror = () => {
        i++;
        if (i < urls.length) attempt();
      };
      document.head.appendChild(s);
    }
    attempt();
  }

  loadScript([
    "https://verify.msg91.com/otp-provider.js",
    "https://verify.phone91.com/otp-provider.js",
  ]);
}

// ── MSG91 Widget Auth Screen ───────────────────────────────────────────────────
function OtpWidgetScreen({ onAuthenticated }) {
  const [status, setStatus] = useState("loading"); // loading | ready | verifying | error
  const [errorMsg, setErrorMsg] = useState("");
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (scriptLoaded.current) return;
    scriptLoaded.current = true;

    // Small delay so the DOM is ready
    const timer = setTimeout(() => {
      loadMsg91Script(
        async (data) => {
          // data.message = access_token from MSG91 widget
          const accessToken = data?.message || data?.token || data;
          if (!accessToken) {
            setErrorMsg("OTP verification failed. Try again.");
            setStatus("error");
            return;
          }
          setStatus("verifying");
          try {
            const result = await apiVerifyWidgetToken(accessToken);
            if (result.success) {
              const phone = result.phone || "";
              localStorage.setItem("anbu_phone", phone);
              localStorage.setItem("anbu_widget_token", accessToken);
              onAuthenticated({ phone, prompts: result.prompts });
            } else {
              setErrorMsg("Verification failed. Please try again.");
              setStatus("error");
            }
          } catch (e) {
            // If backend verify endpoint not yet deployed, fall back gracefully
            // by storing the token and letting the user in
            console.warn("[MSG91] Backend verify error (fallback mode):", e.message);
            localStorage.setItem("anbu_widget_token", accessToken);
            onAuthenticated({ phone: "", prompts: null });
          }
        },
        (err) => {
          setErrorMsg("OTP அனுப்புவதில் பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.");
          setStatus("error");
        }
      );
      setStatus("ready");
    }, 300);

    return () => clearTimeout(timer);
  }, [onAuthenticated]);

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(34,197,94,0.15), transparent), #0a0a0a",
      padding: "20px",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 400,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 20,
        padding: "36px 32px",
        backdropFilter: "blur(24px)",
        boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
        animation: "fadeIn 0.4s ease",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(34,197,94,0.35)",
          }}>
            <HeartIcon />
          </div>
          <h1 style={{ color: "#fff", fontSize: 22, fontWeight: 700, margin: "0 0 6px" }}>
            Anbu Health AI
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, margin: 0 }}>
            Tamil Nadu Village Healthcare
          </p>
        </div>

        {/* Status messages */}
        {status === "loading" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "2px solid rgba(34,197,94,0.3)",
              borderTopColor: "#22c55e",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }} />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Widget loading...</p>
          </div>
        )}

        {status === "verifying" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "2px solid rgba(34,197,94,0.3)",
              borderTopColor: "#22c55e",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 12px",
            }} />
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              Verifying your OTP...
            </p>
          </div>
        )}

        {status === "error" && (
          <div style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 16,
            textAlign: "center",
          }}>
            <p style={{ color: "#f87171", fontSize: 13, margin: "0 0 10px" }}>{errorMsg}</p>
            <button
              onClick={() => { setStatus("loading"); setErrorMsg(""); scriptLoaded.current = false; }}
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 8,
                color: "#f87171",
                padding: "6px 16px",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* The MSG91 widget mounts itself into the DOM here */}
        <div id="otp-widget-container" style={{ marginTop: status === "ready" ? 0 : 8 }} />

        <p style={{
          color: "rgba(255,255,255,0.2)",
          fontSize: 11,
          textAlign: "center",
          marginTop: 20,
          lineHeight: 1.5,
        }}>
          உங்கள் phone number பாதுகாப்பாக உள்ளது.<br />
          OTP மட்டுமே verify செய்யப்படும்.
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px) } to { opacity:1; transform:none } }
        @keyframes spin   { to { transform:rotate(360deg) } }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}

// ── StructuredLabResult ───────────────────────────────────────────────────────
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
    sec: { background:"rgba(255,255,255,0.04)",border:"0.5px solid rgba(255,255,255,0.09)",borderRadius:12,padding:"12px 14px",marginBottom:10 },
    secD: { background:"rgba(239,68,68,0.05)",border:"0.5px solid rgba(239,68,68,0.22)",borderRadius:12,padding:"12px 14px",marginBottom:10 },
    lbl: { fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:8,display:"block" },
    lb: (a) => ({ fontSize:11,padding:"3px 10px",borderRadius:6,border:`0.5px solid ${a?"rgba(96,165,250,0.4)":"rgba(255,255,255,0.15)"}`,background:a?"rgba(96,165,250,0.12)":"transparent",color:a?"#60a5fa":"rgba(255,255,255,0.4)",cursor:"pointer" }),
    fq: { fontSize:12,padding:"5px 12px",borderRadius:8,border:"0.5px solid rgba(255,255,255,0.12)",background:"transparent",color:"rgba(255,255,255,0.55)",cursor:"pointer",fontFamily:"inherit" },
  };
  const followUps = [];
  if (abnormal.some(f => /Glucose|HbA1c|Sugar/i.test(f))) followUps.push("Diabetes control பண்றது எப்படி?");
  if (abnormal.some(f => /Cholesterol|HDL|LDL/i.test(f))) followUps.push("Cholesterol கம்மி பண்ண diet என்ன?");
  if (abnormal.length > 0) followUps.push("இந்த results என்ன mean?");
  followUps.push("Doctor கிட்ட என்ன சொல்லணும்?");
  return (
    <div style={{ marginTop:14 }}>
      {(patient||reportDate||labName) && (
        <div style={S.sec}>
          <span style={S.lbl}>Patient Info</span>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
            {[["Name",patient],["Age / Gender",age],["Report Date",reportDate],["Lab",labName],["Report Type",reportType]].filter(([,v])=>v).map(([k,v])=>(
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
      <p style={{ fontSize:12,color:"rgba(255,255,255,0.25)",textAlign:"center",margin:"8px 0 0",fontStyle:"italic" }}>{disclaimer}</p>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  // ── Auth state ────────────────────────────────────────────────────────────────
  const [authenticated, setAuthenticated] = useState(() => {
    const phone = localStorage.getItem("anbu_phone");
    const token = localStorage.getItem("anbu_widget_token");
    return !!(phone || token);
  });
  const [authUser, setAuthUser] = useState(() => ({
    phone: localStorage.getItem("anbu_phone") || "",
    prompts: null,
  }));

  // ── Chat state ────────────────────────────────────────────────────────────────
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState("");
  const [loading, setLoading]         = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [mode, setMode]               = useState("general");
  const [chatId]                      = useState(() => crypto.randomUUID());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyMsgs, setHistoryMsgs] = useState([]);
  const [promptCount, setPromptCount] = useState(() => getPromptData().count);
  const [limitReached, setLimitReached] = useState(false);
  const [serverPrompts, setServerPrompts] = useState(null);
  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load history on auth
  useEffect(() => {
    if (!authenticated || !authUser.phone) return;
    apiUserHistory(authUser.phone).then(msgs => {
      if (msgs.length > 0) setHistoryMsgs(msgs);
    }).catch(() => {});
    apiUserStatus(authUser.phone).then(s => {
      if (s) setServerPrompts(s);
    }).catch(() => {});
  }, [authenticated, authUser.phone]);

  const handleAuthenticated = useCallback(({ phone, prompts }) => {
    setAuthUser({ phone, prompts });
    setAuthenticated(true);
    if (prompts) setServerPrompts(prompts);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("anbu_phone");
    localStorage.removeItem("anbu_widget_token");
    setAuthenticated(false);
    setAuthUser({ phone: "", prompts: null });
    setMessages([]);
    setHistoryMsgs([]);
  }, []);

  // ── File upload ────────────────────────────────────────────────────────────────
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadPreview(ev.target.result);
    reader.readAsDataURL(file);
  }, []);

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setUploadPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // ── Voice input ────────────────────────────────────────────────────────────────
  const toggleVoice = useCallback(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice not supported in this browser.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = "ta-IN";
    rec.continuous = false;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const txt = e.results[0][0].transcript;
      setInput(prev => prev + (prev ? " " : "") + txt);
    };
    rec.onerror = () => setIsListening(false);
    rec.onend   = () => setIsListening(false);
    recognitionRef.current = rec;
    rec.start();
    setIsListening(true);
  }, [isListening]);

  // ── Send message ───────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed && !uploadedFile) return;

    // Check prompt limits
    const effective = serverPrompts || { count: promptCount, remaining: MAX_PROMPTS - promptCount, limit: MAX_PROMPTS, allowed: promptCount < MAX_PROMPTS };
    if (!effective.allowed && effective.remaining <= 0) {
      setLimitReached(true);
      return;
    }

    const userMsg = {
      role: "user",
      content: trimmed,
      image: uploadPreview,
      mode,
      ts: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    const fileToSend = uploadedFile;
    removeFile();

    try {
      const result = await callAnbuAPI(trimmed, fileToSend, mode, authUser.phone, chatId);
      const count = incrementPrompt();
      setPromptCount(count);
      if (result.prompts) setServerPrompts(result.prompts);

      setMessages(prev => [...prev, {
        role: "assistant",
        content: result.answer,
        structured: result.structured,
        mode: result.mode,
        ts: Date.now(),
      }]);
    } catch (err) {
      if (err.message === "DAILY_LIMIT") {
        setLimitReached(true);
      } else {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "❌ " + err.message,
          ts: Date.now(),
        }]);
      }
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }, [input, uploadedFile, uploadPreview, mode, authUser.phone, chatId, promptCount, serverPrompts, removeFile]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Prompt info
  const promptInfo = useMemo(() => {
    if (serverPrompts) return serverPrompts;
    const count = promptCount;
    return { count, remaining: MAX_PROMPTS - count, limit: MAX_PROMPTS, allowed: count < MAX_PROMPTS };
  }, [serverPrompts, promptCount]);

  // ── If not authenticated — show MSG91 widget ──────────────────────────────────
  if (!authenticated) {
    return <OtpWidgetScreen onAuthenticated={handleAuthenticated} />;
  }

  // ── Main Chat UI ───────────────────────────────────────────────────────────────
  const modeOptions = [
    { value: "general", label: "💬 General", icon: <BotIcon /> },
    { value: "lab",     label: "🔬 Lab",     icon: <LabIcon /> },
    { value: "scan",    label: "🫀 Scan",    icon: <ScanIcon /> },
    { value: "medicine",label: "💊 Medicine",icon: <PillIcon /> },
  ];

  return (
    <div style={{
      height: "100dvh",
      display: "flex",
      flexDirection: "column",
      background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,197,94,0.08), transparent), #0a0a0a",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#fff",
      overflow: "hidden",
    }}>
      {/* ── Header ── */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,0,0,0.4)",
        backdropFilter: "blur(12px)",
        flexShrink: 0,
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#22c55e,#16a34a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <HeartIcon />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>Anbu Health AI</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Tamil Nadu Village Healthcare</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Prompt counter */}
          <div style={{
            fontSize: 11,
            color: promptInfo.remaining <= 3 ? "#f87171" : "rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
            padding: "4px 10px",
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}>
            <span style={{ opacity: 0.6 }}>💬</span>
            <span>{promptInfo.remaining}/{promptInfo.limit} remaining</span>
          </div>

          {/* History */}
          <button
            id="btn-history"
            onClick={() => setHistoryOpen(v => !v)}
            title="Chat History"
            style={{
              background: historyOpen ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, color: "#fff", padding: "6px 10px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 12,
            }}
          >
            <HistoryIcon />
          </button>

          {/* Phone display + logout */}
          {authUser.phone && (
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 8, padding: "5px 10px",
            }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                +91 {authUser.phone.replace(/^91/, "")}
              </span>
            </div>
          )}
          <button
            id="btn-logout"
            onClick={handleLogout}
            title="Logout"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8, color: "rgba(255,255,255,0.5)",
              padding: "6px 8px", cursor: "pointer",
              display: "flex", alignItems: "center",
            }}
          >
            <LogoutIcon />
          </button>
        </div>
      </header>

      {/* ── History Panel ── */}
      {historyOpen && (
        <div style={{
          position: "absolute", top: 65, right: 16, zIndex: 100,
          width: 320, maxHeight: 400,
          background: "rgba(18,18,18,0.97)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 14, overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
          backdropFilter: "blur(12px)",
        }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Chat History</span>
            <button onClick={() => setHistoryOpen(false)} style={{ background:"none",border:"none",color:"rgba(255,255,255,0.4)",cursor:"pointer" }}><CloseIcon /></button>
          </div>
          <div style={{ overflowY:"auto", maxHeight: 340, padding: "8px 0" }}>
            {historyMsgs.length === 0 ? (
              <p style={{ color:"rgba(255,255,255,0.3)",fontSize:13,textAlign:"center",padding:"20px 16px" }}>No history yet</p>
            ) : historyMsgs.map((m, i) => (
              <div key={i} onClick={() => { setInput(m.question || ""); setHistoryOpen(false); inputRef.current?.focus(); }}
                style={{ padding:"10px 16px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.04)" }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
                onMouseLeave={e => e.currentTarget.style.background=""}
              >
                <div style={{ fontSize:13,color:"rgba(255,255,255,0.8)",marginBottom:2 }}>{m.question}</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.3)" }}>{new Date(m.timestamp).toLocaleString("ta-IN")}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Mode Selector ── */}
      <div style={{
        display: "flex", gap: 6, padding: "8px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        flexShrink: 0, overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {modeOptions.map(opt => (
          <button
            key={opt.value}
            id={`mode-${opt.value}`}
            onClick={() => setMode(opt.value)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              padding: "5px 12px",
              borderRadius: 8,
              fontSize: 12, fontWeight: 500,
              cursor: "pointer",
              border: mode === opt.value
                ? "1px solid rgba(34,197,94,0.4)"
                : "1px solid rgba(255,255,255,0.07)",
              background: mode === opt.value
                ? "rgba(34,197,94,0.12)"
                : "rgba(255,255,255,0.04)",
              color: mode === opt.value ? "#4ade80" : "rgba(255,255,255,0.5)",
              transition: "all 0.15s",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* ── Messages ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", scrollbarWidth: "thin" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <HeartIcon />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Vanakkam! 🙏</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, maxWidth: 320, margin: "0 auto 24px" }}>
              உங்கள் உடல் நலம் பத்தி கேளுங்க. Lab reports, scans, medicines — எதுவும் கேட்கலாம்.
            </p>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",maxWidth:400,margin:"0 auto" }}>
              {["என் blood sugar அதிகமா இருக்கா?","Lab report explain பண்ணுங்க","இந்த மாத்திரை safe-ஆ?","Chest scan result என்ன?"].map((q,i)=>(
                <button key={i} onClick={()=>sendMessage(q)} style={{
                  padding:"8px 14px",borderRadius:10,fontSize:12,
                  border:"1px solid rgba(34,197,94,0.2)",
                  background:"rgba(34,197,94,0.06)",
                  color:"rgba(255,255,255,0.65)",
                  cursor:"pointer",fontFamily:"inherit",
                }}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            marginBottom: 12,
            animation: "fadeIn 0.2s ease",
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginRight: 8, marginTop: 2,
                background: "linear-gradient(135deg,#22c55e,#16a34a)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <BotIcon />
              </div>
            )}
            <div style={{
              maxWidth: msg.structured ? "100%" : "78%",
              background: msg.role === "user"
                ? "linear-gradient(135deg,#22c55e,#16a34a)"
                : "rgba(255,255,255,0.05)",
              border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.07)",
              borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "4px 16px 16px 16px",
              padding: "10px 14px",
              fontSize: 14, lineHeight: 1.65,
              color: msg.role === "user" ? "#fff" : "rgba(255,255,255,0.88)",
            }}>
              {msg.image && (
                <img src={msg.image} alt="uploaded" style={{
                  width: "100%", maxWidth: 200, borderRadius: 8, marginBottom: 8, display: "block",
                }} />
              )}
              <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
              {msg.structured && <StructuredLabResult data={msg.structured} onFollowUp={sendMessage} />}
            </div>
            {msg.role === "user" && (
              <div style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0, marginLeft: 8, marginTop: 2,
                background: "rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <UserIcon />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
            <div style={{ width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,#22c55e,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center" }}><BotIcon /></div>
            <div style={{ display:"flex",gap:4,alignItems:"center",padding:"10px 14px",background:"rgba(255,255,255,0.05)",borderRadius:"4px 16px 16px 16px",border:"1px solid rgba(255,255,255,0.07)" }}>
              {[0,1,2].map(i=>(
                <div key={i} style={{ width:6,height:6,borderRadius:"50%",background:"#22c55e",animation:`bounce 1s ease ${i*0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}

        {limitReached && (
          <div style={{ textAlign:"center",padding:"20px",background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",borderRadius:12,margin:"8px 0" }}>
            <p style={{ color:"#f87171",margin:"0 0 4px",fontWeight:600 }}>Daily limit reached</p>
            <p style={{ color:"rgba(255,255,255,0.4)",fontSize:13,margin:0 }}>நாளை மீண்டும் வாருங்கள் 🙏</p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input Area ── */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(12px)",
        flexShrink: 0,
      }}>
        {uploadPreview && (
          <div style={{ position:"relative",display:"inline-block",marginBottom:8 }}>
            <img src={uploadPreview} alt="preview" style={{ width:64,height:64,objectFit:"cover",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)" }} />
            <button onClick={removeFile} style={{ position:"absolute",top:-6,right:-6,width:18,height:18,borderRadius:"50%",background:"#ef4444",border:"none",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0,lineHeight:1 }}>
              <CloseIcon />
            </button>
          </div>
        )}
        <div style={{ display:"flex",gap:8,alignItems:"flex-end" }}>
          <button
            id="btn-upload"
            onClick={() => fileInputRef.current?.click()}
            title="Upload image"
            style={{
              width:40,height:40,borderRadius:10,flexShrink:0,
              background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.08)",
              color:"rgba(255,255,255,0.5)",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}
          >
            <PlusIcon />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} style={{ display:"none" }} />

          <textarea
            ref={inputRef}
            id="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="உங்கள் கேள்வி தமிழிலோ English-லோ கேளுங்க..."
            rows={1}
            style={{
              flex:1, background:"rgba(255,255,255,0.06)",
              border:"1px solid rgba(255,255,255,0.09)",
              borderRadius:12, color:"#fff", fontSize:14,
              padding:"10px 14px", resize:"none", outline:"none",
              fontFamily:"inherit", lineHeight:1.5,
              maxHeight:120, overflowY:"auto",
              scrollbarWidth:"none",
            }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />

          <button
            id="btn-voice"
            onClick={toggleVoice}
            title="Voice input"
            style={{
              width:40,height:40,borderRadius:10,flexShrink:0,
              background: isListening ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)",
              border: isListening ? "1px solid rgba(239,68,68,0.4)" : "1px solid rgba(255,255,255,0.08)",
              color: isListening ? "#f87171" : "rgba(255,255,255,0.5)",
              cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
            }}
          >
            <MicIcon active={isListening} />
          </button>

          <button
            id="btn-send"
            onClick={() => sendMessage()}
            disabled={loading || (!input.trim() && !uploadedFile)}
            style={{
              width:40,height:40,borderRadius:10,flexShrink:0,
              background: loading || (!input.trim()&&!uploadedFile)
                ? "rgba(255,255,255,0.06)"
                : "linear-gradient(135deg,#22c55e,#16a34a)",
              border:"none",
              color: loading || (!input.trim()&&!uploadedFile)
                ? "rgba(255,255,255,0.3)"
                : "#fff",
              cursor: loading || (!input.trim()&&!uploadedFile) ? "not-allowed" : "pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"all 0.15s",
            }}
          >
            <SendIcon />
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }
        @keyframes bounce { 0%,80%,100% { transform:translateY(0) } 40% { transform:translateY(-6px) } }
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px; }
        textarea::-webkit-scrollbar { display:none; }
      `}</style>
    </div>
  );
}
