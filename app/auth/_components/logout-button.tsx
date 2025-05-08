import { authApi } from "@/app/api";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const { logout } = authApi;
  const router = useRouter();
  const onSuccess = () => router.replace("/auth");
  return (
    <button
      onClick={() => logout(onSuccess)}
      className="mt-auto mb-10 text-left text-subtitle-s text-label-natural"
    >
      로그아웃
    </button>
  );
};
export default LogoutButton;
