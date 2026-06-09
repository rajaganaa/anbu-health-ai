import { useState, useRef, useEffect, useCallback } from "react";

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
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const WarningIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" stroke="white" strokeWidth="2" /><line x1="12" y1="17" x2="12.01" y2="17" stroke="white" strokeWidth="2" />
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

// ── Mock API (replace with real FastAPI calls) ─────────────────────────────────
const MOCK_RESPONSES = {
  lab: (filename) => ({
    mode: "lab",
    structured: {
      summary: "Blood test results analyzed. Hemoglobin slightly below normal range.",
      findings: ["Hemoglobin: 10.2 g/dL (Low — normal: 12–16)", "Blood Sugar: 108 mg/dL (Normal)", "WBC Count: 9,200/μL (Normal)", "Platelet Count: 1.8 Lakh/μL (Normal)"],
      recommendation: "Eat iron-rich foods like spinach, dal, and jaggery. Follow up in 4 weeks.",
      urgency: "medium",
      disclaimer: "⚠️ இது மட்டும் தகவல். Doctor கிட்ட போயி பாருங்க."
    },
    answer: `உங்கள் ${filename} படிக்கப்பட்டது. Hemoglobin கொஞ்சம் குறைவாக இருக்கு (10.2 g/dL). Spinach, dal சாப்பிடுங்க. Blood sugar normal-ஆ இருக்கு.`
  }),
  scan: (filename) => ({
    mode: "scan",
    structured: {
      summary: "Chest X-Ray analysis complete. No major abnormalities detected.",
      findings: ["Lung fields: Clear", "Heart size: Normal", "Bones: Intact", "Diaphragm: Normal position"],
      recommendation: "No immediate concern. Continue regular checkups.",
      urgency: "low",
      disclaimer: "⚠️ இது மட்டும் தகவல். Radiologist report வாங்குங்க."
    },
    answer: `${filename} scan பார்த்தேன். Lungs clear-ஆ இருக்கு. Heart size normal. Special concern இல்லை. Regular checkup continue பண்ணுங்க.`
  }),
  medicine: (filename) => ({
    mode: "medicine",
    structured: {
      summary: "Paracetamol 500mg tablet identified.",
      uses: ["Fever (காய்ச்சல்)", "Mild to moderate pain", "Headache (தலைவலி)"],
      dosage: "Adults: 500mg–1000mg every 4–6 hours. Maximum: 4000mg/day",
      sideEffects: ["Nausea (குமட்டல்) — rare", "Liver damage if overdosed"],
      warnings: ["Do NOT exceed 4 tablets/day", "Avoid with alcohol", "Liver problem இருந்தா use வேண்டாம்"],
      disclaimer: "⚠️ Doctor சொன்ன dosage மட்டும் எடுங்க."
    },
    answer: "Paracetamol 500mg tablet identify பண்ணினேன். Fever மற்றும் pain-க்கு use ஆகும். Adults: 1 tablet (500mg) every 6 hours. Day-ku maximum 4 tablets மட்டும்."
  }),
  general: (q) => ({
    mode: "general",
    answer: q.toLowerCase().includes("sugar") || q.toLowerCase().includes("diabetes")
      ? "Diabetes control-க்கு: Daily exercise, less rice, more vegetables. Metformin எடுக்கிறீங்களா? Doctor கிட்ட HbA1c test பண்ணுங்க. Normal range: below 7%."
      : q.toLowerCase().includes("bp") || q.toLowerCase().includes("pressure")
        ? "Blood pressure-கு: Less salt, walk 30 minutes daily. Stress குறைக்கணும். ஒரு week-கு ஒரு முறை BP check பண்ணுங்க. Doctor advice follow பண்ணுங்க."
        : "உங்கள் கேள்விக்கு நன்றி. இந்த symptom-க்கு doctor consultation recommend பண்றேன். More info தேவைன்னா ask பண்ணுங்க!",
    structured: null
  })
};

const API_URL = "https://anbu-health-ai.kindrock-2ca528ff.centralindia.azurecontainerapps.io";

