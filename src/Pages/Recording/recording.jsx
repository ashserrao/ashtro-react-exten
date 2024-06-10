import React from "react";

const Navbar = () => {
  return (
    <div>
      <div class="w-full p-2.5 flex flex-wrap text-lg font-medium">
        <img src="/assets/icon.svg" alt="icon" />
        ExamLock Lite
        <span class="flex-auto"></span>
        <button id="profile">
          <img
            class="h-8"
            src="https://www.svgrepo.com/show/23012/profile-user.svg"
            alt="profile-icon"
          />
        </button>
      </div>
      <hr />
    </div>
  );
};

function Recording() {
  return (
    <div>
      <Navbar />
    </div>
  );
}

export default Recording;

export { Navbar };
