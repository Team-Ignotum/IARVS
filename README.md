# IARVS — Intelligent Academic Registration and Validation System

**IARVS (Intelligent Academic Registration and Validation System)** is an AI-assisted academic registration and validation platform designed to automate and improve the manual course registration and re-registration process for the **Bachelor of Software Engineering Honours (BSE Hons)** programme at the **Open University of Sri Lanka (OUSL)**.

The system analyses student registration requests against curriculum structures, prerequisite requirements, academic records, transition rules, and institutional policies. It combines **rule-based reasoning, dependency graph analysis, semantic policy search, and Agentic AI** to provide reliable registration validation and decision support for academic staff.

## 🎯 Objectives

IARVS aims to:

* Automate the validation of student course registrations.
* Determine course eligibility based on academic records and prerequisite rules.
* Analyse prerequisite and course dependencies.
* Support curriculum transitions and equivalent-module mappings.
* Retrieve and interpret relevant academic policies.
* Assist academic staff in making registration override decisions.
* Provide an **Agentic AI chatbot** capable of interacting with system tools to answer academic registration queries.
* Reduce manual effort, inconsistency, and errors in the existing registration process.

## 🧠 Core Features

### 1. Student Registration Analysis

The system retrieves a student's academic information and analyses requested courses against:

* Passed and failed courses
* Current academic level
* Required credits
* Prerequisites
* Repeat requirements
* Curriculum rules
* Registration policies

### 2. Forward-Chaining Eligibility Engine

IARVS uses a **rule-based forward-chaining reasoning engine** to determine whether a student is eligible for a requested course.

The engine evaluates facts about the student and progressively applies academic rules to derive new facts and eligibility conclusions.

**Example:**

```text
Student passed FDE3023
        ↓
Prerequisite condition satisfied
        ↓
Student satisfies Level 4 prerequisite
        ↓
Course eligibility = TRUE
```

This approach keeps critical academic eligibility decisions **deterministic, explainable, and auditable**.

### 3. Prerequisite Dependency Graph

Course prerequisites are represented as a dependency graph.

The system uses **topological ordering** to analyse prerequisite relationships and determine the correct dependency sequence between courses.

```text
FDE3023
   ↓
Course A
   ↓
Course B
   ↓
Course C
```

This enables IARVS to identify prerequisite dependencies and support curriculum-aware registration validation.

### 4. Curriculum & Transition Management

The system supports changes between curriculum versions by maintaining:

* Curriculum versions
* Course mappings
* Equivalent modules
* Transition rules
* Replacement modules
* Student curriculum information

This allows registration decisions to account for students following different curriculum structures.

### 5. Academic Policy Semantic Search

IARVS provides semantic retrieval of relevant academic policies.

Policy documents can be converted into searchable representations using **Natural Language Processing / Sentence-BERT embeddings**, allowing the system to identify policies that are semantically relevant to a registration query.

### 6. Override Decision Support

When a registration request does not satisfy the standard eligibility rules, IARVS can provide decision-support information to authorised academic staff.

The system can present:

* Eligibility results
* Failed prerequisite conditions
* Relevant policies
* Curriculum transition rules
* Student academic information
* Supporting reasoning

Academic staff can then **approve or reject an override** according to institutional authority and policy.

### 7. Agentic AI Chatbot

IARVS includes an **Agentic AI-powered chatbot** designed to interact with the system through specialised tools.

Instead of relying only on static LLM responses, the agent can invoke system tools to retrieve and analyse academic information.

Example workflow:

```text
User Query
    ↓
Agentic AI
    ↓
Select Appropriate Tool
    ↓
Retrieve / Analyse Data
    ↓
Reason Over Results
    ↓
Generate Response
```

The chatbot is designed to support tasks such as:

* Student information lookup
* Registration analysis
* Eligibility checking
* Curriculum information retrieval
* Academic policy search

The agent therefore acts as an intelligent interface over the underlying academic validation services.

## 🏗️ System Architecture

IARVS follows a layered architecture separating the frontend, backend services, reasoning components, data layer, and AI capabilities.

```text
┌──────────────────────────────────────┐
│            Next.js Frontend          │
│      Student / Academic Staff UI     │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│             FastAPI Backend          │
│                                      │
│  Students │ Registration │ Eligibility│
│  Curriculum │ Policies │ Graph │ Agent│
└──────────────────┬───────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
┌────────────┐ ┌──────────┐ ┌──────────┐
│ Rule Engine│ │ Graph    │ │ AI Agent │
│            │ │ Analysis │ │ + Tools  │
└──────┬─────┘ └────┬─────┘ └────┬─────┘
       │            │             │
       └────────────┼─────────────┘
                    ▼
          ┌──────────────────┐
          │   PostgreSQL DB  │
          └──────────────────┘
```

## 🛠️ Technology Stack

