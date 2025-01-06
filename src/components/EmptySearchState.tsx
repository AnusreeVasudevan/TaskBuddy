const EmptySearchState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-24 h-24 mb-6">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-full h-full text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M9 9L15 15M15 9L9 15"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <p className="text-gray-600 text-lg font-medium mb-1">
        It looks like we can't find any results
      </p>
      <p className="text-gray-500 text-sm">
        that match.
      </p>
    </div>
  );
};

export default EmptySearchState;