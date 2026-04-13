"use client";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [originalUser, setOriginalUser] = useState<any>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
     fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/current-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setOriginalUser(data);
      });
  }, []);

  const handleChange = (e: any) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/current-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });

      const data = await res.json();
      setUser(data.user);
      setOriginalUser(data.user);
      setEditMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setEditMode(false);
  };

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-background text-foreground p-6">

      <h1 className="text-3xl font-semibold mb-6">My Account</h1>

      <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("info")}
          className={`px-4 py-2 rounded-md text-sm ${
            activeTab === "info"
              ? "bg-background shadow"
              : "text-muted-foreground"
          }`}
        >
          Account Info
        </button>

        <button
          onClick={() => setActiveTab("password")}
          className={`px-4 py-2 rounded-md text-sm ${
            activeTab === "password"
              ? "bg-background shadow"
              : "text-muted-foreground"
          }`}
        >
          Password
        </button>
      </div>

      {activeTab === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="bg-card border rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-primary/20 to-transparent" />

            <div className="relative flex flex-col items-center text-center">

              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-semibold mb-3">
                {user.name?.charAt(0)}
              </div>

              <h2 className="text-lg font-semibold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">{user.phone}</p>

              <div className="w-full border-t my-4" />

              <div className="w-full grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted/40 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Room</p>
                  <p className="font-medium">{user.room_number}</p>
                </div>

                <div className="bg-muted/40 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Year</p>
                  <p className="font-medium">{user.year}</p>
                </div>

                <div className="bg-muted/40 p-3 rounded-lg col-span-2">
                  <p className="text-xs text-muted-foreground">Course</p>
                  <p className="font-medium">{user.course}</p>
                </div>
              </div>

              <div className="mt-4 w-full bg-muted/30 rounded-lg p-3 text-sm">
                <p className="text-xs text-muted-foreground">Hostel</p>
                <p className="font-medium">{user.hostel?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.hostel?.address}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-card border rounded-2xl p-6 shadow-sm space-y-6">

            <h2 className="text-lg font-semibold">Edit Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <input name="name" value={user.name || ""} onChange={handleChange} disabled={!editMode}
                  className="w-full mt-1 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary"/>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <input name="email" value={user.email || ""} onChange={handleChange} disabled={!editMode}
                  className="w-full mt-1 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary"/>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <input name="phone" value={user.phone || ""} onChange={handleChange} disabled={!editMode}
                  className="w-full mt-1 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary"/>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Room Number</label>
                <input name="room_number" value={user.room_number || ""} onChange={handleChange} disabled={!editMode}
                  className="w-full mt-1 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary"/>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Course</label>
                <input name="course" value={user.course || ""} onChange={handleChange} disabled={!editMode}
                  className="w-full mt-1 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary"/>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Year</label>
                <input name="year" value={user.year || ""} onChange={handleChange} disabled={!editMode}
                  className="w-full mt-1 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary"/>
              </div>

            </div>

            <div className="flex justify-end gap-3">
              {!editMode ? (
                <button onClick={() => setEditMode(true)}
                  className="px-5 py-2 bg-primary text-white rounded-md">
                  Edit Profile
                </button>
              ) : (
                <>
                  <button onClick={handleCancel}
                    className="px-5 py-2 border rounded-md">
                    Cancel
                  </button>

                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`px-5 py-2 rounded-md text-white ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-600"
                    }`}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === "password" && (
        <div className="bg-card border rounded-2xl p-6 shadow-sm max-w-xl">

          <h2 className="text-lg font-semibold mb-2">Security</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Change your password to keep your account secure
          </p>

          <div className="space-y-4">

            <div>
              <label className="text-sm font-medium text-muted-foreground">Current Password</label>
              <input type="password"
                className="w-full mt-1 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary"/>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">New Password</label>
              <input type="password"
                className="w-full mt-1 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary"/>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
              <input type="password"
                className="w-full mt-1 p-3 border rounded-md bg-background focus:ring-2 focus:ring-primary"/>
            </div>

          </div>

          <div className="flex justify-end mt-6">
            <button className="px-5 py-2 bg-primary text-white rounded-md">
              Update Password
            </button>
          </div>
        </div>
      )}
    </div>
  );
}