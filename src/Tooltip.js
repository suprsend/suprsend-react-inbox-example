import React, { useState } from "react";

const Tooltip = (props) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, props.delay || 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  if (props.content) {
    return (
      <div
        className="Tooltip-Wrapper"
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
      >
        {/* Wrapping */}
        {props.children}
        {active && (
          <div
            className={`Tooltip-Tip ${props.direction || "top"} normal-case`}
          >
            {/* Content */}
            {props.content}
          </div>
        )}
      </div>
    );
  } else {
    return props.children;
  }
};

export default Tooltip;
