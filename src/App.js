import { useEffect, useState } from "react";
import { SuprSendProvider } from "@suprsend/react-headless";
import suprsend from "@suprsend/web-sdk";
import { v4 as uuid } from "uuid";
import { ToastContainer } from "react-toastify";
import InboxForm from "./InboxForm";
import InboxPreview from "./InboxPreview";
import "./App.css";

async function fetchSubscriber(distinctID) {
  const response = await fetch(
    `${window.location.href}subscriber/${distinctID}`
  );
  const userDetails = await response.json();
  return userDetails?.subscriber_id;
}

function App() {
  const [showToast, setShowToast] = useState(false);
  const [userData, setUserData] = useState({
    distinct_id: "",
    subscriber_id: "",
  });

  async function handleUserCreation() {
    let userID = localStorage.getItem("InboxExampleUserID");
    if (!userID) {
      userID = uuid();
      localStorage.setItem("InboxExampleUserID", userID);
      suprsend.identify(userID);
    }

    const subscriberId = await fetchSubscriber(userID);
    setUserData({ distinct_id: userID, subscriber_id: subscriberId });
  }

  useEffect(() => {
    handleUserCreation();
  }, []);

  return (
    <SuprSendProvider
      workspaceKey={process.env.REACT_APP_WORKSPACE_KEY}
      workspaceSecret={process.env.REACT_APP_WORKSPACE_SECRET}
      subscriberId={userData?.subscriber_id}
      distinctId={userData?.distinct_id}
      pollingInterval={7}
    >
      <div className="p-20 grid grid-cols-2">
        <InboxForm showToast={showToast} setShowToast={setShowToast} />
        <InboxPreview showToast={showToast} />
      </div>
      <ToastContainer />
    </SuprSendProvider>
  );
}

export default App;
