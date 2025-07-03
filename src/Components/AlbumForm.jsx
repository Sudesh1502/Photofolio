import { useRef, useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebaseInit";
import { useNotification } from "../Custom Hooks/useNotification";
import "../Custom Hooks/Notification.css";
import "./AlbumForm.css";

const AlbumForm = ({ setSignal, setShowForm }) => {
  const [title, setTitle] = useState("");
  const titleRef = useRef();
  const { showNotification, Notification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let newTitle = titleRef.current.value;

    if (!newTitle.trim()) {
      alert("Please enter a valid album title.");
      return;
    }
    setTitle(newTitle);
    console.log(titleRef.current.value, title);

    await addDoc(collection(db, "albums"), {
      title: newTitle,
      createdAt: Timestamp.now(),
    });
    setSignal((prev) => !prev); // Trigger re-render in AlbumList
    showNotification("successfully created new Folder!", "green");
  };

  const removeForm = (e) => {
    e.preventDefault();
    setShowForm(false);
  };

  return (
    <>
      <Notification />
      <div className="albumForm">
        <form className="addForm" onSubmit={handleSubmit}>
          <div className="album-form-header">
            <h2>Create Album</h2>
            <button className="cancel-btn" onClick={removeForm}>
              Cancel
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="albumTitle">Album Title</label>
            <input
              ref={titleRef}
              type="text"
              id="albumTitle"
              name="albumTitle"
              placeholder="Enter album title"
            />
          </div>
          <div className="btns">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                titleRef.current.value = "";
                setTitle("");
              }}
              className="clear-btn"
            >
              Clear
            </button>
            <button type="submit" className="create-album-btn">
              Create Album
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AlbumForm;