async function callAnbuAPI(message, uploadedFile, mode) {
  const formData = new FormData();
  formData.append("question", message);
  formData.append("mode", mode || "general");
  if (uploadedFile) formData.append("image", uploadedFile);

  const response = await fetch(`${API_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return {
    mode: data.mode,
    answer: data.final_answer,
    structured: data.buddhi?.structured_response,
  };
}

// ── Prompt counter (replace with Supabase) ─────────────────────────────────────
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

// ── Sub-components ─────────────────────────────────────────────────────────────

function StructuredLabResult({ data }) {
  const urgencyColor = { low: "#10b981", medium: "#f59e0b", high: "#ef4444" }[data.urgency] || "#6b7280";
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: urgencyColor, display: "block" }} />
        <span style={{ fontSize: 11, color: urgencyColor, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
          {data.urgency === "low" ? "Normal" : data.urgency === "medium" ? "Attention" : "Urgent"} • Lab Report
        </span>
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 10, padding: "12px 14px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
        {data.findings.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "5px 0", borderBottom: i < data.findings.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <span style={{ color: f.includes("Low") || f.includes("High") ? "#f59e0b" : "#10b981", marginTop: 1, flexShrink: 0 }}>
              {f.includes("Low") || f.includes("High") ? <WarningIcon /> : <CheckIcon />}
            </span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>{f}</span>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(16,185,129,0.08)", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(16,185,129,0.2)", fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
        💡 {data.recommendation}
      </div>
    </div>
  );
}

function StructuredMedicineResult({ data }) {
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <span style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>💊 Medicine Info</span>
      </div>
      {[
        { label: "Uses / பயன்பாடு", items: data.uses || [], color: "#60a5fa" },
        { label: "Side Effects / பக்க விளைவுகள்", items: data.sideEffects || data.side_effects || [], color: "#f59e0b" },
        { label: "Warnings / எச்சரிக்கை", items: data.warnings || [], color: "#ef4444" },
      ].map(({ label, items, color }) => (
        <div key={label} style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11, color, fontWeight: 600, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {items.map((item, i) => (
              <span key={i} style={{ background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 20, padding: "3px 10px", fontSize: 12, color: "rgba(255,255,255,0.75)" }}>{item}</span>
            ))}
          </div>
        </div>
      ))}
      <div style={{ background: "rgba(139,92,246,0.08)", borderRadius: 8, padding: "8px 12px", border: "1px solid rgba(139,92,246,0.2)", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
        📏 Dosage: {data.dosage}
      </div>
    </div>
  );
}

function MessageBubble({ msg, isLast }) {
  const isUser = msg.role === "user";
  const [audioPlaying, setAudioPlaying] = useState(false);

  const speakText = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(msg.content.slice(0, 300));
    utter.lang = "ta-IN";
    utter.rate = 0.9;
    setAudioPlaying(true);
    utter.onend = () => setAudioPlaying(false);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div style={{
      display: "flex",
      gap: 10,
      padding: "6px 0",
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-start",
      animation: isLast ? "slideUp 0.3s ease" : "none"
    }}>
      {/* Avatar */}
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: isUser
          ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
          : "linear-gradient(135deg, #059669, #10b981)",
        boxShadow: isUser ? "0 2px 8px rgba(99,102,241,0.4)" : "0 2px 8px rgba(16,185,129,0.35)"
      }}>
        {isUser ? <UserIcon /> : <BotIcon />}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: "75%", minWidth: 80 }}>
        {/* Upload preview */}
        {msg.file && (
          <div style={{
            background: "rgba(255,255,255,0.06)", borderRadius: "12px 12px 0 0", padding: "8px 12px",
            border: "1px solid rgba(255,255,255,0.1)", borderBottom: "none",
            display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.6)"
          }}>
            <span style={{ fontSize: 18 }}>{msg.fileMode === "lab" ? "🧪" : msg.fileMode === "scan" ? "🩻" : "💊"}</span>
            <span>{msg.file}</span>
          </div>
        )}

        <div style={{
          background: isUser
            ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))"
            : "rgba(255,255,255,0.05)",
          border: isUser
            ? "1px solid rgba(99,102,241,0.35)"
            : "1px solid rgba(255,255,255,0.08)",
          borderRadius: msg.file
            ? (isUser ? "0 12px 12px 12px" : "0 12px 12px 12px")
            : (isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px"),
          padding: "11px 14px",
        }}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.88)", whiteSpace: "pre-wrap" }}>
            {msg.content}
          </p>

          {/* Structured results */}
          {msg.structured && msg.structured.findings && <StructuredLabResult data={msg.structured} />}
          {msg.structured && msg.structured.uses && <StructuredMedicineResult data={msg.structured} />}
          {msg.structured?.findings && (
            <p style={{ margin: "10px 0 0", fontSize: 11, color: "rgba(255,255,255,0.4)", borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 8 }}>
              {msg.structured.disclaimer}
            </p>
          )}
        </div>

        {/* Actions row */}
        {!isUser && (
          <div style={{ display: "flex", gap: 8, marginTop: 5, paddingLeft: 4 }}>
            <button onClick={speakText} style={{
              display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: audioPlaying ? "#10b981" : "rgba(255,255,255,0.35)",
              background: "none", border: "none", cursor: "pointer", padding: "2px 6px", borderRadius: 4,
              transition: "color 0.2s"
            }}>
              {audioPlaying ? "🔊 Playing..." : "🔈 Listen (Tamil)"}
            </button>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>
              {new Date(msg.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 10, padding: "6px 0", alignItems: "flex-start" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #059669, #10b981)" }}>
        <BotIcon />
      </div>
      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px 16px 16px 16px", padding: "14px 18px" }}>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", animation: `bounce 1.2s ${i * 0.15}s infinite` }} />
          ))}
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
    lab: { emoji: "🧪", title: "Lab Report Upload", subtitle: "Blood test, urine test, sugar report", color: "#60a5fa", accept: ".pdf,.jpg,.jpeg,.png" },
    scan: { emoji: "🩻", title: "X-Ray / Scan Upload", subtitle: "Chest X-ray, ultrasound, MRI scan", color: "#a78bfa", accept: ".jpg,.jpeg,.png,.dicom" },
    medicine: { emoji: "💊", title: "Medicine Photo", subtitle: "Take a photo of medicine strip or box", color: "#34d399", accept: ".jpg,.jpeg,.png" },
  }[mode];

  const handleFile = (file) => setSelectedFile(file);
  const handleDrop = (e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
      <div style={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 400, animation: "slideUp 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{modeConfig.emoji}</div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "white" }}>{modeConfig.title}</h3>
            <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{modeConfig.subtitle}</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CloseIcon />
          </button>
        </div>

        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? modeConfig.color : "rgba(255,255,255,0.15)"}`,
            borderRadius: 14, padding: "30px 20px", textAlign: "center", cursor: "pointer",
            background: dragging ? `${modeConfig.color}08` : "rgba(255,255,255,0.02)",
            transition: "all 0.2s", marginBottom: 16
          }}
        >
          <input ref={fileInputRef} type="file" accept={modeConfig.accept} style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
          {selectedFile ? (
            <>
              <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
              <p style={{ margin: 0, fontSize: 14, color: modeConfig.color, fontWeight: 600 }}>{selectedFile.name}</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{(selectedFile.size / 1024).toFixed(0)} KB</p>
            </>
          ) : (
            <>
              <div style={{ color: "rgba(255,255,255,0.3)", marginBottom: 10 }}><UploadIcon /></div>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>Tap to upload or drag & drop</p>
              <p style={{ margin: "4px 0 0", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{modeConfig.accept}</p>
            </>
          )}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px 0", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.6)", fontSize: 14, cursor: "pointer" }}>
            Cancel
          </button>
          <button
            onClick={() => selectedFile && onUpload(selectedFile, mode)}
            disabled={!selectedFile}
            style={{
              flex: 2, padding: "11px 0", borderRadius: 10, border: "none",
              background: selectedFile ? `linear-gradient(135deg, ${modeConfig.color}, ${modeConfig.color}bb)` : "rgba(255,255,255,0.08)",
              color: selectedFile ? "white" : "rgba(255,255,255,0.3)", fontSize: 14, fontWeight: 600, cursor: selectedFile ? "pointer" : "default",
              transition: "all 0.2s"
            }}
          >
            Analyze {modeConfig.emoji}
          </button>
        </div>
      </div>
    </div>
  );
}

