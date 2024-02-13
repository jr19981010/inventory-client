import React, { useRef } from "react";
import socket from "../../../socket";
import './AddItems.css';
import { FaPlus, FaTimes } from 'react-icons/fa';

const AddItems = ({setReload, reload, addItems, setAddItems}) => {

    const itemName = useRef();

    const emitCallback = (eventName, data) => {
        return new Promise ((resolve, reject) => {
            socket.emit(eventName, data, (result) => {
                if ( result.success ) {
                    resolve(result);
                } else {
                    reject('Operation failed!');
                }
            });
        });
    };
    

    const handleItemData = async () => {
        
        try {      
            const setItemData = {
                name: itemName.current.value,
            }  
            const result = await emitCallback('addItem', setItemData);
            console.log('Server confirmed add:', result);
        } catch ( error ) {
            console.log(error);
        }
        setReload(!reload);
        setAddItems(false);
    };
    return(
        <>
            <div className="del-Item-modal">
      <div className="modal-delItem-content">

        <label htmlFor="name">name</label>
        <input ref={itemName} type="text" id="name" name="name" />  
        <div className="ctrl-addItem-sec">
  
        <button className="add-addItem-btn"  onClick={handleItemData}><FaPlus /> add</button> 
        <button className="del-addItem-btn" onClick={() => setAddItems(false)}><FaTimes /> close</button>
        </div>
      </div>
    </div>

        </>
    );
}

export default AddItems;
