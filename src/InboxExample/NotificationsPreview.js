import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import { marked } from "marked";
import DOMPurify from "dompurify";
import DefaultPreviewIcon from "../assets/defaultPreviewIcon.png";
import SuprSendLogo from "../assets/suprsendLogo.png";

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

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

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

const NotificationPreview = ({
  showNotifications,
  notifications,
  markClicked,
}) => {
  if (showNotifications)
    return (
      <>
        <div className="w-10 overflow-hidden ml-[35px] bg-white">
          <div className="h-4 w-4 border border-gray-300 rotate-45 transform origin-bottom-left bg-white"></div>
        </div>
        <div className="rounded-lg shadow border border-gray-200 -mt-[0.8px]">
          <div className="max-h-[550px]">
            {!notifications || notifications?.length === 0 ? (
              <div className="h-[300px] flex justify-center items-center">
                <p className="text-sm text-gray-500">
                  No notification triggered yet
                </p>
              </div>
            ) : (
              <div className="max-h-[500px] overflow-x-auto">
                {notifications.map((notification, index) => {
                  const notificationdetails = notification?.message;

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
                            : "bg-[#F4F9FF] hover:bg-[#DFECFF]"
                        )}
                      >
                        <div className="p-4 cursor-pointer flex w-full">
                          <div className="inline-flex items-start mr-2 w-[10%]">
                            {notificationdetails?.avatar?.action_url ? (
                              <a
                                href={notificationdetails?.avatar?.action_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                              >
                                <img
                                  src={notificationdetails?.avatar?.avatar_url}
                                  alt="avatar"
                                  className="h-10 w-10 rounded-full"
                                  onError={({ currentTarget }) => {
                                    currentTarget.onerror = null; // prevents looping
                                    currentTarget.src = DefaultPreviewIcon;
                                  }}
                                />
                              </a>
                            ) : (
                              <img
                                src={DefaultPreviewIcon}
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
                                  __html: DOMPurify.sanitize(
                                    marked(notificationdetails?.text)
                                  ),
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

                        <div className="flex pr-4 pl-[60px] pb-4 border-b">
                          {[...Array(2)].map((x, i) => {
                            if (
                              notificationdetails?.actions?.[i] &&
                              notificationdetails?.actions?.[i]?.name &&
                              notificationdetails?.actions?.[i]?.url
                            ) {
                              const buttonName =
                                notificationdetails?.actions?.[i]?.name;
                              const buttonLink =
                                notificationdetails?.actions?.[i]?.url;

                              if (!buttonName || !buttonLink) return null;
                              return (
                                <div
                                  className={classNames(
                                    i === 0
                                      ? "bg-[#066AF3] text-white"
                                      : "bg-white border border-gray-200 text-[#434343]",
                                    "mr-2 rounded py-1 font-medium text-sm"
                                  )}
                                  style={{ maxWidth: "50%" }}
                                  key={i}
                                >
                                  <a
                                    href={notificationdetails?.actions[i].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                    }}
                                  >
                                    <div className="break-all text-center px-5 cursor-pointer">
                                      {notificationdetails.actions[i].name}
                                    </div>
                                  </a>
                                </div>
                              );
                            } else {
                              return null;
                            }
                          })}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
            <div className="py-2 border-t border-gray-200 flex items-center justify-center">
              <p className="text-sm text-gray-400">Powered By</p>
              <img
                src={SuprSendLogo}
                alt="suprsend_logo"
                className="w-18 h-4 ml-1.5"
              />
            </div>
          </div>
        </div>
      </>
    );
};

export default NotificationPreview;
