import React from "react";
import Navbar from "./navbar";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div>
      <Navbar />
      <div className="mx-2">
        <h5 className="text-lg font-medium">Advanced System Check</h5>
        <h6 className="text-base font-medium" id="opsys">
          Loading...
        </h6>
        <p className="text-sm font-medium py-2">
          Our tool is checking to ensure your system is compatible to provide a
          best experience for your exam.
        </p>
        <img className="my-2" src="/static/Group 1000003788.svg" />
      </div>
      <div className="bottom-sec px-2 mt-60 text-center">
        <Link to="/about">
          <button
            className="w-full bg-teal-600 text-slate-100 font-semibold rounded p-1 hover:bg-teal-700"
            id="begin-system-check"
          >
            Begin System Check
          </button>
        </Link>
        <a
          className="text-teal-600 underline underline-offset-2 mt-2 hover:text-teal-600 hover:underline underline-offset-2  hover:mt-2 hover:font-medium"
          href="https://erv2dev.examroom.ai/#/auth/login"
          target="_blank"
        >
          Login to start exam
        </a>
      </div>
    </div>
  );
}

export default Landing;
