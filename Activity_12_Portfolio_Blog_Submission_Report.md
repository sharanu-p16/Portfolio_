# PORTFOLIO BUILDING (B25CS0311)
## Activity 12: Building Your Portfolio Blog by Prompting an AI Assistant
**Final Submission & Studio Deliverable Report**

---

### Student Information
- **Student Name:** Sharanabasappagouda p.patil
- **Semester / Branch:** 3rd Semester, B.Tech Computer Science & IT (CSIT)
- **Institution:** REVA University, Bengaluru
- **Live Portfolio Page:** https://sharanu-p16.github.io/Portfolio_/
- **GitHub Profile:** https://github.com/sharanu-p16
- **LinkedIn Profile:** https://www.linkedin.com/in/sharanabasappagouda-p-patil16
- **Repositories Linked:**
  - `hello_world-c` — https://github.com/sharanu-p16/hello_world-c
  - `Hacker_rank-problems` — https://github.com/sharanu-p16/Hacker_rank-problems

---

## Contents
1. **Portfolio Brief** (Pages 1–2)
2. **Prompt Log, Review and Publication** (Pages 3–4)
3. **Live Portfolio Page Verification**
4. **Reflection** (3–5 lines)

---

# Part 1: Portfolio Brief

### 1. Purpose and Audience
This brief describes the interactive single-page personal portfolio website built to represent my academic journey, course activities, and projects. The primary readers are recruiters, interviewers, and faculty members who spend only a few minutes reviewing a student's profile. The page allows them to quickly evaluate my skills and verify my claims by providing direct links to my public GitHub repositories and LinkedIn profile.

### 2. About Me
I am **Sharanabasappagouda p.patil**, a 3rd-semester B.Tech student in Computer Science & IT at REVA University, Bengaluru. I enjoy understanding how intelligent systems work, solving algorithmic problems in C and C++, and exploring emerging AI technologies including AI agents and agentic models. I keep my practice work organized in public GitHub repositories and am aiming for a software engineering internship at a technology company.

