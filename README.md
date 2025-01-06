# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```



Kindly read the below mentioned points

Features

Authentication: Sign in using Firebase Google Sign-In.

Task Management:

View tasks in three sections: To-Do, In Progress, and Completed.
Task Categories & Date Filters: Easily filter tasks based on categories or due dates.
Task Creation: Add new tasks via the "Add Task" button.
Task Update: Edit and update tasks with a simple modal.
Task Deletion: Delete tasks from any section.
Drag & Drop: Drag and drop tasks between sections in both List View and Board View.
Batch Updates: Select multiple tasks with checkboxes and update their status or delete them in bulk.

Task Views

List View:

Hover over a task to reveal options to Edit and Delete.
Change the task's status by dragging it between the different sections (To-Do, In Progress, Completed).

Board View:

Hover over the task’s 3-dot menu to drag and drop tasks between sections.
Similar task options as in List View (Edit and Delete) are available here.

User Interface

Header Section: Contains user details and a Logout button.
Task Filters: Filter tasks by category and date.
Search: Easily search for tasks.
Add Task Button: Opens a modal to add new tasks.

How to Use

Sign In: Click on the link and sign in using Firebase Google Sign-In.
Home Page: After authentication, you will be redirected to the home page, where you can see your tasks in the three sections: To-Do, In Progress, and Completed.
Task Management:
Hover over a task to see additional options like Edit and Delete.
Use the Add Task button to create new tasks.
Drag and Drop: Move tasks between sections by dragging and dropping them in both List View and Board View.
Batch Updates: Select multiple tasks using checkboxes to either change their status or delete them all at once.

Important Note: If changes do not reflect immediately, please refresh the page. Also, when hovering over a task in List View, the cursor will change to a four-sided pointer to indicate drag-and-drop availability. In Board View, the drag-and-drop cursor will appear when hovering over the 3-dot menu on a task.

Tech Stack
Frontend: React.js
Backend: Firebase (Authentication, Firestore Database)
Deployment: Hosted on Netlify

Challenges Faced

Implementing the drag-and-drop functionality efficiently.
Separating the views for List View and Board View while keeping the tasks synchronized across both.