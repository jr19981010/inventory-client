import React, { useEffect, useRef } from "react";
import socket from "../../../socket";
import { FaEdit , FaTimes } from 'react-icons/fa';
import './UpdateItems.css';

const UpdateItems = ({selectItem, reload, setReload, updateItems, setUpdateItems}) => {
    const useName = useRef();
    useEffect(() => {
        if(selectItem) { 
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
    }

    const handleEdit = async () => {
        try {
            const updateData ={
                id: selectItem.id,
                name: useName.current.value,
            }
            const result = await emitCallback('editItem', updateData);
            console.log("Server confirmed update:", result);
            setReload(!reload);
            setUpdateItems(false);
        } catch ( error ) {
            console.error("Error during updating:", error.message);
        }
    }


    return(

        <>       
         <div className="del-Item-modal">
        <div className="modal-delItem-content">
        
            <label htmlFor="name">name</label>
            <input ref={useName} type="text" id="name" name="name" />
            <div className="ctrl-delItem-sec">

            <button className="add-delItem-btn"  onClick={handleEdit}><FaEdit /> update</button> 
            <button className="del-delItem-btn" onClick={() => setUpdateItems(false)}><FaTimes /> close</button>
            </div>
          </div>
          </div>

        </>
    );
};

export default UpdateItems;