import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { MapPin, DollarSign, Building2, Tag, CalendarDays, FileText } from "lucide-react";
const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState({});
  const navigateTo = useNavigate();

  const { user } = useContext(Context);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/v1/job/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setJob(res.data.job);
      })
      .catch(() => {
        navigateTo("/notfound");
      });
    // include dependencies so lint is satisfied
  }, [id, navigateTo]);

  const postedOn = useMemo(() => {
    try {
      return job?.jobPostedOn ? new Date(job.jobPostedOn).toLocaleDateString() : "";
    } catch {
      return job?.jobPostedOn || "";
    }
  }, [job?.jobPostedOn]);

  const salaryText = useMemo(() => {
    if (job?.fixedSalary) return `₹ ${Number(job.fixedSalary).toLocaleString()}`;
    if (job?.salaryFrom || job?.salaryTo) {
      const from = Number(job.salaryFrom || 0).toLocaleString();
      const to = Number(job.salaryTo || 0).toLocaleString();
      return `₹ ${from} - ₹ ${to}`;
    }
    return "Not disclosed";
  }, [job]);

  return (
    <section className="jobDetail page">
      <div className="container">
        <h3>Role overview</h3>
        <div className="job_detail_card elevate fade-in-up">
          {/* Head */}
          <div className="job_head">
            <h2 className="job_title">{job.title}</h2>
            <div className="job_meta">
              {job.companyName && (
                <span className="company_chip"><Building2 size={14} /> {job.companyName}</span>
              )}
              {(job.city || job.country) && (
                <span className="muted"><MapPin size={14} /> {job.city || job.country}</span>
              )}
            </div>
          </div>

          {/* Meta grid */}
          <div className="detail_grid">
            <DetailRow icon={<Tag size={14} />} label="Category" value={job.category} />
            <DetailRow icon={<MapPin size={14} />} label="Country" value={job.country} />
            <DetailRow icon={<MapPin size={14} />} label="City" value={job.city} />
            <DetailRow icon={<CalendarDays size={14} />} label="Posted" value={postedOn} />
            <DetailRow icon={<DollarSign size={14} />} label="Salary" value={salaryText} />
          </div>

          {/* Sections */}
          <div className="detail_sections">
            <div className="detail_section">
              <p className="detail_section_title"><FileText size={14} /> Description</p>
              <p className="detail_section_body">{job.description}</p>
            </div>
            {job.location && (
              <div className="detail_section">
                <p className="detail_section_title"><MapPin size={14} /> Location</p>
                <p className="detail_section_body">{job.location}</p>
              </div>
            )}
          </div>

          {/* CTA */}
          {(!user || user.role === "Job Seeker") && (
            <div className="apply_row">
              <Link to={`/application/${job._id}`} className="apply_btn_outline">Apply now</Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const DetailRow = ({ icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="detail_row">
      <span className="detail_label">{icon}{label}</span>
      <span className="detail_value">{value}</span>
    </div>
  );
};

export default JobDetails;
