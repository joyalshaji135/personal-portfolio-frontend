import { ExternalLink, Send, Github, Linkedin, Globe } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { contactService } from "../services/public-api/contactService";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const fade = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

// Icon mapping for social links
const getSocialIcon = (iconName) => {
  const icons = {
    github: <FaGithub className="text-2xl" />,
    linkedin: <FaLinkedin className="text-2xl text-blue-400" />,
    website: <Globe className="text-2xl text-[#27CBCB]" />,
    twitter: <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    youtube: <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
    instagram: <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  };
  return icons[iconName?.toLowerCase()] || <Globe className="text-2xl text-gray-400" />;
};

// Get social link display name
const getSocialDisplayName = (name) => {
  const names = {
    github: "GitHub",
    linkedin: "LinkedIn",
    website: "Portfolio",
    twitter: "Twitter",
    youtube: "YouTube",
    instagram: "Instagram",
  };
  return names[name?.toLowerCase()] || name || "Website";
};

const Contact = () => {
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true);
        const response = await contactService.getPublicContact();
        if (response.status && response.data) {
          setContactData(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching contact data:', err);
        setError('Failed to load contact data');
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name is required";
    else if (form.name.trim().length < 2) e.name = "Name too short";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Invalid email";

    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 10) e.message = "Message too short";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setFormLoading(true);

    try {
      const res = await fetch(`${API_BASE}/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setForm({ name: "", email: "", message: "" });
      setToast("Message sent successfully ✓");
    } catch {
      setToast("Failed to send message");
    } finally {
      setFormLoading(false);
    }
  };

  // Use data from API or fallback to defaults
  const data = contactData || {};
  const heading = data.heading || "Let's work together";
  const description = data.description || "Have an opportunity or project in mind? Send a quick message - I usually respond within 24 hours.";
  const socials = data.socials || [];

  if (loading) {
    return (
      <section className="relative px-4 sm:px-6 md:px-8 mx-auto py-20 max-w-6xl min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#27CBCB]"></div>
          <p className="text-gray-400 font-mono text-sm">Loading contact...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative px-4 sm:px-6 md:px-8 mx-auto py-20 max-w-6xl min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-red-400 text-4xl">⚠️</div>
          <p className="text-gray-400 font-mono text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#27CBCB]/20 text-[#27CBCB] rounded-lg hover:bg-[#27CBCB]/30 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative px-4 sm:px-6 md:px-8 mx-auto py-20 max-w-6xl">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(39,203,203,0.08),transparent_40%)]" />

      <div className="grid md:grid-cols-2 gap-16 items-center">
        <motion.div variants={fade} initial="hidden" whileInView="show">
          <h2 className="text-5xl font-bold leading-tight text-transparent bg-clip-text bg-linear-to-r from-gray-100 to-gray-400">
            {heading}
          </h2>

          <p className="mt-6 text-gray-400 max-w-md text-lg">
            {description}
          </p>

          <div className="mt-10 space-y-4">
            {socials.map((social) => (
              <motion.a
                key={social._id}
                whileHover={{ x: 6 }}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-800 bg-gray-900/40 backdrop-blur-sm hover:border-[#27CBCB]/30 transition-colors"
              >
                <span className="text-2xl">
                  {getSocialIcon(social.icon)}
                </span>
                <div>
                  <p className="font-medium text-gray-200">
                    {getSocialDisplayName(social.name)}
                  </p>
                  <p className="text-sm text-gray-400">{social.description}</p>
                </div>
                <ExternalLink className="ml-auto opacity-60 text-gray-400" size={18} />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.form
          variants={fade}
          initial="hidden"
          whileInView="show"
          onSubmit={handleSubmit}
          className="p-8 rounded-3xl border border-gray-800 bg-linear-to-b from-gray-900/60 to-gray-900/30 backdrop-blur-xl space-y-5"
        >
          <h3 className="text-2xl font-semibold text-gray-200">
            Send a Message
          </h3>

          <div>
            <input
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-emerald-500 outline-none transition-colors text-gray-200 placeholder-gray-500"
            />
            {errors.name && (
              <p className="text-sm text-red-400 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-emerald-500 outline-none transition-colors text-gray-200 placeholder-gray-500"
            />
            {errors.email && (
              <p className="text-sm text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <textarea
              name="message"
              rows="5"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-emerald-500 outline-none transition-colors text-gray-200 placeholder-gray-500 resize-none"
            />
            {errors.message && (
              <p className="text-sm text-red-400 mt-1">{errors.message}</p>
            )}
          </div>

          <button 
            type="submit"
            disabled={formLoading}
            className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {formLoading ? "Sending..." : "Send Message"}
          </button>

          {toast && (
            <p className={`text-sm text-center ${toast.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {toast}
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;