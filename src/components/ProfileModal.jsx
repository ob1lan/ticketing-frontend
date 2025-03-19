import React, { useEffect, useState } from "react";

const ProfileModal = ({ isOpen, onClose, user }) => {
    const [profile, setProfile] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://127.0.0.1:8000/accounts/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const data = await res.json();
      setProfile(data.results);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      priority,
      type,
      ...(user.role === "admin" && { company }), // Only include company if admin
    };

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch("http://127.0.0.1:8000/tickets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(JSON.stringify(errData));
      } else {
        const data = await res.json();
        onTicketCreated && onTicketCreated(data);
        setTitle("");
        setDescription("");
        setPriority("low");
        setType("incident");
        setCompany("");
        setError("");
        onClose();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog id="profile_modal" className="modal modal-open">
      <div className="modal-box w-11/12 max-w-3xl">
        <fieldset className="fieldset bg-base-100 border border-base-300 p-6 rounded-box shadow-md">
          <legend className="fieldset-legend text-lg font-bold">My Profile</legend>

          {error && <div className="alert alert-error mb-4"><span>{error}</span></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="fieldset-label">Username</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Username"
                value={profile.username}
                onChange={(e) => setTitle(e.target.value)}
                disabled
              />
            </div>
            <div className="form-control">
              <label className="fieldset-label">Firstname</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Firstname"
                value={profile.first_name}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="fieldset-label">Lastname</label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Lastname"
                value={profile.last_name}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="modal-action">
              <button type="button" className="btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </fieldset>
      </div>
    </dialog>
  );
};

export default ProfileModal;
