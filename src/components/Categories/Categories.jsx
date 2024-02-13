import React, { useEffect, useState, useRef } from "react";
import socket from "../../socket";
import AddCategory from "./AddCategory/AddCategory";
import UpdateCategory from "./UpdateCategory/UpdateCategory";
import './Categories.css';
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const Categories = () => {
  const [ addCategory, setAddCategory ] = useState(false);
  const [ UpdateCat, setUpdateCat ] = useState(false);
  const [reload, setReload] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [pageNumber, setPagenUmber] = useState([]);

  const [startIn, setStartIn] = useState(null);
  const [endIn, setEndIn] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [ selectItem, setSelectItem ] = useState(null);

  const [searchData, setSearchData] = useState([]);


  const itemsPerPage = 10;

  useEffect(() => {
    if (!searchTerm){
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setStartIn(startIndex);
      setEndIn(endIndex);
    
      socket.emit('reloadDataCategory');
      socket.on('rdCategories', (data) => {
        setFilteredData(data.slice(startIndex, endIndex));
        setPageCount(data.length);
      });
    }
  }, [reload, currentPage, searchTerm]);

  useEffect(() => {
    setPagenUmber(pageCount / itemsPerPage);
  }, [pageCount]);
  
  const catSetData = (id, name) => {
    setSelectItem({id, name});
    setUpdateCat(true)
  };

  const emitWithCatCallback = (eventName, data) => {
      return new Promise ((resolve, reject) => {
          socket.emit(eventName, data, (result) => {
            if ( result.success ) { 
                resolve(result);
            } else {
              reject('Operation failed!', result);
            }
          });
      });
  }

  const handleDelete = async (id) => {

    try{
        const result = await emitWithCatCallback('delCat', id);
        console.log(result);
        setReload(!reload);
    } catch ( error ) {
      console.log(error)
    }
  };

  const useTbl = useRef();
  const useDtlInv = useRef();

  useEffect(() => {
    if (!filteredData.length) {
      useTbl.current.style.display = "none";
      useDtlInv.current.style.display = "none";
    } else {
      useTbl.current.style.display = "";
      useDtlInv.current.style.display = "";
    }
  }, [filteredData, searchTerm]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setReload(!reload);
  };
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    if (searchTerm) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setStartIn(startIndex);
      setEndIn(endIndex);

      setFilteredData(searchData.slice(startIndex, endIndex));

      console.log("searchDAta fetch", searchData);

      setPageCount(searchData.length);
    } else {
      if (isFocused) {
        setCurrentPage(1);
      }
    }
  }, [searchTerm, searchData, currentPage, isFocused]);
  const emitWithSrcCallback = (eventName, data) => {
    return new Promise((resolve, reject) => {
      socket.emit(eventName, data, (result) => {
        if (result.length) {
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;

          setStartIn(startIndex);
          setEndIn(endIndex);
          setSearchData(result);

          console.log("raw searcg data fetch::", searchData);
          console.log("filtereddata2", result.slice(startIndex, endIndex));
          setPageCount(result.length);
          resolve("Operation succeeded.");
        } else {
          reject("Operation Failed.");
          setFilteredData([]);
        }
      });
    });
  };

  const handleSearch = async (data) => {
    try {
      const result = await emitWithSrcCallback("srchCat", data);
      console.log("searching...", result);
      setCurrentPage(1);
    } catch (error) {
      console.log("error searching!", error);
    }
  };

  return(
      <>

      <section className="sec-category">
      <div className="cat-header">
        <div className="title-srch-cat-sec">
      <h1 className="cat-list-title">Categories Lists</h1>
      <input
              className="inv-srch"
              placeholder="search"
              type="text"
              id="search"
              name="search"
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={searchTerm}

              onChange={(e) => {
                setSearchTerm(e.target.value); 
                handleSearch(e.target.value);
              }}
            />
      </div>

      <button className="add-cat-btn" onClick={() => setAddCategory(true)}><FaPlus /> Add Category</button>
      </div>

        <table ref={useTbl}  className="tbl-cat-list">
        <thead>
          <tr>
            <th>id</th>
            <th>name</th>
            <th>action</th>
          </tr>
        </thead>
        <tbody>{ filteredData.map((category) => (
          <tr key={category.id}>
            <td>{category.id}</td>
            <td>{category.name}</td>
            <td>
              <div className="btn-ctrl-inv-sec">
                  <button className="edit-cat-btn" onClick={() =>catSetData(category.id, category.name)}><FaEdit /></button>
                  <button className="delete-cat-btn" onClick={() => handleDelete(category.id)}><FaTrash /></button>
              </div>
            </td>
        </tr>
        ))          
}
        </tbody>
      </table> 
      {!filteredData.length && (
  <div className="not-found-container">
    <div className="not-found-icon">🚫</div>
    <p className="not-found-message">NOT FOUND!</p>
  </div>
)}

              <nav ref={useDtlInv} className="dtl-cat">
          <p className="dtl-p">
            Showing {startIn + 1} to {Math.min(endIn, pageCount)} of {pageCount}{" "}
            entries
          </p>
          <ul className="dtl-page">
            <li
              className={`prev-li ${currentPage === 1 ? "disabled" : ""}`}
              onClick={handlePreviousPage}
            >
              PREVIOUS
            </li>
            {Array.from({ length: Math.ceil(pageNumber) }).map((_, index) => (
              <li
                key={index + 1}
                className={currentPage === index + 1 ? "inv-active" : ""}
                onClick={() => handlePageClick(index + 1)}
              >
                {index + 1}
              </li>
            ))}

            <li
              className={`next-li ${
                currentPage === Math.ceil(pageNumber) ? "disabled" : ""
              }`}
              onClick={handleNextPage}
              disabled
            >
              NEXT
            </li>
          </ul>
        </nav>    
      </section>
      {
      addCategory && 
      <AddCategory 
      addCategory ={addCategory}
      setAddCategory ={setAddCategory}
      reload ={reload}
      setReload ={setReload}/>
      }

      {
      UpdateCat && 
      <UpdateCategory
      UpdateCat = { UpdateCat }
      setUpdateCat = { setUpdateCat }
      reload={ reload }
      setReload={ setReload }
      selectItem = { selectItem } />
    }
      </>
    );
}

export default Categories;