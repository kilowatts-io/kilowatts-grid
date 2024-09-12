import React from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Canvas, Circle, Group, Path } from "@shopify/react-native-skia";
import { ForeignFlag } from "@/src/atoms/flags";
import * as i from "@/src/components/icons";
import * as c from "@/src/constants";
import Animated, { runOnJS, useDerivedValue } from "react-native-reanimated";
import GB_SVG_MAP from "@/src/atoms/svg-map";
import { MIN_ZOOM, MAX_ZOOM, useSvgMapContext, ZOOM_INC } from "@/src/contexts/svg-map";
import { useScreen } from "@/src/hooks/screen";
import useMousePinchGesture from "@/src/hooks/scroll-gesture";
import { useRouter } from "expo-router";
import * as nav from "@/src/utils/nav";

const mapCanvasCenter = (m: SvgMap) => ({
  x: m.dims.width / 2,
  y: m.dims.height / 2,
});

export const calculatePointX = (lng: number, svgMap: SvgMap) => {
  "worklet";

  const { bounds, dims } = svgMap;

  const lonRad = (lng * Math.PI) / 180;

  const normalizedLon =
    (lonRad - (bounds.west * Math.PI) / 180) /
    ((bounds.east * Math.PI) / 180 - (bounds.west * Math.PI) / 180);

  return normalizedLon * dims.width;
};

export const calculatePointY = (lat: number, svgMap: SvgMap) => {
  "worklet";

  const { bounds, dims } = svgMap;

  const NORTH_RAD = (bounds.north * Math.PI) / 180;
  const SOUTH_RAD = (bounds.south * Math.PI) / 180;
  const NORMALISED_NORTH_Y = Math.log(Math.tan(Math.PI / 4 + NORTH_RAD / 2));
  const NORMALIZED_SOUTH_Y = Math.log(Math.tan(Math.PI / 4 + SOUTH_RAD / 2));

  const latRad = (lat * Math.PI) / 180;

  const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));

  const normalizedY =
    1 -
    (mercatorY - NORMALIZED_SOUTH_Y) /
      (NORMALISED_NORTH_Y - NORMALIZED_SOUTH_Y);

  return normalizedY * dims.height;
};

export const calculatePoint = (
  { lat, lng }: Coords,
  svgMap: SvgMap
): CanvasPoint => {
  "worklet";
  return {
    x: calculatePointX(lng, svgMap),
    y: calculatePointY(lat, svgMap),
  };
};

export const calculateCoords = (point: CanvasPoint, svgMap: SvgMap) => {
  "worklet";
  const { x, y } = point;

  // Scale pixel coordinates back to normalized coordinates
  const normalizedLon = x / svgMap.dims.width;
  let normalizedY = y / svgMap.dims.height;
  normalizedY = 1 - normalizedY; // Invert Y back
  const bounds = svgMap.bounds;

  // Convert normalized longitude back to radians
  const lonRad =
    normalizedLon *
      ((bounds.east * Math.PI) / 180 - (bounds.west * Math.PI) / 180) +
    (bounds.west * Math.PI) / 180;

  // Invert Mercator projection for latitude
  const normalizedSouthY = Math.log(
    Math.tan(Math.PI / 4 + (bounds.south * Math.PI) / 180 / 2)
  );
  const normalizedNorthY = Math.log(
    Math.tan(Math.PI / 4 + (bounds.north * Math.PI) / 180 / 2)
  );
  const mercatorY =
    normalizedY * (normalizedNorthY - normalizedSouthY) + normalizedSouthY;
  const latRad = 2 * (Math.atan(Math.exp(mercatorY)) - Math.PI / 4);

  // Convert radians back to degrees
  const lat = (latRad * 180) / Math.PI;
  const lng = (lonRad * 180) / Math.PI;

  const coords = { lat, lng };
  return coords;
};


/**
 * Measure the distance in km between two points
 */
const calculateDistance = (a:Coords, b:Coords) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (b.lat - a.lat) * (Math.PI / 180); // deg2rad below
  const dLon = (b.lng - a.lng) * (Math.PI / 180);
  const A =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(a.lat * (Math.PI / 180)) *
      Math.cos(b.lat * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
  return R * C; // Distance in km
}

