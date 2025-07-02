import { useRef, useState } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebaseInit";
import { useNotification } from "../Custom Hooks/useNotification";
import '../Custom Hooks/Notification.css'

const AlbumForm = ({setSignal, setShowForm}) => {
  const [title, setTitle] = useState("");
  const titleRef = useRef();
  const { showNotification, Notification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    let newTitle = titleRef.current.value

     if(!newTitle.trim()) {
        alert("Please enter a valid album title.");
        return;
     }
    setTitle(newTitle)
    console.log(titleRef.current.value, title)

    await addDoc(collection(db, "albums"), {
      title: newTitle,
      createdAt: Timestamp.now(),
    });
    setSignal((prev) => !prev); // Trigger re-render in AlbumList
    showNotification("successfully created new Folder!", "green")
  };
  
  const removeForm = (e) => {
    e.preventDefault();
    setShowForm(false);
  }
  
  return (
    <>
    <Notification />
      <div className="albumForm">
        <button onClick={removeForm}>Cancel</button>
        <form onSubmit={handleSubmit}>
            <h2>Create Album</h2>
          <div className="formGroup">
            <label htmlFor="albumTitle">Album Title</label>
            <input
              ref = {titleRef}
              type="text"
              id="albumTitle"
              name="albumTitle"
              placeholder="Enter album title"
            />
          </div>
          <button type="submit">Create Album</button>
        </form>
      </div>
    </>
  );
};

export default AlbumForm;
