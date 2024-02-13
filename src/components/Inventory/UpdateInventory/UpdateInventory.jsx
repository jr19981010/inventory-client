import React, {useState,useEffect, useLayoutEffect, useRef} from "react";
import socket from "../../../socket";
import './UpdateInventory.css';
import { FaEdit , FaTimes } from 'react-icons/fa';

const UpdateInventory = ({selectedItem, updateInv, setUpdateInv, reload, setReload, }) => {
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


  //promise for updating
    const emitWithUpdCallback = (eventName, data) => {
        return new Promise((resolve, reject) => {
           socket.emit(eventName, data, (result) => {
              if (result.success) {
                resolve('successfully Updated!', result);
              } else {
                reject('Operation Failed');
              }
           }); 
        });
    };
    
    const useItem = useRef();
    const useCategory = useRef();
    const useQuantity = useRef();

//passing data to designated part
    useLayoutEffect(() => {
      if (selectedItem?.item && selectedItem?.category){
        const selectedItemData= dataItem.find(item => item.name.toLowerCase() ===         selectedItem.item.toLowerCase());
        const selectedCatData = dataCategory.find(cat => cat.name.toLowerCase() === selectedItem.category.toLowerCase());

        useItem.current.value = selectedItemData?.id;
        useCategory.current.value = selectedCatData?.id;
        useQuantity.current.value = selectedItem.quantity;
      }
    }, [selectedItem, dataItem, dataCategory]);

//edit
const handleEdit = async () => {
  try {
    const updatedData = {
      id: selectedItem.id,
      item: useItem.current.value,
      category: useCategory.current.value,
      quantity: useQuantity.current.value,
    };

    const result = await emitWithUpdCallback('editInv', updatedData);
    console.log('Server confirmed update:', result);
    setReload(!reload);
    setUpdateInv(!updateInv);
    
  } catch (error) {
    console.error('Error during updating:', error.message);
  }
};

    return (
        <>
          <div className="del-inventory-modal">
            <div className="modal-delInv-content">
          <h3>+ Update Category</h3>
          <label htmlFor="name">Name</label>
          <select ref={useItem} id="item" name="item">
            {dataItem.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          <label htmlFor="status">Status</label>
          <select ref={useCategory} id="category" name="category">
          {dataCategory.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
          </select>
          <label htmlFor="quantity">Quantity</label>
          <input ref={useQuantity} type="number" id="quantity" name="quantity" />
          <div className="ctrl-delInv-sec">
          <button className="add-delInv-btn"  onClick={handleEdit}><FaEdit /> Update</button>
          <button className="del-delInv-btn" onClick={() =>    setUpdateInv(false)}><FaTimes /> Close</button>
          </div>
          </div>
          </div>
        </>
      );
};

export default UpdateInventory;