### Frontend

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide React**

### Backend

* **Python**
* **FastAPI**
* REST APIs
* Rule-based reasoning engine

### Database

* **PostgreSQL**

### AI / NLP

* Agentic AI
* Large Language Models (LLMs)
* **Sentence-BERT**
* Semantic search
* Tool calling

### Infrastructure

* **Docker**
* **Redis**

## 📂 Project Structure

```text
iarvs-intelligent-system/
│
├── frontend/
│   └── ...
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── api/
│   │   │   ├── students.py
│   │   │   ├── registration.py
│   │   │   ├── eligibility.py
│   │   │   ├── curriculum.py
│   │   │   ├── policies.py
│   │   │   ├── graph.py
│   │   │   └── agent.py
│   │   │
│   │   ├── services/
│   │   │   ├── student_service.py
│   │   │   ├── registration_service.py
│   │   │   ├── curriculum_service.py
│   │   │   ├── policy_service.py
│   │   │   └── graph_service.py
│   │   │
│   │   ├── rules/
│   │   │   ├── engine.py
│   │   │   ├── facts.py
│   │   │   ├── rules.py
│   │   │   └── eligibility.py
│   │   │
│   │   └── graph/
│   │       ├── dependency_graph.py
│   │       └── curriculum_graph.py
│   │
│   └── requirements.txt
│
├── prisma/
│   ├── schema.prisma
│   └── seed/
│
├── docker-compose.yml
│
└── README.md
```

## 🔄 Registration Validation Workflow

```text
Student Registration Request
             ↓
      Student Lookup
             ↓
    Retrieve Academic Record
             ↓
      Curriculum Analysis
             ↓
   Prerequisite Dependency
         Analysis
             ↓
    Forward-Chaining Rules
             ↓
       Eligibility Result
             ↓
      ┌──────┴──────┐
      │             │
   Eligible     Not Eligible
      │             │
      ▼             ▼
   Approve     Policy / Override
                    Analysis
                       ↓
               Staff Decision
```

## 🔐 Role-Based Access

IARVS supports role-based functionality for different academic users.

| Role                           | Responsibilities                                     |
| ------------------------------ | ---------------------------------------------------- |
| Student                        | Submit and view registration information             |
| Academic Staff                 | Analyse registrations and manage decisions           |
| Super Staff / Super Councillor | Manage curriculum, mappings and authorised overrides |

## 📌 Key Design Principles

IARVS is designed around the following principles:

* **Explainability** — registration decisions should have understandable reasoning.
* **Deterministic validation** — core academic eligibility is governed by explicit rules.
* **Policy awareness** — decisions can reference relevant academic policies.
* **Curriculum awareness** — different curriculum versions and transitions are supported.
* **Separation of concerns** — AI capabilities are separated from deterministic academic validation logic.
* **Auditability** — important registration and override decisions can be traced to their supporting rules and information.

## 🎓 Project Context

IARVS is developed as a **Final-Year Software Engineering Project** for the **Bachelor of Software Engineering Honours programme at the Open University of Sri Lanka**.

The project focuses on applying software engineering, rule-based reasoning, graph analysis, NLP, and Agentic AI techniques to a real-world academic administration problem.

## 👥 Team

**Team Ignotum**

Bachelor of Software Engineering Honours
Open University of Sri Lanka

## 📜 License & Copyright

Copyright © 2026 **Team Ignotum**. All rights reserved.

IARVS is proprietary software developed as part of the **Bachelor of Software Engineering Honours** programme at the **Open University of Sri Lanka (OUSL)**.

The source code, documentation, database schemas, system architecture, algorithms, designs, interfaces, and other materials contained in this repository are protected by applicable copyright and intellectual property laws.

### Restrictions

Unless explicit written permission is obtained from the copyright holders and/or the relevant university authority, you may **not**:

* Copy, reproduce, or redistribute the source code or substantial portions of the project.
* Modify, adapt, or create derivative works based on the project.
* Use the project or its source code for commercial purposes.
* Republish the project, in whole or in part, under another name or repository.
* Use the project's architecture, implementation, database schema, or proprietary components in another system.
* Remove or alter copyright, attribution, or licensing notices.
* Present the project or substantial portions of it as your own work.
* Use the system, source code, or associated materials for academic submission or assessment as another person's original work.

### Permitted Use

Viewing the repository for **personal, educational, or evaluation purposes** is permitted unless otherwise stated.

Any use beyond viewing, including copying, modification, redistribution, deployment, or incorporation into another project, requires prior written permission from the copyright holders and/or the relevant university authority.

### Third-Party Components

IARVS may use third-party libraries, frameworks, models, datasets, or other components that are distributed under their own respective licenses. Those components remain subject to their original licensing terms.

This license applies only to original IARVS materials created


---

> **IARVS — Making academic registration intelligent, explainable, and efficient.**
