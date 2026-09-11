import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthProvider";
import { useNotification } from "../../../providers/NotificationProvider";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Input from "../../../components/forms/Input";
import Checkbox from "../../../components/forms/Checkbox";

// Brand SVGs for luxury presentation
const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M44.5 20H24V28H36.8C35.4 34.1 30.1 38.2 24 38.2C15.8 38.2 9.1 31.5 9.1 23.3C9.1 15.1 15.8 8.4 24 8.4C27.7 8.4 31.1 9.8 33.7 12.5L40.2 6C36 1.9 30.2 0 24 0C10.7 0 0 10.7 0 24C0 37.3 10.7 48 24 48C38.1 48 48 38.1 48 24C48 22.4 47.8 20.8 47.4 19.3H44.5Z" fill="#4285F4"/>
    <path d="M6.3 14.9L12 18.7C13.7 14.7 18.4 11.6 24 11.6C27.7 11.6 31.1 12.9 33.7 15.6L40.2 9.1C36 4.9 30.2 3 24 3C17 3 10.5 6.4 6.3 11.6V14.9Z" fill="#34A853"/>
    <path d="M24 44.4C30.1 44.4 35.4 40.3 36.8 34.2L29.5 30.9C28.2 33.1 26.2 34.4 24 34.4C18.4 34.4 13.7 31.3 12 27.3L6.3 31.1C8.9 37.3 15.4 44.4 24 44.4Z" fill="#FBBC05"/>
    <path d="M44.5 20H24V28H36.8C35.4 34.1 30.1 38.2 24 38.2C18.4 38.2 13.7 35.1 12 31.1L6.3 34.9C9.5 40.1 16.4 44.4 24 44.4C38.1 44.4 48 34.5 48 20C48 19.3 47.9 18.6 47.7 17.9L44.5 20Z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="9" height="9" fill="#F35325" />
    <rect x="13" y="2" width="9" height="9" fill="#81BC06" />
    <rect x="2" y="13" width="9" height="9" fill="#05A6F0" />
    <rect x="13" y="13" width="9" height="9" fill="#FFBA08" />
  </svg>
);

const AppleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.365 1.43c-1.134.014-2.48.756-3.28 1.69-.71.82-1.33 2.1-1.08 3.34 1.16.04 2.54-.74 3.35-1.63.73-.79 1.3-2.06 1.01-3.4z" fill="#000"/>
    <path d="M20.694 8.837c-.11-.27-.22-.55-.37-.82-.74-1.39-2.07-2.34-3.51-2.43-1.49-.1-2.92.88-3.68.88-.77 0-2.02-.84-3.33-.82-1.73.02-3.34 1.02-4.23 2.59-1.82 3.25-.47 8.07 1.32 10.7.87 1.35 1.9 2.86 3.25 2.8 1.29-.06 1.78-.84 3.34-.84 1.57 0 2.01.84 3.33.8 1.41-.04 2.3-1.37 3.18-2.74 1.03-1.57 1.46-3.1 1.48-3.18-.03-.01-2.86-1.1-2.9-4.36-.04-2.97 2.56-4.42 2.62-4.49z" fill="#000"/>
  </svg>
);