### 3. What I Built in the Course Activities
- **Activity 1 & 2 — VS Code Setup & Git/GitHub Workflow:** Configured VS Code as my primary development editor and learned command-line Git/GitHub workflows. Initialized and pushed my practice repository `hello_world-c` (https://github.com/sharanu-p16/hello_world-c) to master version control from the terminal.
- **Activity 3 — GitLens & Live Share Integration:** Set up GitLens for inline git blame and commit tracking inside VS Code, and utilized Live Share for real-time pair programming collaboration.
- **Activity 4 & 8 — Algorithmic Problem Solving (HackerRank & LeetCode):** Built the `Hacker_rank-problems` repository (https://github.com/sharanu-p16/Hacker_rank-problems) containing C++ implementations for core algorithmic challenges:
  - *Diagonal Difference* (2D array traversal, O(N) time, O(1) space)
  - *Dynamic Array* (Nested vectors, O(N+Q) time)
  - *Time Conversion* (String parsing & logic, O(1) time)
  - *Compare the Triplets* (Basic comparison logic, O(1) time)
  - *Sparse Arrays* (Frequency counting with hash maps, O(N+Q) time)
  - Earned a **3-Star Problem Solving Badge** on HackerRank.

### 4. Beyond the Course
- **2D Graphics Editor (C):** A console-based computer graphics application implemented in C using `graphics.h`. Features primitive shape drawing (lines, circles, polygons) and geometric 2D transformations (translation, rotation, scaling).
- **Fake News Detection (Python):** A machine learning text classification pipeline that categorizes news articles as real or fake using NLP preprocessing, TF-IDF feature extraction, and classification models (Logistic Regression / Naive Bayes).
- **Professional Online Presence:** Established an optimized LinkedIn profile (https://www.linkedin.com/in/sharanabasappagouda-p-patil16) complete with custom URL, structured bio, verified skills, and "Open to Work" set to recruiters only.

### 5. Skills
- **Languages:** C, C++, Python, SQL (basic), HTML
- **Frameworks & Libraries:** FastAPI, Flask, NumPy, Pandas, scikit-learn, NLTK, C++ STL
- **Developer Tools:** Git & GitHub (terminal), VS Code, WSL (Linux), Cursor, Ollama
- **Core Concepts:** Data Structures & Algorithms, Object-Oriented Programming (OOP), AI Agents, Competitive Programming

### 6. Goals
- **Short Term (Current Semester):** Expand my `Hacker_rank-problems` and LeetCode problem sets with detailed README files and space/time complexity notes for every problem solved.
- **Medium Term:** Secure a software engineering internship and contribute to open-source agentic AI projects.

### 7. What the Page Contains
A single-page interactive layout with five sections:
1. **Header / Hero:** Name, role tagline, interactive 3D morphing geometric shape, and matrix code-rain background.
2. **Skills & Expertise:** Categorized cards highlighting languages, frameworks, tools, and concepts.
3. **Projects:** Cards for `hello_world-c`, `Hacker_rank-problems`, `2D Graphics Editor`, and `Fake News Detection`, featuring language tags and direct GitHub links.
4. **Timeline / Journey:** Academic milestones from 12th grade foundation to 1st year CSIT at REVA University.
5. **Contact:** Direct links to LinkedIn, GitHub, email, and an interactive contact form with client fallback.

### 8. Tone, Style, and Limits
- **Tone:** Professional, approachable, plain English, first-person.
- **Style:** Modern dark mode with particle canvas, glassmorphism, responsive navigation bar, and custom magnetic cursor.
- **Limits:** Must not invent fake credentials, projects, or non-existent experience.

---

# Part 2: Prompt Log & Review

### 1. Prompt Log

| # | Prompt Sent to AI Assistant | Output Generated & Refinements Made |
|---|---|---|
| **1 (Initial)** | "Build a single-page personal portfolio blog as a self-contained web app (HTML, CSS, JS). Include header with name 'Sharanabasappagouda p.patil', CSIT 1st Year @ REVA University, sections for About, Skills, Projects, Journey, and Contact. Style: modern dark theme with interactive particles, 3D morphing shape, and responsive navbar." | Generated complete `index.html`, `styles.css`, and `script.js` containing all core sections, particle background, 3D object, dark styling, and mobile menu toggle. |
| **2 (Refine)** | "Update the Projects section to explicitly feature my course repositories: `hello_world-c` (Activity 1 & 2) and `Hacker_rank-problems` (Activity 8 C++ solutions with 3-star badge), alongside my 2D Graphics Editor and Fake News Detection projects. Add 'View Repo' buttons linking to my GitHub URLs." | Added explicit project cards with color-coded activity badges, technology tags, feature lists, and working GitHub repository links (`sharanu-p16/hello_world-c` and `sharanu-p16/Hacker_rank-problems`). |
| **3 (Refine)** | "Fix the custom cursor so it gracefully disables on mobile touchscreen devices (coarse pointer), and update the contact form submit handler to fallback to opening the user's default email client (`mailto:sharanuppatil16@gmail.com`) when the API key is unconfigured." | Added `@media (hover: none) and (pointer: coarse)` rule in CSS to restore native mobile touch cursors, and updated `script.js` form submission with `mailto:` URL fallback. |

---

### 2. Review Before Refining
Before publishing, the initial output was reviewed against the portfolio brief and GitHub repositories:
- ✅ **Repository Links:** Confirmed that `hello_world-c` and `Hacker_rank-problems` open the correct GitHub URLs.
- ✅ **LinkedIn Verification:** Verified custom URL `linkedin.com/in/sharanabasappagouda-p-patil16` matches the Activity 9 submission evidence.
- ✅ **Accuracy:** Confirmed that C++ is specified for HackerRank solutions and C for `hello_world-c`.

---

### 3. Publication
The code was committed to the repository `sharanu-p16/Portfolio_` and deployed via **GitHub Pages**:
- **Live URL:** https://sharanu-p16.github.io/Portfolio_/
- **Branch:** `main` (root directory)
- **Status:** Active, published, and rendering without errors.

---

### 4. Reflection (3–5 lines)
Prompt 2 produced the most significant improvement by transforming generic project cards into exact representations of my course repositories (`hello_world-c` and `Hacker_rank-problems`) with direct links and technology badges. During the initial review, the AI originally generated placeholder links (`YOUR_WEB3FORMS_KEY` and generic profile links) and ignored touch device cursor behavior; these were caught during review and corrected using follow-up prompt 3. I now always verify that external repository links open correctly before finalizing my portfolio.
