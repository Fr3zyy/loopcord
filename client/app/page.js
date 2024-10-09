"use client";
const { useAuthStore } = require("@/stores/user");

export default function ProfileComponent() {
  const { user, isLoading, error } = useAuthStore();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>Please log in</div>;

  console.log(user);

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
    </div>
  );
}
