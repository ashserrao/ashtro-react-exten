import React, { useEffect } from "react";
import Camera from "./camera";

function Content(togglepopup) {
  // Destructure togglepopup from props
  const containerStyle = {
    position: "fixed",
    width: "300px",
    height: "450px",
    backgroundColor: "#F6F5F2",
    zIndex: 999999,
    top: "10px",
    right: "10px",
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

    const draggableDiv = document.getElementById("draggableDiv");

    if (draggableDiv) {
      draggableDiv.onmousedown = function (event) {
        let shiftX = event.clientX - draggableDiv.getBoundingClientRect().left;
        let shiftY = event.clientY - draggableDiv.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
          // Calculate new positions
          let newLeft = pageX - shiftX;
          let newTop = pageY - shiftY;

          // Boundary checks
          if (newLeft < 0) newLeft = 0;
          if (newTop < 0) newTop = 0;
          if (newLeft + draggableDiv.offsetWidth > canvas.width)
            newLeft = canvas.width - draggableDiv.offsetWidth;
          if (newTop + draggableDiv.offsetHeight > canvas.height)
            newTop = canvas.height - draggableDiv.offsetHeight;

          // Set new positions
          draggableDiv.style.left = newLeft + "px";
          draggableDiv.style.top = newTop + "px";
        }

        function onMouseMove(event) {
          moveAt(event.pageX, event.pageY);
        }

        // Move the div when the mouse moves
        document.addEventListener("mousemove", onMouseMove);

        // Remove the mousemove listener when the mouse button is released
        document.onmouseup = function () {
          document.removeEventListener("mousemove", onMouseMove);
          document.onmouseup = null;
        };

        // Prevent default dragging of the element
        draggableDiv.ondragstart = function () {
          return false;
        };
      };
    }

    // Clean up the event listeners and canvas on component unmount
    return () => {
      if (draggableDiv) {
        draggableDiv.onmousedown = null;
      }
      document.body.removeChild(canvas);
    };
  }, []);

  return (
    <div id="draggableDiv" style={containerStyle}>
      <Camera />
    </div>
  );
}

export default Content;
