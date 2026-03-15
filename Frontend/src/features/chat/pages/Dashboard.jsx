import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useChat } from "../hook/useChat";

const Dashboard = () => {
  const chat = useChat();

  const user = useSelector((state) => state.auth.user);
  console.log("User in Dashboard:", user);

  useEffect(() => {
    chat.initializeSocketConnection();
  }, []);

  return <div>Dashboard</div>;
};

export default Dashboard;
