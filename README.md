<div align="center">

# 🩺 Anbu Health AI

### Bilingual Medical AI Assistant — Frontend

**Tamil + English support · Lab report & scan analysis · Voice input · Live in production**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?logo=firebase&logoColor=white)](https://firebase.google.com)
[![Status](https://img.shields.io/badge/Status-Production-success)]()
[![License](https://img.shields.io/badge/License-Proprietary-lightgrey)]()

[🌐 Live App](https://anbuclinic.me) · [⚙️ Backend Repo](https://github.com/rajaganaa/anbu-health-ai-api) · [📄 Patent Filed](https://github.com/rajaganaa/antahkarana-reasoning-framework)

</div>

---

## 🔗 Connected Repository

This is the **frontend** for Anbu Health AI. The reasoning engine, RAG pipeline, and API server live in a separate repo:

➡️ **Backend & AI Pipeline:** [`anbu-health-ai-api`](https://github.com/rajaganaa/anbu-health-ai-api)

---

## 💡 Business Use Case

In India, most people can't easily understand their own lab reports, prescriptions, or scan results — and language is often the first barrier between a patient and clear medical information. **Anbu Health AI** solves this by acting as a bilingual (Tamil + English) first point of contact that reads a medical document or photo and explains it in plain language, before the patient sees a doctor.

It's built to:

- 🧪 **Read lab reports** (blood test, sugar, urine) and explain what the values mean
- 🩻 **Read scans & X-rays** and summarize findings in plain language
- 💊 **Identify medicines** from a photo of the strip/box, including dosage and interaction checks
- 🗣️ **Talk back** — voice input and Tamil audio playback for users who prefer speaking over typing
- 🔐 **Protect user data** — phone-based OTP login, session-scoped document storage, and a user-triggered "right to delete" flow aligned with India's DPDP Act 2023

---

## ✨ Core Features

| Feature | Description |
|---|---|
| 🗨️ Bilingual Chat | Full conversation flow in Tamil and English, with auto language detection |
| 🧪 Lab Report Upload | Upload PDF/image of blood, urine, or sugar reports for analysis |
| 🩻 Scan/X-Ray Upload | Upload chest X-ray, ultrasound, or MRI images for plain-language summaries |
| 💊 Medicine Photo Lookup | Photograph a medicine strip/box to get dosage, usage, and interaction info |
| 🎤 Voice Input | Web Speech API support for Tamil + English voice queries |
| 🔊 Tamil Audio Playback | Listen to AI responses read aloud in Tamil |
| 🔐 Phone OTP Auth | Firebase Phone Authentication — no passwords |
| 🗑️ Data Deletion | OTP-verified, user-initiated permanent account & history deletion |
| 📁 Session File Vault | Uploaded documents stay available for follow-up questions within a chat |

---

## 🧠 Powered By: The Antahkarana Reasoning Pipeline

The frontend talks to a 5-stage reasoning pipeline on the backend, inspired by classical cognitive architecture — each stage has a single, clear responsibility:

```
  User Query
      │
      ▼
 ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌─────────┐
 │  Manas  │ → │ Chitta  │ → │ Buddhi  │ → │ Ahamkara │ → │ Sakshi  │ → Answer
 │ Routing │    │   RAG   │    │   LLM   │    │Confidence│    │ Safety  │
 └─────────┘    └─────────┘    └─────────┘    └──────────┘    └─────────┘
```

| Stage | Role |
|---|---|
| 🧭 **Manas** | Routes the question by type (dosage, interaction, lab, scan...) and detects language |
| 📚 **Chitta** | Retrieves relevant medical context via vector search (RAG), with live web fallback |
| 🧠 **Buddhi** | Generates the answer using an LLM, with a 3-model fallback chain for reliability |
| 📊 **Ahamkara** | Scores the answer's confidence (0–100) before it's shown |
| 🛡️ **Sakshi** | Checks for hallucinations and enforces medical safety disclaimers |

📜 **Patent Filed:** App No. 202641043947 — *Antahkarana AI Reasoning Framework*

---

## 🛠 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

**Frontend**
- React 19
- Firebase Auth (Phone OTP)
- Web Speech API (voice input)
- GitHub Pages (hosting)

**Backend**
- FastAPI (Python)
- Groq — LLaMA 3.3 70B (reasoning)
- GPT-4o Vision (lab/scan/medicine image reading)
- Azure Container Apps + Docker

</td>
<td valign="top" width="50%">

**Storage & Search**
- Supabase (PostgreSQL)
- Qdrant (vector DB for RAG)
- Redis (OTP & rate-limit cache)
- DuckDuckGo API (live web search)

**Compliance & Security**
- DPDP Act 2023 aligned
- Firebase phone verification
- Session-scoped data, auto-expiry

</td>
</tr>
</table>

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/rajaganaa/anbu-health-ai.git
cd anbu-health-ai

# Install dependencies
npm install

# Run locally
npm start
```

The app runs at `http://localhost:3000`. You'll need a `.env` with your Firebase config and the backend `API_URL` to fully test auth and chat flows — see [`anbu-health-ai-api`](https://github.com/rajaganaa/anbu-health-ai-api) for backend setup.

```bash
# Production build
npm run build
```

---

## 📦 Deployment

- **Frontend:** GitHub Pages, deployed via GitHub Actions on push to `main`
- **Backend:** Azure Container Apps, Docker + GitHub Actions CI/CD
- **Monitoring:** Prometheus + Grafana on the backend

---

## 👤 Author

**Rajaganapathy M**
Founder, AI Vision (MSME Registered) · M.Tech AI (CGPA 9.6/10) · Patent Filed · IEEE Paper Submitted

🌍 [Portfolio](https://rajaganaa.github.io) · 🤗 [Hugging Face](https://huggingface.co/RajGana) · 🆔 ORCID: 0009-0006-9701-7942

---

<div align="center">
<sub>⚠️ This application provides AI-generated health information only and does not replace professional medical advice. Always consult a doctor.</sub>
</div>
