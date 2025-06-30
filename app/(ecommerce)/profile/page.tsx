/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import Select from "react-select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "flag-icons/css/flag-icons.min.css";
import countryList from "react-select-country-list";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Editable fields
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [altEmail, setAltEmail] = useState("");
  const [language, setLanguage] = useState("");
  const [currency, setCurrency] = useState("");
  const [theme, setTheme] = useState("dark");
  const [newsletter, setNewsletter] = useState(false);
  const [accountStatus, setAccountStatus] = useState("Active");
  const [lastLogin, setLastLogin] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);
  const [referralCode, setReferralCode] = useState("");
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  // UI state
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [showSocialModal, setShowSocialModal] = useState(false);

  // Avatar upload preview
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Country options for react-select
  const countryOptions = countryList().getData();

  useEffect(() => {
    const fetchProfileAndOrders = async () => {
      setLoading(true);
      try {
        const [profileRes, ordersRes] = await Promise.all([
          axiosInstance.get("/api/profile/me"),
          axiosInstance.get("/api/orders"),
        ]);
        const { user: userData, profile: p } = profileRes.data;
        setProfile({ ...p, user: userData });
        setOrders(ordersRes.data);
        setUsername(p.username || "");
        setDob(p.dob ? p.dob.slice(0, 10) : "");
        setGender(p.gender || "");
        // Fix avatar URL to always be absolute
        let avatarPath = p.avatar || "";
        if (avatarPath && !avatarPath.startsWith("http")) {
          const baseURL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000';
          avatarPath = `${baseURL}/${avatarPath.replace(/^\/+/, "")}`;
        }
        setAvatarUrl(avatarPath);
        setBio(p.bio || "");
        setPhone(p.phone || "");
        setAddress(p.address || "");
        setCountry(p.country || "");
        setCity(p.city || "");
        setPostal(p.postal || "");
        setAltEmail(p.altEmail || "");
        setLanguage(p.language || "en");
        setCurrency(p.currency || "USD");
        setTheme(p.theme || "dark");
        setNewsletter(!!p.newsletter);
        setAccountStatus(p.accountStatus || "Active");
        setLastLogin(p.lastLogin || "");
        setTwoFA(!!p.twoFA);
        setSocialAccounts(p.socialAccounts || []);
        setReferralCode(p.referralCode || "");
        setLoyaltyPoints(p.loyaltyPoints || 0);
      } catch {
        setProfile(null);
        setOrders([]);
      }
      setLoading(false);
    };
    fetchProfileAndOrders();
  }, []);

  // Remove currency-codes import and use a static country-to-currency map
  // import currencyCodes from "currency-codes";

  // Minimal country-to-currency map (expand as needed)
  const countryToCurrency: Record<string, string> = {
    US: "USD",
    GB: "GBP",
    EG: "EGP",
    DE: "EUR",
    FR: "EUR",
    SA: "SAR",
    // ...add more as needed
  };

  // When country changes, update currency
  React.useEffect(() => {
    if (country) {
      setCurrency(countryToCurrency[country] || "USD");
    }
  }, [country]);

  // Save handler (ready for backend)
  const handleSave = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("bio", bio);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("postal", postal);
      formData.append("altEmail", altEmail);
      formData.append("language", language);
      formData.append("currency", currency);
      formData.append("theme", theme);
      formData.append("newsletter", String(newsletter));
      if (avatar) {
        formData.append("avatar", avatar);
        console.log("[FRONTEND] Appending avatar file:", avatar);
      } else {
        console.log("[FRONTEND] No avatar file to upload");
      }
      // Debug: log FormData keys
      for (const pair of formData.entries()) {
        console.log("[FRONTEND] FormData:", pair[0], pair[1]);
      }
      await axiosInstance.put("/api/profile", formData);
      setSaveMsg("Profile updated!");
      setAvatar(null); // Reset avatar after upload
    } catch {
      setSaveMsg("Failed to update profile.");
    }
    setSaving(false);
  };

  // Avatar upload handler
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Password modal (scaffold)
  const PasswordModal = () => (
    <AnimatePresence>
      {showPasswordModal && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-900 rounded-xl p-8 shadow-lg border border-[#00ffff30] w-full max-w-md"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
          >
            <h3 className="text-lg font-bold text-[#00ffff] mb-4">Change Password</h3>
            {/* Add your password change form here */}
            <input
              type="password"
              placeholder="Current Password"
              className="mb-2 w-full bg-gray-800 border border-[#00ffff30] rounded px-3 py-2 text-white"
            />
            <input
              type="password"
              placeholder="New Password"
              className="mb-2 w-full bg-gray-800 border border-[#00ffff30] rounded px-3 py-2 text-white"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="mb-4 w-full bg-gray-800 border border-[#00ffff30] rounded px-3 py-2 text-white"
            />
            <div className="flex gap-2">
              <Button
                className="bg-[#00ffff] text-[#222] hover:bg-[#00cccc] hover:text-[#111] font-bold"
                onClick={() => setShowPasswordModal(false)}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="max-w-4xl mx-auto pt-16 px-2 sm:px-6 min-h-screen">
      <motion.h1
        className="text-3xl sm:text-4xl font-extrabold mb-8 text-[#00ffff] tracking-tight text-center drop-shadow-lg"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        👤 Profile
      </motion.h1>
      <AnimatePresence>
        {loading ? (
          <motion.div
            key="loading"
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-[#00ffff30] text-center text-[#00ffff]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Loading...
          </motion.div>
        ) : (
          <motion.form
            key="profile"
            className="bg-gray-800 rounded-xl p-6 shadow-lg border border-[#00ffff30] flex flex-col gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            onSubmit={e => {
              e.preventDefault();
              handleSave();
            }}
          >
            {/* Personal Info */}
            <section>
              <h2 className="text-xl font-bold text-[#00ffff] mb-4">Personal Info</h2>
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col gap-2 flex-1">
                  <label className="text-gray-400 text-sm">Name</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff30] rounded px-3 py-2 text-white"
                    value={profile?.user?.name || user?.name || ""}
                    disabled
                  />
                  <label className="text-gray-400 text-sm">Username</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff] rounded px-3 py-2 text-white"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Your username"
                  />
                  <label className="text-gray-400 text-sm">Date of Birth</label>
                  <input
                    type="date"
                    className="bg-gray-900 border border-[#00ffff] rounded px-3 py-2 text-white focus:border-[#00ffff] focus:ring-2 focus:ring-[#00ffff80]"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    style={{ colorScheme: "dark" }}
                  />
                  <label className="text-gray-400 text-sm">Gender</label>
                  <select
                    className="bg-gray-900 border border-[#00ffff] rounded px-3 py-2 text-white"
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <label className="text-gray-400 text-sm">Bio/About Me</label>
                  <textarea
                    className="bg-gray-900 border border-[#00ffff] rounded px-3 py-2 text-white"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <label className="text-gray-400 text-sm mb-1">Avatar</label>
                  <div className="w-24 h-24 rounded-full bg-gray-900 border-2 border-[#00ffff] flex items-center justify-center overflow-hidden mb-2">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#00ffff] text-4xl">👤</span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <Button
                    type="button"
                    className="bg-[#00ffff] text-[#222] hover:bg-[#00cccc] hover:text-[#111] font-bold"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Avatar
                  </Button>
                </div>
              </div>
            </section>
            {/* Contact Info */}
            <section>
              <h2 className="text-xl font-bold text-[#00ffff] mb-4">Contact Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-sm">Email</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff30] rounded px-3 py-2 text-white"
                    value={profile?.user?.email || user?.email || ""}
                    disabled
                  />
                  <label className="text-gray-400 text-sm">Alternate Email</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff] rounded px-3 py-2 text-white"
                    value={altEmail}
                    onChange={e => setAltEmail(e.target.value)}
                    placeholder="Alternate email"
                  />
                  <label className="text-gray-400 text-sm">Country</label>
                  <Select
                    classNamePrefix="react-select"
                    options={countryOptions}
                    value={countryOptions.find(opt => opt.value === country) || null}
                    onChange={opt => setCountry(opt ? opt.value : "")}
                    styles={{
                      control: (base) => ({
                        ...base,
                        background: "#111827",
                        borderColor: "#00ffff",
                        color: "#fff",
                        borderRadius: 8,
                      }),
                      singleValue: (base) => ({ ...base, color: "#fff" }),
                      menu: (base) => ({ ...base, background: "#222" }),
                      option: (base, state) => ({
                        ...base,
                        background: state.isFocused ? "#00ffff22" : "#222",
                        color: "#fff",
                      }),
                    }}
                  />
                  <label className="text-gray-400 text-sm">Phone</label>
                  <PhoneInput
                    country={country.toLowerCase() || "us"}
                    value={phone}
                    onChange={setPhone}
                    inputStyle={{
                      background: "#111827",
                      border: "1px solid #00ffff",
                      borderRadius: 8,
                      color: "#fff",
                      width: "100%",
                    }}
                    buttonStyle={{ background: "#111827", border: "1px solid #00ffff" }}
                    dropdownStyle={{ background: "#222", color: "#fff" }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-sm">City</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff] rounded px-3 py-2 text-white"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="City"
                  />
                  <label className="text-gray-400 text-sm">Postal/ZIP Code</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff] rounded px-3 py-2 text-white"
                    value={postal}
                    onChange={e => setPostal(e.target.value)}
                    placeholder="Postal/ZIP Code"
                  />
                  <label className="text-gray-400 text-sm">Address</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff] rounded px-3 py-2 text-white"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Add your address"
                  />
                </div>
              </div>
            </section>
            {/* Account Security */}
            <section>
              <h2 className="text-xl font-bold text-[#00ffff] mb-4">Account Security</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-sm">Account Status</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff30] rounded px-3 py-2 text-white"
                    value={accountStatus}
                    disabled
                  />
                  <label className="text-gray-400 text-sm">Last Login</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff30] rounded px-3 py-2 text-white"
                    value={lastLogin ? new Date(lastLogin).toLocaleString() : "Unknown"}
                    disabled
                  />
                  <label className="text-gray-400 text-sm">Account Created</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff30] rounded px-3 py-2 text-white"
                    value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "Unknown"}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-sm">Two-Factor Authentication</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={twoFA}
                      onChange={() => setTwoFA(!twoFA)}
                      className="accent-[#00ffff] w-5 h-5"
                    />
                    <span className="text-white">{twoFA ? "Enabled" : "Disabled"}</span>
                  </div>
                  <Button
                    type="button"
                    className="w-fit bg-[#00ffff] text-[#222] hover:bg-[#00cccc] hover:text-[#111] font-bold mt-2"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </section>
            {/* Preferences */}
            <section>
              <h2 className="text-xl font-bold text-[#00ffff] mb-4">Preferences</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-sm">Language</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff] rounded px-3 py-2 text-white"
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    placeholder="Language"
                  />
                  <label className="text-gray-400 text-sm">Currency</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff] rounded px-3 py-2 text-white"
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    placeholder="Currency"
                  />
                  <label className="text-gray-400 text-sm">Theme</label>
                  <select
                    className="bg-gray-900 border border-[#00ffff] rounded px-3 py-2 text-white"
                    value={theme}
                    onChange={e => setTheme(e.target.value)}
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-sm">Newsletter Subscription</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newsletter}
                      onChange={() => setNewsletter(!newsletter)}
                      className="accent-[#00ffff] w-5 h-5"
                    />
                    <span className="text-white">{newsletter ? "Subscribed" : "Not Subscribed"}</span>
                  </div>
                </div>
              </div>
            </section>
            {/* Other */}
            <section>
              <h2 className="text-xl font-bold text-[#00ffff] mb-4">Other</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-sm">Referral Code/Link</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff30] rounded px-3 py-2 text-white"
                    value={referralCode}
                    disabled
                  />
                  <label className="text-gray-400 text-sm">Loyalty Points/Rewards</label>
                  <input
                    className="bg-gray-900 border border-[#00ffff30] rounded px-3 py-2 text-white"
                    value={loyaltyPoints}
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-gray-400 text-sm">Social Accounts</label>
                  <div className="flex gap-2 flex-wrap">
                    {socialAccounts.length === 0 ? (
                      <span className="text-gray-400 text-sm">No social accounts connected.</span>
                    ) : (
                      socialAccounts.map((acc: any) => (
                        <span key={acc.provider} className="bg-gray-900 border border-[#00ffff] rounded px-3 py-1 text-white">
                          {acc.provider}
                        </span>
                      ))
                    )}
                  </div>
                  <Button
                    type="button"
                    className="w-fit bg-[#00ffff] text-[#222] hover:bg-[#00cccc] hover:text-[#111] font-bold mt-2"
                    onClick={() => setShowSocialModal(true)}
                  >
                    Connect Social Account
                  </Button>
                  <Button
                    type="button"
                    className="w-fit bg-red-600 text-white hover:bg-red-700 font-bold mt-2"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </section>
            <Button
              type="submit"
              className="w-fit bg-[#00ffff] text-[#222] hover:bg-[#00cccc] hover:text-[#111] font-bold mt-2"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save All Changes"}
            </Button>
            {saveMsg && (
              <div className="text-sm mt-1" style={{ color: saveMsg.includes("updated") ? "#00ffff" : "#ff5555" }}>
                {saveMsg}
              </div>
            )}
          </motion.form>
        )}
      </AnimatePresence>
      {/* Password Modal */}
      <PasswordModal />
      {/* Social Connect Modal */}
      {showSocialModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 shadow-lg border border-[#00ffff30] w-full max-w-md">
            <h3 className="text-lg font-bold text-[#00ffff] mb-4">Connect Social Account</h3>
            <p className="mb-4 text-gray-300">Feature coming soon! Here you will be able to connect your Google, Facebook, or other social accounts.</p>
            <Button className="bg-[#00ffff] text-[#222] hover:bg-[#00cccc] hover:text-[#111] font-bold" onClick={() => setShowSocialModal(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 shadow-lg border border-[#00ffff30] w-full max-w-md">
            <h3 className="text-lg font-bold text-red-400 mb-4">Delete Account</h3>
            <p className="mb-2 text-gray-300">This action is <span className="text-red-400 font-bold">permanent</span> and cannot be undone.</p>
            <p className="mb-4 text-gray-300">Type <span className="font-bold text-red-400">delete my account</span> to confirm.</p>
            <input
              className="mb-4 w-full bg-gray-800 border border-[#00ffff30] rounded px-3 py-2 text-white"
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="delete my account"
            />
            <div className="flex gap-2">
              <Button
                className="bg-red-600 text-white hover:bg-red-700 font-bold"
                disabled={deleteConfirm !== 'delete my account'}
                onClick={async () => {
                  try {
                    await axiosInstance.delete("/api/auth/delete-account");
                    setShowDeleteModal(false);
                    setDeleteConfirm("");
                    alert("Account deleted successfully.");
                    window.location.href = "/";
                  } catch (err: any) {
                    alert("Failed to delete account: " + (err?.response?.data?.error || err.message));
                  }
                }}
              >
                Confirm Delete
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirm("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Order/Activity Section */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-bold text-[#00ffff] mb-4">Order History</h2>
        <AnimatePresence>
          {orders.length === 0 && !loading ? (
            <motion.div
              key="no-orders"
              className="bg-gray-900 rounded-xl p-4 text-gray-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              No orders yet.
            </motion.div>
          ) : (
            orders.map((order: any) => (
              <motion.div
                key={order._id}
                className="bg-gray-900 rounded-xl p-4 text-gray-300 mb-4 border border-[#00ffff20]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-[#00ffff]">Order #{order._id.slice(-6)}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(order.placedAt || order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-sm">Total: </span>
                  <span className="font-bold">${order.total?.toFixed(2) ?? "0.00"}</span>
                </div>
                <div>
                  <span className="text-sm">Status: </span>
                  <span className="font-bold">{order.status || "Processing"}</span>
                </div>
                <div className="mt-2">
                  <span className="text-xs text-gray-400">Products:</span>
                  <ul className="list-disc ml-6 text-sm">
                    {order.items?.map((item: any) => (
                      <li key={item.product?._id}>
                        {item.product?.title} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Profile;