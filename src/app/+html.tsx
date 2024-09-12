import { ScrollViewStyleReset } from "expo-router/html";
import { type PropsWithChildren } from "react";

const domain = "gb.kilowatts.io";
const url = `https://${domain}`;
const title = "Kilowatts Grid (Great Britain)";
const icon = `https://${domain}/icon.png`;
const icon192 = `https://${domain}/icon-192.png`;
const appleAppId = "6474467753"
const iosUrl =  `https://apps.apple.com/gb/app/kilowatts-grid/id${appleAppId}`;
const googleUrl = "https://play.google.com/store/apps/details?id=com.benjaminwatts.kilowatts";

const description =
  "Live electricity data and map for Great Britain for hundreds of generators and interconnectors.";
const keywords =
  "electricity, power, energy, grid, generation, interconnectors, Great Britain, UK, live, data, map, kilowatts, kilowatts.io";

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta property="og:title" content={title} />

        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        {/* Add favicon */}

        <link rel="icon" type="image/png" href={icon} />
        <link rel="apple-touch-icon" href={icon} />

        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="kilowatts.io" />

        {/* Open Graph for Social Media */}
        <meta property="og:description" content={description} />
        <meta property="og:image" content={icon} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta
          name="twitter:description"
          content="Calculate your true take-home pay, considering all work-related expenses."
        />
        <meta name="twitter:image" content={icon} />

        {/* <link rel="manifest" href="/manifest.json" /> */}

        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: title,
              description,
              url,
              author: {
                "@type": "Person",
                name: "kilowatts.io",
              },
              applicationCategory: "Utility",
            }),
          }}
        />
        <meta name="apple-itunes-app" content={`app-id=${appleAppId}`} />

        <link rel="stylesheet" href="smartbanner.css" />
        <script src="smartbanner.js" />

        <meta name="smartbanner:enabled-platforms" content="android" />
        <meta name="smartbanner:show" content="true" />

        <meta name="smartbanner:title" content={title} />
        <meta name="smartbanner:author" content="kilowatts.io Limited" />
        <meta name="smartbanner:price" content="" />
        <meta name="smartbanner:price-suffix-apple" content="from Appstore" />
        <meta
          name="smartbanner:price-suffix-google"
          content="from Google Play"
        />
        <meta name="smartbanner:icon-apple" content={icon192} />
        <meta name="smartbanner:icon-google" content={icon192} />
        <meta name="smartbanner:button" content="Download" />
        <meta name="smartbanner:button-url-apple" content={iosUrl} />
        <meta name="smartbanner:button-url-google" content={googleUrl} />

        <meta name="smartbanner:close-label" content="Close" />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;
