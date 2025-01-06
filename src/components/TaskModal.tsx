import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import ReactQuill from "react-quill";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  currentUserId: string | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onTaskCreated,
  currentUserId 
}) => {
  const [category, setCategory] = useState<'work' | 'personal'>('work');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('TO-DO');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAttachment(file);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      alert("Please log in to create tasks");
      return;
    }

    const taskData = {
      title,
      description,
      category,
      dueDate,
      status,
      attachment: attachment ? attachment.name : '',
      userId: currentUserId, // Use the currentUserId instead of email
      createdAt: new Date().toISOString(),
    };

    try {
      const taskRef = collection(db, "tasks");
      await addDoc(taskRef, taskData);

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('work');
      setDueDate('');
      setStatus('TO-DO');
      setAttachment(null);

      // Notify parent component to refresh tasks
      onTaskCreated();
      
      // Close modal
      onClose();
    } catch (error) {
      console.error("Error creating task: ", error);
    }
  };

  // Rest of the component remains the same...
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[48rem] relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 bg-white rounded-t-lg">
          <h2 className="text-lg font-semibold">Create Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleCreateTask} className="bg-gray-50">
          {/* Task Title */}
          <div className="px-6 py-3 bg-white">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 focus:ring-0 px-0 py-1 text-sm placeholder-gray-400"
              placeholder="Task title"
            />
          </div>

          {/* Description with ReactQuill */}
          <div className="px-6 py-3 bg-white">
            <div className="h-28">
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                className="h-20"
                placeholder="Description"
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline'],
                    ['clean']
                  ]
                }}
              />
            </div>
          </div>

          {/* Task Category */}
          <div className="px-6 py-3 bg-white flex items-center text-sm">
            <span className="text-gray-700 mr-4 min-w-[100px]">Task Category*</span>
            <div className="flex space-x-3">
              <button
                type="button"
                className={`px-4 py-1.5 rounded-full transition-colors ${
                  category === 'work' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setCategory('work')}
              >
                Work
              </button>
              <button
                type="button"
                className={`px-4 py-1.5 rounded-full transition-colors ${
                  category === 'personal' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setCategory('personal')}
              >
                Personal
              </button>
            </div>
          </div>

          {/* Due Date and Status Row */}
          <div className="px-6 py-3 bg-white flex space-x-6">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-1">Due on*</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border rounded px-3 py-1.5 text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-1">Task Status*</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded px-3 py-1.5 text-sm appearance-none bg-white"
              >
                <option>Choose</option>
                <option value="TO-DO">TO-DO</option>
                <option value="IN-PROGRESS">IN-PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>
            </div>
          </div>

          {/* Attachment Section */}
          <div className="px-6 py-3 bg-white">
            <label className="block text-gray-700 text-sm mb-1">Attachment</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center text-sm text-gray-500">
              <Upload className="mx-auto mb-1 text-gray-400" size={24} />
              <label className="text-purple-600 cursor-pointer">
                Upload
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
              {attachment && (
                <p className="text-xs mt-2">{attachment.name}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 px-6 py-3 mt-3 bg-gray-50 rounded-b-lg">
            <button
              type="button"
              className="px-6 py-2 text-sm rounded-full font-medium"
              onClick={onClose}
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-sm bg-purple-600 text-white rounded-full hover:bg-purple-700 font-medium"
            >
              CREATE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
