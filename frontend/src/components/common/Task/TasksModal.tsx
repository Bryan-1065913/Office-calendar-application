// src/components/common/Tasks/TaskModal.tsx
import { useState, useEffect } from "react";
import "../../../styles/Task/TasksModal.css";
import Button from "../UI/Buttons.tsx";
import Xmark from "../../../assets/icons/xmark.svg?react";
import ConfirmModal from "../UI/ConfirmModal";

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, date: string | null) => void;
    onDelete?: () => void;
    initialTitle?: string;
    initialDate?: string | null;
    mode: "create" | "edit";
}

const TaskModal = ({ isOpen, onClose, onSave, onDelete, initialTitle = "", initialDate = null, mode }: TaskModalProps) => {
    const [title, setTitle] = useState(initialTitle);
    const [date, setDate] = useState(initialDate || "");
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        setTitle(initialTitle);
        setDate(initialDate || "");
    }, [initialTitle, initialDate, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSave(title.trim(), date || null);
        handleClose();
    };

    const handleDeleteClick = () => {
        setShowConfirm(true);
    };

    const handleConfirmDelete = () => {
        if (onDelete) {
            onDelete();
            setShowConfirm(false);
            handleClose();
        }
    };

    const handleClose = () => {
        setTitle("");
        setDate("");
        setShowConfirm(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="modal-overlay" onClick={handleClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h3 className="modal-title">
                            {mode === "create" ? "Add New Task" : "Edit Task"}
                        </h3>
                        <button className="modal-close" onClick={handleClose}>
                            <Xmark className="modal-close-icon" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="task-title">Title *</label>
                                <input
                                    id="task-title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter task title"
                                    autoFocus
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="task-date">Due Date</label>
                                <input
                                    id="task-date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            {mode === "edit" && onDelete && (
                                <Button variant="secondary" type="button" onClick={handleDeleteClick}>
                                    Delete
                                </Button>
                            )}
                            <Button type="submit">
                                {mode === "create" ? "Create" : "Save"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirm}
                title="Delete Task"
                message="Are you sure you want to delete this task? This action cannot be undone."
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirm(false)}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </>
    );
};

export default TaskModal;