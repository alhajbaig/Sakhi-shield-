# SakhiShield — Help & Safety Resources

## Purpose
The **Help & Safety Resources** module serves as a verified, high-availability emergency directory, interactive standard operating procedure guide, and architectural knowledge base for SakhiShield users.

## Features & Architecture
- **Verified Official National Helplines**: 100% genuine official Indian national and state emergency helplines:
  - **112**: National Emergency Response Support System (ERSS - Police, Fire, Ambulance)
  - **1091**: Women in Distress Emergency Police Helpline
  - **181**: Women Domestic Violence & Crisis Helpline (One Stop Centres)
  - **1930**: National Cyber Crime Reporting Portal Helpline (I4C)
  - **NCW 24/7 Helpline**: 7827170170 (National Commission for Women Call & WhatsApp)
  - **1098**: National Childline Helpline
  - **15100**: National Legal Services Authority (NALSA Free Legal Aid)
  - **NIMHANS**: 08046110007 (Trauma-Informed Psychosocial Support)
  - **108**: National Emergency Medical & Ambulance Service
- **Immediate Emergency Action**: One-tap dialing (`tel:112`, `tel:1091`) and direct integration with the SakhiShield Emergency SOS broadcast.
- **Search & Filtering**: Real-time keyword search across helpline names, descriptions, categories, and verified sources.
- **Interactive Safety Guides**: Step-by-step verified action guides explaining actual SakhiShield features (Emergency Protocol, Walk With Me, Trusted Circle, Incident Vault, Digital Safety).
- **Architectural FAQs**: Clear, reassuring, factual answers regarding location privacy, zero third-party tracking, and evidence hashing.
- **100% Offline Availability**: All helplines, guides, and FAQs are bundled locally and cached in `localStorage` to ensure access with zero internet connectivity.

## Folder Structure
```text
src/features/help-safety-resources/
├── components/
│   ├── HelpDashboard.tsx
│   ├── EmergencyQuickDialCard.tsx
│   ├── ResourceSearchFilter.tsx
│   ├── ResourceCard.tsx
│   ├── SafetyGuidesSection.tsx
│   └── FAQSection.tsx
├── services/
│   └── resourceService.ts
├── hooks/
│   └── useSafetyResources.ts
├── types/
│   └── resources.types.ts
├── data/
│   ├── verifiedHelplines.ts
│   ├── safetyGuidesData.ts
│   └── faqData.ts
├── constants/
│   └── resources.constants.ts
├── index.ts
└── README.md
```

## Security & Storage
- **Public Directory Access**: Verified safety resources are readable by all authenticated and anonymous users via Supabase RLS.
- **No Fabricated Data**: Every external resource links directly to its official `.gov.in` or statutory portal with verified timestamps.
