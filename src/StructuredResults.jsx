/**
 * StructuredResults.jsx — Anbu Health AI
 * Drop-in replacement for all three result card types:
 *   <StructuredLabResult data={structured_response} />
 *   <StructuredMedicineResult data={structured_response} />
 *   <StructuredScanResult data={structured_response} />
 *
 * Usage in MessageBubble:
 *   {msg.structured?.mode === "lab"      && <StructuredLabResult      data={msg.structured} />}
 *   {msg.structured?.mode === "medicine" && <StructuredMedicineResult data={msg.structured} />}
 *   {msg.structured?.mode === "scan"     && <StructuredScanResult     data={msg.structured} />}
 *
 * The `structured_response` object comes from buddhi.py's `sr` dict inside
 * the API response at: response.buddhi.structured_response
 * Map it in callAnbuAPI: result.buddhi.structured_response
 */

import { useState } from "react";

// ─── Shared tokens ────────────────────────────────────────────────────────────
const T = {
  surface:  "rgba(255,255,255,0.04)",
  border:   "rgba(255,255,255,0.08)",
  border2:  "rgba(255,255,255,0.12)",
  textPrimary:   "rgba(255,255,255,0.88)",
  textSecondary: "rgba(255,255,255,0.55)",
  textTertiary:  "rgba(255,255,255,0.3)",
  green:  "#10b981",
  amber:  "#f59e0b",
  red:    "#ef4444",
  blue:   "#60a5fa",
  purple: "#a78bfa",
};

const URGENCY = {
  low:    { color: T.green,  label: "Normal",  bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)" },
  medium: { color: T.amber,  label: "Attention", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)" },
  high:   { color: T.red,    label: "Urgent",   bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.25)" },
};

// ─── Small helpers ────────────────────────────────────────────────────────────

function UrgencyBadge({ urgency }) {
  const u = URGENCY[urgency] || URGENCY.low;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      background: u.bg, border: `1px solid ${u.border}`,
      borderRadius: 20, padding: "4px 12px", fontSize: 11,
      color: u.color, fontWeight: 600, width: "fit-content", marginBottom: 12,
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: u.color, display: "block", flexShrink: 0 }} />
      {u.label}
    </div>
  );
}

function SectionLabel({ children, color = T.textSecondary }) {
  return (
    <p style={{
      margin: "14px 0 6px", fontSize: 10, fontWeight: 600,
      textTransform: "uppercase", letterSpacing: 1, color,
    }}>
      {children}
    </p>
  );
}

function Pill({ children, color = T.blue }) {
  return (
    <span style={{
      display: "inline-block",
      background: `${color}15`, border: `1px solid ${color}30`,
      borderRadius: 20, padding: "3px 11px",
      fontSize: 12, color: "rgba(255,255,255,0.75)",
      marginRight: 5, marginBottom: 5,
    }}>
      {children}
    </span>
  );
}

