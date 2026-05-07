import { useState, useEffect } from "react";
import {
  FiEdit2,
  FiPlus,
  FiX,
  FiSquare,
  FiCheckSquare,
} from "react-icons/fi";

import "./Dashboard.css";
import RenameListModal from "./RenameListModal";
import AddItemModal from "./AddItemModal";
import EditItemModal from "./EditItemModal";
import ConfirmModal from "./ConfirmModal";
import ProfileMenu from "./ProfileMenu";

function Dashboard() {
  const [listName, setListName] = useState("My Grocery List");
  const [groceryData, setGroceryData] = useState([]);
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [isListDropdownOpen, setIsListDropdownOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [displayName, setDisplayName] = useState(
    localStorage.getItem("displayName") ||
      localStorage.getItem("username") ||
      ""
  );
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteCategoryIndex, setDeleteCategoryIndex] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedDisplayName = localStorage.getItem("displayName");

    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedDisplayName) {
      setDisplayName(storedDisplayName);
    } else if (storedUsername) {
      setDisplayName(storedUsername);
    }
  }, []);

  const groupItemsByCategory = items => {
    return items.reduce((acc, item) => {
      const categoryName = item.category || "Uncategorized";

      const existingCategory = acc.find(
        category => category.category === categoryName
      );

      const formattedItem = {
        id: item._id,
        name: item.name,
        quantity: item.quantity,
        checked: item.purchased,
      };

      if (existingCategory) {
        existingCategory.items.push(formattedItem);
      } else {
        acc.push({
          category: categoryName,
          items: [formattedItem],
        });
      }

      return acc;
    }, []);
  };


  const fetchLists = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/lists", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to fetch lists");
        return;
      }

      setLists(data);

      if (data.length > 0) {
        setSelectedList(prevSelectedList => prevSelectedList || data[0]);
        setListName(data[0].title);
      } else {
        setSelectedList(null);
        setListName("My Grocery List");
      }
    } catch (error) {
      console.error("Fetch lists error:", error);
    }
  };

  const fetchItems = async listId => {
    if (!listId) {
      setGroceryData([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/items?list=${listId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.message || "Failed to fetch items");
        return;
      }

      const groupedData = groupItemsByCategory(data);
      setGroceryData(groupedData);
    } catch (error) {
      console.error("Fetch items error:", error);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
    if (selectedList) {
      setListName(selectedList.title);
      fetchItems(selectedList._id);
    } else {
      setGroceryData([]);
    }
  }, [selectedList]);

  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("displayName");
    setIsLogoutModalOpen(false);
    window.location.href = "/login";
  };

  const handleEditTitle = () => {
    setIsRenameModalOpen(true);
  };

  const handleSaveTitle = async updatedTitle => {
    try {
      const trimmedTitle = updatedTitle.trim();

      if (!trimmedTitle) {
        alert("List name cannot be empty");
        return;
      }

      const token = localStorage.getItem("token");

      if (!selectedList) {
        alert("Please create or select a grocery list first");
        return;
      }

      const response = await fetch(`/api/lists/${selectedList._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: trimmedTitle }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update list name");
        return;
      }

      setListName(data.title);
      setSelectedList(data);
      setLists(prevLists =>
        prevLists.map(list => (list._id === data._id ? data : list))
      );
      setIsRenameModalOpen(false);
    } catch (error) {
      console.error("Update list name error:", error);
      alert("Server error");
    }
  };

  const handleCreateList = async () => {
    try {
      const token = localStorage.getItem("token");
      const title = newListTitle.trim() || "My Grocery List";

      const response = await fetch("/api/lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create list");
        return;
      }

      setLists(prevLists => [data, ...prevLists]);
      setSelectedList(data);
      setListName(data.title);
      setNewListTitle("");
      setIsListDropdownOpen(false);
    } catch (error) {
      console.error("Create list error:", error);
      alert("Server error");
    }
  };

  const handleSelectList = list => {
    setSelectedList(list);
    setListName(list.title);
    setIsListDropdownOpen(false);
  };

  const handleCreateItem = async newItem => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newItem.name,
          quantity: newItem.quantity,
          category: newItem.category,
          list: newItem.list,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to create item");
        return;
      }

      setGroceryData(prevData => {
        const existingCategory = prevData.find(
          category => category.category === data.category
        );

        if (existingCategory) {
          return prevData.map(category => {
            if (category.category !== data.category) return category;

            return {
              ...category,
              items: [
                ...category.items,
                {
                  id: data._id,
                  name: data.name,
                  quantity: data.quantity,
                  checked: data.purchased,
                },
              ],
            };
          });
        }

        return [
          ...prevData,
          {
            category: data.category,
            items: [
              {
                id: data._id,
                name: data.name,
                quantity: data.quantity,
                checked: data.purchased,
              },
            ],
          },
        ];
      });
    } catch (error) {
      console.error("Create item error:", error);
      alert("Server error");
    }
  };

  const handleToggleCheck = async (categoryIndex, itemId) => {
    try {
      const token = localStorage.getItem("token");

      const category = groceryData[categoryIndex];
      const currentItem = category.items.find(item => item.id === itemId);

      if (!currentItem) return;

      const response = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: currentItem.name,
          quantity: currentItem.quantity,
          category: category.category,
          purchased: !currentItem.checked,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update item");
        return;
      }

      setGroceryData(prevData =>
        prevData.map((categoryItem, cIndex) => {
          if (cIndex !== categoryIndex) return categoryItem;

          return {
            ...categoryItem,
            items: categoryItem.items.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    checked: data.purchased,
                  }
                : item
            ),
          };
        })
      );
    } catch (error) {
      console.error("Toggle check error:", error);
      alert("Server error");
    }
  };

  const handleOpenEditModal = (categoryIndex, item) => {
    setSelectedCategoryIndex(categoryIndex);
    setSelectedItem({
      ...item,
      category: groceryData[categoryIndex].category,
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEditedItem = async updatedItem => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/items/${updatedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: updatedItem.name,
          quantity: updatedItem.quantity,
          category: updatedItem.category,
          purchased: updatedItem.checked,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update item");
        return;
      }

      setGroceryData(prevData => {
        const originalCategory = prevData[selectedCategoryIndex]?.category;
        const newCategory = data.category;

        let updatedData = prevData.map(category => {
          if (category.category === originalCategory) {
            if (originalCategory === newCategory) {
              return {
                ...category,
                items: category.items.map(item =>
                  item.id === updatedItem.id
                    ? {
                        ...item,
                        name: data.name,
                        quantity: data.quantity,
                        checked: data.purchased,
                      }
                    : item
                ),
              };
            }

            return {
              ...category,
              items: category.items.filter(item => item.id !== updatedItem.id),
            };
          }

          if (category.category === newCategory) {
            return {
              ...category,
              items: [
                ...category.items,
                {
                  id: updatedItem.id,
                  name: data.name,
                  quantity: data.quantity,
                  checked: data.purchased,
                },
              ],
            };
          }

          return category;
        });

        const categoryExists = updatedData.some(
          category => category.category === newCategory
        );

        if (!categoryExists) {
          updatedData.push({
            category: newCategory,
            items: [
              {
                id: updatedItem.id,
                name: data.name,
                quantity: data.quantity,
                checked: data.purchased,
              },
            ],
          });
        }

        return updatedData.filter(category => category.items.length > 0);
      });

      setIsEditModalOpen(false);
      setSelectedItem(null);
      setSelectedCategoryIndex(null);
    } catch (error) {
      console.error("Update item error:", error);
      alert("Server error");
    }
  };

  const handleOpenDeleteModal = (categoryIndex, itemId) => {
    setDeleteCategoryIndex(categoryIndex);
    setItemToDelete(itemId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`/api/items/${itemToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to delete item");
        return;
      }

      setGroceryData(prevData =>
        prevData
          .map((category, cIndex) => {
            if (cIndex !== deleteCategoryIndex) return category;

            return {
              ...category,
              items: category.items.filter(item => item.id !== itemToDelete),
            };
          })
          .filter(category => category.items.length > 0)
      );

      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      setDeleteCategoryIndex(null);
    } catch (error) {
      console.error("Delete item error:", error);
      alert("Server error");
    }
  };

  const handleConfirmClear = async () => {
    try {
      const token = localStorage.getItem("token");

      const clearUrl = selectedList
        ? `/api/items?list=${selectedList._id}`
        : "/api/items";

      const response = await fetch(clearUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to clear items");
        return;
      }

      setGroceryData([]);
      setIsClearModalOpen(false);
    } catch (error) {
      console.error("Clear items error:", error);
      alert("Server error");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="phone-frame">
        <div className="dashboard-topbar">
          <h2 className="greeting">👋 Hi, {displayName}!</h2>
          <ProfileMenu userEmail={username} onLogout={handleLogout} />
        </div>

        <div className="title-row">
          <div className="title-left">
            <div className="list-selector-wrapper">
              <button
                type="button"
                className="dashboard-title list-selector-button"
                onClick={() => setIsListDropdownOpen(!isListDropdownOpen)}>
                {listName} <span className="list-arrow">⌄</span>
              </button>

              {isListDropdownOpen && (
                <div className="list-dropdown">
                  {lists.length === 0 ? (
                    <div className="list-dropdown-empty">No lists yet</div>
                  ) : (
                    lists.map(list => (
                      <button
                        type="button"
                        key={list._id}
                        className={
                          selectedList?._id === list._id
                            ? "list-dropdown-item active"
                            : "list-dropdown-item"
                        }
                        onClick={() => handleSelectList(list)}>
                        {list.title}
                      </button>
                    ))
                  )}

                  <div className="new-list-box">
                    <input
                      type="text"
                      placeholder="New list name"
                      value={newListTitle}
                      onChange={e => setNewListTitle(e.target.value)}
                    />
                    <button type="button" onClick={handleCreateList}>
                      + New List
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              className="icon-button edit-button"
              onClick={handleEditTitle}
              disabled={!selectedList}>
              <FiEdit2 />
            </button>
          </div>

          <button
            className="clear-button"
            onClick={() => setIsClearModalOpen(true)}>
            Clear
          </button>
        </div>

        <div className="category-list">
          {groceryData.length === 0 ? (
            <div className="empty-state">
              <p>No items yet</p>
              <p className="empty-sub">Tap + to add your first item</p>
            </div>
          ) : (
            groceryData.map((category, categoryIndex) => (
              <div className="category-section" key={category.category}>
                <h3 className="category-title">{category.category}</h3>

                <div className="category-card">
                  {category.items.map(item => (
                    <div
                      className="item-row"
                      key={item.id}
                      onClick={() => handleOpenEditModal(categoryIndex, item)}>
                      <button
                        className="check-button"
                        onClick={e => {
                          e.stopPropagation();
                          handleToggleCheck(categoryIndex, item.id);
                        }}>
                        {item.checked ? <FiCheckSquare /> : <FiSquare />}
                      </button>

                      <span
                        className={
                          item.checked ? "item-text checked" : "item-text"
                        }>
                        {item.name} x {item.quantity}
                      </span>

                      <button
                        className="delete-button"
                        onClick={e => {
                          e.stopPropagation();
                          handleOpenDeleteModal(categoryIndex, item.id);
                        }}>
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <button className="floating-add-button" onClick={handleAddItem}>
          <FiPlus />
        </button>

        {isRenameModalOpen && (
          <RenameListModal
            currentTitle={listName}
            onSave={handleSaveTitle}
            onClose={() => setIsRenameModalOpen(false)}
          />
        )}
      </div>

      {isEditModalOpen && selectedItem && (
        <EditItemModal
          currentItem={selectedItem}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
            setSelectedCategoryIndex(null);
          }}
          onSave={handleSaveEditedItem}
        />
      )}

      {isAddModalOpen && (
        <AddItemModal
          selectedList={selectedList}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={newItem => {
            handleCreateItem(newItem);
            setIsAddModalOpen(false);
          }}
        />
      )}

      {isClearModalOpen && (
        <ConfirmModal
          title="CLEAR LIST"
          message="Are you sure you want to clear the list? This action cannot be undone."
          confirmText="Clear"
          onClose={() => setIsClearModalOpen(false)}
          onConfirm={handleConfirmClear}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmModal
          title="DELETE ITEM"
          message="Are you sure you want to delete this item?"
          confirmText="Delete"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isLogoutModalOpen && (
        <ConfirmModal
          title="LOGOUT"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleConfirmLogout}
        />
      )}
    </div>
  );
}

export default Dashboard;
