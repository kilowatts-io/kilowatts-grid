import React from "react";
import log from "../services/log";

const title = "kilowatts grid";
const url = "https://gb.kilowatts.io/";
const domain = "gb.kilowatts.io";
const description =
  "Second by second power plant generation data";
const logoImage = "logo.png";

export const ReactHelmet = () => {
  log.info("ReactHelmet");
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={logoImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:domain" content={domain} />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={logoImage} />
    </>
  );
};
