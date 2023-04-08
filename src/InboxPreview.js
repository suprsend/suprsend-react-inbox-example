import { useEffect, useRef, useState } from "react";
import { useNotifications, useBell, useEvent } from "@suprsend/react-headless";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { marked } from "marked";
import DOMPurify from "dompurify";
import DefaultAvatarIcon from "./assets/defaultAvatarIcon.png";
import SuprSendLogo from "./assets/suprsendLogo.png";
import { ReactComponent as BellIcon } from "./assets/bellIcon.svg";
import { ReactComponent as GithubIcon } from "./assets/github.svg";
import { ReactComponent as DocumentIcon } from "./assets/document.svg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function useComponentVisible(initialIsVisible) {
  const [showNotifications, setShowNotifications] = useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return { ref, showNotifications, setShowNotifications };
}

const renderer = {
  link(href, title, text) {
    return `<a href=${href} title=${title} style="color:#066AF3;text-decoration:none;white-space:normal;">
        ${text}
      </a>`;
  },
  list(body, ordered) {
    if (ordered) {
      return `<ol style="list-style:revert;white-space:normal;margin:0px;padding-left:15px;">${body}</ol>`;
    } else {
      return `<ul style="list-style:revert;white-space:normal;margin:0px;padding-left:15px;">${body}</ul>`;
    }
  },
  paragraph(text) {
    return `<p style="white-space:pre-line">${text}</p>`;
  },
  blockquote(src) {
    return `<blockquote style="margin:0px;padding-left:10px;border-left:2px #DBDADA solid;margin-top:5px; margin-bottom:5px;">${src}</blockquote>`;
  },
};

marked.use({ renderer });

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  relativeTime: {
    past: "%ss",
    s: "1m",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1m",
    MM: "%dm",
    y: "1y",
    yy: "%dy",
  },
});

function ToastNotification({ data }) {
  return (
    <div className="bg-white flex items-start max-h-14">
      {data?.message?.avatar?.avatar_url ? (
        <img
          src={data?.message?.avatar?.avatar_url}
          alt="avatar"
          className="h-6 w-6 rounded-full"
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = DefaultAvatarIcon;
          }}
        />
      ) : (
        <img
          src={DefaultAvatarIcon}
          alt="avatar"
          className="h-6 w-6 rounded-full"
        />
      )}
      <div
        className="text-sm break-words ml-2"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(marked(data?.message?.text)),
        }}
      />
    </div>
  );
}

function NotificationItem({ notifications, notification, index, markClicked }) {
  const notificationdetails = notification?.message;
  const text = notificationdetails?.text;
  const actionOne = notificationdetails?.actions?.[0];
  const actionTwo = notificationdetails?.actions?.[1];
  const hasButtons = actionOne || actionTwo;

  return (
    <a
      href={notificationdetails?.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        markClicked(notification?.n_id);
      }}
      key={index}
    >
      <div
        className={classNames(
          notification?.seen_on
            ? "bg-white hover:bg-gray-50"
            : "bg-[#F4F9FF] hover:bg-[#DFECFF]",
          notifications?.length !== index + 1 && "border-b border-gray-100",
          index === 0 && "rounded-t-xl"
        )}
      >
        <div className="p-4 cursor-pointer flex w-full">
          <div className="inline-flex items-start mr-2 w-[10%]">
            {notificationdetails?.avatar?.avatar_url ? (
              <a
                href={notificationdetails?.avatar?.action_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  markClicked(notification?.n_id);
                }}
              >
                <img
                  src={notificationdetails?.avatar?.avatar_url}
                  alt="avatar"
                  className="h-10 w-10 rounded-full"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = DefaultAvatarIcon;
                  }}
                />
              </a>
            ) : (
              <img
                src={DefaultAvatarIcon}
                alt="avatar"
                className="h-10 w-10 rounded-full"
              />
            )}
          </div>

          <div className="w-[85%]">
            {notificationdetails?.text && (
              <div
                className="text-sm break-words text-[#1c1c1c]"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(marked(text)),
                }}
              />
            )}
            {notificationdetails?.subtext?.text && (
              <a
                href={notificationdetails?.subtext?.action_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.stopPropagation();
                  markClicked(notification?.n_id);
                }}
              >
                <div className="text-xs break-words text-[#707070] mt-2 hover:underline">
                  {notificationdetails?.subtext?.text}
                </div>
              </a>
            )}
          </div>
          <div className="w-[5%] ml-auto">
            {notification?.created_on && (
              <p className="text-xs text-[#707070]">
                {dayjs(notification?.created_on).fromNow(true)}
              </p>
            )}
            {!notification?.seen_on && (
              <div className="w-4 mt-4">
                <div className="w-2 h-2 bg-[#066AF3] rounded mt-2 ml-1"></div>
              </div>
            )}
          </div>
        </div>

        {hasButtons && (
          <div className="flex pr-4 pl-[60px] pb-4 border-b">
            {actionOne && (
              <div
                className="bg-[#066AF3] text-white mr-2 rounded py-1 font-medium text-sm"
                style={{ maxWidth: "50%" }}
              >
                <a
                  href={actionOne?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    markClicked(notification?.n_id);
                  }}
                >
                  <div className="break-all text-center px-5 cursor-pointer">
                    {actionOne?.name}
                  </div>
                </a>
              </div>
            )}
            {actionTwo && (
              <div
                className="bg-white border border-gray-200 text-[#434343] mr-2 rounded py-1 font-medium text-sm"
                style={{ maxWidth: "50%" }}
              >
                <a
                  href={actionTwo?.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.stopPropagation();
                    markClicked(notification?.n_id);
                  }}
                >
                  <div className="break-all text-center px-5 cursor-pointer">
                    {actionTwo?.name}
                  </div>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </a>
  );
}