function InfoRow({ label, value, valueColor }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      padding: "6px 0", borderBottom: `1px solid ${T.border}`,
      gap: 12, fontSize: 13,
    }}>
      <span style={{ color: T.textSecondary, flexShrink: 0 }}>{label}</span>
      <span style={{ color: valueColor || T.textPrimary, textAlign: "right", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function Card({ children, borderColor, style = {} }) {
  return (
    <div style={{
      background: T.surface,
      border: `1px solid ${borderColor || T.border}`,
      borderRadius: 10, padding: "12px 14px",
      ...style,
    }}>
      {children}
    </div>
  );
}

function Disclaimer({ text }) {
  return (
    <p style={{
      margin: "12px 0 0", fontSize: 11,
      color: T.textTertiary,
      borderTop: `1px solid ${T.border}`,
      paddingTop: 8, lineHeight: 1.5,
    }}>
      {text}
    </p>
  );
}

function LangToggle({ lang, onToggle }) {
  return (
    <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
      {["EN", "TA"].map(l => (
        <button
          key={l}
          onClick={() => onToggle(l)}
          style={{
            padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
            border: `1px solid ${lang === l ? T.blue : T.border2}`,
            background: lang === l ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.04)",
            color: lang === l ? T.blue : T.textSecondary,
            cursor: "pointer",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

// ─── ConfidenceBar ────────────────────────────────────────────────────────────
function ConfidenceBar({ value }) {
  const pct = Math.min(100, Math.max(0, Number(value) || 0));
  const color = pct >= 75 ? T.green : pct >= 50 ? T.amber : T.red;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
      <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 600, minWidth: 36 }}>{pct}%</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAB RESULT
// ═══════════════════════════════════════════════════════════════════════════════

export function StructuredLabResult({ data }) {
  const [lang, setLang] = useState("EN");

  const abnormal = data.abnormal_findings || [];
  const normal   = data.normal_findings   || [];
  const all      = data.findings          || [];

  const isHigh = (f) => /high|↑|उच्च/i.test(f);
  const isLow  = (f) => /low|↓|कम/i.test(f);
  const rowColor = (f) => isHigh(f) ? T.amber : isLow(f) ? T.blue : T.green;
  const rowIcon  = (f) => isHigh(f) ? "⚠" : isLow(f) ? "↓" : "✓";

  return (
    <div style={{ marginTop: 14 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>🧪</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.blue, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Lab Report Analysis
          </span>
        </div>
        <LangToggle lang={lang} onToggle={setLang} />
      </div>

      <UrgencyBadge urgency={data.urgency} />

      {/* Summary */}
      {data.summary && (
        <Card style={{ marginBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: T.textPrimary }}>{data.summary}</p>
          <SectionLabel>AI Confidence</SectionLabel>
          <ConfidenceBar value={data.confidence} />
        </Card>
      )}

      {/* Abnormal findings — always first */}
      {abnormal.length > 0 && (
        <>
          <SectionLabel color={T.amber}>⚠ Abnormal Values ({abnormal.length})</SectionLabel>
          <Card borderColor="rgba(245,158,11,0.3)" style={{ marginBottom: 10 }}>
            {abnormal.map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0",
                borderBottom: i < abnormal.length - 1 ? `1px solid ${T.border}` : "none",
              }}>
                <span style={{ color: T.amber, fontSize: 13, marginTop: 1, flexShrink: 0 }}>⚠</span>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      {/* All findings (grouped) */}
      {all.length > 0 && (
        <>
          <SectionLabel>All Test Results</SectionLabel>
          <Card style={{ marginBottom: 10 }}>
            {all.map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0",
                borderBottom: i < all.length - 1 ? `1px solid ${T.border}` : "none",
              }}>
                <span style={{ color: rowColor(f), fontSize: 12, marginTop: 2, flexShrink: 0, fontWeight: 700 }}>
                  {rowIcon(f)}
                </span>
                <span style={{ fontSize: 13, color: T.textPrimary, lineHeight: 1.5 }}>{f}</span>
              </div>
            ))}
          </Card>
        </>
      )}

      {/* Normal findings compact */}
      {normal.length > 0 && (
        <>
          <SectionLabel color={T.green}>✓ Normal Values ({normal.length})</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 10 }}>
            {normal.map((f, i) => <Pill key={i} color={T.green}>{f}</Pill>)}
          </div>
        </>
      )}

      {/* Recommendation */}
      {data.recommendation && (
        <Card borderColor="rgba(16,185,129,0.25)" style={{ marginBottom: 10, background: "rgba(16,185,129,0.06)" }}>
          <p style={{ margin: 0, fontSize: 13, color: T.textPrimary, lineHeight: 1.65 }}>
            <span style={{ color: T.green, marginRight: 6 }}>💡</span>
            {data.recommendation}
          </p>
        </Card>
      )}

      <Disclaimer text={data.disclaimer} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MEDICINE RESULT
// ═══════════════════════════════════════════════════════════════════════════════

export function StructuredMedicineResult({ data }) {
  const [lang, setLang] = useState("EN");
  const [tab, setTab]   = useState("uses"); // uses | side | warn

  const TABS = [
    { id: "uses", label: "Uses / பயன்பாடு",          color: T.blue,   items: data.uses          || [] },
    { id: "side", label: "Side Effects / பக்கவிளைவு", color: T.amber,  items: data.side_effects  || [] },
    { id: "warn", label: "Warnings / எச்சரிக்கை",     color: T.red,    items: data.warnings       || [] },
  ];

  const activeTab = TABS.find(t => t.id === tab);

  return (
    <div style={{ marginTop: 14 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>💊</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.purple, textTransform: "uppercase", letterSpacing: 0.8 }}>
            Medicine Info
          </span>
          {data.drug_name && (
            <span style={{
              background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)",
              borderRadius: 12, padding: "2px 9px", fontSize: 12, color: T.purple, fontWeight: 600,
            }}>
              {data.drug_name}
            </span>
          )}
        </div>
        <LangToggle lang={lang} onToggle={setLang} />
      </div>

      {/* Drug category + urgency row */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <UrgencyBadge urgency={data.urgency || "low"} />
        {data.drug_category && (
          <div style={{
            background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border2}`,
            borderRadius: 20, padding: "4px 12px", fontSize: 11,
            color: T.textSecondary, fontWeight: 500,
          }}>
            {data.drug_category}
          </div>
        )}
      </div>

      {/* Summary */}
      {data.summary && (
        <Card style={{ marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: T.textPrimary }}>{data.summary}</p>
          <ConfidenceBar value={data.confidence} />
        </Card>
      )}

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8, overflowX: "auto" }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "5px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600,
              border: `1px solid ${tab === t.id ? t.color : T.border}`,
              background: tab === t.id ? `${t.color}18` : "rgba(255,255,255,0.03)",
              color: tab === t.id ? t.color : T.textSecondary,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <Card borderColor={`${activeTab.color}30`} style={{ marginBottom: 10, minHeight: 60 }}>
        {activeTab.items.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            {activeTab.items.map((item, i) => <Pill key={i} color={activeTab.color}>{item}</Pill>)}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: 13, color: T.textTertiary }}>No data available.</p>
        )}
      </Card>

      {/* Dosage */}
      <Card borderColor="rgba(167,139,250,0.2)" style={{ marginBottom: 10, background: "rgba(167,139,250,0.06)" }}>
        <p style={{ margin: 0, fontSize: 11, color: T.purple, fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>
          📏 Dosage / அளவு
        </p>
        <p style={{ margin: 0, fontSize: 13, color: T.textPrimary, lineHeight: 1.5 }}>
          {data.dosage || "Doctor prescription follow பண்ணுங்க."}
        </p>
      </Card>

      {/* Recommendation */}
      {data.recommendation && (
        <Card borderColor="rgba(16,185,129,0.2)" style={{ marginBottom: 10, background: "rgba(16,185,129,0.05)" }}>
          <p style={{ margin: 0, fontSize: 13, color: T.textPrimary, lineHeight: 1.65 }}>
            <span style={{ color: T.green, marginRight: 6 }}>💡</span>
            {data.recommendation}
          </p>
        </Card>
      )}

      <Disclaimer text={data.disclaimer} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCAN / X-RAY RESULT
// ═══════════════════════════════════════════════════════════════════════════════

export function StructuredScanResult({ data }) {
  const [lang, setLang]         = useState("EN");
  const [showAll, setShowAll]   = useState(false);

  const findings = data.findings || [];
  const visible  = showAll ? findings : findings.slice(0, 3);

  const SCAN_ICON = {
    "X-ray": "🩻", "CT": "🖥", "MRI": "🧲",
    "Ultrasound": "🔊", "PET-CT": "☢", "DEXA": "🦴",
  };
  const scanIcon = SCAN_ICON[data.scan_type] || "🩻";

  return (
    <div style={{ marginTop: 14 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14 }}>{scanIcon}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: T.purple, textTransform: "uppercase", letterSpacing: 0.8 }}>
            {data.scan_type || "Scan"} Analysis
          </span>
          {data.body_part && (
            <span style={{
              background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)",
              borderRadius: 12, padding: "2px 8px", fontSize: 11, color: T.purple,
            }}>
              {data.body_part}
            </span>
          )}
        </div>
        <LangToggle lang={lang} onToggle={setLang} />
      </div>

      <UrgencyBadge urgency={data.urgency} />

      {/* Metal implant warning — critical */}
      {data.implants_detected && (
        <div style={{
          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
          borderRadius: 10, padding: "10px 14px", marginBottom: 10,
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔩</span>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, color: T.red }}>
              Metal Implant Detected
            </p>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.65)", lineHeight: 1.5 }}>
              {data.implant_details || "Surgical hardware visible. Inform all future doctors — especially before MRI scans."}
            </p>
          </div>
        </div>
      )}

      {/* Fracture alert */}
      {data.fractures_visible && (
        <div style={{
          background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)",
          borderRadius: 10, padding: "8px 14px", marginBottom: 10,
          display: "flex", gap: 8, alignItems: "center", fontSize: 13,
        }}>
          <span>🦴</span>
          <span style={{ color: T.amber, fontWeight: 600 }}>Fracture visible — doctor review required</span>
        </div>
      )}

      {/* Summary */}
      {data.summary && (
        <Card style={{ marginBottom: 10 }}>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: T.textPrimary }}>{data.summary}</p>
          <ConfidenceBar value={data.confidence} />
        </Card>
      )}

      {/* Findings */}
      {findings.length > 0 && (
        <>
          <SectionLabel>Key Findings</SectionLabel>
          <Card style={{ marginBottom: 10 }}>
            {visible.map((f, i) => {
              const isAbnormal = /abnormal|fracture|displaced|irregular|mass|opacity|effusion|suspicious/i.test(f);
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0",
                  borderBottom: i < visible.length - 1 ? `1px solid ${T.border}` : "none",
                }}>
                  <span style={{
                    fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 2,
                    color: isAbnormal ? T.amber : T.green,
                  }}>
                    {isAbnormal ? "⚠" : "✓"}
                  </span>
                  <span style={{ fontSize: 13, color: T.textPrimary, lineHeight: 1.5 }}>{f}</span>
                </div>
              );
            })}

            {findings.length > 3 && (
              <button
                onClick={() => setShowAll(v => !v)}
                style={{
                  marginTop: 8, background: "none", border: "none",
                  color: T.blue, fontSize: 12, cursor: "pointer", padding: 0,
                }}
              >
                {showAll ? "▲ Show less" : `▼ Show ${findings.length - 3} more findings`}
              </button>
            )}
          </Card>
        </>
      )}

      {/* Structure checklist */}
      <SectionLabel>Structure Assessment</SectionLabel>
      <Card style={{ marginBottom: 10 }}>
        {[
          ["Bone / bones",   data.fractures_visible  ? "Fracture visible"     : "Intact",          data.fractures_visible  ? T.amber : T.green],
          ["Implants",       data.implants_detected  ? data.implant_details || "Present" : "None", data.implants_detected  ? T.blue  : T.green],
          ["Soft tissue",    "See findings",          T.textSecondary],
          ["Urgent action",  data.urgency === "high" ? "Required now"        : data.urgency === "medium" ? "Follow-up needed" : "Routine review", data.urgency === "high" ? T.red : data.urgency === "medium" ? T.amber : T.green],
        ].map(([label, value, vc], i, arr) => (
          <InfoRow key={label} label={label} value={value} valueColor={vc} />
        ))}
      </Card>

      {/* Recommendation */}
      {data.recommendation && (
        <Card borderColor="rgba(96,165,250,0.2)" style={{ marginBottom: 10, background: "rgba(96,165,250,0.05)" }}>
          <p style={{ margin: 0, fontSize: 13, color: T.textPrimary, lineHeight: 1.65 }}>
            <span style={{ color: T.blue, marginRight: 6 }}>📋</span>
            {data.recommendation}
          </p>
        </Card>
      )}

      {/* AI limitation — mandatory for scans */}
      <div style={{
        background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)",
        borderRadius: 8, padding: "8px 12px", marginTop: 10, marginBottom: 2,
        fontSize: 12, color: "rgba(255,255,255,0.55)", lineHeight: 1.5,
      }}>
        🏥 {data.disclaimer || "⚠️ This is AI-generated educational guidance. Always get a formal report from a qualified radiologist and consult your doctor."}
      </div>
    </div>
  );
}
