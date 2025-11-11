import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Building2, User, Mail, Lock, Phone, MapPin, FileText } from 'lucide-react';
import useRegistration from '../../../hooks/useRegistration';
import "./register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        organizationName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        contactPhone: '',
        address: '',
        description: ''
    });

    const { registerOrganization, loading, error } = useRegistration();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Form submitted with data:', formData);

        // Client-side validation
        if (formData.password !== formData.confirmPassword) {
            console.error('Passwords do not match');
            return;
        }

        // Call the registration hook
        const result = await registerOrganization(formData);

        console.log('Registration result:', result);

        // If successful, navigation happens in the hook
        // If failed, error state is set and displayed below
    };

    return (
        <div className="register-page">
            <div className="register-purple-lines">
                <div className="register-line register-line-1"></div>
                <div className="register-line register-line-2"></div>
                <div className="register-line register-line-3"></div>
            </div>

            <div className="register-container">
                <div className="register-card register-glass">
                    <div className="register-header">
                        <div className="register-logo">
                            <Sparkles className="register-logo-icon" />
                            <span>TeamSync Pro</span>
                        </div>
                        <h2 className="register-title">Create Your Organization</h2>
                        <p className="register-subtitle">Start your free workspace in 2 minutes</p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        {/* Organization Details */}
                        <div className="register-section">
                            <h3 className="register-section-title">Organization Details</h3>

                            <div className="register-form-group">
                                <label htmlFor="organizationName" className="register-label">
                                    <Building2 size={16} />
                                    Organization Name
                                </label>
                                <input
                                    type="text"
                                    id="organizationName"
                                    name="organizationName"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your Company Name"
                                    className="register-input"
                                />
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="description" className="register-label">
                                    <FileText size={16} />
                                    Description (Optional)
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Brief description of your organization"
                                    className="register-input register-textarea"
                                    rows="3"
                                />
                            </div>

                            <div className="register-form-row">
                                <div className="register-form-group">
                                    <label htmlFor="contactPhone" className="register-label">
                                        <Phone size={16} />
                                        Phone (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        id="contactPhone"
                                        name="contactPhone"
                                        value={formData.contactPhone}
                                        onChange={handleChange}
                                        placeholder="+1 (555) 000-0000"
                                        className="register-input"
                                    />
                                </div>

                                <div className="register-form-group">
                                    <label htmlFor="address" className="register-label">
                                        <MapPin size={16} />
                                        Address (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="City, Country"
                                        className="register-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Manager Account */}
                        <div className="register-section">
                            <h3 className="register-section-title">Manager Account</h3>

                            <div className="register-form-row">
                                <div className="register-form-group">
                                    <label htmlFor="name" className="register-label">
                                        <User size={16} />
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="First name"
                                        className="register-input"
                                    />
                                </div>

                                <div className="register-form-group">
                                    <label htmlFor="surname" className="register-label">
                                        <User size={16} />
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="surname"
                                        name="surname"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        required
                                        placeholder="Last name"
                                        className="register-input"
                                    />
                                </div>
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="username" className="register-label">
                                    <User size={16} />
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    placeholder="Choose a username"
                                    className="register-input"
                                />
                            </div>

                            <div className="register-form-group">
                                <label htmlFor="email" className="register-label">
                                    <Mail size={16} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your.email@company.com"
                                    className="register-input"
                                />
                            </div>

                            <div className="register-form-row">
                                <div className="register-form-group">
                                    <label htmlFor="password" className="register-label">
                                        <Lock size={16} />
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Create a password"
                                        className="register-input"
                                        minLength="6"
                                    />
                                </div>

                                <div className="register-form-group">
                                    <label htmlFor="confirmPassword" className="register-label">
                                        <Lock size={16} />
                                        Confirm Password
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                        placeholder="Confirm password"
                                        className="register-input"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="register-error">
                                {error}
                            </div>
                        )}

                        {/* Password mismatch warning */}
                        {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                            <div className="register-error">
                                Passwords do not match
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || (formData.password !== formData.confirmPassword && formData.confirmPassword)}
                            className="register-submit-btn"
                        >
                            {loading ? 'Creating Organization...' : 'Create Organization'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <p className="register-login-link">
                        Already have an account? <Link to="/portal">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;