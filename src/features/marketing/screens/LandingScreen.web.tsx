import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';

const USER_HOLD_DURATION_MS = 10_000;

const learningStages = [
  {
    label: 'Learn',
    eyebrow: 'LESSON FLOW',
    title: 'Structured lessons with AI-guided explanations.',
    description:
      'Learners follow clear modules, summaries, quizzes, and next steps instead of jumping between random videos.',
    code: 'Lesson → Summary → Quiz',
  },
  {
    label: 'Practice',
    eyebrow: 'PRACTICE MODE',
    title: 'Small tasks after important concepts.',
    description:
      'Every important lesson can connect to a practical task so learners apply concepts immediately.',
    code: 'Task: Build reusable UI',
  },
  {
    label: 'Project',
    eyebrow: 'PROJECT TASK',
    title: 'Build portfolio-ready projects.',
    description:
      'Projects connect lessons, practice, AI help, and completion tracking into visible proof of skill.',
    code: '<CourseCard progress={72} />',
  },
  {
    label: 'Certificate',
    eyebrow: 'CERTIFICATE READY',
    title: 'Progress becomes proof.',
    description:
      'Learners can track readiness through lessons, quizzes, tasks, projects, and course completion rules.',
    code: 'Readiness: 68%',
  },
  {
    label: 'Career',
    eyebrow: 'CAREER PATH',
    title: 'Learning connects to career growth.',
    description:
      'Career paths can connect projects, certificates, internship readiness, and skill milestones.',
    code: 'Skills → Projects → Career',
  },
];

const mobileTabs = [
  {
    label: 'Home',
    eyebrow: 'TODAY',
    title: 'Continue learning',
    subtitle: 'AI Foundations · 12 min left',
    metric: '42%',
    metricLabel: 'Today’s progress',
    assistant: 'Resume your next lesson and continue the guided path.',
  },
  {
    label: 'Courses',
    eyebrow: 'COURSES',
    title: 'Explore tracks',
    subtitle: 'AI, coding, cloud, data, design, career skills',
    metric: '4',
    metricLabel: 'Launch tracks',
    assistant: 'Browse the first launch tracks and planned learning paths.',
  },
  {
    label: 'AI',
    eyebrow: 'AI MENTOR',
    title: 'Ask course AI',
    subtitle: 'Doubts, summaries, quizzes, project help',
    metric: '24/7',
    metricLabel: 'AI guidance',
    assistant: '“Explain this lesson with a practical project example.”',
  },
  {
    label: 'Profile',
    eyebrow: 'CAREER PROFILE',
    title: 'Track readiness',
    subtitle: 'Projects, certificates, career path',
    metric: '68%',
    metricLabel: 'Certificate ready',
    assistant: 'View skill progress, completed tasks, and career readiness.',
  },
];

