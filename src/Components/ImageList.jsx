import { useEffect, useState } from "react";
import { db } from "../firebaseInit";
import ImageForm from "./ImageForm";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import Slider from "./Slider";
import "./ImageList.css"; 
import { useNotification } from "../Custom Hooks/useNotification";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoMdDownload } from "react-icons/io";


const ImageList = ({ imgFolderId, albumName, setShowImgs }) => {
  const [photos, setPhotos] = useState([]);
  const [searchedPhotos, setSearchedPhotos] = useState([]);
  const [imageSignal, setImageSignal] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(null);
  const [editData, setEditData] = useState(false);
  const [photoId, setPhotoId] = useState(null);
  const [exImgData, setExImgData] = useState({
    title: "",
    imageUrl: "",
  });
  const [deleteData, setDeleteData] = useState({
    title: "",
    time: null,
    photoId: "",
  });
  const [showDelete, setShowDelete] = useState(false);
  const { showNotification, Notification } = useNotification();

  useEffect(() => {
    if (!imgFolderId) return;

    const photosCollectionRef = collection(db, "albums", imgFolderId, "photos");

    const unsubscribe = onSnapshot(photosCollectionRef, (snapshot) => {
      const pht = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(
        `Real-time update: ${pht.length} photos for album ID: ${imgFolderId}`
      );
      setPhotos(pht);
    });
    return () => unsubscribe();
  }, [imgFolderId, imageSignal]);

  const handleBack = (e) => {
    e.preventDefault();
    setShowImgs(false);
  };
  const handleAddImage = (e) => {
    e.preventDefault();
    setShowImageForm(true);
  };

  const handleRemoveImageForm = (e) => {
    e.preventDefault();
    setShowImageForm(false);
  };

  const openSlider = (index) => setSliderIndex(index);

  const handleEdit = async (title, imageUrl, imgFolderId) => {
    try {
      const photoDocRef = doc(db, "albums", imgFolderId, "photos", photoId);
      await updateDoc(photoDocRef, {
        title: title,
        imageUrl: imageUrl,
        createdAt: new Date().getTime(),
      });
      setImageSignal((prev) => !prev);
      setShowImageForm(false);
      setEditData(false);
      showNotification("Image successfully updated!", "green");
    } catch (error) {
      console.error("Error updating image:", error);
      showNotification("Failed to update image.", "gray");
      setShowImageForm(false);
      setEditData(false);
    }
  };
  const handleEditClick = (photo) => {
    setExImgData({
      title: photo.title,
      imageUrl: photo.imageUrl,
    });
    setPhotoId(photo.id);
    setEditData(true);
    setShowImageForm(true);
  };

  const deleteImgNotify = () => {
    showNotification("Image successfully deleted!", "red");
  };

  const searchImage = (text) => {
    const photo = photos.filter((photo) => {
      return photo.title.toLowerCase().includes(text.toLowerCase());
    });
    setSearchedPhotos(photo);
  };

  const handleDownload = async (e, photo) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await fetch(photo.imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${photo.title || "image"}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  return (
    <>
      <Notification />
      <div className="image-list-header">
        <div className="search-back-container">
          <div>
            <h2 className="list-heading">
              You are in  album {albumName}
            </h2>
          </div>

          <div className="search-back">
            <input
              type="text"
              name="searchImg"
              id="searchImg"
              className="search-img"
              placeholder="Search Image"
              onChange={(e) => {
                e.preventDefault();
                searchImage(e.target.value);
              }}
            />
            <button className="back-btn" onClick={handleBack}>
              Back
            </button>
          </div>
        </div>
      </div>

      {showImageForm ? (
        <ImageForm
          imgFolderId={imgFolderId}
          setImageSignal={setImageSignal}
          handleRemoveImageForm={handleRemoveImageForm}
          editData={editData}
          handleEdit={handleEdit}
          ExImgData={exImgData}
          setEditData={setEditData}
          deleteData={deleteData}
          showDelete={showDelete}
          setShowDelete={setShowDelete}
          setShowImageForm={setShowImageForm}
          deleteImgNotify={deleteImgNotify}
        />
      ) : (
        <button
          onClick={(e) => {
            handleAddImage(e);
          }}
          className="add-image-btn"
        >
          Add Image
        </button>
      )}

      <div>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {(searchedPhotos.length > 0 ? searchedPhotos : photos).map(
            (photo, index) => (
              <div
                key={photo.id}
                onClick={() => openSlider(index)}
                className="image-item"
                style={{
                  margin: "10px",
                  border: "1px solid #ddd",
                  padding: "10px",
                }}
              >
                <h4 className="imageName" >{photo.title}</h4>
                {photo.imageUrl && (
                  <div className="photo-container">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="photo-image"
                    />
                    <div className="photo-overlay">
                      <button
                      className="overlay-btns"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEditClick(photo);
                        }}
                      >
                        <MdEdit style={{color: "green"}} />
                      </button>
                      <button
                      className="overlay-btns"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setDeleteData({
                            title: photo.title,
                            time: new Date(photo.createdAt.seconds * 1000 + photo.createdAt.nanoseconds / 1e6).toString(),
                            photoId: photo.id,
                          });
                          console.log("date format", photo.createdAt)
                          setShowDelete(true);
                          setShowImageForm(true);
                        }}
                      >
                        <MdDelete style={{color: "red"}}/>
                      </button>

                      <button
                      className="overlay-btns" onClick={(e) => handleDownload(e, photo)}>
                        <IoMdDownload style={{color: "orange"}} />
                      </button>
                    </div>
                  </div>
                )}
                <p>
                  Added:{" "}
                  {photo.createdAt?.toDate
                    ? photo.createdAt.toDate().toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* SLIDER MODAL */}
      {sliderIndex !== null && photos[sliderIndex] && (
        <Slider
          setSliderIndex={setSliderIndex}
          sliderIndex={sliderIndex}
          photos={photos}
        />
      )}
    </>
  );
};

export default ImageList;
