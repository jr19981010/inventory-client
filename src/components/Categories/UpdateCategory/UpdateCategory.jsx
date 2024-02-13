import React, { useEffect, useRef } from "react";
import socket from "../../../socket";
import './UpdateCategory.css';
import { FaEdit , FaTimes } from 'react-icons/fa';

const UpdateCategory = ({
  reload,
  setReload,
  updateCat,
  setUpdateCat,
  selectItem,
}) => {
  const useName = useRef();
  useEffect(() => {
    if (selectItem) {
      useName.current.value = selectItem.name;
    }
  }, [selectItem]);

  const emitCallback = (eventName, data) => {
    return new Promise((resolve, reject) => {
      socket.emit(eventName, data, (result) => {
        if (result.success) {
          resolve(result);
        } else {
          reject("Operation Failed!");
        }
      });
    });
  };

  const handleEdit = async () => {
    try {
      const updateData = {
        id: selectItem.id,
        name: useName.current.value,
      };
      const result = await emitCallback("editCat", updateData);
      console.log("Server confirmed update:", result);
      setReload(!reload);
      setUpdateCat(false);
    } catch (error) {
      console.error("Error during updating:", error.message);
    }
  };

  return (
    <>          
    
    <div className="del-Category-modal">
    <div className="modal-delCat-content">

      <h3>+ Update Category</h3>
      <label htmlFor="name">name</label>
      <input ref={useName} type="text" id="name" name="name" />
      <div className="ctrl-delCat-sec">

      <button className="add-delCat-btn" onClick={handleEdit}><FaEdit /> update</button>
      <button className="del-delCat-btn" onClick={() => setUpdateCat(false)} ><FaTimes /> close</button>
      </div>
          </div>
          </div>
    </>
  );
};

export default UpdateCategory;
