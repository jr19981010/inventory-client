import React, { useEffect, useRef, useState } from "react";
import socket from "../../socket";
import AddInventory from "./AddInventory/AddInventory";
import UpdateInventory from "./UpdateInventory/UpdateInventory";
import "./Inventory.css";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";

const Inventory = () => {
  const [addInventory, setAddInventory] = useState(false);
  const [reload, setReload] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState([]);
  const [pageNumber, setPagenUmber] = useState([]);

  const [startIn, setStartIn] = useState(null);
  const [endIn, setEndIn] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const [updateInv, setUpdateInv] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [searchData, setSearchData] = useState([]);

  const itemsPerPage = 10;

  useEffect(() => {
    if (!searchTerm) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setStartIn(startIndex);
      setEndIn(endIndex);

      socket.emit("reloadDataInv");
      socket.on("rdInv", (data) => {
        console.log("raw data --", data);
        setFilteredData(data.slice(startIndex, endIndex));
        setPageCount(data.length);
      });
    }
  }, [reload, currentPage, searchTerm]);

  useEffect(() => {
    setPagenUmber(pageCount / itemsPerPage);
  }, [pageCount]);

  const emitWithDelCallback = (eventName, data) => {
    return new Promise((resolve, reject) => {
      socket.emit(eventName, data, (result) => {
        if (result.success) {
          resolve("successfully deleted!", result);
        } else {
          reject("Operation Failed.");
        }
      });
    });
  };

  const handleDelete = async (id) => {
    try {
      const result = await emitWithDelCallback("delInv", id);
      console.log("Server confirmed deletion:", result);
      setReload(!reload);
    } catch (error) {
      console.error("Error during deletion:", error.message);
    }
  };

  const invenSetData = (id, item, category, quantity) => {
    setSelectedItem({ id, item, category, quantity });
    setUpdateInv(true);
  };

  // console.log("filteredData ---", filteredData);

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
      const result = await emitWithSrcCallback("srchInv", data);
      console.log("searching...", result);
      setCurrentPage(1);
    } catch (error) {
      console.log("error searching!", error);
    }
  };

  return (
    <>
      <section className="sec-inventory">
        <div className="inv-header">
          <div className="title-srch-sec">
            <h1 className="inv-list-title">Inventory Lists</h1>
            <input
              className="inv-srch"
              placeholder="search"
              type="text"
              id="search"
              name="search"
              value={searchTerm}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleSearch(e.target.value);
              }}
            />
          </div>
          <button className="add-inv-btn" onClick={() => setAddInventory(true)}>
            <FaPlus /> Add Inventory
          </button>
        </div>

        <table ref={useTbl} className="tbl-inv-list">
          <thead>
            <tr>
              <th>id</th>
              <th>item</th>
              <th>category</th>
              <th>quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((inventory) => (
              <tr key={inventory.id}>
                <td>{inventory.id}</td>
                <td>{inventory.item}</td>
                <td>{inventory.category}</td>
                <td>{inventory.quantity}</td>
                <td>
                  <div className="btn-ctrl-inv-sec">
                    <button
                      className="edit-inv-btn"
                      onClick={() =>
                        invenSetData(
                          inventory.id,
                          inventory.item,
                          inventory.category,
                          inventory.quantity
                        )
                      }
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-inv-btn"
                      onClick={() => handleDelete(inventory.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filteredData.length && (
          <div className="not-found-container">
            <div className="not-found-icon">🚫</div>
            <p className="not-found-message">NOT FOUND!</p>
          </div>
        )}
        <nav ref={useDtlInv} className="dtl-inv">
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
      {addInventory && (
        <AddInventory
          addInventory={addInventory}
          setAddInventory={setAddInventory}
          reload={reload}
          setReload={setReload}
        />
      )}
      {updateInv && (
        <UpdateInventory
          selectedItem={selectedItem}
          updateInv={updateInv}
          setUpdateInv={setUpdateInv}
          reload={reload}
          setReload={setReload}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
      )}
    </>
  );
};

export default Inventory;
