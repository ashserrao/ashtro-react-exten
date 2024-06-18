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

// function Recording() {
//   chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "save-video") {
//       console.log("video saved !!!");
//       console.log(message.recordings);
//       sendResponse("message received by DB saver");
//     }
//   });

//   const Persons = [
//     "Recording 1",
//     "Recording 2",
//     "Recording 3",
//     "Recording 4",
//     "Recording 5",
//     "Recording 6",
//     "Recording 7",
//     "Recording 8",
//     "Recording 9",
//     "Recording 10",
//   ];
//   return (
//     <div>
//       <Navbar />
//       <div class="flex justify-center my-3 content">
//         <div class="h-56 overflow-hidden w-11/12 border rounded">
//           <h6
//             class="flex flex-start text-lg font-semibold px-1 py-1"
//             id="rec-header"
//           >
//             Your Recordings
//           </h6>
//           <hr />
//           <div className="h-48 overflow-scroll">
//             <ul class="px-1" id="recording-list">
//               {Persons.map((person, index) => (
//                 <React.Fragment key={index}>
//                   <li className="py-1">{person}</li>
//                   <hr />
//                 </React.Fragment>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>
//       <button className="mx-3 px-3 py-2 rounded bg-teal-600 font-semibold text-slate-50">
//         Resync
//       </button>
//     </div>
//   );
// }

// export default Recording;

export { Navbar };
