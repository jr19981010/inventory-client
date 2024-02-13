import React, { useState } from "react";
import './Navigation.css';
import Inventory from "../Inventory/inventory";
import Categories from "../Categories/Categories";
import Items from "../Items/Items";

const Navigation = () => {
  const [inventory, setInventory] = useState(true);
  const [categories, setCategories] = useState(false);
  const [items, setItems] = useState(false);

  const showInv = () => {
    setCategories(false);
    setItems(false);
    setInventory(true);
  }

  const showCat = () => {
    setInventory(false);
    setItems(false);
    setCategories(true);
  }

  const showItem = () => {
    setCategories(false);
    setInventory(false);
    setItems(true);
  }

  return(
        <>
        <h1 className="title">Inventory Management System</h1>
        <nav className="navigation">
        <ul className="ul-nav">
          <li onClick={showInv}>HOME</li>
          <li onClick={showCat}>CATEGORIES</li>
          <li onClick={showItem}>ITEMS</li>
        </ul>
      </nav>
      {inventory  && <Inventory/>}
      {categories && <Categories />}
      {items && <Items />}
      </>
    )
}

export default Navigation;