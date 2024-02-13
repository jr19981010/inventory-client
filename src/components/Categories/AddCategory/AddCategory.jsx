import React, { useRef } from "react";
import socket from "../../../socket";
import './AddCategory.css';
import { FaPlus, FaTimes } from 'react-icons/fa';

const AddCategory = ({reload, setReload, setAddCategory}) => {
    const catName = useRef();

    const emitCallback = (eventName, data) => {
        return new Promise((resolve, reject) => {
            socket.emit(eventName, data, (result) =>{
                if ( result.success ) {
                    resolve(result);
                } else {
                    reject('Operation failed!');
                }
            });
        });
    }
    const handleCatData = async () => {
        try{
            const setCatData ={
                name: catName.current.value,
            }
            
            const result = await emitCallback('addCat', setCatData);
            console.log('Server confirmed add:', result);
        } catch ( error ) {
            console.log(error);
        }
    setReload(!reload);
    setAddCategory(false);
      
    }

   return(
    <>
    
    <div className="del-Category-modal">
      <div className="modal-delCat-content">

    <h3>Add Category</h3>
    <label htmlFor="name">name</label>
    <input ref={catName} type="text" id="name" name="name"/>
    <div className="ctrl-addCat-sec">

    <button className="add-addCat-btn" onClick={handleCatData}><FaPlus /> add</button>
    <button className="del-addCat-btn" onClick={() =>  setAddCategory(false)} ><FaTimes /> close</button>
    </div>
      </div>
    </div>

    </>

   ); 
}

export default AddCategory;