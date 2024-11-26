import React, { useContext, useEffect, useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Box, Modal, CircularProgress } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import { UserContext } from "../../context/UserContext";
import { Dialog, DialogContent } from "@mui/material";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";

const Users = ({ isSuperAdmin, isAdmin, isViewAdmins }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rows, setRows] = useState([]);
  const [suggestionsList, setSuggestionsList] = useState([]);
  const [active, setActive] = useState(false);
  const [changes, setChanges] = useState({});
  const [userInput, setUserInput] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [open, setOpen] = useState(false);
  const [deleteUserId, setdeleteUserId] = useState(null);
  const { user } = useContext(UserContext);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedValue, setSelectedValue] = useState("Select Role");
  const [showMore, setShowMore] = useState(false);

  const handleClearSelection = () => {
    setSelectedValue("Select Role");
    setShowMore(false);
  };

  const handleShowMoreToggle = () => {
    setShowMore(!showMore);
  };
  const handleOptionClick = (value) => {
    setSelectedValue(value);
    setShowMore(false);
  };

  const handleUpdateUserRole = async () => {
    if (
      !selectedUser ||
      !selectedUser.username ||
      selectedValue === "Select Role"
    ) {
      alert("Please select a user and role before updating.");
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/user/all-users/${selectedUser.id}`,
        {
          username: selectedUser.username,
          role: selectedValue.toLocaleLowerCase(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );
      if (response.data.success) {
        alert("Role assigned successfully!");
        setActive(false);
        setUserInput("");
        setSelectedValue("Select Role");
        setSelectedUser(null);
      }
    } catch (error) {
      console.error("Error assigning role:", error);
      alert("Failed to assign role. Please try again.");
    }
  };
  

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) throw new Error("User is not authenticated");
        let url = "";
        if (isAdmin) {
          url = "http://localhost:5000/api/user/all-users";
        }
        if (isSuperAdmin) {
          if (isViewAdmins) {
            url = "http://localhost:5000/api/user/superadmin/all-admins";
          } else {
            url = "http://localhost:5000/api/user/all-users";
          }
        }
        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        let formattedAdmins;
        if (isAdmin || isSuperAdmin) {
          formattedAdmins = data.users?.map((user) => ({
            ...user,
            id: user._id,
          }));
          if (isSuperAdmin && isViewAdmins) {
            formattedAdmins = data.admins?.map((admin) => ({
              ...admin,
              id: admin._id,
            }));
          }
        }
        setRows(formattedAdmins || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [isAdmin, isSuperAdmin, isViewAdmins]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleDelete = async () => {
    const id = deleteUserId;
    try {
      await axios.delete(`http://localhost:5000/api/user/all-users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      setRows(rows.filter((row) => row.id !== id));
      setOpen(false);
      setdeleteUserId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusToggle = (id) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? { ...row, status: row.status === "active" ? "blocked" : "active" }
        : row
    );
    setRows(updatedRows);
    trackChanges(
      id,
      updatedRows.find((row) => row.id === id)
    );
  };

  const handlePermissionChange = (id, permission) => (e) => {
    const updatedRows = rows.map((row) =>
      row.id === id
        ? {
            ...row,
            permissions: {
              ...row.permissions,
              [permission]: e.target.checked,
            },
          }
        : row
    );
    setRows(updatedRows);
    trackChanges(
      id,
      updatedRows.find((row) => row.id === id)
    );
  };

  const trackChanges = (id, updatedRow) => {
    setChanges((prev) => ({ ...prev, [id]: updatedRow }));
  };

  const handleApply = async (id) => {
    try {
      const updatedPermissions = changes[id].permissions;
      const userId = id;
      const status = changes[id].status;

      const authToken = `Bearer ${localStorage.getItem("auth_token")}`;

      // Helper function to handle responses
      const handleResponse = (response, successMessage) => {
        if (response.data.success) {
          alert(successMessage);
          setChanges((prev) => {
            const newChanges = { ...prev };
            delete newChanges[id];
            return newChanges;
          });
        } else {
          console.error("Failed to update permissions:", response.data.message);
        }
      };

      // If SuperAdmin, update permissions
      if (isSuperAdmin && isViewAdmins) {
        const response = await axios.post(
          "http://localhost:5000/api/user/superadmin/assign-permission",
          { userId, permissions: updatedPermissions, status },
          { headers: { Authorization: authToken } }
        );
        handleResponse(response, "Permissions updated successfully.");
      }

      // Block or unblock the user
      const response = await axios.post(
        "http://localhost:5000/api/user/all-users/blockOrUnblockUser",
        { userId, status },
        { headers: { Authorization: authToken } }
      );
      handleResponse(response, "User status updated successfully.");
    } catch (error) {
      console.error(
        "Error updating permissions:",
        error.response?.data?.message || error.message
      );
    }
  };

  const onInputChange = async (e) => {
    const { value } = e.target;
    setUserInput(value);

    if (value) {
      try {
        const link = `http://localhost:5000/api/user/all-users`;
        const res = await axios.get(link, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        const users = res.data.users || [];
        // Filter users based on the search query
        const filteredSuggestions = users
          .filter((user) =>
            user.username.toLowerCase().includes(value.toLowerCase())
          )
          .map((item) => ({
            id: item._id,
            username: item.username,
            email: item.email,
          }));

        setSuggestionsList(filteredSuggestions);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setSuggestionsList([]);
    }
  };

  const filteredRows = rows.filter((row) =>
    (row.username?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const handleOpen = (id) => {
    setOpen(true);
    setdeleteUserId(id);
  };
  const handleSuggestionClick = (selectedUser) => {
    setSelectedUser(selectedUser);
    setUserInput(selectedUser.username);
    setSuggestionsList([]);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleAddMemberClick = () => {
    setActive(!active);
  };
  <EditIcon
    className="dark:text-black text-black hover:text-green-500"
    size={20}
  />;
  const columns = [
    { field: "id", headerName: "ID", flex: 0.2 },
    {
      field: "username",
      headerName: "Username",
      flex: 0.3,
    },
    { field: "email", headerName: "Email", flex: 0.3 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.3,
      renderCell: (params) => (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${
            params.row.status === "active"
              ? "bg-green-200 text-green-600"
              : "bg-red-200 text-red-600"
          }`}
        >
          {params.row.status}
        </span>
      ),
    },
    { field: "role", headerName: "Role", flex: 0.2 },
    isSuperAdmin &&
      isViewAdmins && {
        field: "permissions",
        headerName: "Permissions",
        flex: 0.5,
        renderCell: (params) => (
          <div className="flex gap-2 p-2.5">
            {Object.keys(params.row.permissions).map((permission) => (
              <div key={permission} className="inline-flex items-center">
                <label className="flex items-center cursor-pointer relative">
                  <input
                    type="checkbox"
                    checked={params.row.permissions[permission]}
                    onChange={handlePermissionChange(params.row.id, permission)}
                    className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-green-600 checked:border-green-600"
                    id="check"
                  />
                  <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </span>
                </label>
                <label className="cursor-pointer ml-2 text-slate-600 text-sm font-medium">
                  {permission}
                </label>
              </div>
            ))}
          </div>
        ),
      },
    user.permissions["modify"] && {
      field: "Block users",
      headerName: "Block users",
      flex: 0.2,
      renderCell: (params) => (
        <label className="flex items-center cursor-pointer p-2.5">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={params.row.status === "blocked"}
            onChange={() => handleStatusToggle(params.row.id)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-red-600 relative">
            <div
              className={`absolute top-0.5 left-[2px] bg-white w-5 h-5 rounded-full transition-transform ${
                params.row.status === "blocked" ? "translate-x-full" : ""
              }`}
            ></div>
          </div>
        </label>
      ),
    },

    user.permissions["modify"] && {
      field: "Save",
      headerName: "Save",
      headerAlign: "center",
      align: "center",
      flex: 0.2,
      renderCell: (params) => {
        const isChanged = !!changes[params.row.id];
        return (
          <button
            type="button"
            className={`text-white font-medium rounded-lg text-sm px-4 py-2 mb-2 ${
              isChanged
                ? "bg-green-600 hover:bg-green-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!isChanged}
            onClick={() => handleApply(params.row.id)}
          >
            Apply
          </button>
        );
      },
    },
    user.permissions["modify"] &&
      user.permissions["delete"] && {
        field: "Delete users",
        headerName: "Delete users",
        headerAlign: "center",
        align: "center",
        flex: 0.2,
        renderCell: (params) => (
          <button className="text-white rounded-md focus:outline-none cursor-pointer">
            <DeleteOutlineIcon
              className="dark:text-black text-black hover:text-red-500"
              onClick={() => {
                handleOpen(params.row.id);
              }}
              size={20}
            />
          </button>
        ),
      },
  ].filter(Boolean); // Filter out false values from columns array

  if (loading)
    return (
      <div className="flex justify-center items-center">
        <CircularProgress />
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {isSuperAdmin ? "All Admin" : "All Users"}
        </h1>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 w-full">
        <div className="w-1/2 space-x-4 flex items-center">
          <span className="text-gray-800 font-semibold text-lg">Search:</span>
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={handleSearch}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-md"
          />
        </div>

        {isSuperAdmin && isViewAdmins && (
          <button
            className="text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 flex items-center gap-2"
            onClick={handleAddMemberClick}
          >
            <AddOutlinedIcon />
            Add New Admin
          </button>
        )}
      </div>

      <Box m="30px 0 0 0" height="auto">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          disableSelectionOnClick
          autoHeight
          pageSizeOptions={[5, 8, 10, 25]}
          initialState={{
            pagination: { paginationModel: { pageSize: 8, page: 0 } },
          }}
        />
      </Box>

      <Dialog
        open={active}
        onClose={handleAddMemberClick}
        className="my-dialog"
      >
        <DialogContent className="w-96 h-[24rem] dark:bg-gray-900">
          <div className="p-4">
            <h1 className="text-2xl text-center font-bold mb-4 text-gray-800 dark:text-white">
              Add New Admin
            </h1>
            <label
              htmlFor="input-group-search"
              className="font-semibold block py-2 mb-1 dark:text-white"
            >
              Enter Username:
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                <PersonOutlinedIcon
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  style={{ fontSize: "20px" }}
                />
              </div>
              <input
                type="text"
                id="input-group-search"
                value={userInput}
                onChange={onInputChange}
                className="block w-full p-3 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search username"
              />
            </div>
            {userInput && (
              <ul className="absolute bg-slate-600 w-[19rem] mt-2 p-2 overflow-y-auto text-sm text-white rounded-md shadow-lg z-50">
                {suggestionsList.length > 0 ? (
                  suggestionsList.map((data, index) => (
                    <li
                      key={index}
                      className="cursor-pointer hover:bg-slate-700 px-2 py-3 rounded"
                      onClick={() => handleSuggestionClick(data)}
                    >
                      <div className="flex gap-1 items-center">
                        <div className="flex flex-col">
                          <span>{data.email}</span>
                          <span>{data.username}</span>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-center text-gray-300">
                    No matching users found
                  </li>
                )}
              </ul>
            )}

            <div className=" max-w-md mx-auto dark:text-white mt-4">
              <label htmlFor="select" className="font-semibold block py-2">
                Select Role:
              </label>
              <div className="relative">
                <div className="h-10 bg-white dark:bg-gray-800 flex border border-gray-200 dark:border-gray-700 rounded items-center">
                  <input
                    value={selectedValue}
                    name="select"
                    id="select"
                    className="px-4 appearance-none outline-none text-gray-800 dark:text-white dark:bg-gray-800 w-full"
                    readOnly
                  />
                  <button
                    className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600"
                    onClick={handleClearSelection}
                  >
                    <CloseOutlinedIcon
                      className="w-4 h-4 mx-2 fill-current cursor-pointer"
                      style={{ fontSize: "18px" }}
                    />
                  </button>
                  <button
                    className="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600"
                    onClick={handleShowMoreToggle}
                  >
                    <ArrowDropDownOutlinedIcon
                      className="w-4 h-4 mx-2 fill-current"
                      style={{ fontSize: "24px" }}
                    />
                  </button>
                </div>
                <input
                  type="checkbox"
                  name="show_more"
                  id="show_more"
                  className="hidden peer"
                  checked={showMore}
                />
                <div
                  className={`absolute rounded shadow bg-white dark:bg-gray-800 dark:border-gray-700 overflow-hidden ${
                    showMore ? "hidden peer-checked:flex" : "hidden"
                  } flex-col w-full mt-1 border border-gray-200 `}
                >
                  <div className="cursor-pointer group border-t">
                    <span
                      className="block p-2 border-transparent border-l-4 group-hover:border-blue-600  group-hover:bg-gray-100 dark:group-hover:bg-gray-700"
                      onClick={() => handleOptionClick("Admin")}
                    >
                      Admin
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="text-white w-full mt-[2.4rem] bg-green-700 hover:bg-green-800 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5 text-center me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              onClick={handleUpdateUserRole}
            >
              Update
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {open && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="flex justify-center items-center h-full ">
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                  type="button"
                  className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-hide="popup-modal"
                  onClick={handleClose}
                >
                  <CloseIcon className="w-3 h-3 text-gray-500" />
                  <span className="sr-only">Close modal</span>
                </button>
                <div className="p-4 md:p-5 text-center">
                  <ErrorOutlineRoundedIcon
                    className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
                    style={{ fontSize: "50px" }}
                  />

                  <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete this User?
                  </h3>
                  <div className="flex flex-col md:flex-row justify-center items-center md:items-start space-y-2 md:space-y-0">
                    <button
                      data-modal-hide="popup-modal"
                      type="button"
                      className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2"
                      onClick={handleDelete}
                    >
                      Yes, I'm sure
                    </button>
                    <button
                      data-modal-hide="popup-modal"
                      type="button"
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                      onClick={handleClose}
                    >
                      No, cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
};

export default Users;
