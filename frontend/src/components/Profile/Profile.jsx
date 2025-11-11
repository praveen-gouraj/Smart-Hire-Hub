import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import { RiMapPinLine } from "react-icons/ri";

const Profile = () => {
  const { isAuthorized, user, setUser } = useContext(Context);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [defaultCoverLetter, setDefaultCoverLetter] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState(""); // comma separated
  const [experienceYears, setExperienceYears] = useState("");
  const [education, setEducation] = useState("");

  // Redirect rules
  useEffect(() => {
    if (isAuthorized === false) {
      navigate("/login");
    }
    if (user && user.role === "Employer") {
      navigate("/");
    }
  }, [isAuthorized, user, navigate]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/profile/me",
          { withCredentials: true }
        );
        const p = data?.profile;
        if (p) {
          setAddress(p.address || "");
          setDefaultCoverLetter(p.defaultCoverLetter || "");
          setBio(p.bio || "");
          setSkills(Array.isArray(p.skills) ? p.skills.join(", ") : "");
          setExperienceYears(
            typeof p.experienceYears === "number" ? String(p.experienceYears) : ""
          );
          setEducation(p.education || "");
        }
        // initialize identity from context if available
        if (user) {
          setName(user.name || "");
          setEmail(user.email || "");
          setPhone(user.phone ? String(user.phone) : "");
        }
      } catch (err) {
        // it's okay if profile doesn't exist yet
      } finally {
        setLoading(false);
      }
    };
    if (isAuthorized) loadProfile();
  }, [isAuthorized, user]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (saving) return;
    // basic validation
    if (experienceYears !== "" && !/^\d+$/.test(experienceYears)) {
      toast.error("Experience must be a positive number (years)");
      return;
    }
    try {
      setSaving(true);
      const payload = {
        address,
        defaultCoverLetter,
        bio,
        skills,
        experienceYears: experienceYears === "" ? undefined : Number(experienceYears),
        education,
      };
      const { data } = await axios.post(
        "http://localhost:4000/api/v1/profile/upsert",
        payload,
        { withCredentials: true }
      );
      toast.success(data?.message || "Profile saved");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to save profile";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const headerName = useMemo(() => user?.name || "Your profile", [user]);

  return (
  <section className="profileSection page" style={{paddingTop:'0px', paddingBottom:'60px'}}>
      <div className="container" style={{display:'flex', flexDirection:'column', alignItems:'center', gap:'30px'}}>
        {loading && <p className="text-slate-500" role="status">Loading profile…</p>}
        <div style={{textAlign:'center', maxWidth:'900px'}} className="fade-in-up">
          <h3 style={{fontSize:'2.2rem', fontWeight:700, color:'var(--text)', letterSpacing:'-0.5px'}}>{headerName}</h3>
          <p style={{marginTop:'10px', color:'var(--muted)', fontSize:'1.05rem'}}>Create your job-seeker profile to auto-fill applications.</p>
        </div>
        <form onSubmit={handleSave} className="profileCard elevate fade-in-up">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center h-12 rounded-lg border border-slate-200 bg-white px-3">
              <span className="mr-2 h-5 w-5 text-slate-400">@</span>
              <input type="text" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="flex-1 bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400" />
            </div>
            <div className="flex items-center h-12 rounded-lg border border-slate-200 bg-white px-3">
              <span className="mr-2 h-5 w-5 text-slate-400">✉</span>
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400" />
            </div>
            <div className="flex items-center h-12 rounded-lg border border-slate-200 bg-white px-3">
              <span className="mr-2 h-5 w-5 text-slate-400">☎</span>
              <input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} maxLength={10} className="flex-1 bg-transparent border-0 outline-none text-slate-900 placeholder:text-slate-400" />
            </div>
            <div className="flex items-center h-12 rounded-lg border border-slate-200 bg-white px-3">
              <RiMapPinLine className="mr-2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="City, country (address)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-none"
                style={{ color: 'var(--text)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Default cover letter</label>
            <textarea rows={5} placeholder="Write a reusable cover letter..." value={defaultCoverLetter} onChange={(e) => setDefaultCoverLetter(e.target.value)} className="profileTextArea" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Skills (comma separated)</label>
              <input type="text" placeholder="react, node, mongodb" value={skills} onChange={(e) => setSkills(e.target.value)} className="profileInput" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Experience (years)</label>
              <input type="number" min="0" step="1" placeholder="0" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} className="profileInput" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Education</label>
            <input type="text" placeholder="B.Tech in Computer Science" value={education} onChange={(e) => setEducation(e.target.value)} className="profileInput" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short bio</label>
            <textarea rows={3} placeholder="A short summary about you..." value={bio} onChange={(e) => setBio(e.target.value)} className="profileTextArea" />
          </div>

          <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
            <button type="submit" disabled={saving} className="profileSaveBtn" >
              {saving ? "Saving…" : "Save profile"}
            </button>
            <button
              type="button"
              onClick={async () => {
                // update basic info on user object
                try {
                  const { data } = await axios.put(
                    "http://localhost:4000/api/v1/user/update",
                    { name, email, phone },
                    { withCredentials: true }
                  );
                  toast.success(data?.message || "Account updated");
                  if (data?.user) setUser(data.user);
                } catch (err) {
                  toast.error(err?.response?.data?.message || "Failed to update account");
                }
              }}
              className="profileSaveBtn"
              style={{background:'linear-gradient(135deg,var(--accent-1) 0%, var(--accent-2) 100%)'}}
            >
              Update account
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Profile;
