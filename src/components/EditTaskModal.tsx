import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import { X, Upload } from 'lucide-react';
import 'react-quill/dist/quill.snow.css';
import { db, updateDoc, doc } from '../config/firebaseConfig'; // Import Firebase methods

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  status: 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
  category: 'Work' | 'Personal';
  attachment?: File | null;
}

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;  // This will handle saving task to Firestore
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  isOpen,
  onClose,
}) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [category, setCategory] = useState<'work' | 'personal'>(
    task.category.toLowerCase() as 'work' | 'personal'
  );

  useEffect(() => {
    setEditedTask(task);
    setCategory(task.category.toLowerCase() as 'work' | 'personal');
  }, [task]);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof Task, value: any) => {
    setEditedTask(prevTask => ({ ...prevTask, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleInputChange('attachment', file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editedTask.title || !editedTask.dueDate || !editedTask.status) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      // Updating task in Firestore
      const taskDocRef = doc(db, 'tasks', editedTask.id); // Assuming tasks collection
      await updateDoc(taskDocRef, {
        title: editedTask.title,
        description: editedTask.description,
        dueDate: editedTask.dueDate,
        status: editedTask.status,
        category: editedTask.category,
        attachment: editedTask.attachment ? editedTask.attachment.name : null, // You can handle file upload separately if needed
      });

      alert('Task updated successfully!');
      onClose();  // Close the modal
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update the task. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-[60rem] relative flex shadow-lg">
        {/* Left Panel */}
        <div className="flex-1">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Edit Task</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            {/* Title */}
            <div>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 text-sm"
                placeholder="Task title"
                value={editedTask.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 mb-1">Description</label>
              <div className="h-24">
                <ReactQuill
                  theme="snow"
                  value={editedTask.description || ''}
                  onChange={(value) => handleInputChange('description', value)}
                  className="h-16"
                />
              </div>
            </div>

            {/* Category */}
            <div className="pt-4">
              <span className="text-gray-700 font-medium">Task Category*</span>
              <div className="flex space-x-2 mt-1">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full ${
                    category === 'work'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => {
                    setCategory('work');
                    setEditedTask({ ...editedTask, category: 'Work' });
                  }}
                >
                  Work
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-full ${
                    category === 'personal'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => {
                    setCategory('personal');
                    setEditedTask({ ...editedTask, category: 'Personal' });
                  }}
                >
                  Personal
                </button>
              </div>
            </div>

            {/* Due Date and Status */}
            <div className="flex space-x-4">
              <div className="w-1/2">
                <label className="block text-gray-700 mb-1">Due on*</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={editedTask.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-700 mb-1">Task Status*</label>
                <select
                  className="w-full border rounded px-3 py-2 text-sm"
                  value={editedTask.status}
                  onChange={(e) =>
                    handleInputChange('status', e.target.value as Task['status'])
                  }
                >
                  <option value="TO-DO">TO-DO</option>
                  <option value="IN-PROGRESS">IN-PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>
            </div>

            {/* Attachment */}
            <div>
              <label className="block text-gray-700 mb-1">Attachment</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center text-sm">
                <Upload className="mx-auto mb-1 text-gray-400" size={24} />
                <label className="text-purple-600 cursor-pointer">
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
                {editedTask.attachment && (
                  <p className="text-xs mt-2">{editedTask.attachment.name}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-6 py-2 text-sm bg-gray-200 rounded font-medium hover:bg-gray-300"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 font-medium"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTaskModal;
