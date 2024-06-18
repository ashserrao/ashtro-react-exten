import React, { useState } from "react";
import { Navbar } from "../Recording/recording";

function Consent() {
  const [consent, setConsent] = useState(false);

  const handleCheckboxChange = () => {
    setConsent(!consent);
  };

  return (
    <div>
      <style>{`
    li {
    list-style-type: circle;
    padding-bottom: 1% ;
}
    `}</style>
      <Navbar />
      <div className="mx-10 my-4 p-2 border">
        <h1 className="font-bold text-lg">Consent Form</h1>
        <hr />
        <div className="py-1 px-6">
          <ol>
            <li>
              We strive to provide a more efficient and streamlined remote
              proctoring service for all users, both administrators, and
              candidates. By utilizing APIs and LTIs to create an automated
              system integrating with most LMS and databases, we can support a
              single sign-on system. Ensuring exam integrity by providing live
              person onboarding agents to verify identity and environment scans.
              Proctoring can be delivered by a live person, with AI assistance,
              or a standalone AI proctoring service.
            </li>
            <li>
              We strive to provide a more efficient and streamlined remote
              proctoring service for all users, both administrators, and
              candidates. By utilizing APIs and LTIs to create an automated
              system integrating with most LMS and databases, we can support a
              single sign-on system. Ensuring exam integrity by providing live
              person onboarding agents to verify identity and environment scans.
              Proctoring can be delivered by a live person, with AI assistance,
              or a standalone AI proctoring service.
            </li>
            <li>
              We strive to provide a more efficient and streamlined remote
              proctoring service for all users, both administrators, and
              candidates. By utilizing APIs and LTIs to create an automated
              system integrating with most LMS and databases, we can support a
              single sign-on system. Ensuring exam integrity by providing live
              person onboarding agents to verify identity and environment scans.
              Proctoring can be delivered by a live person, with AI assistance,
              or a standalone AI proctoring service.
            </li>
            <li>
              We strive to provide a more efficient and streamlined remote
              proctoring service for all users, both administrators, and
              candidates. By utilizing APIs and LTIs to create an automated
              system integrating with most LMS and databases, we can support a
              single sign-on system. Ensuring exam integrity by providing live
              person onboarding agents to verify identity and environment scans.
              Proctoring can be delivered by a live person, with AI assistance,
              or a standalone AI proctoring service.
            </li>
          </ol>
        </div>
        <div className="flex flex-wrap px-2">
          <input
            type="checkbox"
            checked={consent}
            onChange={handleCheckboxChange}
          />
          <span className="p-2">
            I have read and accepted the terms and conditions
          </span>
          <span className="flex flex-auto"></span>
          <button
            disabled={!consent}
            className={`bg-teal-600 text-slate-100 font-semibold rounded p-2 hover:bg-teal-700 ${
              !consent && "cursor-not-allowed opacity-50"
            }`}
            onClick={() => {
              window.location = "id_scan.html";
            }}
          >
            Start Recording
          </button>
        </div>
      </div>
    </div>
  );
}

export default Consent;
