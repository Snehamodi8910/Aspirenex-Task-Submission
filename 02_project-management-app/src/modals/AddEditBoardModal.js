import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import crossIcon from "../assets/icon-cross.svg";
import boardsSlice from "../redux/boardsSlice";
import "../styles/BoardModals.css";
import { v4 as uuidv4 } from "uuid";

export default function AddEditBoardModal({ type, setIsBoardModalOpen }) {
  const dispatch = useDispatch();
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [members, setMembers] = useState([""]);
  const [newColumns, setNewColumns] = useState([
    { name: "Todo", tasks: [], id: uuidv4() },
    { name: "Doing", tasks: [], id: uuidv4() },
  ]);
  const [isValid, setIsValid] = useState(true);
  const board = useSelector((state) => state.boards).find(
    (board) => board.isActive
  );

  if (type === "edit" && isFirstLoad) {
    setNewColumns(
      board.columns.map((col) => {
        return { ...col, id: uuidv4() };
      })
    );
    setName(board.name);
    setDescription(board.description || "");
    setStartDate(board.startDate || "");
    setEndDate(board.endDate || "");
    setMembers(board.members || [""]);
    setIsFirstLoad(false);
  }

  const validate = () => {
    setIsValid(false);
    if (!name.trim() || !description.trim() || !startDate.trim() || !endDate.trim() || members.some(member => !member.trim())) {
      return false;
    }
    for (let i = 0; i < newColumns.length; i++) {
      if (!newColumns[i].name.trim()) {
        return false;
      }
    }
    setIsValid(true);
    return true;
  };

  const onChangeColumn = (id, newValue) => {
    setNewColumns((prevState) => {
      const newState = [...prevState];
      const column = newState.find((col) => col.id === id);
      column.name = newValue;
      return newState;
    });
  };

  const onDeleteColumn = (id) => {
    setNewColumns((prevState) => prevState.filter((el) => el.id !== id));
  };

  const onChangeMember = (index, newValue) => {
    setMembers((prevState) => {
      const newState = [...prevState];
      newState[index] = newValue;
      return newState;
    });
  };

  const onDeleteMember = (index) => {
    setMembers((prevState) => prevState.filter((_, i) => i !== index));
  };

  const onSubmit = (type) => {
    setIsBoardModalOpen(false);
    if (type === "add") {
      dispatch(boardsSlice.actions.addBoard({ name, description, startDate, endDate, members, newColumns }));
    } else {
      dispatch(boardsSlice.actions.editBoard({ name, description, startDate, endDate, members, newColumns }));
    }
  };

  return (
    <div
      className="modal-container dimmed"
      onClick={(e) => {
        if (e.target !== e.currentTarget) {
          return;
        }
        setIsBoardModalOpen(false);
      }}
    >
      <div className="modal">
        <h3>{type === "edit" ? "Edit" : "Add new"} Project</h3>
        <label htmlFor="board-name-input">Project Name</label>
        <div className="input-container">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="board-name-input"
            type="text"
            placeholder="e.g. Web Design"
            className={!isValid && !name.trim() ? "red-border" : ""}
          />
          {!isValid && !name.trim() && (
            <span className="cant-be-empty-span text-L"> Can't be empty</span>
          )}
        </div>

        <label htmlFor="board-description-input">Project Description</label>
        <div className="input-container">
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            id="board-description-input"
            type="text"
            placeholder="e.g. A project to design a website"
            className={!isValid && !description.trim() ? "red-border" : ""}
          />
          {!isValid && !description.trim() && (
            <span className="cant-be-empty-span text-L"> Can't be empty</span>
          )}
        </div>

        <label htmlFor="board-start-date-input">Start Date</label>
        <div className="input-container">
          <input
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            id="board-start-date-input"
            type="date"
            className={!isValid && !startDate.trim() ? "red-border" : ""}
          />
          {!isValid && !startDate.trim() && (
            <span className="cant-be-empty-span text-L"> Can't be empty</span>
          )}
        </div>

        <label htmlFor="board-end-date-input">End Date</label>
        <div className="input-container">
          <input
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            id="board-end-date-input"
            type="date"
            className={!isValid && !endDate.trim() ? "red-border" : ""}
          />
          {!isValid && !endDate.trim() && (
            <span className="cant-be-empty-span text-L"> Can't be empty</span>
          )}
        </div>

        <label>Project Members</label>
        <div className="modal-members">
          {members.map((member, index) => (
            <div className="modal-member" key={index}>
              <div className="input-container">
                <input
                  onChange={(e) => onChangeMember(index, e.target.value)}
                  type="text"
                  value={member}
                  className={!isValid && !member.trim() ? "red-border" : ""}
                />
                {!isValid && !member.trim() && (
                  <span className="cant-be-empty-span text-L"> Can't be empty</span>
                )}
              </div>
              <img
                src={crossIcon}
                alt="delete-member-icon"
                onClick={() => onDeleteMember(index)}
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setMembers([...members, ""])}
          className="add-member-btn btn-light"
        >
          + Add New Member
        </button>

        <label>Project Columns</label>
        <div className="modal-columns">
          {newColumns.map((column, index) => (
            <div className="modal-column" key={index}>
              <div className="input-container">
                <input
                  onChange={(e) => onChangeColumn(column.id, e.target.value)}
                  type="text"
                  value={column.name}
                  className={!isValid && !column.name.trim() ? "red-border" : ""}
                />
                {!isValid && !column.name.trim() && (
                  <span className="cant-be-empty-span text-L"> Can't be empty</span>
                )}
              </div>
              <img
                src={crossIcon}
                alt="delete-column-icon"
                onClick={() => onDeleteColumn(column.id)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => setNewColumns([...newColumns, { name: "", tasks: [], id: uuidv4() }])}
          className="add-column-btn btn-light"
        >
          + Add New Column
        </button>
        <button
          onClick={() => {
            const isValid = validate();
            if (isValid) onSubmit(type);
          }}
          className="create-btn"
        >
          {type === "add" ? "Create New Project" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