export function LandingScreen() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeJourney, setActiveJourney] = useState(2);
  const [activeMobileTab, setActiveMobileTab] = useState(0);

  const journeyHoldUntilRef = useRef(0);
  const mobileHoldUntilRef = useRef(0);

  const selectedJourney = learningStages[activeJourney];
  const selectedMobileTab = mobileTabs[activeMobileTab];

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  function selectJourney(index: number) {
    setActiveJourney(index);
    journeyHoldUntilRef.current = Date.now() + USER_HOLD_DURATION_MS;
  }

  function selectMobileTab(index: number) {
    setActiveMobileTab(index);
    mobileHoldUntilRef.current = Date.now() + USER_HOLD_DURATION_MS;
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 32);

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const journeyTimer = window.setInterval(() => {
      if (Date.now() < journeyHoldUntilRef.current) {
        return;
      }

      setActiveJourney((current) => (current + 1) % learningStages.length);
    }, 3600);

    const mobileTimer = window.setInterval(() => {
      if (Date.now() < mobileHoldUntilRef.current) {
        return;
      }

      setActiveMobileTab((current) => (current + 1) % mobileTabs.length);
    }, 3300);

    return () => {
      window.clearInterval(journeyTimer);
      window.clearInterval(mobileTimer);
    };
  }, []);

  return (
    <main className="lx-page">
      <style>{styles}</style>

      <header className={`lx-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="lx-nav-shell">
          <button className="lx-brand" onClick={() => router.push('/')}>
            <span className="lx-brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            <span>LearnXai</span>
          </button>

          <nav className="lx-nav-links">
            <button onClick={() => router.push('/courses')}>Courses</button>
            <button type="button" onClick={() => scrollToSection('ai-mentor')}>
              AI Mentor
            </button>
            <button type="button" onClick={() => scrollToSection('launch-tracks')}>
              Launch Tracks
            </button>
            <button type="button" onClick={() => scrollToSection('pricing')}>
              Pricing
            </button>
          </nav>

          <div className="lx-nav-actions">
            <button className="lx-ghost-btn" onClick={() => router.push('/login')}>
              Invited Login
            </button>
            <button className="lx-dark-btn" onClick={() => router.push('/register')}>
              Join Free Early Access
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="grid-overlay" />
        <div className="glow glow-cyan" />
        <div className="glow glow-peach" />
        <div className="glow glow-violet" />

        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow-pill">Pre-launch LMS for outcome-focused learners</div>

            <h1>Every course gets its own AI mentor.</h1>

            <p>
              LearnXai is a pre-launch learning platform for structured courses,
              AI-guided lessons, projects, certificates, and career paths — built
              for learners who want outcomes, not just videos.
            </p>

            <div className="hero-actions">
              <button className="primary-btn" onClick={() => router.push('/register')}>
                Join Free Early Access
              </button>

              <button className="secondary-btn" onClick={() => scrollToSection('launch-tracks')}>
                View Launch Tracks
              </button>
            </div>

            <p className="cta-note">
              Free to join. Get pre-launch offers when LearnXai opens access.
            </p>

            <div className="proof-row">
              <article>
                <strong>4</strong>
                <span>Launch tracks prepared</span>
              </article>
              <article>
                <strong>AI</strong>
                <span>Mentor planned per course</span>
              </article>
              <article>
                <strong>Free</strong>
                <span>Early access registration</span>
              </article>
              <article>
                <strong>120+</strong>
                <span>Planned lessons and paths</span>
              </article>
            </div>
          </div>

          <div className="learning-os-card">
            <div className="os-top">
              <div>
                <span>LEARNXAI LEARNING OS</span>
                <h2>AI-guided course journey</h2>
              </div>

              <b>Pre-launch</b>
            </div>

            <div className="os-body">
              <div className="os-main">
                <div className="os-tiles">
                  <article>
                    <span>COURSES</span>
                    <strong>Launch tracks</strong>
                    <p>AI foundations, mobile apps, full-stack, and career skills.</p>
                  </article>

                  <article className="dark">
                    <span>AI MENTOR</span>
                    <strong>Course companion</strong>
                    <p>Doubts, summaries, quizzes, and project guidance.</p>
                  </article>

                  <article>
                    <span>PROJECTS</span>
                    <strong>Real tasks</strong>
                    <p>Hands-on assignments connected to practical outcomes.</p>
                  </article>

                  <article>
                    <span>CAREER</span>
                    <strong>Growth paths</strong>
                    <p>Certificates, internships, and career readiness planned.</p>
                  </article>
                </div>

                <div className="journey-tabs">
                  {learningStages.map((stage, index) => (
                    <button
                      key={stage.label}
                      className={index === activeJourney ? 'active' : ''}
                      onClick={() => selectJourney(index)}
                      type="button"
                    >
                      {stage.label}
                    </button>
                  ))}
                </div>

                <div className="stage-summary-card">
                  <div>
                    <span>{selectedJourney.eyebrow}</span>
                    <strong>{selectedJourney.title}</strong>
                    <p>{selectedJourney.description}</p>
                  </div>

                  <code>{selectedJourney.code}</code>
                </div>
              </div>

              <div className="os-side">
                <div className="phone-shell os-phone">
                  <div className="phone-status">
                    <span>9:41</span>
                    <i />
                  </div>

                  <div className="phone-screen">
                    <span className="phone-kicker">LEARNER APP</span>
                    <h3>{selectedMobileTab.title}</h3>

                    <div className="phone-card">
                      <span>{selectedMobileTab.eyebrow}</span>
                      <strong>{selectedMobileTab.subtitle}</strong>
                      <p>{selectedMobileTab.metricLabel}</p>
                      <button>Continue</button>
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

                    <div className="phone-assistant">
                      <span>AI COURSE ASSISTANT</span>
                      <p>{selectedMobileTab.assistant}</p>
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="capability-strip">
        <span>AI mentor per course</span>
        <span>Launch tracks</span>
        <span>Projects</span>
        <span>Certificates</span>
        <span>Career paths</span>
        <span>Free early access</span>
      </section>

      <section id="ai-mentor" className="content-section ai-mentor-section">
        <div className="section-heading">
          <span>The LearnXai wedge</span>
          <h2>Not just courses. Course-specific AI guidance.</h2>
          <p>
            The strongest idea behind LearnXai is simple: every course experience
            should feel guided. The AI mentor layer is planned to help learners
            understand lessons, practice concepts, and move toward projects.
          </p>
        </div>

        <div className="mentor-demo">
          <div className="mentor-chat">
            <div className="chat-bubble learner">
              Explain React Native navigation like I am building my first mobile app.
            </div>

            <div className="chat-bubble ai">
              Start with screens, then connect them using routes. After that, build a
              small project so the routing logic becomes practical.
            </div>

            <div className="chat-action">
              <span>AI mentor suggestion</span>
              <strong>Practice: Build a 3-screen course app flow</strong>
            </div>
          </div>

          <div className="mentor-copy">
            <span>Why this matters</span>
            <h3>Most LMS platforms give content. LearnXai is designed to guide action.</h3>
            <p>
              The AI mentor does not replace learning. It supports the learner while
              they move from lesson to practice, project, certificate, and career path.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section ecosystem-section">
        <div className="section-heading">
          <span>Complete learning ecosystem</span>
          <h2>Built around the learner journey, not only video content.</h2>
          <p>
            LearnXai is planned as one connected system for courses, AI help, tasks,
            projects, certificates, internships, and career paths.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card large">
            <span>01 / Guided journey</span>
            <h3>From beginner to career-ready without feeling lost.</h3>
            <p>
              Learners move from lessons to practice, projects, certificates, and
              career paths through a clear learning journey.
            </p>

            <div className="path-stack">
              <b>Beginner</b>
              <b className="active">Guided path</b>
              <b>Project</b>
              <b>Certificate</b>
              <b>Career</b>
            </div>
          </article>

          <article className="feature-card blue">
            <span>02 / AI course assistant</span>
            <h3>Every course gets its own learning companion.</h3>
            <p>Explain lessons, generate quizzes, summarize topics, and guide tasks.</p>
          </article>

          <article className="feature-card mint">
            <span>03 / Mentor-led roadmap</span>
            <h3>Human mentor support is planned for launch cohorts.</h3>
            <p>Mentor-led sessions will be added only after real mentor onboarding.</p>
          </article>

          <article className="feature-card peach wide">
            <span>04 / Career outcomes</span>
            <h3>Projects, internships, and certificates become part of the journey.</h3>
            <p>
              LearnXai will focus on visible proof of skill, not just completed videos.
            </p>
          </article>
        </div>
      </section>

      <section className="content-section mobile-section">
        <div className="mobile-copy">
          <span>Mobile learning app</span>
          <h2>Learning continues after the browser closes.</h2>
          <p>
            Learners continue lessons, complete tasks, ask course AI, track certificates,
            and follow career progress from mobile.
          </p>

          <div className="store-row">
            <button className="store-badge dark">
              <small>Download on the</small>
              <strong>App Store</strong>
            </button>
            <button className="store-badge dark">
              <small>Get it on</small>
              <strong>Google Play</strong>
            </button>
          </div>
        </div>

        <div className="mobile-product-card">
          <div className="mobile-product-content">
            <div className="mobile-app-tabs">
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

            <span>{selectedMobileTab.eyebrow}</span>
            <h3>{selectedMobileTab.title}</h3>
            <p>{selectedMobileTab.assistant}</p>

            <div className="mobile-proof-row">
              <article>
                <strong>{selectedMobileTab.metric}</strong>
                <small>{selectedMobileTab.metricLabel}</small>
              </article>
              <article>
                <strong>08</strong>
                <small>Active tasks</small>
              </article>
              <article>
                <strong>03</strong>
                <small>Project previews</small>
              </article>
            </div>
          </div>

          <div className="phone-shell mobile-phone-small">
            <div className="phone-status">
              <span>9:41</span>
              <i />
            </div>

            <div className="phone-screen">
              <span className="phone-kicker">LEARNER APP</span>
              <h3>{selectedMobileTab.title}</h3>

              <div className="phone-card">
                <span>{selectedMobileTab.eyebrow}</span>
                <strong>{selectedMobileTab.subtitle}</strong>
                <p>{selectedMobileTab.metricLabel}</p>
                <button>Continue</button>
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

              <div className="phone-assistant">
                <span>AI COURSE ASSISTANT</span>
                <p>{selectedMobileTab.assistant}</p>
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
        </div>
      </section>

      <section id="launch-tracks" className="content-section catalogue-section">
        <div className="catalogue-copy">
          <span>Launch tracks</span>
          <h2>Four launch tracks first. 120+ planned lessons and paths later.</h2>
          <p>
            LearnXai is starting with focused launch tracks. The wider catalogue is
            planned for full rollout after early access validation.
          </p>
        </div>

        <div className="catalogue-list">
          <button onClick={() => router.push('/courses')}>
            <span>01</span>
            <div>
              <strong>AI Foundations</strong>
              <small>Prompting, tools, workflows, AI assistant guidance</small>
            </div>
          </button>

          <button onClick={() => router.push('/courses')}>
            <span>02</span>
            <div>
              <strong>React Native with Expo</strong>
              <small>Mobile development, projects, certificates</small>
            </div>
          </button>

          <button onClick={() => router.push('/courses')}>
            <span>03</span>
            <div>
              <strong>Full-Stack Development</strong>
              <small>Frontend, APIs, databases, deployment</small>
            </div>
          </button>

          <button onClick={() => router.push('/courses')}>
            <span>04</span>
            <div>
              <strong>Career + Internship Track</strong>
              <small>Projects, readiness, certificates, internships</small>
            </div>
          </button>
        </div>
      </section>

      <section id="pricing" className="content-section pricing-section">
        <div className="pricing-copy">
          <span>Early access pricing</span>
          <h2>Free to register before launch.</h2>
          <p>
            LearnXai is currently pre-launch. Early access registration is free and
            helps us understand real learner interest before opening enrollment.
          </p>
        </div>

        <div className="pricing-card">
          <span>FOUNDING ACCESS</span>
          <h3>Free early access</h3>

          <ul>
            <li>No payment required to register interest</li>
            <li>Pre-launch offers planned for early users</li>
            <li>Pricing will be announced before enrollment</li>
            <li>Invited users can access login when accounts are enabled</li>
          </ul>

          <button onClick={() => router.push('/register')}>Join Free Early Access</button>
        </div>
      </section>

      <section className="content-section faq-section">
        <div className="section-heading">
          <span>Questions before launch</span>
          <h2>Clear answers before users trust the platform.</h2>
        </div>

        <div className="faq-grid">
          <article>
            <strong>Is LearnXai live now?</strong>
            <p>
              LearnXai is currently in pre-launch and early access preparation.
              Registration is for interested learners before public access opens.
            </p>
          </article>

          <article>
            <strong>Is early access free?</strong>
            <p>
              Yes. Early access registration is free. Pricing will be shared before
              enrollment or paid access begins.
            </p>
          </article>

          <article>
            <strong>Are 120+ tracks available today?</strong>
            <p>
              No. Four launch tracks are being prepared first. 120+ lessons and
              learning paths are planned for the wider rollout.
            </p>
          </article>

          <article>
            <strong>Are mentors available now?</strong>
            <p>
              Mentor-led support is planned for launch cohorts. We will only show
              real mentor names after onboarding confirmed mentors.
            </p>
          </article>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-top">
          <div>
            <button className="footer-brand" onClick={() => router.push('/')}>
              <span className="lx-brand-mark" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
              LearnXai
            </button>

            <p>
              Pre-launch LMS for AI-guided courses, projects, certificates, and
              career-focused learning paths.
            </p>
          </div>

          <button className="footer-cta" onClick={() => router.push('/register')}>
            Join Free Early Access
          </button>
        </div>

        <div className="footer-grid">
          <div>
            <span>Platform</span>
            <button onClick={() => router.push('/courses')}>Courses</button>
            <button type="button" onClick={() => scrollToSection('ai-mentor')}>
              AI Mentor
            </button>
            <button type="button" onClick={() => scrollToSection('launch-tracks')}>
              Launch Tracks
            </button>
          </div>

          <div>
            <span>Outcomes</span>
            <button type="button">Projects</button>
            <button type="button">Certificates</button>
            <button type="button">Career Paths</button>
          </div>

          <div>
            <span>Access</span>
            <button onClick={() => router.push('/login')}>Invited Login</button>
            <button onClick={() => router.push('/register')}>Free Early Access</button>
            <button type="button" onClick={() => scrollToSection('pricing')}>
              Pricing
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 LearnXai</span>
          <span>Pre-launch product. Free early access registration open.</span>
        </div>
      </footer>
    </main>
  );
}

const styles = `
:root {
  --ink: #181818;
  --body: #61646d;
  --muted: #858895;
  --line: rgba(24, 24, 24, 0.08);
  --brand: #5d55f4;
  --cyan: #76def3;
  --paper: #fbf8f2;
  --shadow: 0 20px 60px rgba(78, 86, 104, 0.11);
  --shadow-strong: 0 30px 90px rgba(78, 86, 104, 0.15);
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
  font-family: var(--font);
  color: var(--ink);
  background: var(--paper);
}

button {
  font: inherit;
}

.lx-page {
  min-height: 100vh;
  overflow-x: hidden;
  background:
    radial-gradient(circle at 7% 22%, rgba(118, 222, 243, 0.42), transparent 25%),
    radial-gradient(circle at 92% 18%, rgba(255, 215, 190, 0.52), transparent 27%),
    radial-gradient(circle at 52% 78%, rgba(180, 164, 255, 0.2), transparent 22%),
    linear-gradient(135deg, #f9fcfd 0%, #fbf8f2 44%, #fff4e8 100%);
}

.lx-header {
  position: sticky;
  top: 0;
  z-index: 100;
  padding: 16px 22px 0;
  pointer-events: none;
}

.lx-nav-shell {
  width: min(1360px, 100%);
  height: 74px;
  margin: 0 auto;
  padding: 0 22px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 0 18px 54px rgba(80, 88, 106, 0.1);
  backdrop-filter: blur(18px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  pointer-events: auto;
  transition: all 260ms ease;
}

.lx-header.is-scrolled .lx-nav-shell {
  width: min(1160px, 100%);
  height: 66px;
  border-radius: 999px;
  box-shadow: 0 24px 66px rgba(80, 88, 106, 0.17);
}

.lx-brand,
.lx-nav-links button,
.lx-ghost-btn,
.lx-dark-btn,
.primary-btn,
.secondary-btn,
.journey-tabs button,
.phone-tabs button,
.mobile-app-tabs button,
.catalogue-list button,
.pricing-card button,
.footer button {
  border: 0;
  cursor: pointer;
}

.lx-brand {
  background: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--ink);
  font-size: 26px;
  font-weight: 900;
  letter-spacing: -0.8px;
}

.lx-brand-mark {
  width: 24px;
  height: 24px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  transform: rotate(45deg);
}

.lx-brand-mark i {
  display: block;
  border-radius: 4px;
  background: var(--ink);
}

.lx-brand-mark i:nth-child(2) {
  background: transparent;
  border: 2px solid var(--ink);
}

.lx-nav-links {
  display: flex;
  align-items: center;
  gap: 30px;
}

.lx-nav-links button {
  background: transparent;
  color: #393b42;
  font-size: 15px;
  font-weight: 800;
}

.lx-nav-actions {
  display: flex;
  gap: 12px;
}

.lx-ghost-btn,
.lx-dark-btn,
.primary-btn,
.secondary-btn {
  min-height: 46px;
  padding: 0 24px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 900;
}

.lx-ghost-btn {
  color: var(--ink);
  background: rgba(255, 255, 255, 0.78);
}

.lx-dark-btn,
.primary-btn {
  color: white;
  background: #080808;
  box-shadow: 0 16px 42px rgba(0, 0, 0, 0.16);
}

.secondary-btn {
  color: var(--ink);
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid var(--line);
}

.hero-section {
  position: relative;
  padding: 20px 22px 26px;
  overflow: hidden;
}

.grid-overlay {
  position: absolute;
  inset: 90px 0 0;
  opacity: 0.045;
  background-image:
    linear-gradient(rgba(24, 24, 24, 0.9) 1px, transparent 1px),
    linear-gradient(90deg, rgba(24, 24, 24, 0.9) 1px, transparent 1px);
  background-size: 54px 54px;
}

.glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(42px);
  pointer-events: none;
}

.glow-cyan {
  width: 430px;
  height: 430px;
  left: -150px;
  top: 230px;
  background: rgba(118, 222, 243, 0.56);
}

.glow-peach {
  width: 540px;
  height: 540px;
  right: -170px;
  top: 80px;
  background: rgba(255, 211, 184, 0.62);
}

.glow-violet {
  width: 380px;
  height: 380px;
  left: 52%;
  bottom: 5px;
  transform: translateX(-50%);
  background: rgba(174, 158, 255, 0.22);
}

.hero-inner {
  position: relative;
  z-index: 2;
  width: min(1360px, 100%);
  min-height: calc(100vh - 112px);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(390px, 0.76fr) minmax(760px, 1.24fr);
  gap: 34px;
  align-items: center;
}

.hero-copy {
  max-width: 610px;
}

.eyebrow-pill {
  display: inline-flex;
  padding: 11px 18px;
  border-radius: 999px;
  color: #2d53d8;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(87, 98, 210, 0.16);
  box-shadow: 0 12px 32px rgba(71, 90, 145, 0.08);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.9px;
  text-transform: uppercase;
}

.hero-copy h1 {
  margin: 24px 0 0;
  color: #202020;
  font-size: clamp(58px, 6vw, 96px);
  line-height: 0.9;
  letter-spacing: -5px;
  font-weight: 950;
}

.hero-copy p {
  margin: 24px 0 0;
  color: var(--body);
  font-size: 17px;
  line-height: 1.62;
}

.hero-actions {
  margin-top: 28px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.cta-note {
  max-width: 470px;
  margin-top: 14px !important;
  color: var(--muted) !important;
  font-size: 13px !important;
  font-weight: 800;
}

.proof-row {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.proof-row article {
  padding: 15px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid rgba(255, 255, 255, 0.74);
  box-shadow: var(--shadow);
}

.proof-row strong {
  display: block;
  font-size: 26px;
  line-height: 1;
  font-weight: 950;
}

.proof-row span {
  display: block;
  margin-top: 6px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
}

.learning-os-card {
  width: 100%;
  padding: 26px;
  border-radius: 36px;
  background: rgba(255, 255, 255, 0.77);
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow: var(--shadow-strong);
  backdrop-filter: blur(18px);
}

.os-top {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: start;
}

.os-top span,
.os-tiles span,
.stage-summary-card span,
.section-heading span,
.mobile-copy span,
.catalogue-copy span,
.mobile-product-content span,
.pricing-copy span,
.pricing-card span,
.phone-kicker,
.phone-card span,
.phone-metrics span,
.phone-assistant span,
.feature-card span,
.chat-action span,
.mentor-copy span,
.footer-grid span {
  color: var(--brand);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1.1px;
  text-transform: uppercase;
}

.os-top h2 {
  margin: 8px 0 0;
  font-size: 32px;
  line-height: 1.05;
  letter-spacing: -1.2px;
  font-weight: 950;
}

.os-top b {
  padding: 11px 16px;
  border-radius: 999px;
  color: #0c8749;
  background: rgba(60, 200, 115, 0.16);
  font-size: 14px;
}

.os-body {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 218px;
  gap: 18px;
  align-items: start;
}

.os-tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 13px;
}

.os-tiles article {
  min-height: 130px;
  padding: 18px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line);
}

.os-tiles article.dark {
  color: white;
  background: linear-gradient(145deg, #17171d, #352f64);
}

.os-tiles article.dark span {
  color: #9cf1ff;
}

.os-tiles strong {
  display: block;
  margin-top: 11px;
  font-size: 20px;
  line-height: 1.12;
  font-weight: 950;
}

.os-tiles p {
  margin: 8px 0 0;
  color: var(--body);
  font-size: 13px;
  line-height: 1.48;
}

.os-tiles article.dark p {
  color: rgba(255, 255, 255, 0.72);
}

.journey-tabs {
  margin-top: 13px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.journey-tabs button {
  min-height: 38px;
  padding: 0 8px;
  border-radius: 999px;
  color: rgba(40, 40, 40, 0.56);
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line);
  font-size: 12px;
  font-weight: 900;
  transition: all 200ms ease;
}

.journey-tabs button.active {
  color: white;
  background: #101010;
  transform: translateY(-2px);
}

.stage-summary-card {
  margin-top: 14px;
  padding: 18px;
  border-radius: 24px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 210px;
  gap: 16px;
  align-items: center;
  background: rgba(255, 255, 255, 0.84);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 14px 36px rgba(68, 74, 90, 0.08);
}

.stage-summary-card strong {
  display: block;
  margin-top: 7px;
  font-size: 22px;
  line-height: 1.1;
  letter-spacing: -0.6px;
  font-weight: 950;
}

.stage-summary-card p {
  margin: 8px 0 0;
  color: var(--body);
  font-size: 13px;
  line-height: 1.45;
}

.stage-summary-card code {
  display: block;
  padding: 13px;
  border-radius: 14px;
  color: #eef1ff;
  background: #101010;
  font-size: 11px;
  line-height: 1.35;
  white-space: normal;
  word-break: break-word;
}

.os-side {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.phone-shell {
  aspect-ratio: 390 / 844;
  padding: 11px;
  border-radius: 36px;
  background: linear-gradient(180deg, #171717, #0d0d0d);
  box-shadow: 0 24px 68px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.os-phone {
  width: 218px;
}

.mobile-phone-small {
  width: 260px;
}

.phone-status {
  height: 25px;
  padding: 0 10px;
  color: rgba(255, 255, 255, 0.78);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 900;
}

.phone-status i {
  width: 28px;
  height: 7px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.5);
}

.phone-screen {
  height: calc(100% - 25px);
  padding: 15px;
  border-radius: 28px;
  color: white;
  background:
    radial-gradient(circle at 22% 0%, rgba(113, 219, 244, 0.24), transparent 34%),
    radial-gradient(circle at 90% 12%, rgba(112, 94, 255, 0.18), transparent 36%),
    linear-gradient(180deg, #20293a, #111);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.phone-screen h3 {
  margin: 8px 0 0;
  font-size: 20px;
  line-height: 1.06;
  font-weight: 950;
}

.phone-card {
  margin-top: 13px;
  padding: 14px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.11);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.phone-card span,
.phone-metrics span,
.phone-assistant span {
  color: #9cf1ff;
  font-size: 10px;
}

.phone-card strong {
  display: block;
  margin-top: 7px;
  font-size: 16px;
  line-height: 1.15;
  font-weight: 950;
}

.phone-card p {
  margin: 7px 0 0;
  color: rgba(255, 255, 255, 0.66);
  font-size: 12px;
}

.phone-card button {
  margin-top: 12px;
  min-height: 32px;
  padding: 0 13px;
  border-radius: 999px;
  border: 0;
  color: #111;
  background: white;
  font-size: 12px;
  font-weight: 900;
}

.phone-metrics {
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 9px;
}

.phone-metrics article {
  padding: 11px;
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.08);
}

.phone-metrics strong {
  display: block;
  margin-top: 5px;
  font-size: 18px;
  font-weight: 950;
}

.phone-assistant {
  margin-top: 10px;
  padding: 12px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.08);
}

.phone-assistant p {
  margin: 7px 0 0;
  font-size: 12px;
  line-height: 1.42;
}

.phone-tabs {
  margin-top: auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  padding: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
}

.phone-tabs button {
  min-height: 28px;
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.55);
  background: transparent;
  font-size: 9px;
  font-weight: 900;
}

.phone-tabs button.active {
  color: #111;
  background: white;
}

.capability-strip {
  width: min(1360px, calc(100% - 44px));
  margin: 6px auto 0;
  padding: 16px 0 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 28px;
  color: rgba(33, 35, 40, 0.52);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.content-section {
  width: min(1360px, calc(100% - 44px));
  margin: 76px auto 0;
  scroll-margin-top: 120px;
}

.section-heading {
  max-width: 920px;
  margin: 0 auto 42px;
  text-align: center;
}

.section-heading h2,
.mobile-copy h2,
.catalogue-copy h2,
.pricing-copy h2 {
  margin: 16px 0 0;
  color: #202020;
  font-size: clamp(42px, 4vw, 64px);
  line-height: 0.99;
  letter-spacing: -2.4px;
  font-weight: 950;
}

.section-heading p,
.mobile-copy p,
.catalogue-copy p,
.pricing-copy p {
  margin: 18px 0 0;
  color: var(--body);
  font-size: 17px;
  line-height: 1.65;
}

.mentor-demo {
  padding: 34px;
  border-radius: 38px;
  background: rgba(255,255,255,0.76);
  border: 1px solid rgba(255,255,255,0.86);
  box-shadow: var(--shadow-strong);
  display: grid;
  grid-template-columns: 1fr 0.9fr;
  gap: 34px;
  align-items: center;
}

.mentor-chat {
  display: grid;
  gap: 14px;
}

.chat-bubble,
.chat-action {
  padding: 22px;
  border-radius: 28px;
  font-size: 17px;
  line-height: 1.5;
}

.chat-bubble.learner {
  background: #101010;
  color: white;
  margin-right: 70px;
}

.chat-bubble.ai,
.chat-action {
  background: rgba(255,255,255,0.84);
  border: 1px solid var(--line);
  margin-left: 70px;
}

.chat-action strong {
  display: block;
  margin-top: 8px;
  font-size: 24px;
  line-height: 1.12;
  font-weight: 950;
}

.mentor-copy h3 {
  margin: 16px 0 0;
  font-size: 44px;
  line-height: 1;
  letter-spacing: -1.8px;
  font-weight: 950;
}

.mentor-copy p {
  margin: 18px 0 0;
  color: var(--body);
  font-size: 17px;
  line-height: 1.62;
}

.feature-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.95fr 0.95fr;
  gap: 18px;
}

.feature-card {
  padding: 28px;
  border-radius: 34px;
  background: rgba(255, 255, 255, 0.74);
  border: 1px solid rgba(255, 255, 255, 0.84);
  box-shadow: var(--shadow);
}

.feature-card.large {
  grid-row: span 2;
}

.feature-card.wide {
  grid-column: span 2;
}

.feature-card.blue {
  background: linear-gradient(135deg, rgba(255,255,255,0.84), rgba(226,245,255,0.88));
}

.feature-card.mint {
  background: linear-gradient(135deg, rgba(255,255,255,0.84), rgba(230,249,238,0.88));
}

.feature-card.peach {
  background: linear-gradient(135deg, rgba(255,255,255,0.84), rgba(255,235,220,0.88));
}

.feature-card h3 {
  margin: 18px 0 0;
  font-size: 30px;
  line-height: 1.08;
  letter-spacing: -1.1px;
  font-weight: 950;
}

.feature-card p {
  margin: 14px 0 0;
  color: var(--body);
  font-size: 15px;
  line-height: 1.65;
}

.path-stack {
  margin-top: 34px;
  display: grid;
  gap: 12px;
}

.path-stack b {
  min-height: 48px;
  padding: 0 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--line);
  color: rgba(28, 28, 28, 0.58);
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 900;
}

.path-stack b.active {
  color: white;
  background: #101010;
}

.mobile-section {
  display: grid;
  grid-template-columns: 0.82fr 1.18fr;
  gap: 44px;
  align-items: center;
}

.mobile-copy {
  max-width: 560px;
}

.store-row {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.store-badge {
  min-width: 168px;
  min-height: 54px;
  padding: 9px 16px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.74);
  color: var(--ink);
  text-align: left;
  font-weight: 900;
}

.store-badge.dark {
  background: #101010;
  color: white;
}

.store-badge small,
.store-badge strong {
  display: block;
}

.store-badge small {
  font-size: 10px;
  opacity: 0.72;
}

.store-badge strong {
  margin-top: 2px;
  font-size: 16px;
}

.mobile-product-card {
  padding: 26px;
  border-radius: 36px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 28px;
  align-items: center;
  background: rgba(255, 255, 255, 0.76);
  border: 1px solid rgba(255, 255, 255, 0.84);
  box-shadow: var(--shadow-strong);
}

.mobile-product-content h3 {
  margin: 18px 0 0;
  font-size: 48px;
  line-height: 0.95;
  letter-spacing: -2px;
  font-weight: 950;
}

.mobile-product-content p {
  margin: 18px 0 0;
  color: var(--body);
  font-size: 16px;
  line-height: 1.6;
}

.mobile-app-tabs {
  width: max-content;
  max-width: 100%;
  padding: 6px;
  border-radius: 999px;
  display: grid;
  grid-template-columns: repeat(4, minmax(74px, 1fr));
  gap: 6px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid var(--line);
  margin-bottom: 22px;
}

.mobile-app-tabs button {
  min-height: 38px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  color: rgba(40, 40, 40, 0.58);
  background: transparent;
  font-size: 13px;
  font-weight: 900;
}

.mobile-app-tabs button.active {
  color: white;
  background: #101010;
}

.mobile-proof-row {
  margin-top: 22px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.mobile-proof-row article {
  padding: 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid var(--line);
}

.mobile-proof-row strong {
  display: block;
  font-size: 28px;
  line-height: 1;
  font-weight: 950;
}

.mobile-proof-row small {
  display: block;
  margin-top: 7px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 800;
}

.catalogue-section,
.pricing-section {
  padding: 56px;
  border-radius: 38px;
  background: rgba(255,255,255,0.74);
  border: 1px solid rgba(255,255,255,0.84);
  box-shadow: var(--shadow-strong);
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 42px;
  align-items: center;
}

.catalogue-list {
  display: grid;
  gap: 14px;
}

.catalogue-list button {
  min-height: 86px;
  padding: 18px 20px;
  border-radius: 24px;
  text-align: left;
  background: rgba(255,255,255,0.86);
  border: 1px solid var(--line);
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 14px;
  align-items: center;
}

.catalogue-list button span {
  color: var(--brand);
  font-size: 18px;
  font-weight: 950;
}

.catalogue-list strong {
  display: block;
  font-size: 18px;
  font-weight: 900;
}

.catalogue-list small {
  display: block;
  margin-top: 5px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.45;
}

.pricing-card {
  padding: 32px;
  border-radius: 32px;
  color: white;
  background:
    radial-gradient(circle at 85% 12%, rgba(118, 222, 243, 0.28), transparent 34%),
    linear-gradient(145deg, #111, #312a5e);
  box-shadow: 0 28px 72px rgba(0,0,0,0.2);
}

.pricing-card h3 {
  margin: 14px 0 0;
  font-size: 42px;
  line-height: 1;
  letter-spacing: -1.5px;
  font-weight: 950;
}

.pricing-card ul {
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 14px;
}

.pricing-card li {
  color: rgba(255,255,255,0.78);
  font-size: 15px;
  line-height: 1.5;
}

.pricing-card li::before {
  content: "✓";
  display: inline-flex;
  margin-right: 10px;
  color: #9cf1ff;
  font-weight: 900;
}

.pricing-card button {
  margin-top: 28px;
  min-height: 50px;
  padding: 0 24px;
  border-radius: 999px;
  background: white;
  color: #111;
  font-size: 15px;
  font-weight: 950;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.faq-grid article {
  padding: 28px;
  border-radius: 30px;
  background: rgba(255,255,255,0.76);
  border: 1px solid rgba(255,255,255,0.86);
  box-shadow: var(--shadow);
}

.faq-grid strong {
  display: block;
  font-size: 22px;
  line-height: 1.12;
  font-weight: 950;
}

.faq-grid p {
  margin: 12px 0 0;
  color: var(--body);
  font-size: 15px;
  line-height: 1.6;
}

.footer {
  width: min(1360px, calc(100% - 44px));
  margin: 76px auto 34px;
  padding: 34px;
  border-radius: 36px;
  background:
    radial-gradient(circle at 10% 10%, rgba(118, 222, 243, 0.2), transparent 28%),
    radial-gradient(circle at 90% 20%, rgba(255, 211, 184, 0.28), transparent 32%),
    rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.86);
  box-shadow: var(--shadow-strong);
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 28px;
  align-items: flex-start;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--line);
}

.footer-brand {
  border: 0;
  background: transparent;
  color: var(--ink);
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 28px;
  font-weight: 950;
  letter-spacing: -0.8px;
}

.footer-top p {
  max-width: 640px;
  margin: 14px 0 0;
  color: var(--body);
  font-size: 15px;
  line-height: 1.6;
}

.footer-cta {
  min-height: 48px;
  padding: 0 24px;
  border: 0;
  border-radius: 999px;
  color: white;
  background: #101010;
  font-size: 15px;
  font-weight: 900;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.16);
}

.footer-grid {
  padding: 28px 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
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
  border: 0;
  background: transparent;
  color: #3d4048;
  font-size: 14px;
  font-weight: 800;
}

.footer-bottom {
  padding-top: 22px;
  border-top: 1px solid var(--line);
  display: flex;
  justify-content: space-between;
  gap: 18px;
  color: var(--muted);
  font-size: 13px;
  font-weight: 700;
}

@media (max-width: 1280px) {
  .hero-inner,
  .mobile-section,
  .catalogue-section,
  .pricing-section,
  .mentor-demo {
    grid-template-columns: 1fr;
  }

  .hero-copy,
  .mobile-copy {
    max-width: none;
  }

  .learning-os-card {
    max-width: 980px;
  }
}

@media (max-width: 920px) {
  .lx-header {
    padding: 0;
  }

  .lx-nav-shell,
  .lx-header.is-scrolled .lx-nav-shell {
    width: 100%;
    height: auto;
    border-radius: 0;
    padding: 18px 16px;
    flex-direction: column;
    align-items: flex-start;
    box-shadow: none;
  }

  .lx-nav-links {
    width: 100%;
    justify-content: space-between;
    gap: 10px;
    padding: 6px;
    border-radius: 999px;
    background: rgba(255,255,255,0.72);
    border: 1px solid var(--line);
    overflow-x: auto;
  }

  .lx-nav-actions {
    width: 100%;
  }

  .lx-ghost-btn,
  .lx-dark-btn {
    flex: 1;
  }

  .hero-inner,
  .os-body,
  .os-tiles,
  .proof-row,
  .feature-grid,
  .stage-summary-card,
  .mobile-product-card,
  .mobile-proof-row,
  .catalogue-section,
  .pricing-section,
  .faq-grid,
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .hero-section {
    padding: 24px 14px;
  }

  .hero-copy h1 {
    font-size: 48px;
    line-height: 0.96;
    letter-spacing: -2px;
  }

  .learning-os-card,
  .mobile-product-card,
  .catalogue-section,
  .pricing-section,
  .footer {
    padding: 22px;
    border-radius: 28px;
  }

  .os-side {
    max-width: 320px;
    margin: 0 auto;
  }

  .journey-tabs,
  .mobile-app-tabs {
    width: 100%;
    grid-template-columns: 1fr;
  }

  .mobile-product-card {
    justify-items: center;
  }

  .mobile-product-content h3 {
    font-size: 34px;
    letter-spacing: -1px;
  }

  .mobile-phone-small {
    width: 100%;
    max-width: 320px;
  }

  .content-section,
  .capability-strip,
  .footer {
    width: calc(100% - 28px);
  }

  .section-heading h2,
  .mobile-copy h2,
  .catalogue-copy h2,
  .pricing-copy h2 {
    font-size: 38px;
    line-height: 1.03;
    letter-spacing: -1.4px;
  }

  .feature-card.large,
  .feature-card.wide {
    grid-row: auto;
    grid-column: auto;
  }

  .footer-top,
  .footer-bottom {
    display: grid;
    grid-template-columns: 1fr;
  }

  .chat-bubble.learner,
  .chat-bubble.ai,
  .chat-action {
    margin-left: 0;
    margin-right: 0;
  }
}
`;