function OTPModal({ onSuccess, onClose }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); // phone | otp | success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendOTP = async () => {
    if (phone.length !== 10) { setError("Valid 10-digit number போடு"); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false); setStep("otp");
  };

  const verifyOTP = async () => {
    if (otp.length !== 6) { setError("6-digit OTP போடு"); return; }
    setLoading(true); setError("");
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    if (otp === "123456" || otp.length === 6) {
      setStep("success");
      setTimeout(() => onSuccess({ phone }), 1200);
    } else {
      setError("Wrong OTP. Try again."); setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}>
      <div style={{ background: "#0f1117", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 24, padding: 32, width: "100%", maxWidth: 360, animation: "slideUp 0.4s ease" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "linear-gradient(135deg, #059669, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }}>
            <HeartIcon />
          </div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "white" }}>Anbu Health AI</h2>
          <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Tamil Nadu Village Healthcare</p>
        </div>

        {step === "success" ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ margin: 0, fontSize: 16, color: "#10b981", fontWeight: 700 }}>Login Success!</p>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Welcome to Anbu Health AI</p>
          </div>
        ) : step === "phone" ? (
          <>
            <p style={{ margin: "0 0 16px", fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>Phone number போடு — OTP வரும்</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ padding: "13px 12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 14, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 4 }}>
                <PhoneIcon /> +91
              </div>
              <input
                type="tel" maxLength={10} value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                placeholder="98765 43210"
                style={{ flex: 1, padding: "13px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 16, color: "white", outline: "none", letterSpacing: 2 }}
              />
            </div>
            {error && <p style={{ margin: "0 0 10px", fontSize: 12, color: "#ef4444", textAlign: "center" }}>{error}</p>}
            <button onClick={sendOTP} disabled={loading || phone.length !== 10} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: phone.length === 10 ? "linear-gradient(135deg, #059669, #10b981)" : "rgba(255,255,255,0.07)", color: phone.length === 10 ? "white" : "rgba(255,255,255,0.3)", fontSize: 15, fontWeight: 700, cursor: phone.length === 10 ? "pointer" : "default", transition: "all 0.2s" }}>
              {loading ? "Sending..." : "OTP அனுப்பு →"}
            </button>
          </>
        ) : (
          <>
            <p style={{ margin: "0 0 6px", fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>+91 {phone} க்கு OTP வந்தது</p>
            <p style={{ margin: "0 0 16px", fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>(Demo: use any 6 digits)</p>
            <input
              type="tel" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="• • • • • •"
              style={{ width: "100%", padding: "16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 10, fontSize: 24, color: "white", outline: "none", letterSpacing: 12, textAlign: "center", boxSizing: "border-box", marginBottom: 12 }}
            />
            {error && <p style={{ margin: "0 0 10px", fontSize: 12, color: "#ef4444", textAlign: "center" }}>{error}</p>}
            <button onClick={verifyOTP} disabled={loading || otp.length !== 6} style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: otp.length === 6 ? "linear-gradient(135deg, #059669, #10b981)" : "rgba(255,255,255,0.07)", color: otp.length === 6 ? "white" : "rgba(255,255,255,0.3)", fontSize: 15, fontWeight: 700, cursor: otp.length === 6 ? "pointer" : "default", transition: "all 0.2s" }}>
              {loading ? "Verifying..." : "Verify ✓"}
            </button>
            <button onClick={() => setStep("phone")} style={{ width: "100%", marginTop: 8, padding: "10px", borderRadius: 10, border: "none", background: "none", color: "rgba(255,255,255,0.35)", fontSize: 13, cursor: "pointer" }}>← Change number</button>
          </>
        )}
      </div>
    </div>
  );
}

function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, user, promptCount, onClose, visible }) {
  return (
    <>
      {visible && <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40, display: "block" }} />}
      <div style={{
        position: "fixed", left: 0, top: 0, height: "100%", width: 260,
        background: "#0d1117", borderRight: "1px solid rgba(255,255,255,0.07)",
        display: "flex", flexDirection: "column", zIndex: 50,
        transform: visible ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)"
      }}>
        {/* Header */}
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #059669, #10b981)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HeartIcon />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "white" }}>Anbu Health AI</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Medical Assistant</div>
            </div>
          </div>
          <button onClick={onNewChat} style={{ width: "100%", padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit", transition: "background 0.15s" }}>
            <NewChatIcon /> New Chat
          </button>
        </div>

        {/* Prompt count */}
        <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>Today's prompts</span>
            <span style={{ fontSize: 11, color: promptCount >= MAX_PROMPTS ? "#ef4444" : "#10b981", fontWeight: 600 }}>{promptCount}/{MAX_PROMPTS}</span>
          </div>
          <div style={{ height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${(promptCount / MAX_PROMPTS) * 100}%`, background: promptCount >= MAX_PROMPTS ? "#ef4444" : "linear-gradient(90deg, #059669, #10b981)", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>

        {/* Chat history */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 8px" }}>
          <p style={{ margin: "8px 8px 6px", fontSize: 10, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: 1 }}>Recent Chats</p>
          {chats.map(chat => (
            <button key={chat.id} onClick={() => { onSelectChat(chat.id); onClose(); }} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "none", background: chat.id === activeChatId ? "rgba(16,185,129,0.12)" : "none", color: chat.id === activeChatId ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer", textAlign: "left", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 8, marginBottom: 2, transition: "all 0.15s" }}>
              <HistoryIcon />
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{chat.title}</span>
            </button>
          ))}
        </div>

        {/* User */}
        {user && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <UserIcon />
            </div>
            <div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>+91 {user.phone}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Verified ✓</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Welcome Screen ─────────────────────────────────────────────────────────────
function WelcomeScreen({ onQuickPrompt }) {
  const suggestions = [
    { icon: "🩸", text: "Sugar test result explain பண்ணு", mode: null },
    { icon: "💊", text: "Paracetamol dosage என்ன?", mode: null },
    { icon: "❤️", text: "BP high-ஆ இருக்கு, என்ன சாப்பிடணும்?", mode: null },
    { icon: "🤒", text: "Fever 3 days-ஆ இருக்கு, என்ன பண்றது?", mode: null },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "20px 20px 0", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: "linear-gradient(135deg, #059669, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 12px 32px rgba(16,185,129,0.3)", animation: "pulse 2.5s infinite" }}>
        <span style={{ fontSize: 32 }}>🏥</span>
      </div>
      <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "white" }}>Anbu Health AI</h1>
      <p style={{ margin: "0 0 6px", fontSize: 14, color: "rgba(255,255,255,0.5)", maxWidth: 300, lineHeight: 1.6 }}>
        Tamil Nadu village patients-க்கான AI medical assistant
      </p>
      <p style={{ margin: "0 0 28px", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Lab reports • X-Rays • Medicine info • Health questions</p>

      <div style={{ width: "100%", maxWidth: 500 }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: 1 }}>இதை கேளுங்க</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {suggestions.map((s, i) => (
            <button key={i} onClick={() => onQuickPrompt(s.text)} style={{
              padding: "11px 12px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.5,
              cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.2s",
              display: "flex", alignItems: "flex-start", gap: 8
            }}>
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
  const [showOTP, setShowOTP] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMode, setUploadMode] = useState(null);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [promptCount, setPromptCount] = useState(() => getPromptData().count);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingMode, setPendingMode] = useState(null);

  const [chats, setChats] = useState([
    { id: "c1", title: "New Chat", messages: [] }
  ]);
  const [activeChatId, setActiveChatId] = useState("c1");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId);
  const messages = activeChat?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "ta-IN";
      rec.continuous = false;
      rec.interimResults = false;
      rec.onresult = (e) => { setInputText(e.results[0][0].transcript); setIsListening(false); };
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const addMessage = useCallback((chatId, msg) => {
    setChats(prev => prev.map(c => c.id === chatId ? {
      ...c,
      title: c.messages.length === 0 ? (msg.content?.slice(0, 30) || "Chat") + "..." : c.title,
      messages: [...c.messages, msg]
    } : c));
  }, []);

  const handleSend = async (textOverride) => {
    const text = textOverride || inputText.trim();
    if (!text && !pendingFile) return;
    if (promptCount >= MAX_PROMPTS) return;

    const msgText = text || (pendingFile ? `${pendingFile.name} analyze பண்ணு` : "");
    const userMsg = {
      id: Date.now(), role: "user", content: msgText,
      file: pendingFile?.name, fileMode: pendingMode,
      timestamp: Date.now()
    };

    addMessage(activeChatId, userMsg);
    setInputText(""); setPendingFile(null); setPendingMode(null);
    setIsLoading(true);

    const newCount = incrementPrompt();
    setPromptCount(newCount);

    try {
      const result = await callAnbuAPI(msgText, pendingFile, pendingMode);
      const botMsg = {
        id: Date.now() + 1, role: "assistant",
        content: result.answer,
        structured: result.structured,
        timestamp: Date.now()
      };
      addMessage(activeChatId, botMsg);
    } catch (e) {
      addMessage(activeChatId, { id: Date.now() + 1, role: "assistant", content: "Sorry, error ஆச்சு. Try again.", timestamp: Date.now() });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = (file, mode) => {
    setPendingFile(file); setPendingMode(mode);
    setShowUploadModal(false);
    inputRef.current?.focus();
  };

  const handleVoice = () => {
    if (!recognitionRef.current) { alert("Voice not supported in this browser"); return; }
    if (isListening) { recognitionRef.current.stop(); setIsListening(false); }
    else { recognitionRef.current.start(); setIsListening(true); }
  };

  const handleNewChat = () => {
    const newId = `c${Date.now()}`;
    setChats(prev => [{ id: newId, title: "New Chat", messages: [] }, ...prev]);
    setActiveChatId(newId); setSidebarOpen(false);
  };

  const plusMenuItems = [
    { icon: <LabIcon />, label: "Lab Report", sublabel: "Blood test, sugar, urine", color: "#60a5fa", mode: "lab" },
    { icon: <ScanIcon />, label: "X-Ray / Scan", sublabel: "Chest, abdomen, MRI", color: "#a78bfa", mode: "scan" },
    { icon: <PillIcon />, label: "Medicine", sublabel: "Photo of medicine strip", color: "#34d399", mode: "medicine" },
  ];

  return (
    <div style={{ height: "100vh", background: "#0f1117", display: "flex", flexDirection: "column", fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 12px 32px rgba(16,185,129,0.3); } 50% { box-shadow: 0 12px 48px rgba(16,185,129,0.55); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; }
        input, button { font-family: inherit; }
        textarea:focus { outline: none; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* OTP Modal */}
      {showOTP && <OTPModal onSuccess={(u) => { setUser(u); setShowOTP(false); }} onClose={() => setShowOTP(false)} />}

      {/* Sidebar */}
      <Sidebar
        visible={sidebarOpen} onClose={() => setSidebarOpen(false)}
        chats={chats} activeChatId={activeChatId}
        onNewChat={handleNewChat} onSelectChat={setActiveChatId}
        user={user} promptCount={promptCount}
      />

      {/* Upload Modal */}
      {showUploadModal && <UploadModal mode={uploadMode} onClose={() => setShowUploadModal(false)} onUpload={handleUpload} />}

      {/* Plus menu backdrop */}
      {showPlusMenu && <div onClick={() => setShowPlusMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 20 }} />}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "#0f1117", flexShrink: 0 }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #059669, #10b981)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🏥</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: "white" }}>Anbu Health AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "4px 10px" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontSize: 11, color: "#10b981", fontWeight: 600 }}>Live</span>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 8px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {messages.length === 0 ? (
            <WelcomeScreen onQuickPrompt={(text) => { setInputText(text); setTimeout(() => handleSend(text), 100); }} />
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id} msg={msg} isLast={i === messages.length - 1} />
              ))}
              {isLoading && <TypingIndicator />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Pending file chip */}
      {pendingFile && (
        <div style={{ padding: "0 16px 8px", maxWidth: 696, margin: "0 auto", width: "100%" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 20, padding: "5px 12px" }}>
            <span style={{ fontSize: 13 }}>{pendingMode === "lab" ? "🧪" : pendingMode === "scan" ? "🩻" : "💊"}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{pendingFile.name}</span>
            <button onClick={() => { setPendingFile(null); setPendingMode(null); }} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", padding: 0, display: "flex" }}><CloseIcon /></button>
          </div>
        </div>
      )}

      {/* Prompt limit warning */}
      {promptCount >= MAX_PROMPTS && (
        <div style={{ padding: "8px 16px", maxWidth: 696, margin: "0 auto", width: "100%" }}>
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 10, padding: "8px 14px", fontSize: 12, color: "#fca5a5", textAlign: "center" }}>
            ⚠️ Today's 20 prompts மொத்தமும் use ஆயிட்டு. நாளைக்கு வா! (Resets at midnight)
          </div>
        </div>
      )}

      {/* Input Area */}
      <div style={{ padding: "8px 16px 16px", flexShrink: 0, maxWidth: 696, margin: "0 auto", width: "100%" }}>
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, display: "flex", alignItems: "flex-end", gap: 4, padding: "10px 12px", transition: "border-color 0.2s" }}>

          {/* Plus button */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setShowPlusMenu(p => !p)}
              style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: showPlusMenu ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.07)", color: showPlusMenu ? "#10b981" : "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", transform: showPlusMenu ? "rotate(45deg)" : "none" }}
            >
              <PlusIcon />
            </button>

            {/* Plus dropdown */}
            {showPlusMenu && (
              <div style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, background: "#1a1f2e", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: 8, minWidth: 220, zIndex: 30, animation: "slideUp 0.2s ease", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}>
                {plusMenuItems.map(item => (
                  <button key={item.mode} onClick={() => { setUploadMode(item.mode); setShowUploadModal(true); setShowPlusMenu(false); }} style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", background: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontFamily: "inherit", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "none"}
                  >
                    <span style={{ color: item.color }}>{item.icon}</span>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{item.sublabel}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text input */}
          <textarea
            ref={inputRef}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder={isListening ? "🎤 Listening... (Tamil/English)" : "கேள்வி கேளுங்க... (Tamil or English)"}
            rows={1}
            disabled={promptCount >= MAX_PROMPTS}
            style={{ flex: 1, background: "none", border: "none", color: "rgba(255,255,255,0.9)", fontSize: 14, lineHeight: 1.5, resize: "none", padding: "8px 4px", maxHeight: 120, overflowY: "auto", outline: "none", opacity: promptCount >= MAX_PROMPTS ? 0.4 : 1 }}
          />

          {/* Mic */}
          <button
            onClick={handleVoice}
            style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: isListening ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.07)", color: isListening ? "#ef4444" : "rgba(255,255,255,0.5)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}
          >
            <MicIcon active={isListening} />
          </button>

          {/* Send */}
          <button
            onClick={() => handleSend()}
            disabled={(!inputText.trim() && !pendingFile) || isLoading || promptCount >= MAX_PROMPTS}
            style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: (inputText.trim() || pendingFile) && !isLoading && promptCount < MAX_PROMPTS ? "linear-gradient(135deg, #059669, #10b981)" : "rgba(255,255,255,0.07)", color: (inputText.trim() || pendingFile) && !isLoading && promptCount < MAX_PROMPTS ? "white" : "rgba(255,255,255,0.25)", cursor: (inputText.trim() || pendingFile) && !isLoading && promptCount < MAX_PROMPTS ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", boxShadow: (inputText.trim() || pendingFile) && !isLoading ? "0 4px 12px rgba(16,185,129,0.3)" : "none" }}
          >
            <SendIcon />
          </button>
        </div>

        <p style={{ margin: "8px 0 0", fontSize: 11, color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
          Anbu AI is for information only • Doctor advice மட்டும் follow பண்ணுங்க
        </p>
      </div>
    </div>
  );
}
