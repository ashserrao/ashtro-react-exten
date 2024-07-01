import React, { useContext, useEffect } from "react";
import Camera from "./Camera";
import Minified from "./Minified";
import { PopupContext } from "./Contentstate";
import Monitoring from "./Monitoring";

function Content() {
  const { isOpen, togglePopup } = useContext(PopupContext);

  const containerStyle = {
    position: "fixed",
    width: "fit-content",
    height: "fit-content",
    // background: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "#F6F5F2",
    zIndex: 999999,
    bottom: "10px",
    left: "10px",
    borderRadius: "10px",
    cursor: "move",
  };

  useEffect(() => {
    // Create and append the canvas
    const canvas = document.createElement("canvas");
    canvas.id = "transparentCanvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "999998";
    canvas.style.pointerEvents = "none"; // Allow clicks to pass through
    document.body.appendChild(canvas);

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", updateCanvasSize);

    const draggableDiv = document.getElementById("draggableDiv");

    if (draggableDiv) {
      const handleMouseDown = (event) => {
        let shiftX = event.clientX - draggableDiv.getBoundingClientRect().left;
        let shiftY = event.clientY - draggableDiv.getBoundingClientRect().top;

        const moveAt = (pageX, pageY) => {
          // Calculate new positions
          let newLeft = pageX - shiftX;
          let newTop = pageY - shiftY;

          // Boundary checks
          if (newLeft < 0) newLeft = 0;
          if (newTop < 0) newTop = 0;
          if (newLeft + draggableDiv.offsetWidth > window.innerWidth)
            newLeft = window.innerWidth - draggableDiv.offsetWidth;
          if (newTop + draggableDiv.offsetHeight > window.innerHeight)
            newTop = window.innerHeight - draggableDiv.offsetHeight;

          // Set new positions
          draggableDiv.style.left = newLeft + "px";
          draggableDiv.style.top = newTop + "px";
        };

        const handleMouseMove = (event) => {
          moveAt(event.pageX, event.pageY);
        };

        document.addEventListener("mousemove", handleMouseMove);

        const handleMouseUp = () => {
          document.removeEventListener("mousemove", handleMouseMove);
          document.removeEventListener("mouseup", handleMouseUp);
        };

        document.addEventListener("mouseup", handleMouseUp);

        draggableDiv.ondragstart = () => false;
      };

      draggableDiv.addEventListener("mousedown", handleMouseDown);

      return () => {
        draggableDiv.removeEventListener("mousedown", handleMouseDown);
      };
    }

    return () => {
      document.body.removeChild(canvas);
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [isOpen, togglePopup]);

  return (
    <div
      id="draggableDiv"
      style={{
        ...containerStyle,
      }}
    >
      <Minified />
      <Camera />
      <Monitoring />
    </div>
  );
}

export default Content;
