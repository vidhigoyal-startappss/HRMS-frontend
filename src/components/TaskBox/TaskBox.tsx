import React, { useState } from "react";

interface TaskBoxProps {
  tasks: string[];
}

const TaskBox: React.FC<TaskBoxProps> = ({ tasks }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const nextTask = () => {
    if (currentIndex < tasks.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const prevTask = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  return (
    <div className="w-[48%] h-[300px] bg-white shadow-md rounded-md py-10 px-6 space-y-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Task {currentIndex + 1} of {tasks.length}
        </h2>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md text-gray-800 text-sm">
          {tasks[currentIndex]}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={prevTask}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={nextTask}
          disabled={currentIndex === tasks.length - 1}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskBox;
