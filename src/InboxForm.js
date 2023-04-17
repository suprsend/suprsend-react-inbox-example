import { useState } from "react";
import suprsend from "@suprsend/web-sdk";
import { toast, ToastContainer } from "react-toastify";
import { ReactComponent as CrossIcon } from "./assets/crossIcon.svg";
import { ReactComponent as QuestionMarkIcon } from "./assets/questionMarkIcon.svg";
import Tooltip from "./Tooltip";
import "react-toastify/dist/ReactToastify.css";

const mandatoryFieldMessage = "This field is required";

function formValidation({ text, avatar, subtext, actions, url }) {
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
    url: "",
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
    errors.text = mandatoryFieldMessage;
  }

  if (avatar?.action_url && !avatar?.avatar_url) {
    errors.avatar.avatar_url = mandatoryFieldMessage;
  }

  if (subtext?.action_url && !subtext?.text) {
    errors.subtext.text = mandatoryFieldMessage;
  }

  if (actions?.[0]?.name && !actions?.[0]?.url) {
    errors.actions[0].url = mandatoryFieldMessage;
  }

  if (actions?.[0]?.url && !actions?.[0]?.name) {
    errors.actions[0].name = mandatoryFieldMessage;
  }

  if (actions?.[1]?.name && !actions?.[1]?.url) {
    errors.actions[1].url = mandatoryFieldMessage;
  }

  if (actions?.[1]?.url && !actions?.[1]?.name) {
    errors.actions[1].name = mandatoryFieldMessage;
  }

  return errors;
}

function handleSendNotification({
  text,
  url,
  avatar,
  subtext,
  actions,
  setFormErrors,
  setText,
  setUrl,
  setAvatar,
  setSubtext,
  setActions,
}) {
  const errors = formValidation({ text, avatar, subtext, actions, url });

  if (
    errors?.text ||
    errors?.avatar?.avatar_url ||
    errors?.subtext?.text ||
    errors?.actions?.[0]?.name ||
    errors?.actions?.[0]?.url ||
    errors?.actions?.[1]?.url ||
    errors?.actions?.[1]?.name
  ) {
    setFormErrors(errors);
    return;
  }

  const formDetails = {
    text: text,
    avatar: avatar,
    subtext: subtext,
    url: url,
    actions: actions,
  };
  suprsend.track("INBOX DEMO - SEND NOTIFICATION", formDetails);

  toast("Notification will be triggered in a while", {
    type: "success",
    position: "bottom-right",
    hideProgressBar: true,
    theme: "light",
    closeOnClick: true,
    autoClose: 2000,
  });

  clearForm({ setText, setUrl, setAvatar, setSubtext, setActions });
}

function clearForm({ setText, setUrl, setAvatar, setSubtext, setActions }) {
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
}

