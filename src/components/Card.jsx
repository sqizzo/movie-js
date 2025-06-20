import React, { useState, useEffect } from "react";

// Class components
// class ClassComponents extends React.Component {
//   render() {
//     return <h2>Class component</h2>;
//   }
// }

const Card = ({ title }) => {
  const [count, setCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Runs when the state of count is changed
  useEffect(() => {
    console.log(` ${title} has been liked : ${hasLiked}`);
  }, [hasLiked]);

  // Runs when the component is mounted
  useEffect(() => {
    console.log("Card component is mounted");
  }, []);

  return (
    <div
      className="card"
      onClick={() =>
        setCount((prevState) => (hasLiked ? prevState : prevState + 1))
      }
    >
      <h2>
        {/* conditional rendering for count */}
        {title} {count ? "- " + count : null}
      </h2>
      <button onClick={() => setHasLiked(!hasLiked)}>
        {hasLiked ? "❤️" : "🤍"}
      </button>
    </div>
  );
};

export default Card;
