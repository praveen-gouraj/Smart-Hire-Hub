import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MapPin, DollarSign, FileText, Pencil, Trash2, Check } from "lucide-react";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";
import { JOB_CATEGORIES } from "../../constants/jobCategories";
import Button from "../ui/Button";

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  // Fetch jobs posted by current employer
  useEffect(() => {
    if (!isAuthorized) return; // redirect handled below
    axios
      .get("http://localhost:4000/api/v1/job/getmyjobs", { withCredentials: true })
      .then((res) => {
        setMyJobs(res.data.myJobs || []);
      })
      .catch((err) => console.error(err));
  }, [isAuthorized]);

  // Guard routes
  if (!isAuthorized) navigateTo("/");
  if (user?.role === "Job Seeker") navigateTo("/");

  const handleEnableEdit = (id) => setEditingId(id);
  const handleDisableEdit = () => setEditingId(null);

  const handleInputChange = (id, field, value) => {
    setMyJobs((prev) => prev.map((j) => (j._id === id ? { ...j, [field]: value } : j)));
  };

  const handleUpdateJob = async (id) => {
    const job = myJobs.find((j) => j._id === id);
    if (!job) return;
    try {
      const payload = {
        companyName: job.companyName,
        title: job.title,
        description: job.description,
        category: job.category,
        country: job.country,
        city: job.city,
        location: job.location,
        fixedSalary: job.fixedSalary,
        salaryFrom: job.salaryFrom,
        salaryTo: job.salaryTo,
        expired: job.expired,
      };
      await axios.put(`http://localhost:4000/api/v1/job/update/${id}`, payload, { withCredentials: true });
      toast.success("Job updated");
      setEditingId(null);
    } catch (e) {
      toast.error(e.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/job/delete/${id}`, { withCredentials: true });
      setMyJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success("Job deleted");
    } catch (e) {
      toast.error(e.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section className="myJobs page">
      <div className="container">
        <h1>Your posted jobs</h1>
  <p className="lead">Manage and refine the roles you have published. Switch to edit mode to adjust details.</p>

        {myJobs.length === 0 && (
          <div className="empty-state mt-6">You have not posted any jobs yet.</div>
        )}

        <div className="job_admin_grid mt-4">
          {myJobs.map((job, _idx) => {
            const isEditing = editingId === job._id;
            const expired = Boolean(job.expired);
            const salaryText = job.fixedSalary
              ? `₹ ${Number(job.fixedSalary).toLocaleString()}`
              : job.salaryFrom || job.salaryTo
              ? `₹ ${Number(job.salaryFrom || 0).toLocaleString()} - ₹ ${Number(job.salaryTo || 0).toLocaleString()}`
              : "Not disclosed";
            return (
              <div key={job._id} className="job_admin_card">
                {/* Header */}
                <div className="job_admin_header">
                  <span className={`badge_status ${expired ? 'expired' : 'active'}`}>{expired ? 'Expired' : 'Active'}</span>
                </div>

                <div className="job_admin_body">
                  {/* Title + meta */}
                  <div className="mb-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={job.title}
                        onChange={(e) => handleInputChange(job._id, 'title', e.target.value)}
                        className="job_input"
                        placeholder="Job title"
                      />
                    ) : (
                      <h3 className="job_title">{job.title}</h3>
                    )}
                    <div className="job_meta">
                      {job.companyName && <span className="company_chip">{job.companyName}</span>}
                      {(job.city || job.location || job.country) && <span className="muted">{job.city || job.location || job.country}</span>}
                    </div>
                  </div>

                  {/* Info grid */}
                  <div className="job_info_grid">
                    <DetailRow icon={<FileText size={14} />}
                      label="Category"
                      isEditing={isEditing}
                      valueEl={
                        isEditing ? (
                          <select
                            value={job.category}
                            onChange={(e) => handleInputChange(job._id, 'category', e.target.value)}
                            className="job_input"
                          >
                            {JOB_CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="pill" title={job.category}>{job.category}</span>
                        )
                      }
                    />
                    <DetailRow icon={<MapPin size={14} />}
                      label="Country"
                      isEditing={isEditing}
                      valueEl={
                        isEditing ? (
                          <input
                            type="text"
                            value={job.country}
                            onChange={(e) => handleInputChange(job._id, 'country', e.target.value)}
                            className="job_input"
                          />
                        ) : (
                          <span>{job.country}</span>
                        )
                      }
                    />
                    <DetailRow icon={<MapPin size={14} />}
                      label="City"
                      isEditing={isEditing}
                      valueEl={
                        isEditing ? (
                          <input
                            type="text"
                            value={job.city}
                            onChange={(e) => handleInputChange(job._id, 'city', e.target.value)}
                            className="job_input"
                          />
                        ) : (
                          <span>{job.city}</span>
                        )
                      }
                    />
                    <DetailRow icon={<FileText size={14} />}
                      label="Expired"
                      isEditing={isEditing}
                      valueEl={
                        isEditing ? (
                          <select
                            value={String(job.expired)}
                            onChange={(e) => handleInputChange(job._id, 'expired', e.target.value === 'true')}
                            className="job_input"
                          >
                            <option value="false">FALSE</option>
                            <option value="true">TRUE</option>
                          </select>
                        ) : (
                          <span>{job.expired ? 'TRUE' : 'FALSE'}</span>
                        )
                      }
                    />
                    <DetailRow icon={<DollarSign size={14} />}
                      label="Salary"
                      isEditing={isEditing}
                      valueEl={
                        isEditing ? (
                          job.fixedSalary ? (
                            <input
                              type="number"
                              value={job.fixedSalary}
                              onChange={(e) => handleInputChange(job._id, 'fixedSalary', e.target.value)}
                              className="job_input"
                            />
                          ) : (
                            <div className="flex gap-2">
                              <input
                                type="number"
                                value={job.salaryFrom}
                                onChange={(e) => handleInputChange(job._id, 'salaryFrom', e.target.value)}
                                className="job_input"
                              />
                              <input
                                type="number"
                                value={job.salaryTo}
                                onChange={(e) => handleInputChange(job._id, 'salaryTo', e.target.value)}
                                className="job_input"
                              />
                            </div>
                          )
                        ) : (
                          <span className="font-medium">{salaryText}</span>
                        )
                      }
                    />
                  </div>

                  {/* Description & Location */}
                  <div className="mt-3 space-y-3 overflow-hidden">
                    <div className="job_section">
                      <p className="job_section_title"><FileText size={14} /> Description</p>
                      {isEditing ? (
                        <textarea
                          rows={4}
                          value={job.description}
                          onChange={(e) => handleInputChange(job._id, 'description', e.target.value)}
                          className="job_textarea"
                          placeholder="Describe the role, responsibilities, qualifications..."
                        />
                      ) : (
                        <p className="job_section_text" title={job.description}>{job.description}</p>
                      )}
                    </div>
                    <div className="job_section">
                      <p className="job_section_title"><MapPin size={14} /> Location</p>
                      {isEditing ? (
                        <textarea
                          rows={2}
                          value={job.location}
                          onChange={(e) => handleInputChange(job._id, 'location', e.target.value)}
                          className="job_textarea"
                          placeholder="e.g., On-site, Remote, Hybrid – include address if needed"
                        />
                      ) : (
                        <p className="job_section_text" title={job.location}>{job.location}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="job_actions">
                    <div className="left">
                      {isEditing ? (
                        <div className="flex gap-2 order-1">
                          <Button
                            onClick={() => handleUpdateJob(job._id)}
                            variant="outline"
                            size="md"
                            className="rounded-full"
                          >
                            <Check size={14} /> Save
                          </Button>
                          <Button
                            onClick={handleDisableEdit}
                            variant="outline"
                            size="md"
                            className="rounded-full"
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleEnableEdit(job._id)}
                          variant="outline"
                          size="md"
                          className="rounded-full"
                          aria-label="Edit job"
                        >
                          <Pencil size={14} /> Edit
                        </Button>
                      )}
                    </div>
                    <div className="right">
                      <Button
                        onClick={() => handleDeleteJob(job._id)}
                        variant="outline"
                        size="md"
                        className="rounded-full"
                        aria-label="Delete job"
                      >
                        <Trash2 size={14} /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Small presentational helper for uniform label/value rows
const DetailRow = ({ label, valueEl, icon }) => (
  <div className="job_row">
    <span className="job_row_label">{icon}{label}</span>
    <div className="job_row_value">{valueEl}</div>
  </div>
);

export default MyJobs;
