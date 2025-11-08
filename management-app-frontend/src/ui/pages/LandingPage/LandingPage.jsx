import React, { useState } from 'react';
import {
    Sparkles,
    Zap,
    Shield,
    Users,
    BarChart3,
    CheckCircle2,
    ArrowRight,
    X,
    Clock,
    Target,
    TrendingUp
} from 'lucide-react';
import './LandingPage.css'

const LandingPage = () => {
    const [contactOpen, setContactOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        message: '',
        plan: 'Free'
    });

    const handleContactOpen = (plan = 'Free') => {
        setFormData({ ...formData, plan });
        setContactOpen(true);
    };

    const handleContactClose = () => {
        setContactOpen(false);
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Thank you ${formData.name}! We'll contact you at ${formData.email} to set up your ${formData.plan} plan.`);
        setContactOpen(false);
        setFormData({ name: '', email: '', company: '', message: '', plan: 'Free' });
    };

    return (
        <div className="landing-page">
            <div className="purple-lines">
                <div className="line line-1"></div>
                <div className="line line-2"></div>
                <div className="line line-3"></div>
                <div className="line line-4"></div>
            </div>

            <nav className="nav">
                <div className="container">
                    <div className="nav-content">
                        <div className="logo">
                            <Sparkles className="logo-icon" />
                            <span className="logo-text">TeamSync Pro</span>
                        </div>
                        <button className="btn-outline" onClick={() => handleContactOpen()}>
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            <section className="hero">
                <div className="container">
                    <div className="hero-content">
                        <div className="badge">
                            <Zap size={14} />
                            <span>Zero Clutter. Maximum Focus.</span>
                        </div>
                        <h1 className="hero-title">
                            Crisp workflows.
                            <br />
                            <span className="gradient-text">Zero noise.</span>
                        </h1>
                        <p className="hero-description">
                            A minimalist workspace with morphism design. Keep tasks, clients, and teams
                            synchronized without visual chaos. Built for modern teams who value clarity.
                        </p>
                        <div className="hero-cta">
                            <button className="btn-primary" onClick={() => handleContactOpen('Free')}>
                                Start Free
                                <ArrowRight size={18} />
                            </button>
                            <button className="btn-ghost">View Demo</button>
                        </div>
                        <div className="hero-stats">
                            <div className="stat">
                                <CheckCircle2 size={16} />
                                <span>No credit card</span>
                            </div>
                            <div className="stat">
                                <Clock size={16} />
                                <span>Setup in 2 mins</span>
                            </div>
                            <div className="stat">
                                <Shield size={16} />
                                <span>Enterprise secure</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="features">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">FEATURES</span>
                        <h2 className="section-title">Everything you need to stay in sync</h2>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card glass">
                            <div className="feature-icon purple">
                                <Target size={28} />
                            </div>
                            <h3 className="feature-title">Task Management</h3>
                            <p className="feature-description">
                                Assign, track, and complete work with clarity. No bloat, just pure productivity.
                            </p>
                            <ul className="feature-list">
                                <li><CheckCircle2 size={16} />Clear status indicators</li>
                                <li><CheckCircle2 size={16} />Smart assignments</li>
                                <li><CheckCircle2 size={16} />Deadline tracking</li>
                            </ul>
                        </div>

                        <div className="feature-card glass">
                            <div className="feature-icon purple">
                                <Users size={28} />
                            </div>
                            <h3 className="feature-title">Team Collaboration</h3>
                            <p className="feature-description">
                                Isolated workspaces with role-based access. Admins lead, teams execute.
                            </p>
                            <ul className="feature-list">
                                <li><CheckCircle2 size={16} />Secure org spaces</li>
                                <li><CheckCircle2 size={16} />Role management</li>
                                <li><CheckCircle2 size={16} />Real-time updates</li>
                            </ul>
                        </div>

                        <div className="feature-card glass">
                            <div className="feature-icon purple">
                                <BarChart3 size={28} />
                            </div>
                            <h3 className="feature-title">Live Analytics</h3>
                            <p className="feature-description">
                                Data-driven decisions with beautiful dashboards. Track trends at a glance.
                            </p>
                            <ul className="feature-list">
                                <li><CheckCircle2 size={16} />Real-time metrics</li>
                                <li><CheckCircle2 size={16} />Performance insights</li>
                                <li><CheckCircle2 size={16} />Team workload</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="showcase">
                <div className="container">
                    <div className="showcase-grid">
                        <div className="showcase-visual">
                            <div className="mockup glass">
                                <div className="mockup-header">
                                    <div className="dots">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                                <div className="mockup-body">
                                    <div className="progress-bars">
                                        <div className="progress-item">
                                            <div className="progress-label">Completed</div>
                                            <div className="progress-bar">
                                                <div className="progress-fill complete"></div>
                                            </div>
                                        </div>
                                        <div className="progress-item">
                                            <div className="progress-label">In Progress</div>
                                            <div className="progress-bar">
                                                <div className="progress-fill active"></div>
                                            </div>
                                        </div>
                                        <div className="progress-item">
                                            <div className="progress-label">Pending</div>
                                            <div className="progress-bar">
                                                <div className="progress-fill pending"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="stats-grid">
                                        <div className="stat-box">
                                            <TrendingUp size={20} className="stat-icon" />
                                            <div className="stat-value">+24%</div>
                                        </div>
                                        <div className="stat-box">
                                            <Target size={20} className="stat-icon" />
                                            <div className="stat-value">127</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="showcase-content">
                            <span className="section-badge">PERFORMANCE</span>
                            <h2 className="showcase-title">Built for speed and clarity</h2>
                            <p className="showcase-description">
                                Every interaction is instant. Every view is clean. Our morphism design creates
                                depth without distraction, letting you focus on what matters.
                            </p>
                            <div className="showcase-points">
                                <div className="point">
                                    <div className="point-icon purple">
                                        <Zap size={18} />
                                    </div>
                                    <div>
                                        <h4>Lightning Fast</h4>
                                        <p>Sub-100ms response times</p>
                                    </div>
                                </div>
                                <div className="point">
                                    <div className="point-icon purple">
                                        <Shield size={18} />
                                    </div>
                                    <div>
                                        <h4>Bank-Level Security</h4>
                                        <p>End-to-end encryption</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pricing">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">PRICING</span>
                        <h2 className="section-title">Choose your plan</h2>
                        <p className="section-description">Start free. Scale when ready.</p>
                    </div>

                    <div className="pricing-grid">
                        <div className="pricing-card glass">
                            <div className="pricing-header">
                                <h3 className="pricing-name">Free</h3>
                                <div className="pricing-price">
                                    <span className="price">$0</span>
                                    <span className="period">/month</span>
                                </div>
                            </div>
                            <p className="pricing-description">Perfect for small teams getting started</p>
                            <ul className="pricing-features">
                                <li><CheckCircle2 size={16} />Unlimited tasks</li>
                                <li><CheckCircle2 size={16} />Client management</li>
                                <li><CheckCircle2 size={16} />Role-based access</li>
                                <li><CheckCircle2 size={16} />Real-time analytics</li>
                                <li><CheckCircle2 size={16} />Comments & notifications</li>
                                <li><CheckCircle2 size={16} />Secure authentication</li>
                                <li><CheckCircle2 size={16} />Email support</li>
                            </ul>
                            <button className="btn-outline full" onClick={() => handleContactOpen('Free')}>
                                Get Started
                            </button>
                        </div>

                        <div className="pricing-card glass featured">
                            <div className="popular-badge">Coming Soon</div>
                            <div className="pricing-header">
                                <h3 className="pricing-name">Pro</h3>
                                <div className="pricing-price">
                                    <span className="price">Custom</span>
                                </div>
                            </div>
                            <p className="pricing-description">Advanced features for growing teams</p>
                            <ul className="pricing-features">
                                <li><CheckCircle2 size={16} />Everything in Free</li>
                                <li><CheckCircle2 size={16} />Automation & recurring tasks</li>
                                <li><CheckCircle2 size={16} />AI-powered suggestions</li>
                                <li><CheckCircle2 size={16} />Calendar integration</li>
                                <li><CheckCircle2 size={16} />Client portal access</li>
                                <li><CheckCircle2 size={16} />Advanced reporting</li>
                                <li><CheckCircle2 size={16} />File attachments</li>
                                <li><CheckCircle2 size={16} />Time tracking</li>
                                <li><CheckCircle2 size={16} />Priority support</li>
                            </ul>
                            <button className="btn-primary full" onClick={() => handleContactOpen('Pro')}>
                                Contact Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="cta">
                <div className="container">
                    <div className="cta-box glass">
                        <div className="cta-glow"></div>
                        <h2 className="cta-title">Ready to sync your team?</h2>
                        <p className="cta-description">
                            Join teams who've ditched the chaos for clarity. Setup takes 2 minutes.
                        </p>
                        <button className="btn-primary large" onClick={() => handleContactOpen()}>
                            Start Free Today
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <Sparkles size={24} />
                            <span>TeamSync Pro</span>
                        </div>
                        <p className="footer-copy">© 2025 TeamSync Pro. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {contactOpen && (
                <div className="modal-overlay" onClick={handleContactClose}>
                    <div className="modal glass" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={handleContactClose}>
                            <X size={20} />
                        </button>
                        <h3 className="modal-title">Let's set up your {formData.plan} plan</h3>
                        <p className="modal-description">
                            Tell us about your team. We'll prepare your workspace and reach out within 24 hours.
                        </p>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                                className="input"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleFormChange}
                                required
                                className="input"
                            />
                            <input
                                type="text"
                                name="company"
                                placeholder="Company Name"
                                value={formData.company}
                                onChange={handleFormChange}
                                required
                                className="input"
                            />
                            <textarea
                                name="message"
                                placeholder="Tell us about your needs (optional)"
                                value={formData.message}
                                onChange={handleFormChange}
                                rows="4"
                                className="input"
                            />
                            <button type="submit" className="btn-primary full">
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LandingPage;
