import { DocumentData } from '../types';

export const SAMPLE_DOCUMENTS: DocumentData[] = [
  {
    id: 'sample-q3-roadmap',
    name: 'Q3_Roadmap_and_Budget_Strategy.pdf',
    size: 245800,
    type: 'application/pdf',
    createdAt: Date.now(),
    isSample: true,
    content: `EXECUTIVE BRIEF: Q3 STRATEGIC ROADMAP & BUDGET ALLOCATION

1. INFRASTRUCTURE & TECHNICAL DEBT
The proposed Q3 roadmap prioritizes infrastructure stability over new feature velocity to address technical debt accumulated over previous development cycles. Core microservices will undergo containerization, database indexing optimization, and query caching. Engineering sprint capacity will dedicate 40% to refactoring, zero-downtime database migrations, and CI/CD pipeline automation.

2. RESEARCH & AI DEPARTMENT ALLOCATION
Budget allocation for the AI research department is set to increase by 15% starting next fiscal month. This additional funding of approximately $220,000 will directly fund serverless GPU compute clusters, fine-tuning infrastructure, and high-throughput vector storage for generative intelligence workloads.

3. WORKFORCE & REMOTE POLICY FORMALIZATION
Remote work policies are being formalized to support a hybrid model indefinitely. All operational and technical teams will operate on a core 2-day on-site, 3-day flexible schedule with stipends provided for ergonomic home office setups and high-speed broadband connections.

4. ACTION ITEMS & DEADLINES
- August 15: Q3 Technical Roadmap review sign-off with team leads.
- September 01: Implementation of revised remote policy and security compliance guidelines.
- October 01: Fiscal quarter reconciliation and Q4 budget review.
- Responsible parties: VP of Engineering (Technical Roadmap), CISO (Security & Remote Work), Director of Finance (Budgeting).`
  },
  {
    id: 'sample-ai-policy',
    name: 'Enterprise_AI_Governance_Memo.docx',
    size: 184000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    createdAt: Date.now() - 86400000,
    isSample: true,
    content: `MEMORANDUM: ENTERPRISE AI GOVERNANCE & DATA SECURITY

Subject: Safe Usage Standards for Generative AI Tools
Target Audience: All Employees, Contractors, and Third-Party Consultants

SUMMARY & DIRECTIVES:
1. DATA CLASSIFICATION & PRIVACY
Employees must never input customer Personally Identifiable Information (PII), unreleased financial statements, or proprietary source code into unapproved public AI tools. Only enterprise-cleared AI proxies (such as DocSum Enterprise) with zero data-retention guarantees are permitted for document analysis.

2. RISK MANAGEMENT & CODE AUDITING
All code generated or assisted by Large Language Models must undergo automated SAST scanning and peer review prior to production deployment.

3. VENDOR AUDITS & COSTS
Procurement has secured enterprise API licensing terms resulting in an estimated 18% reduction in quarterly cloud software expenses ($140,000 saved).`
  },
  {
    id: 'sample-service-contract',
    name: 'SaaS_Vendor_Master_Agreement.pdf',
    size: 312000,
    type: 'application/pdf',
    createdAt: Date.now() - 172800000,
    isSample: true,
    content: `MASTER SERVICES AGREEMENT (MSA) - EXTRACT

CONTRACT TERM & FINANCIALS:
- Initial Term: 24 Months beginning October 1, 2026.
- Total Contract Value: $480,000 payable in equal bi-annual installments of $120,000.
- Annual Price Cap Adjustment: Capped at maximum 3.5% inflation match.

SERVICE LEVEL AGREEMENT (SLA):
- Guaranteed Uptime: 99.95% monthly availability excluding scheduled maintenance windows.
- Penalty Credits: 5% service credit for every 0.1% downtime below SLA threshold.

DATA PROTECTION & INDEMNIFICATION:
- Mutual $5,000,000 liability cap for breach of confidentiality or data security obligations.`
  }
];
