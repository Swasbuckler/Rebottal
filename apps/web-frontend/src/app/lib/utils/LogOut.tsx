import axiosInstance from "../auth/axios-instance";

export default function LogOut({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {

  const logOut = async () => {
    const response = await axiosInstance.get(
      '/api/auth/log-out'
    );
  };

  return (
    <div onClick={() => logOut()}>
      {children}
    </div>
  );
}