import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import Modal from "react-modal";
import { Navbar } from "../Recording/recording";

function Idscan() {
  let imagesAllowed = 2;
  const webcamRef = useRef(null);
  const [submit, setSubmit] = useState(false);
  const [images, setImages] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImages((prevImages) => {
      const newImages = [...prevImages, imageSrc];
      if (newImages.length >= imagesAllowed) {
        setSubmit(true);
      }
      return newImages;
    });
  };

  const handleUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages((prevImages) => {
        const newImages = [...prevImages, reader.result];
        if (newImages.length >= imagesAllowed) {
          setSubmit(true);
        }
        return newImages;
      });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
    closeUploadModal();
  };

  const deleteImage = (index) => {
    setImages((prevImages) => {
      const newImages = prevImages.filter((_, i) => i !== index);
      if (newImages.length < imagesAllowed) {
        setSubmit(false);
      }
      return newImages;
    });
  };

  const clearAllImages = () => {
    setImages([]);
    setSubmit(false);
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const openViewModal = (imageSrc) => {
    setCurrentImage(imageSrc);
    setIsViewModalOpen(true);
  };

  const closeViewModal = () => {
    setIsViewModalOpen(false);
    setCurrentImage(null);
  };

  const handleSubmit = async () => {
    console.log("Submitting images:", images);
    let message = {
      action: "id-cards",
      data: images,
    };
    chrome.runtime.sendMessage(message, (response) => {
      console.log("Response from background script:", response);
    });
    window.location = "./face_scan.html";
  };

  return (
    <div>
      <style>{`
    li {
      list-style-type: circle;
      padding-bottom: 1% ;
    }

    img {
      aspect-ratio: 16/9;
      object-fit: contain;
    }
    `}</style>
      <Navbar />
      <div className="flex flex-wrap">
        <div
          className="h-full w-1/2 rounded border"
          style={{ height: "35.5rem" }}
        >
          <h1 className="text-center text-lg font-semibold">ID scan</h1>
          <div className="w-full flex justify-center">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={640}
              height={480}
            />
          </div>
          <div className="w-full flex justify-center">
            <button
              className="m-2 bg-teal-600 text-slate-100 font-semibold rounded p-2 hover:bg-teal-700"
              onClick={submit ? handleSubmit : capture}
            >
              {submit ? "Submit" : "Capture photo"}
            </button>
            <button
              onClick={openUploadModal}
              className={`m-2 bg-teal-600 text-slate-100 font-semibold rounded p-2 hover:bg-teal-700 ${
                submit && "cursor-not-allowed opacity-50"
              }`}
              disabled={submit}
            >
              Upload Image
            </button>
            <button
              onClick={clearAllImages}
              className="m-2 bg-red-600 text-slate-100 font-semibold rounded p-2 hover:bg-red-700"
            >
              Delete All
            </button>
          </div>
        </div>
        <div
          className="border rounded w-1/2 h-1/5 overflow-scroll"
          style={{ height: "35.5rem" }}
        >
          <h1 className="p-1 text-lg font-semibold">Preview</h1>
          <hr />
          <div className="flex flex-wrap w-full">
            <div className="flex flex-wrap">
              {images.map((src, index) => (
                <div
                  key={index}
                  className="flex text-center my-2 mx-4 p-2 border"
                  style={{ flexDirection: "column" }}
                >
                  <h1 className="w-full text-medium font-semibold">{`Image ${
                    index + 1
                  }`}</h1>
                  <img
                    onClick={() => openViewModal(src)}
                    src={src}
                    alt={`Captured ${index + 1}`}
                    style={{ width: "400px", cursor: "pointer" }}
                  />
                  <button
                    onClick={() => deleteImage(index)}
                    className="my-2 bg-red-600 text-slate-100 font-semibold rounded p-2 hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-2 rounded border my-4">
        <h1 className="text-lg font-semibold">Instructions</h1>
        <hr />
        <div className="px-6 my-2">
          <ul>
            <li>
              Your can either capture the ID using your web-camera or you can
              upload the image of your ID
            </li>
            <li>
              Please align yourself in the middle of the frame before capturing
              the photo.
            </li>
            <li>
              Please upload a valid ID else your exam will be disqualified.
            </li>
            <li>Please make sure the ID is not expired.</li>
            <li>One photo ID is mandatory.</li>
          </ul>
        </div>
      </div>

      <Modal
        isOpen={isUploadModalOpen}
        onRequestClose={closeUploadModal}
        contentLabel="Upload Image"
        ariaHideApp={false}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <h2 className="font-semibold">Upload Image</h2>
        <input type="file" accept="image/*" onChange={handleUpload} />
        <button
          onClick={closeUploadModal}
          className="mt-4 bg-red-600 text-slate-100 font-semibold rounded p-2 hover:bg-red-700"
        >
          Close
        </button>
      </Modal>
      <Modal
        isOpen={isViewModalOpen}
        onRequestClose={closeViewModal}
        contentLabel="View Image"
        ariaHideApp={false}
        style={{
          content: {
            width: "40%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        <div className="w-full flex justify-end">
          <button
            onClick={closeViewModal}
            className="mt-4 bg-red-600 text-slate-100 font-semibold rounded p-2 hover:bg-red-700 justify-right"
          >
            Close
          </button>
        </div>
        {currentImage && (
          <img src={currentImage} alt="View" style={{ width: "100%" }} />
        )}
      </Modal>
    </div>
  );
}

export default Idscan;
