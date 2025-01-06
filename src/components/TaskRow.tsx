import React, { useState } from "react";
import { MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useDrag } from "react-dnd";
import EditTaskModal from "./EditTaskModal";

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  category: "Work" | "Personal";
}

interface TaskRowProps {
  task: Task;
  onDelete?: (taskId: string) => void;
  onEdit?: (updatedTask: Task) => void;
  showMenuOnly?: boolean;
  className?: string;
  selected?: boolean;
  onSelect?: (taskId: string) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onDelete,
  onEdit,
  showMenuOnly = false,
  className = "",
  selected = false,
  onSelect,
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: () => ({ id: task.id, status: task.status }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ moved: boolean }>();
      if (item && dropResult) {
        console.log("Task dropped successfully");
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [task.id, task.status]);

  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete the task. Please try again.");
      }
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleSave = (updatedTask: Task) => {
    if (onEdit) onEdit(updatedTask);
    setShowEditModal(false);
  };

  const isCompleted = task.status === "COMPLETED";

  return (
    <>
      {showMenuOnly ? (
        <div
          ref={drag}
          className={`flex items-center px-4 py-3 hover:bg-gray-50 group cursor-move
            ${isDragging ? "opacity-50" : ""}
            ${isCompleted ? "line-through text-gray-400" : ""}
            ${className}`}
          style={{ 
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move',
            touchAction: 'none'
          }}
        >
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
              <button
                onClick={handleEdit}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
              >
                <Edit2 size={14} className="mr-2 inline" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left"
              >
                <Trash2 size={14} className="mr-2 inline" />
                Delete
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          ref={drag}
          className={`flex items-center px-4 py-3 hover:bg-gray-50 group cursor-move
            ${isDragging ? "opacity-50" : ""}
            ${isCompleted ? "line-through text-gray-400" : ""}
            ${className}`}
          style={{ opacity: isDragging ? 0.5 : 1 }}
        >
          <input
            type="checkbox"
            className="mr-4 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            checked={selected}
            onChange={() => onSelect?.(task.id)}
          />
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">
                {task.category === "Work" ? "💼" : "👤"}
              </span>
              <span className="text-sm text-gray-700">{task.title}</span>
            </div>
            {/* Desktop view details */}
            <div className="hidden md:flex items-center space-x-8">
              <span className="text-sm text-gray-600">{task.dueDate}</span>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  task.category === "Work"
                    ? "text-blue-700 bg-blue-50"
                    : "text-green-700 bg-green-50"
                }`}
              >
                {task.category}
              </span>
              <span
                className={`text-sm px-2 py-1 rounded ${
                  task.status === "TO-DO"
                    ? "text-yellow-700 bg-yellow-50"
                    : task.status === "IN-PROGRESS"
                    ? "text-blue-700 bg-blue-50"
                    : "text-green-700 bg-green-50"
                }`}
              >
                {task.status}
              </span>

              <div className="hidden group-hover:flex items-center space-x-2">
                <button
                  onClick={handleEdit}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1"
                >
                  <Edit2 size={14} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center space-x-1"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
            {/* Mobile view actions */}
            <div className="md:hidden flex items-center">
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <button
                    onClick={handleEdit}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit2 size={14} className="mr-2 inline" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left"
                  >
                    <Trash2 size={14} className="mr-2 inline" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditTaskModal
          task={task}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default TaskRow;