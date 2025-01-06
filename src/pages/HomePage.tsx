import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  writeBatch,
  updateDoc,
} from "firebase/firestore";
import { FiSearch, FiPlus } from "react-icons/fi";
import TaskSection from "../components/TaskSection";
import Header from "../components/Header";
import TaskModal from "../components/TaskModal";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import EmptySearchState from '../components/EmptySearchState';

// Type definitions
type TaskStatus = "TO-DO" | "IN-PROGRESS" | "COMPLETED";
type TaskCategory = "Work" | "Personal";
type ViewType = "list" | "board";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  category: TaskCategory;
  userId: string;
}

interface TasksData {
  todo: Task[];
  inProgress: Task[];
  completed: Task[];
}

const HomePage = () => {

  const isMobile = () => window.innerWidth <= 768;
  // State management
  const [view, setView] = useState<ViewType>("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<TasksData>({
    todo: [],
    inProgress: [],
    completed: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<TaskCategory | "">("");
  const [filterDueDate, setFilterDueDate] = useState<string>("");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Force list view on mobile
    const handleResize = () => {
      if (isMobile()) {
        setView("list");
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  // Authentication and initial data fetch
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setUserPhoto(user.photoURL);
        setCurrentUserId(user.uid);
        fetchTasks(user.uid);
      } else {
        setUserName(null);
        setUserPhoto(null);
        setCurrentUserId(null);
        setTasks({
          todo: [],
          inProgress: [],
          completed: [],
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Authentication handlers
  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Task management functions
  const fetchTasks = async (userId: string) => {
    const db = getFirestore();
    const tasksCollection = collection(db, "tasks");
    const userTasksQuery = query(tasksCollection, where("userId", "==", userId));

    try {
      const tasksSnapshot = await getDocs(userTasksQuery);
      const allTasks: Task[] = tasksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as Omit<Task, "id">,
      }));

      setTasks({
        todo: allTasks.filter((task) => task.status === "TO-DO"),
        inProgress: allTasks.filter((task) => task.status === "IN-PROGRESS"),
        completed: allTasks.filter((task) => task.status === "COMPLETED"),
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const moveTask = async (taskId: string, newStatus: TaskStatus) => {
    if (!currentUserId) return;

    const db = getFirestore();
    const taskRef = doc(db, "tasks", taskId);

    try {
      // Optimistic UI update
      setTasks((prevTasks) => {
        const updatedTasks = { ...prevTasks };
        let movedTask: Task | undefined;

        // Remove task from current status
        Object.keys(prevTasks).forEach((key) => {
          const statusKey = key as keyof TasksData;
          const taskIndex = prevTasks[statusKey].findIndex((t) => t.id === taskId);
          if (taskIndex !== -1) {
            [movedTask] = prevTasks[statusKey].splice(taskIndex, 1);
          }
        });

        // Add task to new status
        if (movedTask) {
          const updatedTask = { ...movedTask, status: newStatus };
          switch (newStatus) {
            case "TO-DO":
              updatedTasks.todo.push(updatedTask);
              break;
            case "IN-PROGRESS":
              updatedTasks.inProgress.push(updatedTask);
              break;
            case "COMPLETED":
              updatedTasks.completed.push(updatedTask);
              break;
          }
        }

        return updatedTasks;
      });

      await updateDoc(taskRef, { status: newStatus });
    } catch (error) {
      console.error("Error moving task:", error);
      await fetchTasks(currentUserId);
    }
  };

  const deleteTaskFromDB = async (taskId: string) => {
    if (!currentUserId) return;

    const db = getFirestore();
    const taskRef = doc(db, "tasks", taskId);

    try {
      await deleteDoc(taskRef);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: TaskStatus) => {
    if (!currentUserId || selectedTasks.size === 0) return;

    const db = getFirestore();
    const batch = writeBatch(db);

    Array.from(selectedTasks).forEach((taskId) => {
      const taskRef = doc(db, "tasks", taskId);
      batch.update(taskRef, { status: newStatus });
    });

    try {
      await batch.commit();
      await fetchTasks(currentUserId);
      setSelectedTasks(new Set());
    } catch (error) {
      console.error("Error updating tasks:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (!currentUserId || selectedTasks.size === 0) return;

    const db = getFirestore();
    const batch = writeBatch(db);

    Array.from(selectedTasks).forEach((taskId) => {
      const taskRef = doc(db, "tasks", taskId);
      batch.delete(taskRef);
    });

    try {
      await batch.commit();
      await fetchTasks(currentUserId);
      setSelectedTasks(new Set());
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  const handleDelete = async (taskId: string) => {
    await deleteTaskFromDB(taskId);
    setTasks((prevTasks) => ({
      todo: prevTasks.todo.filter((task) => task.id !== taskId),
      inProgress: prevTasks.inProgress.filter((task) => task.id !== taskId),
      completed: prevTasks.completed.filter((task) => task.id !== taskId),
    }));
  };

  const handleTaskCreated = () => {
    if (currentUserId) {
      fetchTasks(currentUserId);
    }
  };

  const handleTaskSelect = (taskId: string) => {
    setSelectedTasks((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  // Filter and search functions
  const getFilteredTasks = () => {
    const currentDate = new Date();
    const addDays = (days: number) => {
      const date = new Date(currentDate);
      date.setDate(date.getDate() + days);
      return date.toISOString().split("T")[0];
    };

    const today = currentDate.toISOString().split("T")[0];
    const tomorrow = addDays(1);
    const thisWeek = addDays(7);

    const isWithinDueDate = (dueDate: string) => {
      switch (filterDueDate) {
        case "Today":
          return dueDate === today;
        case "Tomorrow":
          return dueDate === tomorrow;
        case "This Week":
          return dueDate >= today && dueDate <= thisWeek;
        default:
          return true;
      }
    };

    const filterTask = (task: Task) =>
      (filterCategory === "" || task.category.toLowerCase() === filterCategory.toLowerCase()) &&
      isWithinDueDate(task.dueDate) &&
      task.title.toLowerCase().includes(searchTerm.toLowerCase());

    return {
      todo: tasks.todo.filter(filterTask),
      inProgress: tasks.inProgress.filter(filterTask),
      completed: tasks.completed.filter(filterTask),
    };
  };

  const filteredTasks = getFilteredTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      <DndProvider backend={HTML5Backend}>
        <Header
          view={view}
          setView={setView}
          userName={userName}
          userPhoto={userPhoto}
          onLogout={handleLogout}
          showViewToggle={!isMobile()}
        />
        
        <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-8">
          {/* Filters and Search Bar */}
          <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-sm text-gray-600 w-full sm:w-auto">
              <span className="whitespace-nowrap">Filter by:</span>
              <div className="flex gap-2 w-full sm:w-auto">
                <select
                  className="flex-1 sm:flex-none min-w-[120px] border rounded-lg px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as TaskCategory | "")}
                >
                  <option value="">Category</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>
                <select
                  className="flex-1 sm:flex-none min-w-[120px] border rounded-lg px-4 py-2 bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  value={filterDueDate}
                  onChange={(e) => setFilterDueDate(e.target.value)}
                >
                  <option value="">Due Date</option>
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="This Week">This Week</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-full border shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="whitespace-nowrap inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 rounded-full shadow-sm transition-colors duration-200"
              >
                <FiPlus size={18} />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>
          </div>

          {/* Task Sections */}
          <div className={`${view === "board" ? "grid grid-cols-1 md:grid-cols-3 gap-6" : "space-y-6"}`}>
          {filteredTasks.todo.length === 0 &&
           filteredTasks.inProgress.length === 0 &&
           filteredTasks.completed.length === 0 &&
           searchTerm ? (
            <EmptySearchState />
          ) : (
            <>
              <TaskSection
                title="Todo"
                count={filteredTasks.todo.length}
                tasks={filteredTasks.todo}
                bgColor="#d0b5ce"
                view={view}
                onDelete={handleDelete}
                selectedTasks={selectedTasks}
                onTaskSelect={handleTaskSelect}
                onMoveTask={moveTask}
                acceptableStatuses={["IN-PROGRESS", "COMPLETED"]}
                status="TO-DO"
                onAddTask={handleAddTask}
              />
              <TaskSection
                title="In Progress"
                count={filteredTasks.inProgress.length}
                tasks={filteredTasks.inProgress}
                bgColor="#a0c9d7"
                view={view}
                onDelete={handleDelete}
                selectedTasks={selectedTasks}
                onTaskSelect={handleTaskSelect}
                onMoveTask={moveTask}
                acceptableStatuses={["TO-DO", "COMPLETED"]}
                status="IN-PROGRESS"
                onAddTask={handleAddTask}
              />
              <TaskSection
                title="Completed"
                count={filteredTasks.completed.length}
                tasks={filteredTasks.completed}
                bgColor="#b7d2a8"
                view={view}
                onDelete={handleDelete}
                selectedTasks={selectedTasks}
                onTaskSelect={handleTaskSelect}
                onMoveTask={moveTask}
                acceptableStatuses={["TO-DO", "IN-PROGRESS"]}
                status="COMPLETED"
                onAddTask={handleAddTask}
              />
            </>
          )}
        </div>


          {/* Bulk Actions Footer */}
          {selectedTasks.size > 0 && (
            <div className="fixed bottom-6 right-6 left-6 sm:left-auto bg-white rounded-xl shadow-lg p-4 z-50 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <span className="text-sm text-gray-600 font-medium text-center sm:text-left">
                {selectedTasks.size} task{selectedTasks.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <select
                  className="w-full sm:w-auto border rounded-lg px-4 py-2 text-sm bg-white shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  onChange={(e) => handleBulkStatusUpdate(e.target.value as TaskStatus)}
                  defaultValue=""
                >
                  <option value="" disabled>Move to...</option>
                  <option value="TO-DO">To Do</option>
                  <option value="IN-PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <button
                  onClick={handleBulkDelete}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg text-sm shadow-sm transition-colors duration-200"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Task Creation/Edit Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onTaskCreated={handleTaskCreated}
          currentUserId={currentUserId}
        />
      </DndProvider>
    </div>
  );
};

export default HomePage;
