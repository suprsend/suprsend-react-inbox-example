import { useEffect, useState } from "react";
import { SuprSendProvider } from "@suprsend/react-headless";
import suprsend from "@suprsend/web-sdk";
import { v4 as uuid } from "uuid";
import InboxExample from "./InboxExample";
import "./App.css";

const fetchUserDetails = async (userID, callback) => {
  const url = `http://127.0.0.1:8788/subscriber/${userID}`;
  const response = await fetch(url);
  const myJson = await response.json();
  if (typeof callback === "function") {
    return callback(myJson);
  }
};

const createUser = () => {
  const userID = uuid();
  suprsend.identify(userID);
  localStorage.setItem("SuprsendUser", userID);
};

function App() {
  const [data, setData] = useState();
  const userID = localStorage.getItem("SuprsendUser");

  useEffect(() => {
    fetchUserDetails(userID, function (obj) {
      setData(obj);
    });
  }, []);

  if (!userID) {
    createUser();
  }

  return (
    <SuprSendProvider
      workspaceKey={process.env.REACT_APP_WORKSPACE_KEY}
      workspaceSecret={process.env.REACT_APP_WORKSPACE_SECRET_KEY}
      subscriberId={data?.subscriber_id}
      distinctId={data?.distinct_id}
      pollingInterval={7}
    >
      <InboxExample />
    </SuprSendProvider>
  );
}

export default App;
