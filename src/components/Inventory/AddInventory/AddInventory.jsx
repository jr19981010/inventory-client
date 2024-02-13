import React, { useEffect, useRef, useState } from "react";
import socket from "../../../socket";
import './AddInventory.css';
import { FaPlus, FaTimes } from 'react-icons/fa';



const AddInventory = ({ addInventory, setAddInventory, reload, setReload }) => {
  const invName = useRef();
  const invStatus = useRef();
  const invQuantity = useRef();
  const [ dataItem, setDataItem ] = useState([]);
  const [ dataCategory, setDataCategory ] = useState([]);

  useEffect(() => {
      socket.emit('reloadDataItems');
      socket.on('rdItems', (data) => {
        setDataItem([...data]);
      });

      socket.emit('reloadDataCategory');
      socket.on('rdCategories', (data) => {
        setDataCategory([...data]);
      });
  }, []);

const emitWithCallback = (eventName, data) =>{
  return new Promise((resolve, reject) => {
      socket.emit(eventName, data, (result) => {
        if (result.success) {
          resolve(result)
        } else {
          reject('Operation Failed.');
        }
      });
  });
};

const handleInvData = async () => {
  const invNameVal = invName.current.value;
  const invStatVal = invStatus.current.value;
  const invQuanVal = invQuantity.current.value;

  const setInvData = {
    item: invNameVal,
    category: invStatVal,
    quantity: invQuanVal,
  };

  const result = await emitWithCallback("addInv", setInvData);
  console.log('Server confirmed add:', result);
  setReload(!reload);
  setAddInventory(false);
  };

  return (
    <>
    <div className="del-inventory-modal">
      <div className="modal-delInv-content">
      <h3>+ Add Inventory</h3>
      <label htmlFor="items">Items</label>
      <select ref={invName} id="items" name="items" >
        {dataItem.map((item) => (
        <option key={item.id} value={item.id}>{item.name}</option>
        ))}
      </select>
      <label htmlFor="status">Status</label>
      <select ref={invStatus} id="status" name="status">
        {dataCategory.map((category) => (
          <option key={category.id} value={category.id}>{category.name}</option>
        ))}
      </select>
      <label htmlFor="quantity">Quantity</label>
      <input ref={invQuantity} type="number" id="quantity" name="quantity" />
      <div className="ctrl-addInv-sec">
      <button className="add-addInv-btn" onClick={handleInvData}><FaPlus /> Add</button>
      <button className="del-addInv-btn" onClick={() =>   setAddInventory(false)}><FaTimes /> Close</button>
      </div>
      </div>
    </div>
    </>
  );
};

export default AddInventory;
