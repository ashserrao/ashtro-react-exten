import React from "react";

const Navbar = () => {
  return (
    <div>
      {/* <!-- logo and profile line --> */}
      <div class="navbar p-2.5 flex flex-wrap text-lg font-medium">
        <img src="/assets/icon.svg" alt="logo" />
        ExamLock Lite
        <span class="flex-auto"></span>
        <button id="profile">
          <img
            class="h-8"
            src="https://www.svgrepo.com/show/23012/profile-user.svg"
            alt="profile-pic"
          />
        </button>
      </div>
      <hr />
    </div>
  );
};

function Popup() {
  return (
    <div>
      <Navbar />
      <h1 className="text-xl">Working fine</h1>
      <a href="./systemcheck.html">go next</a>
    </div>
  );
}

export default Popup;

export { Navbar };