function NotificationList({ notifications, markClicked }) {
  return (
    <div className="max-h-[500px] overflow-x-auto">
      {notifications.map((notification, index) => {
        return (
          <NotificationItem
            notifications={notifications}
            notification={notification}
            index={index}
            markClicked={markClicked}
          />
        );
      })}
    </div>
  );
}

function NotificationPreview({ notifications, markClicked }) {
  const hasNotifications = notifications?.length > 0;

  return (
    <div>
      <div className="w-10 overflow-hidden ml-[35px] bg-white">
        <div className="h-4 w-4 border border-gray-300 rotate-45 transform origin-bottom-left bg-white"></div>
      </div>
      <div className="rounded-xl border border-gray-300 -mt-[0.8px]">
        <div className="max-h-[550px]">
          {!hasNotifications ? (
            <div className="h-[300px] flex justify-center items-center">
              <p className="text-sm text-gray-500">
                No notification triggered yet
              </p>
            </div>
          ) : (
            <NotificationList
              notifications={notifications}
              markClicked={markClicked}
            />
          )}
          <div className="py-3 border-t border-gray-200 flex items-center justify-center">
            <p className="text-xs text-gray-400">Powered By</p>
            <img
              src={SuprSendLogo}
              alt="suprsend_logo"
              className="w-18 h-4 ml-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function InboxPreview({ showToast }) {
  const toastRef = useRef(showToast);

  const { ref, showNotifications, setShowNotifications } =
    useComponentVisible(false);
  const { notifications, markClicked, unSeenCount } = useNotifications();
  const { markAllSeen } = useBell();

  useEffect(() => {
    toastRef.current = showToast;
  }, [showToast]);

  useEvent("new_notification", (newNotification) => {
    newNotification?.forEach((data) => {
      if (toastRef.current) {
        toast(ToastNotification({ data }), {
          icon: false,
          type: "success",
          theme: "light",
          closeOnClick: true,
          hideProgressBar: true,
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    });
  });

  return (
    <div className="col-span-1 w-9/12 pl-16" ref={ref}>
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
          href="https://github.com/suprsend/react-inbox-example"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto mt-9 text-sm text-gray-500 mr-6 flex items-center"
        >
          <GithubIcon className="h-4 w-4 mr-1" />
          Github repo
        </a>
        <a
          href="https://docs.suprsend.com/docs/inbox-react-native"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-9 text-sm text-gray-500 flex items-center"
        >
          <DocumentIcon className="h-4 w-4 mr-1" />
          Documentation
        </a>
      </div>
      {showNotifications && (
        <NotificationPreview
          notifications={notifications}
          markClicked={markClicked}
        />
      )}
    </div>
  );
}

export default InboxPreview;
