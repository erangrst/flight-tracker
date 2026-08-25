import { useEffect, useState } from "react";
import { middleOfUSA } from "../lib/constants";
import { Popup, useMap } from "@vis.gl/react-maplibre";
import { getLocation } from "../lib/api";

export default function YouAreHere() {
  const [popupLocation, setPopupLocation] = useState(middleOfUSA);
  const { current: map } = useMap();

  useEffect(() => {
    if (!map) return;
    (async () => {
      console.log('%c YouAreHere 1', 'background-color: yellow', { map });
      const location = await getLocation();

      console.log('%c YouAreHere 1', 'background-color: yellow', { location });

      if (location !== middleOfUSA) {
        setPopupLocation(location);
        map.flyTo({ center: location, zoom: 8 });
      }
    })();
  }, [map]);

  if (!map) return null;

  return (
    <Popup
      longitude={popupLocation[0]}
      latitude={popupLocation[1]}>
      <h3>You are approximately here!</h3>
    </Popup>
  );
}