import React from "react";
import { Group, Path, Rect, Skia } from "@shopify/react-native-skia";
import * as c from "@/src/constants";

type FlagProps = {
  point: CanvasPoint;
};

type TricolorFlagProps = FlagProps & {
  color1: string;
  color2: string;
  color3: string;
};

const triColourDimensions = ({ point }: FlagProps) => {
  return {
    topY: point.y - c.FLAG_HEIGHT / 2,
    leftX: point.x - c.FLAG_WIDTH * (1 / 3),
    rightX: point.x + c.FLAG_HEIGHT * (1 / 3),
    stripeWidth: c.FLAG_WIDTH / 3,
  };
};

const TricolorFlag: React.FC<TricolorFlagProps> = ({
  point,
  color1,
  color2,
  color3,
}) => {
  const d = triColourDimensions({ point });
  const props = { width: d.stripeWidth, height: c.FLAG_HEIGHT, y: d.topY };

  return (
    <>
      <Rect {...props} x={d.leftX} color={color1} />
      <Rect {...props} x={point.x} color={color2} />
      <Rect {...props} x={d.rightX} color={color3} />
    </>
  );
};

export const France: React.FC<FlagProps> = (p) => (
  <Group
    transform={[
      { translateY: c.FLAG_HEIGHT / 2 },
      { translateX: -c.FLAG_WIDTH / 4 },
    ]}
  >
    <TricolorFlag
      {...p}
      color1={c.FLAG_COLORS.blue}
      color2={c.FLAG_COLORS.white}
      color3={c.FLAG_COLORS.red}
    />
  </Group>
);

export const Belgium: React.FC<FlagProps> = (p) => (
  <Group
    transform={[
      { translateY: c.FLAG_HEIGHT / 2 },
      { translateX: c.FLAG_WIDTH / 4 },
    ]}
  >
    <TricolorFlag
      {...p}
      color1={c.FLAG_COLORS.black}
      color2={c.FLAG_COLORS.orange}
      color3={c.FLAG_COLORS.red}
    />
  </Group>
);

export const Ireland: React.FC<FlagProps> = (p) => {
  return (
    <Group
      transform={[{ translateY: 0 }, { translateX: -c.FLAG_WIDTH * (2 / 3) }]}
    >
      <TricolorFlag
        {...p}
        color1={c.FLAG_COLORS.green}
        color2={c.FLAG_COLORS.white}
        color3={c.FLAG_COLORS.orange}
      />
    </Group>
  );
};

export const Netherlands: React.FC<FlagProps> = ({ point }) => {
  const leftX = point.x - c.FLAG_WIDTH / 2;

  const props = {
    x: leftX,
    height: c.FLAG_HEIGHT / 3,
  };

  const topY = point.y - c.FLAG_HEIGHT / 2;
  const y2 = topY + c.FLAG_HEIGHT / 3;
  const y3 = topY + (c.FLAG_HEIGHT * 2) / 3;

  return (
    <Group transform={[{ translateX: c.FLAG_WIDTH / 2 }]}>
      <Rect
        y={topY}
        width={c.FLAG_WIDTH}
        {...props}
        color={c.FLAG_COLORS.red}
      />
      <Rect
        y={y2}
        width={c.FLAG_WIDTH}
        {...props}
        color={c.FLAG_COLORS.white}
      />
      <Rect y={y3} width={c.FLAG_WIDTH} {...props} color={c.FLAG_COLORS.blue} />
    </Group>
  );
};

export const RedBackgroundWhiteCross: React.FC<FlagProps> = ({ point }) => {
  const topY = point.y - c.FLAG_HEIGHT / 2;
  const topLeft = { x: point.x - c.FLAG_WIDTH / 2, y: topY };
  const leftX = topLeft.x;
  const stripeWidth = c.FLAG_HEIGHT / 4;
  return (
    <>
      <Rect
        {...topLeft}
        width={c.FLAG_WIDTH}
        height={c.FLAG_HEIGHT}
        color={c.FLAG_COLORS.red}
      />
      <Rect
        x={leftX}
        y={topLeft.y + c.FLAG_HEIGHT / 3}
        width={c.FLAG_WIDTH}
        height={stripeWidth}
        color={c.FLAG_COLORS.white}
      />
      <Rect
        y={topY}
        x={leftX + c.FLAG_WIDTH / 3}
        width={stripeWidth}
        height={c.FLAG_HEIGHT}
        color={c.FLAG_COLORS.white}
      />
    </>
  );
};

