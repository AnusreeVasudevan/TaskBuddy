import { useState } from "react";
import { useDrop } from "react-dnd";
import TaskRow from "./TaskRow";
import EditTaskModal from "./EditTaskModal";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: "TO-DO" | "IN-PROGRESS" | "COMPLETED";
  category: "Work" | "Personal";
}

interface TaskSectionProps {
  title: string;
  count: number;
  tasks: Task[];
  bgColor: string;
  view: "list" | "board";
  onDelete: (taskId: string) => void;
  onEdit?: (updatedTask: Task) => void;
  selectedTasks: Set<string>;
  onTaskSelect: (taskId: string) => void;
  onMoveTask: (taskId: string, newStatus: Task["status"]) => void;
  acceptableStatuses: Task["status"][];
  status: Task["status"];
  onAddTask: () => void; // New prop for handling task creation
}

const TaskSection = ({
  title,
  count,
  tasks,
  bgColor,
  view,
  onDelete,
  onEdit,
  selectedTasks,
  onTaskSelect,
  onMoveTask,
  acceptableStatuses,
  status,
  onAddTask, // Add the new prop to the destructuring
}: TaskSectionProps) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { id: string; status: Task["status"] }) => {
      if (item.status !== status) {
        onMoveTask(item.id, status);
        return { moved: true };
      }
      return undefined;
    },
    canDrop: (item: { id: string; status: Task["status"] }) => {
      return item.status !== status && acceptableStatuses.includes(item.status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [status, acceptableStatuses, onMoveTask]);

  const handleSaveTask = (updatedTask: Task) => {
    if (onEdit) onEdit(updatedTask);
    setIsEditModalOpen(false);
    setTaskToEdit(null);
  };

  const getDragIndicatorStyles = () => {
    if (isOver && canDrop) {
      return "border-2 border-dashed border-purple-400 bg-purple-50";
    }
    if (canDrop) {
      return "border-2 border-dashed border-gray-200";
    }
    return "";
  };

  return (
    <div
      ref={drop}
      className={`bg-white rounded-lg overflow-hidden h-full flex flex-col ${getDragIndicatorStyles()}`}
    >
      <div
        className="flex justify-between items-center px-4 py-3"
        style={{ backgroundColor: bgColor }}
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium">{title}</span>
          <span className="text-sm">({count})</span>
        </div>
        <button 
          onClick={onAddTask}
          className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
          title={`Add new ${title.toLowerCase()} task`}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            strokeWidth="2" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {/* Rest of the component remains the same */}
      <div className={`p-4 ${view === "list" ? "divide-y" : "flex flex-col space-y-4"}`}>
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No tasks</div>
        ) : (
          tasks.map((task) =>
            view === "list" ? (
              <TaskRow
                key={task.id}
                task={task}
                onDelete={onDelete}
                onEdit={onEdit}
                selected={selectedTasks.has(task.id)}
                onSelect={onTaskSelect}
                className={task.status === "COMPLETED" ? "line-through text-gray-400" : ""}
              />
            ) : (
              <div
                key={task.id}
                className={`bg-gray-100 p-4 rounded-lg shadow-md border relative 
                  ${task.status === "COMPLETED" ? "line-through text-gray-400" : ""}`}
              >
                <TaskRow
                  task={task}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  showMenuOnly={true}
                  selected={selectedTasks.has(task.id)}
                  onSelect={onTaskSelect}
                />
                <div className="pl-8">
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.dueDate}</p>
                  <span className="text-xs text-gray-400">{task.category}</span>
                </div>
              </div>
            )
          )
        )}
      </div>

      {isEditModalOpen && taskToEdit && (
        <EditTaskModal
          task={taskToEdit}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setTaskToEdit(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
};

export default TaskSection;