function InboxForm({ showToast, setShowToast }) {
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
  const [formErrors, setFormErrors] = useState({});

  let clonedFormErrors = { ...formErrors };

  const enableButton =
    text ||
    avatar?.avatar_url ||
    avatar?.action_url ||
    subtext?.text ||
    subtext?.action_url ||
    url ||
    actions?.[0]?.name ||
    actions?.[0]?.url ||
    actions?.[1]?.name ||
    actions?.[1]?.url;

  return (
    <div className="col-span-1">
      <h1 className="text-xl text-black font-bold">
        Inbox Notification Example
      </h1>
      <p className="mt-2 text-sm font-normal text-[#4B5563]">
        This is where you can add the content of the notification
      </p>

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
            if (formErrors?.text) {
              clonedFormErrors.text = "";
              setFormErrors(clonedFormErrors);
            }
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
          className="text-sm font-medium text-gray-700 mb-1 flex items-center"
        >
          Avatar
          <Tooltip
            content="Left side image to show profile image"
            direction="top"
          >
            <QuestionMarkIcon className="h-4 w-4 ml-1 text-[#6D727E]" />
          </Tooltip>
        </label>
        <div className="flex w-9/12">
          <div className="w-full">
            <input
              id="avatar"
              className="w-full rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 h-10 mr-1.5 px-3"
              placeholder="Image URL"
              value={avatar?.avatar_url}
              onChange={(e) => {
                setAvatar({ ...avatar, avatar_url: e.target.value });
                if (formErrors?.avatar?.avatar_url) {
                  clonedFormErrors.avatar.avatar_url = "";
                  setFormErrors(clonedFormErrors);
                }
              }}
            />
            {formErrors?.avatar?.avatar_url && (
              <p className="text-sm text-red-500">
                {formErrors?.avatar?.avatar_url}
              </p>
            )}
          </div>
          <div className="w-full">
            <input
              id="avatar_action_url"
              className="w-full rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 h-10 ml-1.5 px-3"
              placeholder="Click Action URL"
              value={avatar?.action_url}
              onChange={(e) => {
                setAvatar({ ...avatar, action_url: e.target.value });
                if (!e.target.value && formErrors?.avatar?.avatar_url) {
                  clonedFormErrors.avatar.avatar_url = "";
                  setFormErrors(clonedFormErrors);
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="subtext"
          className="text-sm font-medium text-gray-700 mb-1 flex items-center"
        >
          Subtext
          <Tooltip content="Shown below body text" direction="top">
            <QuestionMarkIcon className="h-4 w-4 ml-1 text-[#6D727E]" />
          </Tooltip>
        </label>
        <div className="flex w-9/12">
          <div className="w-full">
            <input
              id="subtext"
              className="w-full rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 h-10 mr-1.5 px-3"
              placeholder="Subtext"
              value={subtext?.text}
              onChange={(e) => {
                setSubtext({ ...subtext, text: e.target.value });
                if (formErrors?.subtext?.text) {
                  clonedFormErrors.subtext.text = "";
                  setFormErrors(clonedFormErrors);
                }
              }}
            />
            {formErrors?.subtext?.text && (
              <p className="text-sm text-red-500">
                {formErrors?.subtext?.text}
              </p>
            )}
          </div>
          <div className="w-full">
            <input
              id="subtext_action_url"
              className="w-full rounded-md sm:text-sm border border-gray-300 placeholder-gray-300 h-10 ml-1.5 px-3"
              placeholder="Click Action URL"
              value={subtext?.action_url}
              onChange={(e) => {
                setSubtext({ ...subtext, action_url: e.target.value });
                if (!e.target.value && formErrors?.subtext?.text) {
                  clonedFormErrors.subtext.text = "";
                  setFormErrors(clonedFormErrors);
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="mb-6">
        <label
          htmlFor="url"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Action URL
        </label>
        <input
          id="url"
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

                      if (formErrors?.actions?.[i]?.name) {
                        clonedFormErrors.actions[i].name = "";
                        setFormErrors(clonedFormErrors);
                      }
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

                      if (formErrors?.actions?.[i]?.url) {
                        clonedFormErrors.actions[i].url = "";
                        setFormErrors(clonedFormErrors);
                      }
                    }}
                  />
                  {formErrors?.actions?.[i]?.url && (
                    <p className="text-sm text-red-500 ml-2 mt-1">
                      {formErrors?.actions?.[i]?.url}
                    </p>
                  )}
                </div>
                <div className="mt-2 ml-4">
                  <button
                    type="button"
                    onClick={() => {
                      let newArr = [...actions];
                      newArr[i] = { name: "", url: "" };
                      setActions(newArr);

                      if (
                        formErrors?.actions?.[i]?.url ||
                        formErrors?.actions?.[i]?.name
                      ) {
                        clonedFormErrors.actions[i] = { name: "", url: "" };
                        setFormErrors(clonedFormErrors);
                      }
                    }}
                  >
                    <CrossIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center">
        <input
          id="toast"
          type="checkbox"
          className="h-4 w-4"
          checked={showToast}
          onChange={(e) => {
            setShowToast(e.target.checked);
          }}
        />
        <label htmlFor="toast" className="text-sm text-gray-700 ml-2">
          Show toast
        </label>
      </div>
      <div className="flex justify-center ml-48">
        <button
          className="bg-[#066AF3] rounded py-2 px-3 text-sm text-white disabled:opacity-50"
          disabled={!enableButton}
          onClick={() => {
            handleSendNotification({
              text,
              url,
              avatar,
              subtext,
              actions,
              setFormErrors,
              setText,
              setUrl,
              setAvatar,
              setSubtext,
              setActions,
              setShowToast,
            });
          }}
        >
          Send Notification
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default InboxForm;
