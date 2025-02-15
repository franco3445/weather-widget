import { createRoot } from 'react-dom/client';

import WeatherWidget from "./WeatherWidget";

const root = createRoot(document.body);
root.render(<WeatherWidget/>);