import Items from "../../components/Items/Items";
import SearchBar from "../../components/SearchBar/SearchBar";

const Home = () => {
  return (
    <div>
      {/* Storage Items will be here */}
      <SearchBar />
      <Items />
    </div>
  );
};

export default Home;
