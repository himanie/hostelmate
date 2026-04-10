"use client";
import React from "react";

export function useUser() {
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/loggedin-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);
console.log("currentUser=>", user)
  return user;
}