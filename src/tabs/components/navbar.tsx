import React from "react";


function Navbar() {
  return (
    <div>
      <div className="navbar p-2.5 flex flex-wrap text-lg font-medium">
        <img src='./static/icon.svg' />
        ExamLock Lite
        <span className="flex-auto"></span>
        <button id="profile">
          <img
            className="h-8"
            src="https://www.svgrepo.com/show/23012/profile-user.svg"
          />
        </button>
      </div>
      <hr />
    </div>
  );
}

export default Navbar;