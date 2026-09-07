import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <section className="max-w-xl rounded-xl bg-white p-8 shadow">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="mt-6 space-y-4">
        <p>
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <p>
          <strong>Role:</strong> {user?.role}
        </p>
      </div>
    </section>
  );
}