import AuthLayout from '../../../layouts/AuthLayout';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [activePortal, setActivePortal] = useState("CLINICAL"); // CLINICAL or CLIENT
  const [ssoProvider, setSsoProvider] = useState(null); // 'google' | 'microsoft' | 'apple' | null
  const [ssoLoading, setSsoLoading] = useState(false);
  const [ssoLoadingText, setSsoLoadingText] = useState("");

  const { login } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  // Testimonials rotation
  const testimonials = [
    {
      text: "MindCare has streamlined our clinical intake, reducing admin overhead by 40% and letting us focus entirely on client care.",
      author: "Dr. Robert Chen, PsyD",
      role: "Clinical Director, Hope Pathways",
    },
    {
      text: "The HIPAA-compliant secure messaging and automatic outcome scoring have completely transformed how we measure CBT progress.",
      author: "Sarah Jenkins, LCSW",
      role: "Lead Psychotherapist, Valley Health",
    },
    {
      text: "As a supervisor, having the pending co-signatures queue and supervisor notes integrated saves me hours of coordination every week.",
      author: "Dr. Patricia Williams, LMFT",
      role: "Clinical Supervisor",
    },
  ];
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    // Rotation removed per user request for stable page
  }, []);

  const demoAccounts = [
    {
      email: "admin@mindcare.com",
      password: "admin123",
      role: "System Administrator",
      name: "Sarah Mitchell",
      portal: "CLINICAL",
    },
    {
      email: "psychiatrist@mindcare.com",
      password: "psychiatrist123",
      role: "Psychiatrist",
      name: "Dr. Mark Rivera, MD",
      portal: "CLINICAL",
    },
    {
      email: "psychologist@mindcare.com",
      password: "psychologist123",
      role: "Psychologist",
      name: "Dr. Maya Patel, PsyD",
      portal: "CLINICAL",
    },
    {
      email: "therapist@mindcare.com",
      password: "therapist123",
      role: "Therapist",
      name: "Dr. Sarah Chen, LCSW",
      portal: "CLINICAL",
    },
    {
      email: "supervisor@mindcare.com",
      password: "supervisor123",
      role: "Supervisor",
      name: "Dr. Patricia Williams",
      portal: "CLINICAL",
    },
    {
      email: "case_manager@mindcare.com",
      password: "case123",
      role: "Case Manager",
      name: "Robert Davis",
      portal: "CLINICAL",
    },
    {
      email: "receptionist@mindcare.com",
      password: "receptionist123",
      role: "Receptionist",
      name: "Jennifer Adams",
      portal: "CLINICAL",
    },
    {
      email: "client@mindcare.com",
      password: "client123",
      role: "Client",
      name: "Alex Morgan",
      portal: "CLIENT",
    },
  ];

  // Enterprise SSO accounts mapping to backend credentials
  const googleSSOAccounts = [
    {
      name: "Dr. Mark Rivera, MD",
      ssoEmail: "m.rivera@mindcarehealth.org",
      systemEmail: "psychiatrist@mindcare.com",
      password: "psychiatrist123",
      role: "Psychiatrist",
      title: "Attending Psychiatrist",
      badge: "MD / Staff Physician",
      avatarBg: "#4285F4",
      portal: "CLINICAL",
    },
    {
      name: "Dr. Maya Patel, PsyD",
      ssoEmail: "m.patel@mindcarehealth.org",
      systemEmail: "psychologist@mindcare.com",
      password: "psychologist123",
      role: "Psychologist",
      title: "Clinical Psychologist",
      badge: "PsyD / Lead Evaluator",
      avatarBg: "#34A853",
      portal: "CLINICAL",
    },
    {
      name: "Dr. Sarah Chen, LCSW",
      ssoEmail: "s.chen@mindcarehealth.org",
      systemEmail: "therapist@mindcare.com",
      password: "therapist123",
      role: "Therapist",
      title: "Licensed Psychotherapist",
      badge: "LCSW / Outpatient",
      avatarBg: "#FBBC05",
      portal: "CLINICAL",
    },
    {
      name: "Sarah Mitchell",
      ssoEmail: "s.mitchell@mindcarehealth.org",
      systemEmail: "admin@mindcare.com",
      password: "admin123",
      role: "System Administrator",
      title: "IT & Compliance Director",
      badge: "HIPAA Security Officer",
      avatarBg: "#EA4335",
      portal: "CLINICAL",
    },
  ];

  const microsoftSSOAccounts = [
    {
      name: "Dr. Mark Rivera, MD",
      ssoEmail: "mark.rivera@mindcare.onmicrosoft.com",
      systemEmail: "psychiatrist@mindcare.com",
      password: "psychiatrist123",
      role: "Psychiatrist",
      title: "Attending Psychiatrist",
      badge: "Azure AD Healthcare",
      avatarBg: "#0078D4",
      portal: "CLINICAL",
    },
    {
      name: "Dr. Patricia Williams",
      ssoEmail: "patricia.williams@mindcare.onmicrosoft.com",
      systemEmail: "supervisor@mindcare.com",
      password: "supervisor123",
      role: "Supervisor",
      title: "Clinical Supervisor",
      badge: "LMFT / Direct Supervision",
      avatarBg: "#81BC06",
      portal: "CLINICAL",
    },
    {
      name: "Jennifer Adams",
      ssoEmail: "jennifer.adams@mindcare.onmicrosoft.com",
      systemEmail: "receptionist@mindcare.com",
      password: "receptionist123",
      role: "Receptionist",
      title: "Front Desk Coordinator",
      badge: "Patient Intake & Scheduling",
      avatarBg: "#F35325",
      portal: "CLINICAL",
    },
    {
      name: "Robert Davis",
      ssoEmail: "robert.davis@mindcare.onmicrosoft.com",
      systemEmail: "case_manager@mindcare.com",
      password: "case123",
      role: "Case Manager",
      title: "Care Coordinator",
      badge: "Social Services & Referrals",
      avatarBg: "#FFBA08",
      portal: "CLINICAL",
    },
  ];

  const appleSSOAccounts = [
    {
      name: "Alex Morgan",
      ssoEmail: "alex.morgan@privaterelay.appleid.com",
      systemEmail: "client@mindcare.com",
      password: "client123",
      role: "Client",
      title: "Patient / Client Account",
      badge: "Patient Portal · Private Relay",
      avatarBg: "#111827",
      portal: "CLIENT",
    },
  ];

  const ssoConfigs = {
    google: {
      provider: "Google Workspace for Healthcare",
      tagline: "Enterprise SAML 2.0 & OAuth Federated Authentication",
      tenantBadge: "Google Cloud Healthcare API · Verified",
      icon: <GoogleIcon />,
      accentColor: "#4285F4",
      officialUrl: "https://accounts.google.com",
      accounts: googleSSOAccounts,
    },
    microsoft: {
      provider: "Microsoft Entra ID (Azure AD)",
      tagline: "Office 365 Healthcare Directory & Federated Identity",
      tenantBadge: "Microsoft Cloud for Healthcare · Verified",
      icon: <MicrosoftIcon />,
      accentColor: "#0078D4",
      officialUrl: "https://login.microsoftonline.com",
      accounts: microsoftSSOAccounts,
    },
    apple: {
      provider: "Sign in with Apple",
      tagline: "Biometric Client Authentication & Private Relay",
      tenantBadge: "HIPAA Compliant Patient Gateway",
      icon: <AppleIcon />,
      accentColor: "#111827",
      officialUrl: "https://appleid.apple.com",
      accounts: appleSSOAccounts,
    },
  };

  const validate = () => {
    const errs = {};
    if (!email) errs.email = "Username or Email is required";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6)
      errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result && result.role) {
        addToast(
          "success",
          "Welcome back!",
          `Signed in as ${result.firstName} ${result.lastName}`,
        );
        navigate(result.role === "CLIENT" ? "/client/dashboard" : "/dashboard");
      } else {
        setErrors({ general: "Invalid email or password" });
        addToast("error", "Login Failed", "Invalid credentials");
      }
    } catch (err) {
      setErrors({ general: err.message || "Invalid email or password" });
      addToast("error", "Login Failed", err.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setActivePortal(account.portal);
    setErrors({});
  };

  const handleExecuteSSO = async (account, providerName) => {
    setSsoLoading(true);
    setSsoLoadingText(`Connecting to ${providerName} Secure Identity Provider...`);
    try {
      await new Promise((resolve) => setTimeout(resolve, 550));
      setSsoLoadingText(`Authorizing ${account.name} via ${providerName}...`);
      await new Promise((resolve) => setTimeout(resolve, 450));

      const result = await login(account.systemEmail, account.password);
      if (result && result.role) {
        addToast(
          "success",
          `${providerName} SSO Connected`,
          `Welcome back, ${account.name}!`
        );
        setSsoProvider(null);
        navigate(result.role === "CLIENT" ? "/client/dashboard" : "/dashboard");
      } else {
        addToast("error", `${providerName} SSO Failed`, "Account verification failed");
      }
    } catch (err) {
      addToast("error", `${providerName} SSO Error`, err.message || "SSO Authentication failed");
    } finally {
      setSsoLoading(false);
      setSsoLoadingText("");
    }
  };

  const handleSocialClick = (provider) => {
    const officialUrls = {
      google: "https://accounts.google.com",
      microsoft: "https://login.microsoftonline.com",
      apple: "https://appleid.apple.com",
    };
    const names = {
      google: "Google",
      microsoft: "Microsoft",
      apple: "Apple",
    };
    const url = officialUrls[provider];
    if (url) {
      addToast(
        "info",
        `Official ${names[provider]} Portal`,
        `Opening official ${names[provider]} website in a new tab...`
      );
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
    <AuthLayout>
      <div className="mc-luxury-card">
            <div className="mc-auth-form-header" style={{ marginBottom: 16 }}>
              <h2
                style={{
                  fontWeight: 800,
                  color: "#101828",
                  fontSize: 18,
                  letterSpacing: "-0.5px",
                }}
              >
                {activePortal === "CLINICAL"
                  ? "Clinician Practice Gateway 🧠"
                  : "Client Wellness Portal 🌿"}
              </h2>
              <p
                style={{
                  color: "#475467",
                  fontSize: 12,
                  marginTop: 4,
                  lineHeight: 1.4,
                }}
              >
                Securely sign in to access your therapy practice and clinical
                dashboard.
              </p>
            </div>

            {/* Portal Switcher Tabs */}
            <div
              style={{
                display: "flex",
                background: "#F2F4F7",
                borderRadius: 8,
                padding: 3,
                marginBottom: 16,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setActivePortal("CLINICAL");
                  setErrors({});
                }}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  background:
                    activePortal === "CLINICAL" ? "white" : "transparent",
                  color: activePortal === "CLINICAL" ? "#4338CA" : "#667085",
                  boxShadow:
                    activePortal === "CLINICAL"
                      ? "0 1px 3px rgba(16, 24, 40, 0.05)"
                      : "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Clinician Hub
              </button>
              <button
                type="button"
                onClick={() => {
                  setActivePortal("CLIENT");
                  setErrors({});
                }}
                style={{
                  flex: 1,
                  padding: "8px 10px",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 600,
                  background:
                    activePortal === "CLIENT" ? "white" : "transparent",
                  color: activePortal === "CLIENT" ? "#4338CA" : "#667085",
                  boxShadow:
                    activePortal === "CLIENT"
                      ? "0 1px 3px rgba(16, 24, 40, 0.05)"
                      : "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                Client Portal
              </button>
            </div>

            {errors.general && (
              <div
                style={{
                  padding: "8px 12px",
                  background: "var(--color-danger-light)",
                  border: "1px solid var(--color-danger-bg)",
                  borderRadius: 8,
                  color: "var(--color-danger)",
                  fontSize: 11,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <LockOutlinedIcon style={{ fontSize: 12 }} />
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#344054",
                    marginBottom: 4,
                  }}
                >
                  Username / Email <span style={{ color: "red" }}>*</span>
                </label>
                <Input
                  icon={<EmailOutlinedIcon style={{ fontSize: 16 }} />}
                  type="text"
                  placeholder="Username or Email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: null }));
                  }}
                  autoComplete="email"
                  error={errors.email}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#344054",
                    marginBottom: 4,
                  }}
                >
                  Password <span style={{ color: "red" }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <Input
                    icon={<LockOutlinedIcon style={{ fontSize: 16 }} />}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors((prev) => ({ ...prev, password: null }));
                    }}
                    autoComplete="current-password"
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 14,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#98A2B3",
                      padding: 4,
                      display: "flex",
                    }}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon style={{ fontSize: 16 }} />
                    ) : (
                      <VisibilityOutlinedIcon style={{ fontSize: 16 }} />
                    )}
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Checkbox label="Remember me" />
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#4338CA",
                    textDecoration: "none",
                  }}
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="mc-luxury-btn-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span
                      className="mc-spinner"
                      style={{
                        width: 14,
                        height: 14,
                        borderWidth: 2,
                        borderColor: "white",
                        borderTopColor: "transparent",
                      }}
                    ></span>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div
              style={{
                margin: "14px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <span
                style={{ flex: 1, height: 1, background: "#EAECF0" }}
              ></span>
              <span style={{ fontSize: 10, color: "#98A2B3", fontWeight: 500 }}>
                OR CONTINUE WITH
              </span>
              <span
                style={{ flex: 1, height: 1, background: "#EAECF0" }}
              ></span>
            </div>

            {/* Social Logins */}
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <button
                type="button"
                className="mc-luxury-btn-social"
                style={{ flex: 1, height: 38, gap: 4, fontSize: 11 }}
                onClick={() => handleSocialClick("google")}
                title="Open official Google Sign-In website (accounts.google.com)"
              >
                <GoogleIcon /> Google
              </button>
              <button
                type="button"
                className="mc-luxury-btn-social"
                style={{ flex: 1, height: 38, gap: 4, fontSize: 11 }}
                onClick={() => handleSocialClick("microsoft")}
                title="Open official Microsoft Sign-In website (login.microsoftonline.com)"
              >
                <MicrosoftIcon /> Microsoft
              </button>
              <button
                type="button"
                className="mc-luxury-btn-social"
                style={{ flex: 1, height: 38, gap: 4, fontSize: 11 }}
                onClick={() => handleSocialClick("apple")}
                title="Open official Apple ID website (appleid.apple.com)"
              >
                <AppleIcon /> Apple
              </button>
            </div>

            <div
              className="mc-auth-form-footer"
              style={{
                marginTop: 12,
                fontSize: 11,
                color: "#667085",
                textAlign: "center",
              }}
            >
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "#4338CA",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Create account
              </Link>
            </div>

            {/* Sandbox Button to Trigger Modal */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 10,
                borderTop: "1px solid #EAECF0",
                paddingTop: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setShowSandboxModal(true)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#4338CA",
                  fontSize: 10,
                  fontWeight: 600,
                  textDecoration: "underline",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                ⚙️ Open Dev Sandbox Accounts
              </button>
            </div>

            {/* HIPAA Compliance badges */}
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: 12,
                borderTop: "1px solid #EAECF0",
                paddingTop: 10,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 9,
                  color: "#667085",
                  fontWeight: 500,
                }}
              >
                <ShieldOutlinedIcon
                  style={{ fontSize: 12, color: "#4338CA" }}
                />{" "}
                E2EE Secure
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 9,
                  color: "#667085",
                  fontWeight: 500,
                }}
              >
                <SecurityOutlinedIcon
                  style={{ fontSize: 12, color: "#4338CA" }}
                />{" "}
                RBAC Admin
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 9,
                  color: "#667085",
                  fontWeight: 500,
                }}
              >
                <CheckCircleOutlinedIcon
                  style={{ fontSize: 12, color: "#4338CA" }}
                />{" "}
                HIPAA Notice
              </span>
            </div>
          </div>
      </AuthLayout>
      {/* Sandbox Drawer Modal overlay */}
      {showSandboxModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 20,
              borderRadius: 16,
              width: "100%",
              maxWidth: 400,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "1px solid #EAECF0",
              animation: "cardFadeIn 0.3s ease-out",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#1D2939",
                }}
              >
                ⚙️ Dev Sandbox Console
              </h3>
              <button
                type="button"
                onClick={() => setShowSandboxModal(false)}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#667085",
                  padding: 4,
                }}
              >
                &times;
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#667085", marginBottom: 12 }}>
              Click any profile below to instantly pre-fill login credentials.
            </p>
            <div
              style={{
                display: "grid",
                gap: 5,
                maxHeight: 220,
                overflowY: "auto",
                paddingRight: 4,
              }}
            >
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    handleDemoLogin(account);
                    setShowSandboxModal(false);
                  }}
                  style={{
                    background: "white",
                    border: "1px solid #EAECF0",
                    borderRadius: 6,
                    padding: "6px 10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: 10,
                    color: "#1D2939",
                    width: "100%",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#EEF2FF";
                    e.currentTarget.style.borderColor = "#4338CA";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                    e.currentTarget.style.borderColor = "#EAECF0";
                  }}
                >
                  <div style={{ textAlign: "left" }}>
                    <strong style={{ display: "block", fontSize: 10 }}>
                      {account.name}
                    </strong>
                    <span style={{ fontSize: 8, color: "#667085" }}>
                      {account.email}
                    </span>
                  </div>
                  <span
                    className="mc-badge mc-badge-default"
                    style={{ fontSize: 8 }}
                  >
                    {account.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enterprise Single Sign-On (SSO) Modal */}
      {ssoProvider && ssoConfigs[ssoProvider] && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.72)",
            backdropFilter: "blur(6px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !ssoLoading) {
              setSsoProvider(null);
            }
          }}
        >
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              width: "100%",
              maxWidth: 460,
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.35)",
              border: "1px solid #E2E8F0",
              overflow: "hidden",
              position: "relative",
              animation: "cardFadeIn 0.25s ease-out",
            }}
          >
            {/* Top accent bar */}
            <div
              style={{
                height: 4,
                width: "100%",
                background: ssoConfigs[ssoProvider].accentColor,
              }}
            />

            {/* Modal Header */}
            <div
              style={{
                padding: "16px 20px 14px",
                borderBottom: "1px solid #F1F5F9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {ssoConfigs[ssoProvider].icon}
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0F172A",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    {ssoConfigs[ssoProvider].provider}
                  </h3>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748B",
                      marginTop: 2,
                    }}
                  >
                    {ssoConfigs[ssoProvider].tagline}
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={ssoLoading}
                onClick={() => setSsoProvider(null)}
                style={{
                  border: "none",
                  background: "#F1F5F9",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  cursor: ssoLoading ? "not-allowed" : "pointer",
                  color: "#64748B",
                  transition: "all 0.15s ease",
                }}
              >
                &times;
              </button>
            </div>

            {/* Tenant / Compliance Pill */}
            <div
              style={{
                background: "#F8FAFC",
                padding: "8px 20px",
                borderBottom: "1px solid #F1F5F9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#334155",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <ShieldOutlinedIcon style={{ fontSize: 13, color: "#4338CA" }} />
                {ssoConfigs[ssoProvider].tenantBadge}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <a
                  href={ssoConfigs[ssoProvider].officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#1E40AF",
                    background: "#EFF6FF",
                    padding: "3px 8px",
                    borderRadius: 6,
                    border: "1px solid #BFDBFE",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                  title={`Open official ${ssoConfigs[ssoProvider].provider} login`}
                >
                  🌐 Official Web &rarr;
                </a>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 600,
                    color: "#059669",
                    background: "#ECFDF5",
                    padding: "2px 8px",
                    borderRadius: 9999,
                    border: "1px solid #A7F3D0",
                  }}
                >
                  Ready for SSO
                </span>
              </div>
            </div>

            {/* Body / Account List */}
            <div style={{ padding: "16px 20px" }}>
              <p
                style={{
                  margin: "0 0 12px 0",
                  fontSize: 11,
                  color: "#475467",
                  fontWeight: 500,
                }}
              >
                Select an authorized profile to authenticate with{" "}
                <strong>{ssoConfigs[ssoProvider].provider}</strong>:
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  maxHeight: 260,
                  overflowY: "auto",
                  paddingRight: 2,
                }}
              >
                {ssoConfigs[ssoProvider].accounts.map((acc, index) => (
                  <button
                    key={acc.ssoEmail || index}
                    type="button"
                    disabled={ssoLoading}
                    onClick={() =>
                      handleExecuteSSO(acc, ssoConfigs[ssoProvider].provider)
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "10px 14px",
                      background: "#FFFFFF",
                      border: "1px solid #E2E8F0",
                      borderRadius: 10,
                      cursor: ssoLoading ? "not-allowed" : "pointer",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => {
                      if (!ssoLoading) {
                        e.currentTarget.style.background = "#F8FAFC";
                        e.currentTarget.style.borderColor = "#4338CA";
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!ssoLoading) {
                        e.currentTarget.style.background = "#FFFFFF";
                        e.currentTarget.style.borderColor = "#E2E8F0";
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    {/* User Avatar Circle */}
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: acc.avatarBg || "#4338CA",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 12,
                        flexShrink: 0,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {acc.name
                        .split(" ")
                        .filter(
                          (p) =>
                            !p.includes("Dr.") &&
                            !p.includes("MD") &&
                            !p.includes("PsyD") &&
                            !p.includes("LCSW")
                        )
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("") || acc.name.slice(0, 2).toUpperCase()}
                    </div>

                    {/* Account Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 6,
                        }}
                      >
                        <span
                          style={{
                            fontWeight: 700,
                            fontSize: 12,
                            color: "#0F172A",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {acc.name}
                        </span>
                        <span
                          className="mc-badge mc-badge-default"
                          style={{
                            fontSize: 9,
                            padding: "2px 6px",
                            whiteSpace: "nowrap",
                            background: "#EEF2FF",
                            color: "#4338CA",
                            border: "1px solid #C7D2FE",
                          }}
                        >
                          {acc.badge}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: 10,
                          color: "#64748B",
                          fontFamily: "monospace",
                          marginTop: 2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {acc.ssoEmail}
                      </div>
                    </div>

                    {/* Action Icon */}
                    <div
                      style={{
                        color: "#94A3B8",
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      &rarr;
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Loading Overlay */}
            {ssoLoading && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255, 255, 255, 0.94)",
                  backdropFilter: "blur(4px)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  zIndex: 20,
                  padding: 24,
                }}
              >
                <div
                  className="mc-spinner"
                  style={{
                    width: 36,
                    height: 36,
                    borderWidth: 3,
                    borderColor: ssoConfigs[ssoProvider].accentColor,
                    borderTopColor: "transparent",
                  }}
                />
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    Enterprise SSO Authentication
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#64748B",
                      marginTop: 4,
                    }}
                  >
                    {ssoLoadingText}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div
              style={{
                padding: "10px 20px 14px",
                borderTop: "1px solid #F1F5F9",
                background: "#FAFAFA",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 10,
                color: "#64748B",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <LockOutlinedIcon style={{ fontSize: 12, color: "#4338CA" }} />
                256-bit TLS Zero-Trust Channel
              </span>
              <button
                type="button"
                disabled={ssoLoading}
                onClick={() => {
                  setSsoProvider(null);
                  setShowSandboxModal(true);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4338CA",
                  cursor: ssoLoading ? "not-allowed" : "pointer",
                  fontSize: 10,
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                Switch to manual sandbox
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
