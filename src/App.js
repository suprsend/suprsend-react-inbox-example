import { useEffect, useState } from "react";
import { SuprSendProvider } from "@suprsend/react-headless";
import suprsend from "@suprsend/web-sdk";
import { v4 as uuid } from "uuid";
import { ToastContainer } from "react-toastify";
import InboxForm from "./InboxForm";
import InboxPreview from "./InboxPreview";
import "./App.css";

function createUser() {
  const userID = uuid();
  localStorage.setItem("SuprsendUser", userID);
  suprsend.identify(userID);
}

async function fetchSubscriber(userID, setUserData) {
  const response = await fetch(`${window.location.href}subscriber/${userID}`);
  const userDetails = await response.json();
  setUserData(userDetails);
}

function App() {
  const [userData, setUserData] = useState();
  const [showToast, setShowToast] = useState(false);

  const userID = localStorage.getItem("SuprsendUser");

  if (!userID) {
    createUser();
  }

  useEffect(() => {
    fetchSubscriber(userID, setUserData);
  }, [userID]);

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
