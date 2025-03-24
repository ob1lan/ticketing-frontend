import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import ProfileModal from "../components/ProfileModal";
import SettingsModal from "../components/SettingsModal";
import { fetchProfile } from "../api";

function Layout({ children }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const user = useAuth();
    const [profile, setProfile] = useState({});;
    const navigate = useNavigate();

    useEffect(() => {
        fetchProfile()
            .then((data) => {
                setProfile(data);
            })
            .catch((err) => {
                console.error("Failed to fetch profile:", err);
                navigate("/login", { replace: true });
            });
    }, [navigate]);

    return (
        <>
            <Navbar
                onOpenProfile={() => setIsProfileOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                profile={profile}
                user={user}
            />
            <div className="container mx-auto px-4 py-6">{children}</div>
            <Footer />
            {isProfileOpen && (
                <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} user={user} />
            )}
            {isSettingsOpen && (
                <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            )}
        </>
    );
}

export default Layout;
