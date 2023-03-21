import React, { useState, useEffect } from "react";
import { Loader, Card, FormField } from "../components";

const RenderCards = ({ data, title }) => {
  if (data?.length > 0)
    return data.map((post) => <Card key={post._id} {...post} />);

  return (
    <h2 className="mt-5 font-bold text-[#6469ff] text-xl uppercase">{title}</h2>
  );
};

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState(null);
  const [searchText, setsearchText] = useState("");
  const [searchResults, setsearchResults] = useState(null);
  const [searchTimeOut, setsearchTimeOut] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:8181/api/v1/post", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          const result = await response.json();

          setAllPosts(result.data.reverse());
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (e) => {
    clearTimeout(searchTimeOut);
    setsearchText(e.target.value);

    setsearchTimeOut(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );

        setsearchResults(searchResult);
      }, 500)
    );
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Community Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500px]">
          Indulge into Imagination & Creativity
        </p>
      </div>

      <div className="mt-16">
        <FormField
          labelName="Search Posts"
          type="text"
          name="text"
          placeHolder="Search Posts.."
          value={searchText}
          handleChange={handleSearch}
        />
      </div>

      <div className="mt-10 ">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing Results For
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}
            <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchResults}
                  title="No Search Results Found!"
                />
              ) : (
                <RenderCards data={allPosts} title="No Posts Found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
