import type { Module } from '../types';

export const modules: Module[] = [
  {
    id: 1,
    title: 'K-12 Market Fundamentals',
    description: 'Understand the K-12 education landscape, key stakeholders, and buying cycles.',
    icon: '🏫',
    roles: ['SDR', 'GTM Engineer', 'SDR Manager', 'CSM'],
    content: `
# Module 1: K-12 Market Fundamentals

## Overview

The K-12 education market represents one of the largest and most complex sales environments in the United States. Understanding its structure, stakeholders, and buying patterns is essential for any sales professional targeting this space.

## The K-12 Landscape

### Market Size & Structure

- **130,000+** K-12 schools across the US
- **13,500+** school districts
- **$800B+** total annual spending
- **$40B+** spent on technology and services annually

The market is divided into:
- **Public Schools** (~90% of students) — funded by federal, state, and local taxes
- **Private Schools** (~10% of students) — funded by tuition and donations
- **Charter Schools** — publicly funded but independently operated

### The Buying Cycle

K-12 purchasing follows a **predictable annual cycle** tied to the academic calendar and budget timelines:

| Period | Activity |
|--------|----------|
| **Jan - Mar** | Budget planning begins, needs assessments |
| **Mar - May** | RFPs issued, vendor evaluations |
| **May - Jul** | Purchase decisions made, board approvals |
| **Jul - Sep** | Implementation and onboarding |
| **Sep - Dec** | Evaluation and renewal planning |

> **Key Insight:** The best time to engage prospects is during Q1 (Jan-Mar), when budgets are being planned. Late engagement often means waiting an entire year.

## Key Stakeholders

Understanding who makes decisions — and who influences them — is critical.

### Decision Makers
- **Superintendent** — Sets district-wide priorities and vision
- **Chief Technology Officer (CTO)** — Owns technology strategy and infrastructure
- **Chief Academic Officer (CAO)** — Drives curriculum and instructional decisions
- **School Board** — Approves major purchases (often $25K+)

### Influencers
- **Principals** — Champion solutions at the building level
- **Teachers** — End users who can make or break adoption
- **IT Staff** — Evaluate technical requirements and integration
- **Parents/Community** — Can influence board decisions

### Budget Holders
- **CFO / Business Manager** — Controls purchasing and procurement
- **Grants Coordinator** — Manages federal and state funding (Title I, ESSER, E-Rate)

## Funding Sources

Understanding funding is a superpower in K-12 sales:

### Federal Funding
- **Title I** — $18B+ for schools serving low-income students
- **IDEA** — Special education funding
- **E-Rate** — Discounts on internet and telecom for schools
- **ESSER (COVID relief)** — Significant but time-limited funds

### State & Local Funding
- **Per-pupil allocations** — Vary dramatically by state
- **Bond measures** — For capital expenditures and technology
- **Grants** — State-specific competitive grants

## Common Challenges in K-12

When positioning your solution, connect to these universal pain points:

1. **Student Achievement Gaps** — Disparities in outcomes across demographics
2. **Teacher Retention** — 44% of teachers leave within 5 years
3. **Technology Integration** — Schools have tech but struggle with adoption
4. **Data & Reporting** — Compliance burdens with state and federal reporting
5. **Budget Constraints** — Always doing more with less
6. **Parent Engagement** — Difficulty keeping families involved

## Role-Specific Tips

### For SDRs
Focus your outreach on timing. Map your pipeline to the buying cycle and lead with insights about funding availability.

### For GTM Engineers
Build demo environments that mirror real school scenarios. Prepare data stories that resonate with district KPIs.

### For SDR Managers
Coach your team on stakeholder mapping. Every opportunity should have 3+ contacts identified across different roles.

### For CSMs
Onboarding timing matters. Plan implementations around the school calendar — never launch a new tool mid-testing season.

## Summary

The K-12 market rewards patience, relationships, and deep understanding of the education ecosystem. Master the buying cycle, know your stakeholders, and align your approach to funding timelines.

---

*Next: Module 2 — Prospecting & Outreach Strategies*
`,
    quiz: {
      questions: [
        {
          id: 'q1-1',
          question: 'What is the best period to initially engage K-12 prospects?',
          options: [
            'September - December',
            'January - March',
            'July - September',
            'May - July',
          ],
          correctAnswer: 1,
          explanation:
            'January to March is when budget planning begins and needs assessments are conducted, making it the ideal time to engage prospects before RFPs are issued.',
        },
        {
          id: 'q1-2',
          question: 'Which stakeholder typically approves major purchases over $25K?',
          options: [
            'Principal',
            'CTO',
            'School Board',
            'Grants Coordinator',
          ],
          correctAnswer: 2,
          explanation:
            'The School Board approves major purchases, often those exceeding $25K. Understanding this approval process is critical for deal timelines.',
        },
        {
          id: 'q1-3',
          question: 'What is the approximate annual technology spending in K-12?',
          options: [
            '$10 billion',
            '$20 billion',
            '$40 billion',
            '$100 billion',
          ],
          correctAnswer: 2,
          explanation:
            'K-12 schools spend approximately $40B+ annually on technology and services, making it a significant market opportunity.',
        },
        {
          id: 'q1-4',
          scenario:
            'You are an SDR reaching out to a school district in April. The budget has already been planned and RFPs are being issued. Your competitor has been in conversations since January.',
          question: 'What is the best approach in this scenario?',
          options: [
            'Aggressively push for a meeting to compete on the current RFP',
            'Focus on building a relationship for next year\'s budget cycle while looking for any remaining opportunities',
            'Go directly to the school board to bypass the procurement process',
            'Offer a steep discount to win the deal quickly',
          ],
          correctAnswer: 1,
          explanation:
            'When you\'ve missed the optimal engagement window, focus on relationship building for the next cycle. Rushing an established process rarely works and can damage credibility.',
        },
        {
          id: 'q1-5',
          question: 'Which federal funding source provides discounts on internet and telecom for schools?',
          options: ['Title I', 'IDEA', 'E-Rate', 'ESSER'],
          correctAnswer: 2,
          explanation:
            'E-Rate provides discounts on internet access and telecommunications for schools and libraries, making it a key funding source for technology purchases.',
        },
      ],
    },
  },
  {
    id: 2,
    title: 'Prospecting & Outreach',
    description: 'Master effective outreach strategies tailored to education buyers.',
    icon: '📞',
    roles: ['SDR', 'GTM Engineer', 'SDR Manager'],
    content: `
# Module 2: Prospecting & Outreach Strategies

## Overview

Prospecting in K-12 requires a different approach than traditional B2B sales. Education professionals are mission-driven, time-constrained, and skeptical of vendors who don't understand their world.

## Coming Soon

This module content is under development. Check back soon for detailed prospecting strategies, email templates, and outreach frameworks specific to K-12 sales.
`,
    quiz: {
      questions: [],
    },
  },
  {
    id: 3,
    title: 'Discovery & Qualification',
    description: 'Learn frameworks for qualifying K-12 opportunities effectively.',
    icon: '🔍',
    roles: ['SDR', 'GTM Engineer', 'SDR Manager', 'CSM'],
    content: `
# Module 3: Discovery & Qualification

## Overview

Effective discovery in K-12 goes beyond BANT. Learn to uncover the real challenges districts face and qualify opportunities based on funding, timeline, and stakeholder alignment.

## Coming Soon

This module content is under development.
`,
    quiz: {
      questions: [],
    },
  },
  {
    id: 4,
    title: 'Demos & Presentations',
    description: 'Deliver compelling demos that resonate with education stakeholders.',
    icon: '🎯',
    roles: ['SDR', 'GTM Engineer', 'CSM'],
    content: `
# Module 4: Demos & Presentations

## Overview

Learn to deliver demos that speak the language of educators, connect to district goals, and showcase real impact on student outcomes.

## Coming Soon

This module content is under development.
`,
    quiz: {
      questions: [],
    },
  },
  {
    id: 5,
    title: 'Navigating Procurement',
    description: 'Understand RFPs, board approvals, and procurement processes.',
    icon: '📋',
    roles: ['SDR', 'GTM Engineer', 'SDR Manager'],
    content: `
# Module 5: Navigating Procurement

## Overview

K-12 procurement is unique. From RFP responses to school board presentations, learn to navigate the complex purchasing process in education.

## Coming Soon

This module content is under development.
`,
    quiz: {
      questions: [],
    },
  },
  {
    id: 6,
    title: 'Customer Success & Expansion',
    description: 'Drive adoption, renewals, and expansion in school districts.',
    icon: '🚀',
    roles: ['CSM', 'SDR Manager'],
    content: `
# Module 6: Customer Success & Expansion

## Overview

Success in K-12 is measured by student outcomes. Learn how to drive adoption, demonstrate impact, and expand within districts through champion-led growth.

## Coming Soon

This module content is under development.
`,
    quiz: {
      questions: [],
    },
  },
];
