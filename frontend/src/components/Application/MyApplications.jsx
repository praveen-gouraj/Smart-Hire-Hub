import React, { useContext, useEffect, useState, useRef } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiPhone, FiMapPin, FiFileText } from "react-icons/fi";
import ResumeModal from "./ResumeModal";
import EmptyState from "../ui/EmptyState";
import Button from "../ui/Button";

// Smaller phone/location text, consistent styling container
const DetailRow = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="app_detail_row">
      <div className="icon">
        <Icon />
      </div>
      <div className="content">
        <p className="label">{label}</p>
        <p className="value">{value}</p>
      </div>
    </div>
  );
};

const SectionBlock = ({ icon: Icon, title, children }) => (
  <div className="app_section">
    <p className="section_title">{Icon && <Icon />} {title}</p>
    <div className="section_body">{children}</div>
  </div>
);

// Employer card (with shortlist / reject actions)
const EmployerApplicationCard = ({ application, openModal, onDelete, onStatusChange }) => {
  const { name, email, phone, address, coverLetter, resume, _id, status } = application;
  const resumeUrl = resume?.url;

  const updateStatus = async (action) => {
    try {
      const { data } = await axios.patch(
        `http://localhost:4000/api/v1/application/employer/${_id}/status`,
        { action },
        { withCredentials: true }
      );
      toast.success(data.message);
      onStatusChange(_id, data.application.status);
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to update";
      toast.error(msg);
    }
  };

  return (
    <div className="app_card">
      <div className="app_header">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="eyebrow">Candidate</p>
          <span className={`badge_status application_status ${status?.toLowerCase()}`}>{status}</span>
        </div>
        <h3 className="title capitalize">{name}</h3>
        {email && <p className="subtitle break-all">{email}</p>}
      </div>

      <SectionBlock icon={FiFileText} title="Description">
        {coverLetter || "No cover letter provided."}
      </SectionBlock>

      <div className="grid_two">
        <DetailRow icon={FiPhone} label="Phone" value={phone} />
        <DetailRow icon={FiMapPin} label="Location" value={address} />
      </div>

      {resumeUrl && (
        <SectionBlock icon={FiFileText} title="Resume preview">
          <div className="resume_preview" onClick={() => openModal(resumeUrl)}>
            <img src={resumeUrl} alt={`${name || "candidate"} resume`} />
          </div>
          <div className="app_actions flex-wrap">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={() => openModal(resumeUrl)}
            >
              View details
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={() => {
                const a = document.createElement("a");
                a.href = resumeUrl;
                a.download = `${name || "resume"}.pdf`;
                a.target = "_blank";
                a.click();
              }}
            >
              Download
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              disabled={status === "Shortlisted"}
              onClick={() => updateStatus("shortlist")}
            >
              {status === "Shortlisted" ? "Shortlisted" : "Shortlist"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              disabled={status === "Rejected"}
              onClick={() => updateStatus("reject")}
            >
              {status === "Rejected" ? "Rejected" : "Reject"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={() => onDelete(_id)}
            >
              Delete
            </Button>
          </div>
        </SectionBlock>
      )}
    </div>
  );
};

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  // Prevent duplicate fetches when authorization or user changes rapidly
  const hasFetchedRef = useRef(false);
  useEffect(() => {
    if (!isAuthorized || !user?.role) return; // Guard until role is known
    // Reset when user changes
    hasFetchedRef.current = false;
  }, [user?.role, isAuthorized]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthorized || !user?.role || hasFetchedRef.current) return;
      hasFetchedRef.current = true;
      setLoading(true);
      try {
        const url =
          user.role === "Employer"
            ? "http://localhost:4000/api/v1/application/employer/getall"
            : "http://localhost:4000/api/v1/application/jobseeker/getall";
        const { data } = await axios.get(url, { withCredentials: true });
        setApplications(data.applications || []);
      } catch (error) {
        const msg = error?.response?.data?.message;
        // Suppress expected role mismatch errors
        if (msg && /not allowed to access this resource/i.test(msg)) {
          return;
        }
        if (msg) toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthorized, user?.role]);

  if (!isAuthorized) {
    navigateTo("/");
  }

  const deleteApplication = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:4000/api/v1/application/delete/${id}`,
        { withCredentials: true }
      );
      toast.success(data.message);
      setApplications((prevApplication) =>
        prevApplication.filter((application) => application._id !== id)
      );
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to withdraw";
      toast.error(msg);
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const isJobSeeker = user && user.role === "Job Seeker";


  return (
    <section className="my_applications page">
      <div className="container">
        <header className="flex flex-col items-center text-center gap-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {isJobSeeker ? "My applications" : "Candidate applications"}
          </h1>
          {isJobSeeker ? (
            <p className="text-slate-600 max-w-2xl">
                Track the jobs you have applied to. You can withdraw if you change your mind.
            </p>
          ) : (
            <p className="text-slate-600 max-w-3xl">
                Review and manage incoming candidate submissions. Open a resume to inspect details or remove an application you no longer need.
            </p>
          )}
        </header>

        {/* Summary cards removed as requested */}

        {loading && (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 flex flex-col gap-4 shadow-sm"
              >
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/5" />
                    <div className="h-4 bg-slate-200 rounded w-4/5" />
                  </div>
                </div>
                <div className="h-40 rounded-lg bg-slate-100" />
                <div className="h-10 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && applications.length === 0 && (
          <EmptyState
            title={"No applications yet"}
            subtitle={
              isJobSeeker
                ? "Start exploring jobs and send your first application."
                : "Once candidates start applying, you'll see them listed here."
            }
            actionLabel={isJobSeeker ? "Browse jobs" : undefined}
            onAction={() => (isJobSeeker ? navigateTo("/job/getall") : null)}
          />
        )}

  {/* Employer view in teal card layout */}
        {!loading && applications.length > 0 && !isJobSeeker && (
          <div className={`app_grid ${applications.length === 1 ? "single" : ""}`}>
            {applications.map((app) => (
              <EmployerApplicationCard
                key={app._id}
                application={app}
                openModal={openModal}
                onDelete={deleteApplication}
                onStatusChange={(id, newStatus) => {
                  setApplications(prev => prev.map(a => a._id === id ? { ...a, status: newStatus } : a));
                }}
              />
            ))}
          </div>
        )}
        {/* Original card grid for job seeker */}
        {!loading && applications.length > 0 && isJobSeeker && (
          <div className={`app_grid ${applications.length === 1 ? "single" : ""}`}>
            {applications.map((element) => (
              <ApplicationCard
                key={element._id}
                element={element}
                isJobSeeker={isJobSeeker}
                deleteApplication={deleteApplication}
                openModal={openModal}
              />
            ))}
          </div>
        )}
      </div>
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

export default MyApplications;

const ApplicationCard = ({
  element,
  isJobSeeker,
  deleteApplication,
  openModal,
}) => {
  const resumeUrl = element.resume?.url;
  return (
    <div className="app_card">

      <div className="app_header">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="eyebrow">Application</p>
          <span className={`badge_status application_status ${element.status?.toLowerCase()}`}>{element.status}</span>
        </div>
        <h3 className="title capitalize">
          {element.name}
        </h3>
        {element.email && <p className="subtitle break-all">{element.email}</p>}
      </div>

      <SectionBlock icon={FiFileText} title="Description">
        {element.coverLetter || "No cover letter provided."}
      </SectionBlock>

      <div className="grid_two">
        <DetailRow icon={FiPhone} label="Phone" value={element.phone} />
        <DetailRow icon={FiMapPin} label="Location" value={element.address} />
      </div>

      {resumeUrl && (
        <SectionBlock icon={FiFileText} title="Resume preview">
          <div className="resume_preview" onClick={() => openModal(resumeUrl)}>
            <img src={resumeUrl} alt={`${element.name || "candidate"} resume`} />
          </div>
          <div className="app_actions">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={() => openModal(resumeUrl)}
            >
              View details
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={() => {
                const a = document.createElement("a");
                a.href = resumeUrl;
                a.download = `${element.name || "resume"}.pdf`;
                a.target = "_blank";
                a.click();
              }}
            >
              Download
            </Button>
          </div>
        </SectionBlock>
      )}

      <div className="pt-2">
        {isJobSeeker ? (
          <Button
            variant="outline"
            size="lg"
            className="rounded-lg w-full"
            onClick={() => deleteApplication(element._id)}
          >
            Withdraw application
          </Button>
        ) : (
          <div className="app_actions">
            {resumeUrl && (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => openModal(resumeUrl)}
              >
                Preview
              </Button>
            )}
            {resumeUrl && (
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => {
                  const a = document.createElement("a");
                  a.href = resumeUrl;
                  a.download = `${element.name || "resume"}.pdf`;
                  a.target = "_blank";
                  a.click();
                }}
              >
                Download
              </Button>
            )}
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => deleteApplication(element._id)}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
