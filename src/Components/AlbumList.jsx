import { useEffect, useState } from "react";
import { db } from "../firebaseInit.js";
import {
  updateDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
import folderSVG from "../Static/222522634_5c23f889-065f-43dd-a012-0e87b13e47b8.svg";
import "./AlbumList.css";
import "../Custom Hooks/Notification.css";
import { useNotification } from "../Custom Hooks/useNotification.jsx";
import AlbumForm from "./AlbumForm.jsx";
import { BsThreeDotsVertical } from "react-icons/bs";
import ImageList from "./ImageList.jsx"; // Assuming you have an ImageList component to display images
const AlbumList = () => {
  const [albums, setAlbums] = useState([]);
  const [signal, setSignal] = useState(false); // Added signal state for re-rendering
  const [showForm, setShowForm] = useState(false); // Added signal state for re-rendering
  const [showImgs, setShowImgs] = useState(false);
  const [imgFolderId, setImgFolderId] = useState(null);
  const [activeOverlayId, setActiveOverlayId] = useState(null);
  const { showNotification, Notification } = useNotification();
  const [albumName, setAlbumName] = useState(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const snapshot = await getDocs(collection(db, "albums"));
        const albumsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAlbums(albumsData); // Correct: Set state with the actual data
        console.log(albumsData); // Log the fetched albums data
      } catch (err) {
        // Added type annotation for 'err' for TypeScript
        console.error("Error fetching albums:", err.message); // More robust error logging
      }
    };

    fetchAlbums(); // Call the async function
  }, [signal]);

  const addForm = (e) => {
    e.preventDefault();
    setShowForm(true); // Trigger re-render in AlbumList
  };

  const handleDeleteAlbum = async (e, albumId) => {
    e.preventDefault();
    try {
      // Get a reference to the specific album document
      const albumDocRef = doc(db, "albums", albumId);

      // Delete the document
      await deleteDoc(albumDocRef);

      console.log(`Album with ID: ${albumId} successfully deleted!`);
      // You might want to update your local state here to remove the album from the UI
      // For example: setAlbums(prevAlbums => prevAlbums.filter(album => album.id !== albumId));
      showNotification("successfully deleted!", "red");
    } catch (error) {
      console.error("Error deleting album:", error);
      // Handle the error, e.g., show a user-friendly message
    }
    setSignal((prev) => !prev);
    setActiveOverlayId(null);
  };

  const handleUpdateAlbumTitle = async (e, albumId, exTitle) => {
    e.preventDefault();
    const newTitle = prompt("Enter new album title:");
    if (!newTitle || !newTitle.trim()) {
      return;
    }
    alert(
      `Are you sure you want to update the album title from "${exTitle}"to "${newTitle}"?`
    );
    try {
      const albumDocRef = doc(db, "albums", albumId);

      await updateDoc(albumDocRef, {
        title: newTitle,
      });

      console.log(
        `Album with ID: ${albumId} title successfully updated to: "${newTitle}"`
      );
      setAlbums((prevAlbums) =>
        prevAlbums.map((album) =>
          album.id === albumId ? { ...album, title: newTitle } : album
        )
      );
      setActiveOverlayId(null);
      showNotification("successfully updated!", "yellow");
    } catch (error) {
      console.error("Error updating album title:", error);
      setSignal((prev) => !prev);
      document.refresh();
      setActiveOverlayId(null);
    }
  };

  const albumClick = (albunId, title) => {
    setShowImgs(true);
    setImgFolderId(albunId);
    setAlbumName(title);
  };

  return (
    <>
      <Notification />
      {showImgs ? (
        <ImageList
          className="imageList"
          imgFolderId={imgFolderId}
          albumName={albumName}
          setShowImgs={setShowImgs}
        />
      ) : (
        <div className="albumList">
          <div className={showForm ? "showForm" : "albumListHeader"}>
            {!showForm ? (
              <button className="add-album-btn" onClick={addForm}>
                ADD ALBUM
              </button>
            ) : (
              <AlbumForm setSignal={setSignal} setShowForm={setShowForm} />
            )}
          </div>

          <div className="albums">
            {albums?.map((album) => {
              const isActive = activeOverlayId === album.id;

              return (
                <div
                  key={album.id}
                  onClick={() => {
                    albumClick(album.id, album.title);
                  }}
                  className="album"
                >
                  <div className="folder">
                    <img src={folderSVG} className="foldersvg" alt="folder" />
                  </div>

                  <div className="folderTitleWrapper">
                    <div className="folderName">{album?.title}</div>
                    <div
                      className="editing"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveOverlayId((prev) =>
                          prev === album.id ? null : album.id
                        );
                      }}
                    >
                      <BsThreeDotsVertical />
                    </div>

                    {isActive && (
                      <div className="popup-menu">
                        <button
                          className="update-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateAlbumTitle(e, album.id, album.title);
                          }}
                        >
                          Rename
                        </button>
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAlbum(e, album.id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default AlbumList;
