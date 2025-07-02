import { useEffect, useState } from "react";
import { db } from "../firebaseInit";
import ImageForm from "./ImageForm";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import Slider from "./Slider";
import "./ImageList.css"; // Assuming you have some styles for the image list
import { useNotification } from "../Custom Hooks/useNotification";

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

    // Cleanup listener on unmount or imgFolderId change
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
  const handleEditClick = (e, photo) => {
    e.preventDefault();
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

  return (
    <>
      <Notification />
      <div className="imageListHeading">
        <p>This is the image folder {albumName}</p>
        <button
          onClick={(e) => {
            handleBack(e);
          }}
        >
          Back
        </button>

        <input
          type="text"
          name="searchImg"
          id="searchImg"
          className="searchImg"
          placeholder="Search Image"
          onChange={(e) => {
            e.preventDefault();
            searchImage(e.target.value);
          }}
        />
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
        >
          Add Image
        </button>
      )}

      <div>
        <h2>Photos for Album: {albumName}</h2>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {(searchedPhotos.length > 0 ? searchedPhotos : photos).map(
            (photo, index) => (
              <div
                key={photo.id}
                onClick={() => openSlider(index)}
                style={{
                  margin: "10px",
                  border: "1px solid #ddd",
                  padding: "10px",
                }}
              >
                <h3>{photo.title}</h3>
                {photo.imageUrl && (
                  <div className="photo-container">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="photo-image"
                    />
                    <div className="photo-overlay">
                      <button onClick={(e) => handleEditClick(e, photo)}>
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setDeleteData({
                            title: photo.title,
                            time: new Date(photo.createdAt),
                            photoId: photo.id,
                          });
                          // deleteImg(e);

                          setShowDelete(true);
                          setShowImageForm(true);
                        }}
                      >
                        Delete
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
