import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchTerm,
  setCategory,
  setAvailability,
  setLocation,
} from "../../store/slices/filtersSlice";
import { RootState } from "../../store/store";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { searchTerm, category, availability, location } = useSelector(
    (state: RootState) => state.filters
  );

  const handleClearFilters = () => {
    dispatch(setSearchTerm(""));
    dispatch(setCategory(""));
    dispatch(setAvailability(""));
    dispatch(setLocation(""));
  };

  return (
    <div className="py-10 px-4 text-white">
      <h2 className="text-3xl font-bold text-center mb-6 font-['Roboto_Slab']">
        Search for items
      </h2>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search with names..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="w-full px-5 py-3 rounded-lg bg-white text-[#2a2a2a] placeholder-[#2a2a2a] shadow-md focus:outline-none font-['Lato']"
          />
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#2a2a2a]">
            <FaSearch size={18} />
          </button>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 text-white font-['Lato'] font-medium text-base">
          {/* Category Filter */}
          <select
            value={category}
            onChange={(e) => dispatch(setCategory(e.target.value))}
            className="bg-transparent px-2 py-1 focus:outline-none"
          >
            <option className="text-black" value="">
              All Categories
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

          {/* Availability Filter */}
          <select
            value={availability}
            onChange={(e) => dispatch(setAvailability(e.target.value))}
            className="bg-transparent px-2 py-1 focus:outline-none"
          >
            <option className="text-black" value="">
              All Availability
            </option>
            <option className="text-black" value="available">
              Available
            </option>
            <option className="text-black" value="unavailable">
              Unavailable
            </option>
          </select>

          <div className="w-px h-6 bg-white opacity-50"></div>

          {/* Location Filter */}
          <select
            value={location}
            onChange={(e) => dispatch(setLocation(e.target.value))}
            className="bg-transparent px-2 py-1 focus:outline-none"
          >
            <option className="text-black" value="">
              All Locations
            </option>
            <option className="text-black" value="helsinki">
              Helsinki
            </option>
            <option className="text-black" value="turku">
              Turku
            </option>
            <option className="text-black" value="tampere">
              Tampere
            </option>
          </select>

          {/* Clear Filters Button */}
          <button
            onClick={handleClearFilters}
            className="ml-4 px-3 py-1 border border-[#3EC3BA] text-[#3EC3BA] rounded-lg transition-all duration-150 hover:bg-[#3EC3BA] hover:text-white hover:cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
