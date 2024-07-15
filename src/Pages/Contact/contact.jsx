import React from "react";
import { Navbar } from "../Recording_Module/module";

function Contact() {
  return (
    <div>
      <style>
        {`
          .init-background {
            background: linear-gradient(119.47deg, #28AAE1 14.41%, #219ED7 17.33%, #1381BF 25.35%, #086CAD 33.37%, #0260A3 41.39%, #005CA0 49.41%, #0464A7 56.71%, #117DBB 69.1%, #25A4DC 83.69%, #28AAE1 85.87%);
          }
        `}
      </style>
      <Navbar />
      <div className="init-background h-3/6 flex flex-initial">
        <div>
          <img className="w-60" src="./assets/bot image.png" alt="bot-image" />
        </div>
        <div className="flex mx-auto self-center">
          <h1 className="text-3xl font-bold text-center text-slate-50">
            Your content is blocked due to restricted activity
          </h1>
        </div>
      </div>
      <div className="content my-10 flex justify-center">
        <div className="w-1/2 mx-2 rounded">
          <div className="py-1 px-2 cont-head">
            <p className="font-semibold text-3xl">
              For further assistance please get in touch with us
            </p>
            <p className="font-semibold text-xl pt-4">
              Call us at +1 877-848-3926
            </p>
            <p className="font-semibold text-xl py-2">
              Email us at support@examroom.ai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
