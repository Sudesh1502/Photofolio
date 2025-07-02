import { useEffect, useRef} from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebaseInit";
import { useNotification } from "../Custom Hooks/useNotification";
import "../Custom Hooks/Notification.css";

const ImageForm = ({
  setImageSignal,
  imgFolderId,
  handleRemoveImageForm,
  editData,
  handleEdit,
  ExImgData,
  setEditData,
  deleteData,
  showDelete,
  setShowDelete,
  setShowImageForm,
  deleteImgNotify,
}) => {
  const titleRef = useRef();
  const urlRef = useRef();
  const { showNotification, Notification } = useNotification();

  useEffect(() => {
    if (!titleRef.current || !urlRef.current) return;

    if (editData) {
      titleRef.current.value = ExImgData?.title || "";
      urlRef.current.value = ExImgData?.imageUrl || "";
    } else {
      titleRef.current.value = "";
      urlRef.current.value = "";
    }
  }, [editData, ExImgData]);

  const handleAddImageToAlbum = async (e, albumId) => {
    e.preventDefault();
    let imageTitle = titleRef.current.value;
    let imageUrl = urlRef.current.value;

    if (!imageTitle.trim() || !imageUrl.trim()) {
      return alert("Please enter image title and URL.");
    }
    try {
      const photosCollectionRef = collection(db, "albums", albumId, "photos");
      await addDoc(photosCollectionRef, {
        title: imageTitle,
        imageUrl: imageUrl, 
        createdAt: Timestamp.now(),
      });

      console.log(
        `Image "${imageTitle}" successfully added to album ID: ${albumId}`
      );
      setImageSignal((prev) => !prev);
      showNotification("Image successfully added to album!", "green");
    } catch (error) {
      console.error("Error adding image to album:", error);
      showNotification("Failed to add image to album.", "gray");
    }
  };

  const clearText = (e) => {
    e.preventDefault();
    titleRef.current.value = "";
    urlRef.current.value = "";
    showNotification("Cleared input fields", "gray");
  };

  const handleEditImage = (e) => {
    e.preventDefault();
    let title = titleRef.current.value;
    let imageUrl = urlRef.current.value;
    if (!title.trim() || !imageUrl.trim()) {
      return alert("Please enter image title and URL.");
    }
    handleEdit(title, imageUrl, imgFolderId);
  };

  const handleDeleteImage = async () => {
    try {
      const photoDocRef = doc(
        db,
        "albums",
        imgFolderId,
        "photos",
        deleteData?.photoId
      );

      await deleteDoc(photoDocRef);
      setShowDelete(false);
      setShowImageForm(false);
      deleteImgNotify();
    } catch (error) {
      console.error("Error deleting image:", error);
      showNotification("Failed to delete image.", "gray");
    }
  };
  return (
    <>
      <Notification />
      <div className="ImageForm">
        <button
          onClick={(e) => {
            handleRemoveImageForm(e);
            setEditData(false);
          }}
        >
          Cancel
        </button>

        {showDelete ? (
          <div className="deleteBox">
            <div className="deleteText">
              <p>
                {`Are you sure you want to delete the image "${deleteData?.title}" posted on "${deleteData?.time}"?`}
              </p>
            </div>
            <div className="deleteBtns">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteImage();
                }}
              >
                Yes Delete
              </button>
              <button>Cancel</button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              handleAddImageToAlbum(e, imgFolderId);
            }}
          >
            <h1>{editData ? "Update" : "Add"} Image</h1>
            <div className="formGroup">
              <label htmlFor="albumTitle">Image Title</label>
              <input
                ref={titleRef}
                type="text"
                id="imageTitle"
                name="imageTitle"
                placeholder="Enter image title"
              />
              <label htmlFor="imageUrl">Image Url</label>
              <input
                ref={urlRef}
                type="text"
                id="imageUrl"
                name="imageUrl"
                placeholder="Enter image url"
              />
            </div>

            <button
              className="clearBtn"
              onClick={(e) => {
                clearText(e);
              }}
            >
              clear
            </button>
            {editData ? (
              <button
                onClick={(e) => {
                  handleEditImage(e);
                }}
              >
                Edit Image
              </button>
            ) : (
              <button type="submit">Add Image</button>
            )}
          </form>
        )}
      </div>
    </>
  );
};

export default ImageForm;