export const Denmark: React.FC<FlagProps & {}> = ({ point }) => {
  const topY = point.y - c.FLAG_HEIGHT / 2;
  const topLeft = { x: point.x - c.FLAG_WIDTH / 2, y: topY };
  return (
    <Group
      transform={[
        { translateY: -c.FLAG_WIDTH / 3 },
        { translateX: c.FLAG_WIDTH / 8 },
      ]}
    >
      <RedBackgroundWhiteCross {...{ point }} />
    </Group>
  );
};

export const Norway: React.FC<FlagProps> = (p) => {
  const { point } = p;
  const topY = point.y - c.FLAG_HEIGHT / 2;
  const topLeft = { x: point.x - c.FLAG_WIDTH / 2, y: topY };
  const leftX = topLeft.x;
  const whiteStripeWidth = c.FLAG_HEIGHT / 4;
  const blueStripeWidth = c.FLAG_HEIGHT / 8;
  const stripeWidthDiff = whiteStripeWidth - blueStripeWidth;
  return (
    <Group transform={[{ translateY: -c.FLAG_WIDTH / 3 }]}>
      <RedBackgroundWhiteCross {...p} />
      <Rect
        x={leftX}
        y={topLeft.y + c.FLAG_HEIGHT / 3 + stripeWidthDiff / 2}
        width={c.FLAG_WIDTH}
        height={blueStripeWidth}
        color={c.FLAG_COLORS.blue}
      />
      <Rect
        x={leftX + c.FLAG_WIDTH / 3 + stripeWidthDiff / 2}
        y={topY}
        width={blueStripeWidth}
        height={c.FLAG_HEIGHT}
        color={c.FLAG_COLORS.blue}
      />
    </Group>
  );
};

export const EU: React.FC = (p) => {
  const radius = c.ICON_LIST_WIDTH / 3; // Adjust the radius based on the width of the flag
  const center = c.LIST_ICON_CENTER_POINT; // Center of the flag
  const starRadius = radius / 7; // Radius of each star
  const angle = (2 * Math.PI) / 12; // Angle between each star

  const starsPath = Skia.Path.Make();

  // Function to create a star path
  const createStar = (cx: number, cy: number, radius: number) => {
    const starPath = Skia.Path.Make();
    for (let i = 0; i < 12; i++) {
      const a = angle * i;
      const x = cx + Math.cos(a) * radius;
      const y = cy + Math.sin(a) * radius;
      if (i === 0) {
        starPath.moveTo(x, y);
      } else {
        starPath.lineTo(x, y);
      }
    }
    starPath.close();
    return starPath;
  };

  // Add stars to the starsPath
  for (let i = 0; i < 12; i++) {
    const a = angle * i;
    const x = center.x + Math.cos(a) * radius;
    const y = center.y + Math.sin(a) * radius;
    starsPath.addPath(createStar(x, y, starRadius));
  }

  return (
    <Group>
      <Rect
        {...p}
        height={c.ICON_LIST_HEIGHT}
        width={c.ICON_LIST_WIDTH}
        color={c.FLAG_COLORS.eublue}
      />
      <Path path={starsPath} color={c.FLAG_COLORS.yellow} />
    </Group>
  );
};


export const ForeignFlag: React.FC<MapForeignMarketProps> = (p) => {
  switch (p.code) {
    case "fr":
      return <France point={p.point} />;
    case "be":
      return <Belgium point={p.point} />;
    case "ie":
      return <Ireland point={p.point} />;
    case "nl":
      return <Netherlands point={p.point} />;
    case "dk":
      return <Denmark point={p.point} />;
    case "no":
      return <Norway point={p.point} />;
    default:
      return null;
  }
}