export const SvgMap: React.FC<SvgMapProps> = (p) => {
  const router = useRouter();
  const screen = useScreen();
  const ctx = useSvgMapContext();
  const svgMap = GB_SVG_MAP;
  const centerX = useDerivedValue(
    () => calculatePointX(ctx.centerLng.value, svgMap),
    [ctx.centerLng]
  );

  const centerY = useDerivedValue(
    () => calculatePointY(ctx.centerLat.value, svgMap),
    [ctx.centerLat]
  );

  const svgCenter = mapCanvasCenter(svgMap);

  const transform = useDerivedValue(() => {
    const scaleValue = ctx.zoom.value; //* zoomChange.value
    const translateY = svgCenter.y - centerY.value * scaleValue;
    return [
      { translateX: svgCenter.x - centerX.value * scaleValue },
      { translateY },
      { scale: scaleValue },
      { translateX: ctx.translationX.value },
      { translateY: ctx.translationY.value },
    ];
  }, [ctx.translationX, ctx.translationY, ctx.zoom, centerX, centerY]);

  const onTap = (point: { x: number; y: number }) => {
    console.log("Tapped at", point);

    if (p.unit_groups.length === 0) return;

    const untranslateX = point.x - ctx.translationX.value;
    const untranslateY = point.y - ctx.translationY.value;

    // Step 2: Reverse scaling
    const unscaleX =
      (untranslateX - svgCenter.x) / ctx.zoom.value + centerX.value;
    const unscaleY =
      (untranslateY - svgCenter.y) / ctx.zoom.value + centerY.value;

    const coords = calculateCoords({ x: unscaleX, y: unscaleY }, svgMap);

    const closest = p.unit_groups
      .map((ug, index) => ({
        ug,
        index,
        distance: calculateDistance(coords, ug.coords),
      }))
      .sort((a, b) => a.distance - b.distance)[0];

    const DISTANCE_THRESHOLD_KM = 30;
    if (closest.distance > DISTANCE_THRESHOLD_KM) {
      console.log("Closest point is too far away");
      return;
    }

    const url = nav.unit_group(closest.ug.code);
    router.navigate(url);
  };

  const gesture = Gesture.Race(
    Gesture.Hover()
      .onBegin(() => (ctx.cursorHovered.value = true))
      .onEnd(() => (ctx.cursorHovered.value = false)),
    Gesture.Pan()
      .onChange((e) => {
        ctx.translationX.value += e.changeX;
        ctx.translationY.value += e.changeY;
      })
      .onEnd(() => {
        const newCoords = calculateCoords(
          {
            x: centerX.value - ctx.translationX.value,
            y: centerY.value - ctx.translationY.value,
          },
          svgMap
        );

        ctx.centerLat.value = newCoords.lat;
        ctx.centerLng.value = newCoords.lng;

        ctx.translationX.value = 0;
        ctx.translationY.value = 0;
      }),
    Gesture.Pinch().onChange((e) => {
      ctx.zoom.value = Math.min(
        Math.max(ctx.zoom.value * e.scaleChange, MIN_ZOOM),
        MAX_ZOOM
      );
    }),
    Gesture.Tap().onEnd(runOnJS(onTap))
  );




  useMousePinchGesture(ctx.cursorHovered.value, () => {
    ctx.zoom.value = Math.min(ctx.zoom.value + ZOOM_INC, MAX_ZOOM);
  }, () => {
    ctx.zoom.value = Math.max(ctx.zoom.value - ZOOM_INC, MIN_ZOOM);
  });

  
  return (
    <Animated.View
      style={{
        backgroundColor: c.MAP_BACKGROUND_COLOR,
        width: screen.mapWidth,
        height: screen.mapHeight,
      }}
    >
      <GestureDetector gesture={gesture}>
        <Canvas
          style={{
            backgroundColor: c.MAP_BACKGROUND_COLOR,
            flex: 1,
          }}
        >
          {/* a circle that highlights a particular spot on the map */}

          <Group transform={transform}>
            <Path path={svgMap.path} color="white" />
            {p.unit_groups.map((ug, index) => {
              switch (ug.fuel_type) {
                case "wind":
                  return <i.WindMapIcon key={`wind-${index}`} {...ug} />;
                case "battery":
                  return <i.BatteryMapIcon key={`battery-${index}`} {...ug} />;
                case "solar":
                  return <i.SolarMapIcon key={`solar-${index}`} {...ug} />;
                case "interconnector":
                  return null;
                default:
                  return (
                    <i.DispatchableMapIcon
                      key={`dispatchable-${index}`}
                      {...(ug as DispatchableMapGeneratorIconProps)}
                    />
                  );
              }
            })}

            {p.foreign_markets.map((fm) => (
              <ForeignFlag key={`flag-${fm.code}`} {...fm} />
            ))}

            {p.foreign_markets
              .map(({ cables }) => cables)
              .flat()
              .map((c) => (
                <i.CableMapIcon key={`cable-${c.code}`} {...c} />
              ))}

            <Circle
              r={c.HIGHLIGHT_CIRCLE_RADIUS}
              cx={centerX}
              cy={centerY}
              color="black" // This is the color of the stroke
              strokeWidth={2} // Set the stroke width
              style="stroke" // Set the style to stroke only (no fill)
              opacity={ctx.highlightOpacity} // Optional: control opacity
            />
          </Group>
        </Canvas>
      </GestureDetector>
    </Animated.View>
  );
};

export default SvgMap;
