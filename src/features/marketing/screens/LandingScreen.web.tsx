import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

const HOLD_DURATION_MS = 10_000;

const journeyStages = [
  {
    label: 'Learn',
    title: 'Focused lessons',
    description: 'Clear modules, notes, checkpoints, and mentor guidance.',
  },
  {
    label: 'Practice',
    title: 'Guided practice',
    description: 'Small tasks after important concepts so learners apply what they learn.',
  },
  {
    label: 'Project',
    title: 'Portfolio projects',
    description: 'Build real outputs connected to course skills and career readiness.',
  },
  {
    label: 'Certificate',
    title: 'Completion proof',
    description: 'Track course progress, tasks, project status, and certificate readiness.',
  },
  {
    label: 'Career',
    title: 'Career path',
    description: 'Connect skills, projects, certificates, and internship readiness.',
  },
];

const courseTracks = [
  {
    title: 'AI Foundations',
    category: 'AI',
    level: 'Beginner',
    duration: '12 modules',
    tools: 'Prompting · Workflows · AI tools',
    description: 'Understand practical AI concepts, tools, prompts, and everyday workflows.',
  },
  {
    title: 'Full-Stack Development',
    category: 'Development',
    level: 'Intermediate',
    duration: '16 modules',
    tools: 'Frontend · APIs · Database',
    description: 'Build application foundations with frontend, backend, APIs, and deployment basics.',
  },
  {
    title: 'Mobile App Development',
    category: 'Mobile',
    level: 'Intermediate',
    duration: '14 modules',
    tools: 'React Native · Expo · Navigation',
    description: 'Create mobile screens, navigation flows, and app-ready project structures.',
  },
  {
    title: 'Cloud & DevOps',
    category: 'Cloud',
    level: 'Intermediate',
    duration: '10 modules',
    tools: 'Cloud · CI/CD · Containers',
    description: 'Learn deployment flows, cloud basics, containers, and delivery pipelines.',
  },
];

const projectCards = [
  {
    title: 'Lesson task',
    description: 'Short assignments after important concepts.',
    meta: '10–20 mins',
  },
  {
    title: 'Course project',
    description: 'Build practical work connected to the curriculum.',
    meta: 'Portfolio-ready',
  },
  {
    title: 'Readiness review',
    description: 'Track task, project, and certificate progress.',
    meta: 'Milestone based',
  },
];

const mobileTabs = [
  {
    label: 'Home',
    title: 'Continue learning',
    eyebrow: 'TODAY',
    detail: 'Full-Stack Development · 18 min left',
    metric: '42%',
    metricLabel: 'Progress',
  },
  {
    label: 'Courses',
    title: 'Browse courses',
    eyebrow: 'CURRICULUM',
    detail: 'AI, full-stack, mobile, cloud, career skills',
    metric: '4',
    metricLabel: 'Tracks',
  },
  {
    label: 'Mentor',
    title: 'Ask for help',
    eyebrow: 'COURSE MENTOR',
    detail: 'Explain lessons, summarize topics, suggest tasks',
    metric: '24/7',
    metricLabel: 'Guidance',
  },
  {
    label: 'Profile',
    title: 'Track readiness',
    eyebrow: 'PROFILE',
    detail: 'Projects, certificates, milestones, career path',
    metric: '68%',
    metricLabel: 'Ready',
  },
];

const faqs = [
  {
    question: 'What is LearnXai?',
    answer:
      'LearnXai provides structured tech courses where lessons connect to practice, projects, certificates, and course-aware mentor guidance.',
  },
  {
    question: 'Does LearnXai create the courses?',
    answer:
      'Yes. LearnXai is designed as a course platform with structured curriculum, projects, learning paths, and mentor support built into the course flow.',
  },
  {
    question: 'How does the course mentor help?',
    answer:
      'The course mentor helps explain lessons, summarize topics, suggest practice, create quizzes, and guide learners through tasks and projects.',
  },
  {
    question: 'Are projects included?',
    answer:
      'Yes. Courses are designed to include tasks and projects so learners build practical proof while learning.',
  },
  {
    question: 'Are certificates included?',
    answer:
      'Certificates can be connected to course completion, tasks, projects, and readiness milestones.',
  },
  {
    question: 'Can learners use it on mobile?',
    answer:
      'Yes. LearnXai is designed for web and mobile learning so learners can continue courses, tasks, mentor help, and progress tracking anywhere.',
  },
];

