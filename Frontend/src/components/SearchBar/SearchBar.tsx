import { FaSearch } from "react-icons/fa";
import { useState } from "react";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [availability, setAvailability] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = () => {
    console.log({ searchTerm, category, availability, location });
  };

  return (
    <div className="py-10 px-4 text-white">
      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-6 font-['Roboto_Slab']">
        Search for items
      </h2>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search for items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 rounded-lg bg-white text-[#2a2a2a] placeholder-[#2a2a2a] shadow-md focus:outline-none font-['Lato']"
          />
          <button
            onClick={handleSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#2a2a2a]"
          >
            <FaSearch size={18} />
          </button>
        </div>

        {/* Filter Dropdowns (unstyled, minimal look) */}
        <div className="flex flex-wrap justify-center items-center gap-4 text-white font-['Lato'] font-medium text-base">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-transparent px-2 py-1 focus:outline-none"
          >
            <option className="text-black" value="">
              Category
            </option>
            <option className="text-black" value="furniture">
              Furniture
            </option>
            <option className="text-black" value="tools">
              Tools
            </option>
            <option className="text-black" value="electronics">
              Electronics
            </option>
          </select>

          <div className="w-px h-6 bg-white opacity-50"></div>

          <select
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
            className="bg-transparent px-2 py-1 focus:outline-none"
          >
            <option className="text-black" value="">
              Availability
            </option>
            <option className="text-black" value="available">
              Available
            </option>
            <option className="text-black" value="unavailable">
              Unavailable
            </option>
          </select>

          <div className="w-px h-6 bg-white opacity-50"></div>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="bg-transparent px-2 py-1 focus:outline-none"
          >
            <option className="text-black" value="">
              Location
            </option>
            <option className="text-black" value="ny">
              Helsinki
            </option>
            <option className="text-black" value="la">
              Turku
            </option>
            <option className="text-black" value="sf">
              Tampere
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
