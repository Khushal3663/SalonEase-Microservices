import React from "react";

const CategoryCard = ({
  handleCategoryClick,
  selectedCategoryId,
  category,
}) => {
  return (
    <div
      onClick={() => handleCategoryClick(category.id)}
      className={`px-3 py-2 cursur-pointer flex gap-2 items-center ${selectedCategoryId === category.id ? " bg-green-600 text-white rounded-xl shadow-lg shadow-green-200 translate-x-2" : "bg-white hover:bg-slate-50 rounded-xl text-slate-700 shadow-sm"}`}
    >
      <img
        className="w-14 h-14 object-cover rounded-full"
        // src="https://homesalon.in/category/1756290215makeup_getlook.jpg"
        src={category.image}
        alt=""
      />
      <h1>{category.name}</h1>
    </div>
  );
};

export default CategoryCard;
