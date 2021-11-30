import React, { useState } from "react";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";

const Loading = () => {
  const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
  `;
  const [loading, setLoading] = useState(true);
  const [color, setColor] = useState("#ffffff");

  return (
    <div style={{ marginTop: "150px" }}>
      <div className="sweet-loading text-center">
        <HashLoader color="#000" loading={loading} css="" size={80} />
      </div>
    </div>
  );
};

export default Loading;
