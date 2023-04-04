import { useState } from "react";
import suprsend from "@suprsend/web-sdk";
import { useNotifications, useBell, useEvent } from "@suprsend/react-headless";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import NotificationPreview from "./NotificationsPreview";
import CrossIconRed from "../assets/crossIconRed.png";
import DefaultPreviewIcon from "../assets/defaultPreviewIcon.png";
import { ReactComponent as BellIcon } from "../assets/bellIcon.svg";

const InboxExample = () => {
  const [text, setText] = useState("");
  const [avatar, setAvatar] = useState({ avatar_url: "", action_url: "" });
  const [subtext, setSubtext] = useState({
    text: "",
    action_url: "",
  });
  const [url, setUrl] = useState("");
  const [actions, setActions] = useState([
    {
      name: "",
      url: "",
    },
    {
      name: "",
      url: "",
    },
  ]);
  const [showToast, setShowToast] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { notifications, markClicked, unSeenCount } = useNotifications();
  const { markAllSeen } = useBell();

  useEvent("new_notification", (newNotification) => {
    newNotification?.forEach((data) => {
      toast.success(
        <div className="bg-white flex items-start">
          <img
            src={data?.message?.avatar?.avatar_url}
            alt="avatar"
            className="h-6 w-6 rounded-full"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = DefaultPreviewIcon;
            }}
          />
          <p className="text-sm ml-2 mt-1">{data?.message?.text}</p>
        </div>,
        {
          icon: false,
          theme: "light",
          closeOnClick: true,
          hideProgressBar: true,
          position: "bottom-right",
        }
      );
    });
  });

  const triggeredToastMessage = () =>
    toast("Notification will be triggered in a moment!", {
      type: "success",
      position: "bottom-right",
      hideProgressBar: true,
      theme: "light",
      closeOnClick: true,
    });

  return (
    <div className="p-20 grid grid-cols-2">
      <div className="col-span-1">
        <h1 className="text-xl text-black font-bold">
          React Native Inbox Notification example
        </h1>
        <p className="mt-2 text-sm font-normal text-[#4B5563]">
          This is where you can add the content of the notification
        </p>
        <form
          onChange={() => {
            setFormErrors({});
          }}
        >
          <div className="mt-6 mb-4">
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Text
              <span className="text-sm text-red-500">*</span>
            </label>
            <textarea
              id="text"
              rows="4"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
              }}
              className="w-9/12 rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 px-3 py-1"
              placeholder="This is a sample notification"
            />
            {formErrors?.text && (
              <p className="text-sm text-red-500">{formErrors?.text}</p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="avatar"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Avatar
            </label>
            <div className="flex w-9/12">
              <div className="w-full">
                <input
                  id="text"
                  className="w-full rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 h-10 mr-1.5 px-3"
                  placeholder="Image URL"
                  value={avatar?.avatar_url}
                  onChange={(e) => {
                    setAvatar({ ...avatar, avatar_url: e.target.value });
                  }}
                />
                {formErrors?.avatar?.avatar_url && (
                  <p className="text-sm text-red-500">
                    {formErrors?.avatar?.avatar_url}
                  </p>
                )}
              </div>

              <input
                id="text"
                className="w-full rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 h-10 ml-1.5 px-3"
                placeholder="Click Action URL"
                value={avatar?.action_url}
                onChange={(e) => {
                  setAvatar({ ...avatar, action_url: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="subtext"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subtext
            </label>
            <div className="flex w-9/12">
              <div className="w-full">
                <input
                  id="text"
                  className="w-full rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 h-10 mr-1.5 px-3"
                  placeholder="Subtext"
                  value={subtext?.text}
                  onChange={(e) => {
                    setSubtext({ ...subtext, text: e.target.value });
                  }}
                />
                {formErrors?.subtext?.text && (
                  <p className="text-sm text-red-500">
                    {formErrors?.subtext?.text}
                  </p>
                )}
              </div>
              <input
                id="text"
                className="w-full rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 h-10 ml-1.5 px-3"
                placeholder="Click Action URL"
                value={subtext?.action_url}
                onChange={(e) => {
                  setSubtext({ ...subtext, action_url: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="action_url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Action URL
            </label>
            <input
              id="text"
              className="w-9/12 rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 px-3 h-10"
              placeholder="Redirect URL for entire card click"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
              }}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="action_url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Action Buttons
            </label>
            <div>
              {[...Array(2)].map((x, i) => {
                return (
                  <div className="flex flex-row w-9/12" key={i}>
                    <div className="w-full mb-3">
                      <input
                        id={`actions[${i}].name`}
                        placeholder={`Button ${i + 1} Title`}
                        value={actions?.[i]?.name}
                        className="w-full rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 h-10 mr-1.5 px-3 "
                        onChange={(e) => {
                          let newArr = [...actions];
                          newArr[i]["name"] = e.target.value;
                          setActions(newArr);
                        }}
                      />
                      {formErrors?.actions?.[i]?.name && (
                        <p className="text-sm text-red-500 ml-2">
                          {formErrors?.actions?.[i]?.name}
                        </p>
                      )}
                    </div>
                    <div className="w-full">
                      <input
                        id={`actions[${i}].url`}
                        placeholder={`Button ${i + 1} Link`}
                        value={actions?.[i]?.url}
                        className="w-full rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 h-10 ml-1.5 px-3"
                        onChange={(e, index) => {
                          let newArr = [...actions];
                          newArr[i]["url"] = e.target.value;
                          setActions(newArr);
                        }}
                      />
                      {formErrors?.actions?.[i]?.url && (
                        <p className="text-sm text-red-500 ml-2 mt-1">
                          {formErrors?.actions?.[i]?.url}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 ml-2">
                      <button
                        type="button"
                        onClick={() => {
                          let newArr = [...actions];
                          newArr[i] = { name: "", url: "" };
                          setActions(newArr);
                        }}
                      >
                        <img
                          className="h-3 w-3 ml-2"
                          src={CrossIconRed}
                          alt="rec cross icon"
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={showToast}
              onChange={(e) => {
                setShowToast(e.target.checked);
              }}
            />
            <p className="text-sm text-gray-700 ml-2">Show toast </p>
          </div>
        </form>
        <div className="flex justify-center ml-48">
          <button
            className="bg-[#386EBC] rounded py-2 px-3 text-sm text-white"
            onClick={() => {
              let errors = {
                text: "",
                avatar: {
                  avatar_url: "",
                  action_url: "",
                },
                subtext: {
                  text: "",
                  action_url: "",
                },
                actions: [
                  {
                    name: "",
                    url: "",
                  },
                  {
                    name: "",
                    url: "",
                  },
                ],
              };

              if (!text) {
                errors.text = "This field is required";
              }

              if (!avatar?.avatar_url && avatar?.action_url) {
                errors.avatar.avatar_url = "This field is required";
              }

              if (!subtext?.text && subtext?.action_url) {
                errors.subtext.text = "This field is required";
              }

              if (actions?.[0]?.name && !actions?.[0]?.url) {
                errors.actions[0].url = "This field is required";
              }

              if (!actions?.[0]?.name && actions?.[0]?.url) {
                errors.actions[0].name = "This field is required";
              }

              if (actions?.[1]?.name && !actions?.[1]?.url) {
                errors.actions[1].url = "This field is required";
              }

              if (!actions?.[1]?.name && actions?.[1]?.url) {
                errors.actions[1].name = "This field is required";
              }

              if (
                !errors.text &&
                !errors.avatar.avatar_url &&
                !errors.subtext.text &&
                !errors.actions[0].name &&
                !errors.actions[0].url &&
                !errors.actions[1].url &&
                !errors.actions[1].name
              ) {
                errors = {};
              }
              setFormErrors(errors);

              if (Object.keys(errors).length === 0) {
                const formDetails = {
                  text: text,
                  avatar: avatar,
                  subtext: subtext,
                  url: url,
                  actions: actions,
                };
                suprsend.track("INBOX DEMO - SEND NOTIFICATION", formDetails);

                triggeredToastMessage();

                setText("");
                setAvatar({ avatar_url: "", action_url: "" });
                setSubtext({
                  text: "",
                  action_url: "",
                });
                setUrl("");
                setActions([
                  {
                    name: "",
                    url: "",
                  },
                  {
                    name: "",
                    url: "",
                  },
                ]);
                setShowToast(false);
              }
              return null;
            }}
          >
            Send Notification
          </button>
        </div>
      </div>
      <div className="col-span-1 w-9/12 pl-16">
        <div className="flex">
          <div>
            <div
              className="ml-8 cursor-pointer"
              onClick={() => {
                setShowNotifications(!showNotifications);
                markAllSeen();
              }}
            >
              {unSeenCount > 0 && (
                <div className="absolute">
                  <div
                    style={{
                      flex: 1,
                      width: "20px",
                      height: "20px",
                      backgroundColor: "#066AF3",
                      borderRadius: "50%",
                      marginLeft: 14,
                      marginTop: -4,
                    }}
                  >
                    <p className="text-sm text-white font-medium text-center">
                      {unSeenCount}
                    </p>
                  </div>
                </div>
              )}

              <BellIcon className="h-7 w-7" />
            </div>
            <p className="text-md font-medium border-b-2 border-[#066AF3]">
              Notifications
            </p>
          </div>
          <a
            href="repo"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto mt-9 text-sm text-gray-500 mr-6"
          >
            Github repo
          </a>
          <a
            href="doc"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 text-sm text-gray-500"
          >
            Documentation
          </a>
        </div>
        <NotificationPreview
          showNotifications={showNotifications}
          notifications={notifications}
          markClicked={markClicked}
        />
      </div>
      <ToastContainer />
    </div>
  );
};

export default InboxExample;