export function LandingScreen() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeJourney, setActiveJourney] = useState(0);
  const [activeMobileTab, setActiveMobileTab] = useState(0);

  const journeyHoldUntilRef = useRef(0);
  const mobileHoldUntilRef = useRef(0);

  const selectedJourney = journeyStages[activeJourney];
  const selectedMobileTab = mobileTabs[activeMobileTab];

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function selectJourney(index: number) {
    setActiveJourney(index);
    journeyHoldUntilRef.current = Date.now() + HOLD_DURATION_MS;
  }

  function selectMobileTab(index: number) {
    setActiveMobileTab(index);
    mobileHoldUntilRef.current = Date.now() + HOLD_DURATION_MS;
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const journeyTimer = window.setInterval(() => {
      if (Date.now() < journeyHoldUntilRef.current) return;
      setActiveJourney((current) => (current + 1) % journeyStages.length);
    }, 3600);

    const mobileTimer = window.setInterval(() => {
      if (Date.now() < mobileHoldUntilRef.current) return;
      setActiveMobileTab((current) => (current + 1) % mobileTabs.length);
    }, 3300);

    return () => {
      window.clearInterval(journeyTimer);
      window.clearInterval(mobileTimer);
    };
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>('.reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -70px 0px' }
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="lx-page">
      <style>{styles}</style>

      <header className={`lx-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="lx-nav">
          <button className="brand" onClick={() => router.push('/')}>
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>LearnXai</span>
          </button>

          <nav className="nav-links">
            <button onClick={() => scrollToSection('curriculum')}>Curriculum</button>
            <button onClick={() => scrollToSection('projects')}>Projects</button>
            <button onClick={() => scrollToSection('mobile')}>Mobile App</button>
            <button onClick={() => scrollToSection('access')}>Access</button>
          </nav>

          <div className="nav-actions">
            <button className="login-btn" onClick={() => router.push('/login')}>
              Login
            </button>
            <button className="primary-nav-btn" onClick={() => router.push('/register')}>
              Start Free
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-glow hero-glow-left" />
        <div className="hero-glow hero-glow-right" />

        <div className="hero-grid">
          <div className="hero-copy reveal reveal-left">
            <div className="hero-badge">
              Early access · Structured LMS · Course mentor · Projects
            </div>

            <h1>Structured courses with built-in mentor guidance.</h1>

            <p>
              LearnXai gives learners focused courses, guided practice, projects,
              certificates, and a course-aware mentor that helps them move forward
              without getting stuck.
            </p>

            <div className="hero-actions">
              <button className="primary-btn" onClick={() => router.push('/register')}>
                Start Free
              </button>
              <button className="secondary-link" onClick={() => scrollToSection('curriculum')}>
                Explore Courses →
              </button>
            </div>

            <div className="cta-note">No credit card required.</div>
          </div>

          <div className="product-preview reveal reveal-3d">
            <div className="browser-bar">
              <div>
                <i />
                <i />
                <i />
              </div>
              <span>Course Player Preview</span>
            </div>

            <div className="player-shell">
              <aside className="lesson-sidebar">
                <span>Full-Stack Development</span>
                <strong>42% complete</strong>

                <button className="done">01 · Components</button>
                <button className="done">02 · State</button>
                <button className="active">03 · API calls</button>
                <button>04 · Project brief</button>
              </aside>

              <section className="lesson-main">
                <div className="lesson-top">
                  <div>
                    <span>CURRENT LESSON</span>
                    <h2>Connecting a React screen to an API</h2>
                  </div>

                  <b>{selectedJourney.title}</b>
                </div>

                <div className="lesson-content">
                  <p>
                    Learn how data moves from an API response into a real application
                    screen, then complete a guided task connected to the project.
                  </p>

                  <div className="task-card">
                    <span>Next task</span>
                    <strong>{selectedJourney.description}</strong>
                  </div>
                </div>

                <div className="mentor-panel">
                  <div>
                    <span>COURSE MENTOR</span>
                    <strong>Explain this lesson with a practical example.</strong>
                    <p>
                      Start with the API response shape. Then map each field into the UI
                      card before adding loading and error states.
                    </p>
                  </div>

                  <span className="mentor-pill">Course help ready</span>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className="journey-section">
        <div className="journey-row">
          {journeyStages.map((stage, index) => (
            <button
              key={stage.label}
              className={index === activeJourney ? 'active' : ''}
              onClick={() => selectJourney(index)}
              type="button"
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {stage.label}
            </button>
          ))}
        </div>
      </section>

      <section id="curriculum" className="section curriculum-section reveal reveal-up">
        <div className="section-heading">
          <span>Curriculum</span>
          <h2>Courses built around lessons, practice, and projects.</h2>
          <p>
            LearnXai courses are structured so learners move from concept to task to
            project without losing the learning path.
          </p>
        </div>

        <div className="course-grid">
          {courseTracks.map((course) => (
            <button key={course.title} onClick={() => router.push('/courses')}>
              <div className="course-visual">
                <span>{course.level}</span>
                <b>{course.category}</b>
              </div>

              <h3>{course.title}</h3>
              <small>
                {course.duration} · {course.tools}
              </small>
              <p>{course.description}</p>
              <strong>
                View course <span aria-hidden="true">→</span>
              </strong>
            </button>
          ))}
        </div>
      </section>

      <section className="section mentor-section reveal reveal-up">
        <div className="split-grid">
          <div className="split-copy">
            <span>Course mentor</span>
            <h2>Guidance inside the course flow.</h2>
            <p>
              The mentor is connected to the learning path. It can explain lessons,
              summarize topics, create practice questions, and suggest the next task.
            </p>

            <div className="mentor-actions-list">
              <article className="active">
                <strong>Explain lesson</strong>
                <p>Break down difficult concepts into practical examples.</p>
              </article>
              <article>
                <strong>Generate quiz</strong>
                <p>Create quick checks based on the current topic.</p>
              </article>
              <article>
                <strong>Project hint</strong>
                <p>Help learners move forward without simply giving away the answer.</p>
              </article>
            </div>
          </div>

          <div className="mentor-card reveal reveal-3d">
            <div className="mentor-card-head">
              <span>Course Mentor</span>
              <b>Current lesson · API calls</b>
            </div>

            <div className="chat learner">
              How do I show loading and error states when calling an API?
            </div>

            <div className="chat mentor">
              Create three states: loading, error, and data. Show a loader first, display
              a friendly error message when the request fails, and render cards only
              when data exists.
            </div>

            <div className="suggestion-box">
              <span>Suggested task</span>
              <strong>Build a product list with loading, error, and empty states.</strong>
            </div>

            <div className="fake-input">
              <span>Ask about this lesson...</span>
              <b>↗</b>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="section project-section reveal reveal-up">
        <div className="section-heading left">
          <span>Projects</span>
          <h2>Build projects as you learn.</h2>
          <p>
            Theory alone is not enough. LearnXai is designed so lessons connect to
            tasks, assignments, and portfolio-ready projects.
          </p>
        </div>

        <div className="project-grid">
          {projectCards.map((project) => (
            <article key={project.title}>
              <span>{project.meta}</span>
              <strong>{project.title}</strong>
              <p>{project.description}</p>
            </article>
          ))}

          <article className="project-output-card">
            <span>Sample output</span>
            <strong>Course dashboard project</strong>
            <p>
              A learner builds a dashboard with course progress, saved courses, tasks,
              and readiness tracking.
            </p>
          </article>
        </div>
      </section>

      <section id="mobile" className="section mobile-section reveal reveal-up">
        <div className="mobile-preview reveal reveal-3d">
          <div className="phone-shell">
            <div className="phone-status">
              <span>9:41</span>
              <i />
            </div>

            <div className="phone-screen">
              <span>LEARNER APP</span>
              <h3>{selectedMobileTab.title}</h3>

              <div className="phone-card">
                <span>{selectedMobileTab.eyebrow}</span>
                <strong>{selectedMobileTab.detail}</strong>
                <p>{selectedMobileTab.metricLabel}</p>
              </div>

              <div className="phone-metrics">
                <article>
                  <span>{selectedMobileTab.metricLabel}</span>
                  <strong>{selectedMobileTab.metric}</strong>
                </article>
                <article>
                  <span>Tasks</span>
                  <strong>08</strong>
                </article>
              </div>

              <div className="phone-tabs">
                {mobileTabs.map((tab, index) => (
                  <button
                    key={tab.label}
                    className={index === activeMobileTab ? 'active' : ''}
                    onClick={() => selectMobileTab(index)}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="floating-card">
            <span>Next lesson</span>
            <strong>Build API loading states</strong>
            <p>2 tasks · 1 project</p>
          </div>
        </div>

        <div className="mobile-copy">
          <span>Mobile App</span>
          <h2>Continue learning from anywhere.</h2>
          <p>
            Learners can continue courses, complete short tasks, ask course questions,
            and track progress from mobile.
          </p>

          <div className="mobile-benefits">
            <article>
              <strong>Continue lessons</strong>
              <p>Resume the next lesson from the same learning path.</p>
            </article>
            <article>
              <strong>Complete tasks</strong>
              <p>Handle short practice work without waiting for desktop time.</p>
            </article>
            <article>
              <strong>Ask mentor</strong>
              <p>Get course-aware help while reviewing lessons.</p>
            </article>
            <article>
              <strong>Track readiness</strong>
              <p>See progress across projects and certificates.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="access" className="section access-section reveal reveal-up">
        <div className="section-heading">
          <span>Access</span>
          <h2>Simple access for learners. Scalable access for teams.</h2>
          <p>
            Start with individual learning. Team and institute access can be configured
            when organizations are ready to onboard learners.
          </p>
        </div>

        <div className="access-grid">
          <article>
            <span>For learners</span>
            <h3>Individual access</h3>
            <p>Courses, tasks, projects, certificate progress, and mentor guidance.</p>
            <ul>
              <li>Structured courses</li>
              <li>Course mentor support</li>
              <li>Projects and tasks</li>
              <li>Mobile learning</li>
            </ul>
            <button onClick={() => router.push('/register')}>Start Free</button>
            <small>No credit card required.</small>
          </article>

          <article>
            <span>For teams</span>
            <h3>Organization access</h3>
            <p>Learning paths, learner progress, admin visibility, and guided cohorts.</p>
            <ul>
              <li>Learner management</li>
              <li>Progress overview</li>
              <li>Course assignments</li>
              <li>Admin dashboard</li>
            </ul>
            <button onClick={() => router.push('/register')}>Request Access</button>
            <small>For institutes and teams.</small>
          </article>
        </div>
      </section>

      <section className="section faq-section reveal reveal-up">
        <div className="section-heading left">
          <span>FAQ</span>
          <h2>Everything you need to know.</h2>
        </div>

        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="final-cta reveal reveal-up">
        <h2>Start with structured courses. Build proof as you learn.</h2>
        <p>
          Move from lessons to practice to projects with course-aware mentor guidance
          built into the journey.
        </p>

        <div>
          <button onClick={() => router.push('/register')}>Start Free</button>
          <button onClick={() => router.push('/courses')}>Explore Courses</button>
        </div>

        <small>No credit card required.</small>
      </section>

      <footer className="footer">
        <div>
          <button className="footer-brand" onClick={() => router.push('/')}>
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            LearnXai
          </button>
          <p>
            Structured tech courses with lessons, mentor guidance, projects,
            certificates, and career-focused learning paths.
          </p>
        </div>

        <div className="footer-grid">
          <div>
            <span>Platform</span>
            <button onClick={() => scrollToSection('curriculum')}>Curriculum</button>
            <button onClick={() => scrollToSection('projects')}>Projects</button>
            <button onClick={() => scrollToSection('mobile')}>Mobile App</button>
          </div>

          <div>
            <span>Access</span>
            <button onClick={() => router.push('/login')}>Login</button>
            <button onClick={() => router.push('/register')}>Register</button>
            <button onClick={() => scrollToSection('access')}>Access</button>
          </div>

          <div>
            <span>Trust</span>
            <button type="button">Contact</button>
            <button type="button">Help</button>
            <button type="button">Privacy</button>
            <button type="button">Terms</button>
          </div>
        </div>
      </footer>
    </main>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

:root {
  --bg: #fbfbfb;
  --surface: #ffffff;
  --surface-soft: #f7faf9;
  --ink: #111827;
  --ink-soft: #1f2937;
  --body: #4b5563;
  --muted: #6b7280;
  --line: rgba(15, 23, 42, 0.08);
  --line-strong: rgba(15, 23, 42, 0.12);
  --green-50: #eafbf3;
  --green-300: #6fd9a8;
  --green-500: #1fad6b;
  --green-600: #0e8f56;
  --green-700: #0a6e42;
  --brand: var(--green-600);
  --brand-dark: var(--green-700);
  --brand-soft: var(--green-50);
  --shadow-resting: 0 1px 2px rgba(15, 23, 42, 0.04);
  --shadow-card:
    0 1px 2px rgba(15, 23, 42, 0.035),
    0 4px 10px rgba(15, 23, 42, 0.045),
    0 10px 24px rgba(15, 23, 42, 0.045);
  --shadow-raised:
    0 2px 4px rgba(15, 23, 42, 0.045),
    0 10px 24px rgba(15, 23, 42, 0.08),
    0 24px 54px rgba(15, 23, 42, 0.10);
  --shadow-modal:
    0 8px 18px rgba(15, 23, 42, 0.08),
    0 24px 48px rgba(15, 23, 42, 0.14),
    0 44px 96px rgba(15, 23, 42, 0.16);
  --inner-highlight:
    inset 0 1px 0 rgba(255, 255, 255, 0.68),
    0 0 0 1px rgba(15, 23, 42, 0.045);
  --radius-pill: 999px;
  --font: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: var(--ink);
  background: var(--bg);
  font-family: var(--font);
}

button {
  font: inherit;
}

button:focus-visible,
summary:focus-visible {
  outline: 2px solid var(--green-300);
  outline-offset: 3px;
}

.lx-page {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 10% 10%, rgba(31, 173, 107, 0.07), transparent 26%),
    radial-gradient(circle at 90% 8%, rgba(59, 130, 246, 0.045), transparent 26%),
    linear-gradient(180deg, #ffffff 0%, var(--bg) 100%);
}

.lx-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 12px 24px 0;
  pointer-events: none;
}

.lx-nav {
  width: min(1248px, 100%);
  min-height: 64px;
  margin: 0 auto;
  padding: 0 24px;
  border: 1px solid rgba(15, 23, 42, 0.07);
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--shadow-card), var(--inner-highlight);
  backdrop-filter: blur(28px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  pointer-events: auto;
  transition: all 220ms ease;
}

.lx-header.is-scrolled .lx-nav {
  width: min(1120px, 100%);
  min-height: 58px;
  background: rgba(255, 255, 255, 0.97);
  box-shadow: var(--shadow-raised), var(--inner-highlight);
}

.brand,
.nav-links button,
.login-btn,
.primary-nav-btn,
.primary-btn,
.secondary-link,
.journey-row button,
.course-grid button,
.access-grid button,
.final-cta button,
.footer button,
.phone-tabs button {
  border: 0;
  cursor: pointer;
}

.brand,
.footer-brand {
  background: transparent;
  color: var(--ink);
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 25px;
  font-weight: 850;
  letter-spacing: -0.025em;
}

.brand-mark {
  width: 24px;
  height: 24px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  transform: rotate(45deg);
}

.brand-mark i {
  display: block;
  border-radius: 4px;
  background: var(--ink);
}

.brand-mark i:nth-child(2) {
  background: transparent;
  border: 2px solid var(--ink);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-links button {
  background: transparent;
  color: var(--body);
  font-size: 14px;
  font-weight: 650;
}

.nav-links button:hover,
.secondary-link:hover,
.footer-grid button:hover {
  color: var(--green-700);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-btn {
  min-height: 40px;
  padding: 0 18px;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--ink);
  font-size: 14px;
  font-weight: 750;
}

.primary-nav-btn,
.primary-btn {
  min-height: 42px;
  padding: 0 22px;
  border-radius: var(--radius-pill);
  background: var(--green-600);
  color: white;
  font-size: 14px;
  font-weight: 750;
  box-shadow:
    0 10px 22px rgba(14, 143, 86, 0.22),
    inset 0 1px 0 rgba(255, 255, 255, 0.22);
}

.primary-nav-btn:hover,
.primary-btn:hover {
  background: var(--green-700);
  transform: translateY(-1px);
}

.secondary-link {
  min-height: 42px;
  padding: 0;
  background: transparent;
  color: var(--ink);
  font-size: 14px;
  font-weight: 750;
}

.hero-section {
  position: relative;
  min-height: auto;
  padding: 44px 24px 48px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(48px);
  pointer-events: none;
}

.hero-glow-left {
  width: 420px;
  height: 420px;
  left: -160px;
  top: 100px;
  background: rgba(31, 173, 107, 0.075);
}

.hero-glow-right {
  width: 520px;
  height: 520px;
  right: -180px;
  bottom: 20px;
  background: rgba(59, 130, 246, 0.055);
}

.hero-grid {
  position: relative;
  z-index: 2;
  width: min(1180px, 100%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(420px, 0.94fr) minmax(540px, 1.06fr);
  gap: 44px;
  align-items: center;
}

.hero-badge {
  width: max-content;
  max-width: 100%;
  padding: 8px 14px;
  border: 1px solid rgba(10, 110, 66, 0.16);
  border-radius: var(--radius-pill);
  color: var(--green-700);
  background: var(--green-50);
  box-shadow: var(--shadow-resting);
  font-size: 11.5px;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.hero-copy h1 {
  max-width: 680px;
  margin: 22px 0 0;
  color: var(--ink);
  font-size: clamp(54px, 5vw, 78px);
  line-height: 1.01;
  letter-spacing: -0.04em;
  font-weight: 780;
}

.hero-copy p {
  max-width: 600px;
  margin: 22px 0 0;
  color: var(--body);
  font-size: 17px;
  line-height: 1.62;
  font-weight: 450;
}

.hero-actions {
  margin-top: 30px;
  display: flex;
  gap: 22px;
  align-items: center;
  flex-wrap: wrap;
}

.cta-note {
  margin-top: 10px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 550;
}

.product-preview {
  position: relative;
  width: 100%;
  max-width: 590px;
  justify-self: end;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 26px;
  background: white;
  box-shadow: var(--shadow-modal), var(--inner-highlight);
  overflow: hidden;
}

.browser-bar {
  min-height: 42px;
  padding: 0 16px;
  border-bottom: 1px solid var(--line);
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.browser-bar div {
  display: flex;
  gap: 7px;
}

.browser-bar i {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--line-strong);
}

.browser-bar span {
  color: var(--muted);
  font-size: 11.5px;
  font-weight: 750;
}

.player-shell {
  padding: 15px;
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 14px;
}

.lesson-sidebar {
  padding: 14px;
  border-radius: 19px;
  background: var(--surface-soft);
  display: grid;
  align-content: start;
  gap: 8px;
}

.lesson-sidebar span,
.lesson-main span,
.task-card span,
.mentor-panel span,
.section-heading span,
.split-copy span,
.project-grid span,
.access-grid span,
.footer-grid span,
.phone-screen > span,
.phone-card span,
.phone-metrics span,
.floating-card span {
  color: var(--green-700);
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.lesson-sidebar strong {
  margin-bottom: 5px;
  color: var(--ink);
  font-size: 13px;
}

.lesson-sidebar button {
  min-height: 32px;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: var(--body);
  text-align: left;
  font-size: 11.75px;
  font-weight: 650;
}

.lesson-sidebar button.done {
  color: var(--green-700);
  background: var(--green-50);
}

.lesson-sidebar button.active {
  color: var(--ink);
  background: white;
  border-color: var(--line);
  box-shadow: var(--shadow-resting);
}

.lesson-main {
  display: grid;
  gap: 12px;
}

.lesson-top {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: start;
}

.lesson-top h2 {
  max-width: 370px;
  margin: 7px 0 0;
  color: var(--ink);
  font-size: 25px;
  line-height: 1.06;
  letter-spacing: -0.025em;
  font-weight: 760;
}

.lesson-top b {
  padding: 7px 10px;
  border-radius: var(--radius-pill);
  color: var(--green-700);
  background: var(--green-50);
  font-size: 10.5px;
  white-space: nowrap;
}

.lesson-content {
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: 19px;
  background: linear-gradient(180deg, #ffffff, #fafafa);
  box-shadow: var(--inner-highlight);
}

.lesson-content p {
  max-width: 560px;
  margin: 0;
  color: var(--body);
  font-size: 13px;
  line-height: 1.54;
}

.task-card {
  margin-top: 12px;
  padding: 13px;
  border-radius: 14px;
  background: #f8fafc;
}

.task-card strong {
  display: block;
  margin-top: 7px;
  color: var(--ink);
  font-size: 13.25px;
  line-height: 1.36;
}

.mentor-panel {
  padding: 14px;
  border-radius: 19px;
  background:
    radial-gradient(circle at 12% 0%, rgba(31, 173, 107, 0.22), transparent 36%),
    linear-gradient(180deg, #1f2937 0%, #111827 100%);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.10),
    0 12px 28px rgba(17, 24, 39, 0.18);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  align-items: center;
}

.mentor-panel span {
  color: #a7f3d0;
}

.mentor-panel strong {
  display: block;
  margin-top: 5px;
  font-size: 13.5px;
}

.mentor-panel p {
  margin: 6px 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 11.75px;
  line-height: 1.42;
}

.mentor-pill {
  min-height: 32px;
  padding: 0 12px;
  border-radius: var(--radius-pill);
  background: white;
  color: var(--ink) !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 11.5px !important;
  font-weight: 800;
  white-space: nowrap;
  letter-spacing: 0 !important;
  text-transform: none !important;
}

.journey-section {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
  padding: 0 0 56px;
}

.journey-row {
  width: 100%;
  max-width: none;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  border: 1px solid var(--line);
  border-radius: 24px;
  background: white;
  box-shadow: var(--shadow-card), var(--inner-highlight);
  overflow: hidden;
}

.journey-row button {
  position: relative;
  min-height: 66px;
  padding: 14px 18px;
  text-align: left;
  background: white;
  border-right: 1px solid var(--line);
  color: var(--body);
  font-size: 13px;
  font-weight: 750;
}

.journey-row button:last-child {
  border-right: 0;
}

.journey-row button span {
  display: block;
  margin-bottom: 4px;
  color: var(--muted);
  font-size: 10.5px;
  font-weight: 850;
}

.journey-row button.active {
  color: var(--ink);
  background: var(--green-50);
}

.journey-row button.active::before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 3px;
  background: var(--green-600);
}

.section {
  width: min(1180px, calc(100% - 48px));
  margin: 112px auto 0;
  scroll-margin-top: 120px;
}

.section-heading {
  max-width: 780px;
  margin: 0 auto 48px;
  text-align: center;
}

.section-heading.left {
  margin-left: 0;
  text-align: left;
}

.section-heading h2,
.split-copy h2,
.mobile-copy h2,
.final-cta h2 {
  margin: 14px 0 0;
  color: var(--ink);
  font-size: clamp(36px, 3.4vw, 52px);
  line-height: 1.12;
  letter-spacing: -0.026em;
  font-weight: 760;
}

.section-heading p,
.split-copy p,
.mobile-copy p,
.final-cta p {
  margin: 18px 0 0;
  color: var(--body);
  font-size: 16px;
  line-height: 1.7;
  font-weight: 450;
}

.course-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 22px;
}

.course-grid button,
.mentor-actions-list article,
.project-grid article,
.mobile-benefits article,
.access-grid article {
  border: 1px solid rgba(15, 23, 42, 0.075);
  background: white;
  box-shadow: var(--shadow-card), var(--inner-highlight);
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.course-grid button:hover,
.mentor-actions-list article:hover,
.project-grid article:hover,
.mobile-benefits article:hover {
  transform: translateY(-3px);
  border-color: rgba(31, 173, 107, 0.20);
  box-shadow: var(--shadow-raised), var(--inner-highlight);
}

.course-grid button {
  min-height: 330px;
  height: 100%;
  padding: 24px;
  border-radius: 24px;
  text-align: left;
  display: flex;
  flex-direction: column;
}

.course-grid button > strong span {
  display: inline-block;
  transition: transform 180ms ease;
}

.course-grid button:hover > strong span {
  transform: translateX(4px);
}

.course-visual {
  height: 96px;
  padding: 15px;
  border: 1px solid rgba(10, 110, 66, 0.08);
  border-radius: 20px;
  background:
    radial-gradient(circle at 88% 10%, rgba(31, 173, 107, 0.16), transparent 42%),
    #f1fbf6;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.course-visual span {
  color: var(--green-700);
  font-weight: 900;
}

.course-visual b {
  color: #374151;
  font-size: 13px;
}

.course-grid h3 {
  min-height: 58px;
  margin: 18px 0 0;
  color: var(--ink);
  font-size: 24px;
  line-height: 1.12;
  letter-spacing: -0.018em;
  font-weight: 720;
}

.course-grid small {
  min-height: 36px;
  margin-top: 10px;
  color: var(--green-700);
  font-size: 12px;
  line-height: 1.45;
  font-weight: 750;
}

.course-grid p {
  min-height: 68px;
  margin: 12px 0 0;
  color: var(--body);
  font-size: 13px;
  line-height: 1.55;
}

.course-grid button > strong {
  margin-top: auto;
  padding-top: 18px;
  color: var(--ink);
  font-size: 13px;
}

.split-grid,
.mobile-section {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 48px;
  align-items: center;
}

.mentor-actions-list {
  margin-top: 28px;
  display: grid;
  gap: 12px;
}

.mentor-actions-list article {
  padding: 18px;
  border-radius: 20px;
}

.mentor-actions-list article.active {
  background: var(--green-50);
  border-color: rgba(31, 173, 107, 0.24);
}

.mentor-actions-list article.active strong {
  color: var(--green-700);
}

.mentor-actions-list strong,
.mobile-benefits strong {
  display: block;
  color: var(--ink-soft);
  font-size: 15px;
  font-weight: 700;
}

.mentor-actions-list p,
.mobile-benefits p {
  margin: 6px 0 0;
  color: var(--body);
  font-size: 13px;
  line-height: 1.5;
}

.mentor-card {
  padding: 26px;
  border: 1px solid rgba(15, 23, 42, 0.075);
  border-radius: 30px;
  background: white;
  box-shadow: var(--shadow-modal), var(--inner-highlight);
}

.mentor-card-head {
  margin-bottom: 18px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.mentor-card-head span {
  color: var(--green-700);
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.mentor-card-head b {
  color: var(--muted);
  font-size: 13px;
}

.chat {
  max-width: 88%;
  padding: 16px 18px;
  border-radius: 22px;
  font-size: 15px;
  line-height: 1.55;
}

.chat.learner {
  margin-left: auto;
  color: white;
  background:
    radial-gradient(circle at 15% 0%, rgba(31, 173, 107, 0.18), transparent 40%),
    linear-gradient(180deg, #1f2937, #111827);
}

.chat.mentor {
  margin-top: 12px;
  color: var(--ink);
  background: var(--surface-soft);
}

.suggestion-box {
  margin-top: 14px;
  padding: 18px;
  border-radius: 22px;
  background: var(--green-50);
}

.suggestion-box strong {
  display: block;
  margin-top: 7px;
  color: var(--ink);
  font-size: 17px;
  line-height: 1.35;
}

.fake-input {
  margin-top: 14px;
  padding: 14px 16px 14px 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-pill);
  color: var(--muted);
  background: white;
  font-size: 14px;
  box-shadow: var(--inner-highlight);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.fake-input b {
  width: 30px;
  height: 30px;
  border-radius: var(--radius-pill);
  background: var(--green-600);
  color: white;
  display: grid;
  place-items: center;
  font-size: 13px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
}

.project-grid article {
  min-height: 220px;
  padding: 24px;
  border-radius: 24px;
}

.project-grid article.project-output-card {
  color: var(--ink);
  background:
    radial-gradient(circle at 88% 10%, rgba(31, 173, 107, 0.14), transparent 42%),
    #ffffff;
  border-color: rgba(31, 173, 107, 0.22);
}

.project-grid strong {
  display: block;
  margin-top: 42px;
  color: var(--ink-soft);
  font-size: 22px;
  line-height: 1.12;
  letter-spacing: -0.018em;
  font-weight: 700;
}

.project-grid p {
  margin: 12px 0 0;
  color: var(--body);
  font-size: 14px;
  line-height: 1.6;
}

.mobile-preview {
  position: relative;
  min-height: 540px;
  display: grid;
  place-items: center;
}

.phone-shell {
  position: relative;
  width: 278px;
  aspect-ratio: 390 / 844;
  padding: 12px;
  border-radius: 42px;
  background:
    linear-gradient(145deg, #020617, #1f2937 45%, #020617);
  box-shadow:
    0 42px 90px rgba(15, 23, 42, 0.26),
    0 18px 36px rgba(15, 23, 42, 0.18),
    inset 0 1px 1px rgba(255, 255, 255, 0.16);
  animation: phoneFloat 6s ease-in-out infinite;
}

.phone-shell::before {
  content: "";
  position: absolute;
  top: 10px;
  left: 50%;
  width: 78px;
  height: 22px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: #020617;
  z-index: 3;
}

.phone-status {
  height: 28px;
  padding: 0 12px;
  color: rgba(255, 255, 255, 0.82);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-weight: 850;
}

.phone-status i {
  width: 30px;
  height: 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.42);
}

.phone-screen {
  position: relative;
  height: calc(100% - 28px);
  padding: 18px;
  border-radius: 30px;
  color: white;
  background:
    radial-gradient(circle at 20% 0%, rgba(16, 185, 129, 0.28), transparent 34%),
    linear-gradient(180deg, #1f2937, #111827);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.phone-screen h3 {
  margin: 9px 0 0;
  font-size: 24px;
  line-height: 1.1;
  letter-spacing: -0.025em;
  font-weight: 760;
}

.phone-card,
.phone-metrics article {
  background: rgba(255, 255, 255, 0.10);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.phone-card {
  margin-top: 18px;
  padding: 16px;
  border-radius: 22px;
}

.phone-card strong {
  display: block;
  margin-top: 8px;
  font-size: 16px;
  line-height: 1.25;
}

.phone-card p {
  margin: 8px 0 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
}

.phone-metrics {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.phone-metrics article {
  padding: 14px;
  border-radius: 20px;
}

.phone-metrics strong {
  display: block;
  margin-top: 5px;
  font-size: 24px;
}

.phone-tabs {
  margin-top: auto;
  padding: 6px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.08);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
}

.phone-tabs button {
  min-height: 30px;
  border-radius: var(--radius-pill);
  background: transparent;
  color: rgba(255, 255, 255, 0.62);
  font-size: 10px;
  font-weight: 750;
}

.phone-tabs button.active {
  color: var(--ink);
  background: white;
}

.floating-card {
  position: absolute;
  left: 60px;
  bottom: 82px;
  width: 220px;
  padding: 18px;
  border-radius: 24px;
  background: white;
  box-shadow:
    0 28px 64px rgba(15, 23, 42, 0.18),
    0 10px 22px rgba(15, 23, 42, 0.10),
    var(--inner-highlight);
}

.floating-card strong {
  display: block;
  margin-top: 8px;
  color: var(--ink);
  font-size: 18px;
  line-height: 1.25;
}

.floating-card p {
  margin: 8px 0 0;
  color: var(--green-700);
  font-size: 13px;
  font-weight: 750;
}

.mobile-benefits {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.mobile-benefits article {
  padding: 18px;
  border-radius: 20px;
}

.access-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 390px));
  justify-content: center;
  align-items: stretch;
  gap: 20px;
}

.access-grid article {
  min-height: 460px;
  padding: 28px;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
}

.access-grid h3 {
  margin: 12px 0 0;
  color: var(--ink);
  font-size: 34px;
  line-height: 1.08;
  letter-spacing: -0.018em;
  font-weight: 720;
}

.access-grid p {
  min-height: 58px;
  margin: 16px 0 0;
  color: var(--body);
  font-size: 14px;
  line-height: 1.6;
}

.access-grid ul {
  flex: 1;
  margin: 22px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 12px;
  align-content: start;
}

.access-grid li {
  color: var(--ink);
  font-size: 14px;
}

.access-grid li::before {
  content: "✓";
  margin-right: 10px;
  color: var(--green-500);
  font-weight: 900;
}

.access-grid button {
  min-height: 48px;
  margin-top: 26px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 750;
}

.access-grid article:first-child button {
  background: var(--green-600);
  color: #ffffff;
  box-shadow: 0 14px 28px rgba(14, 143, 86, 0.22);
}

.access-grid article:nth-child(2) button {
  background: var(--ink);
  color: #ffffff;
}

.access-grid small {
  display: block;
  margin-top: 10px;
  color: var(--muted);
  text-align: center;
  font-size: 12px;
  font-weight: 550;
}

.faq-section {
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  gap: 56px;
  align-items: start;
}

.faq-list {
  display: grid;
  gap: 4px;
}

.faq-list details {
  padding: 24px 0;
  border-bottom: 1px solid var(--line);
}

.faq-list details:first-child {
  padding-top: 0;
}

.faq-list summary {
  cursor: pointer;
  color: var(--ink);
  font-size: 16px;
  font-weight: 750;
  list-style: none;
}

.faq-list summary::-webkit-details-marker {
  display: none;
}

.faq-list summary::after {
  content: "+";
  float: right;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: var(--green-50);
  color: var(--green-700);
  display: grid;
  place-items: center;
}

.faq-list details[open] summary::after {
  content: "–";
}

.faq-list p {
  margin: 14px 0 0;
  color: var(--body);
  font-size: 14px;
  line-height: 1.65;
}

.final-cta {
  width: min(1080px, calc(100% - 48px));
  margin: 112px auto 0;
  padding: 72px 24px;
  text-align: center;
}

.final-cta h2 {
  max-width: 860px;
  margin: 0 auto;
}

.final-cta p {
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.final-cta div {
  margin-top: 28px;
  display: flex;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
}

.final-cta button {
  min-height: 46px;
  padding: 0 22px;
  border-radius: var(--radius-pill);
  font-size: 14px;
  font-weight: 750;
}

.final-cta button:first-child {
  color: white;
  background: var(--green-600);
  box-shadow: 0 14px 28px rgba(14, 143, 86, 0.22);
}

.final-cta button:last-child {
  color: var(--ink);
  background: white;
  border: 1px solid var(--line);
}

.final-cta small {
  display: block;
  margin-top: 12px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 550;
}

.footer {
  width: min(1180px, calc(100% - 48px));
  margin: 40px auto 34px;
  padding: 48px 0 20px;
  border-top: 1px solid var(--line);
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 64px;
  align-items: start;
}

.footer p {
  max-width: 390px;
  margin: 16px 0 0;
  color: var(--body);
  font-size: 14px;
  line-height: 1.6;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px;
}

.footer-grid div {
  display: grid;
  gap: 10px;
}

.footer-grid span {
  margin-bottom: 6px;
}

.footer-grid button {
  width: max-content;
  background: transparent;
  color: var(--body);
  font-size: 14px;
  font-weight: 650;
}

.reveal {
  opacity: 0;
  transform: translateY(34px);
  transition:
    opacity 720ms ease,
    transform 860ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.reveal-left {
  transform: translateX(-26px);
}

.reveal-3d {
  transform: perspective(1100px) translateY(42px) rotateX(7deg) rotateY(-3deg) scale(0.985);
}

.reveal.is-visible {
  opacity: 1;
  transform: translate(0, 0) perspective(1100px) rotateX(0) rotateY(0) scale(1);
}

@keyframes phoneFloat {
  0%, 100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal,
  .phone-shell {
    opacity: 1;
    transform: none !important;
    animation: none !important;
    transition: none !important;
  }
}

@media (max-height: 760px) and (min-width: 1000px) {
  .hero-section {
    padding-top: 30px;
    padding-bottom: 40px;
  }

  .hero-copy h1 {
    font-size: clamp(48px, 4.5vw, 68px);
    line-height: 1.02;
  }

  .hero-copy p {
    font-size: 16px;
    line-height: 1.56;
  }

  .product-preview {
    max-width: 560px;
  }

  .player-shell {
    grid-template-columns: 140px 1fr;
  }

  .lesson-top h2 {
    font-size: 23px;
  }
}

@media (max-width: 1200px) {
  .hero-grid,
  .split-grid,
  .mobile-section,
  .faq-section,
  .footer {
    grid-template-columns: 1fr;
  }

  .product-preview {
    max-width: 900px;
    justify-self: start;
  }

  .journey-row {
    grid-template-columns: repeat(5, minmax(120px, 1fr));
    overflow-x: auto;
  }

  .course-grid,
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 920px) {
  .lx-header {
    padding: 0;
  }

  .lx-nav,
  .lx-header.is-scrolled .lx-nav {
    width: 100%;
    min-height: auto;
    border-radius: 0;
    padding: 18px 16px;
    flex-direction: column;
    align-items: flex-start;
  }

  .nav-links {
    width: 100%;
    gap: 16px;
    overflow-x: auto;
  }

  .nav-actions {
    width: 100%;
  }

  .login-btn,
  .primary-nav-btn {
    flex: 1;
  }

  .hero-section {
    padding: 40px 16px 46px;
  }

  .hero-copy h1 {
    font-size: 44px;
    line-height: 1.06;
  }

  .hero-copy p {
    font-size: 16px;
  }

  .player-shell,
  .journey-row,
  .course-grid,
  .project-grid,
  .mobile-benefits,
  .access-grid,
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .journey-section {
    width: calc(100% - 32px);
    padding-bottom: 48px;
  }

  .journey-row button {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .journey-row button:last-child {
    border-bottom: 0;
  }

  .lesson-top,
  .mentor-panel {
    grid-template-columns: 1fr;
    display: grid;
  }

  .lesson-sidebar {
    display: none;
  }

  .section,
  .final-cta,
  .footer {
    width: calc(100% - 32px);
    margin-top: 80px;
  }

  .section-heading h2,
  .split-copy h2,
  .mobile-copy h2,
  .final-cta h2 {
    font-size: 34px;
    line-height: 1.12;
  }

  .course-grid button {
    min-height: auto;
  }

  .course-grid h3,
  .course-grid p,
  .course-grid small {
    min-height: auto;
  }

  .chat {
    max-width: 100%;
  }

  .floating-card {
    display: none;
  }

  .phone-shell {
    width: min(310px, 100%);
  }

  .access-grid article {
    min-height: auto;
  }
}
`;

export default LandingScreen;
