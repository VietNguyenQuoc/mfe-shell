import { useEffect, useRef } from "react";

// Updated URLs of deployed miniapps
const MINIAPP1_URL = "https://mfa-products-production.up.railway.app";
const MINIAPP2_URL = "https://mfe-cart-production.up.railway.app";

type MiniappConfig = {
  url: string;
  tag: string;
};

const miniappConfigs: MiniappConfig[] = [
  { url: MINIAPP1_URL, tag: "mfe-product" },
  { url: MINIAPP2_URL, tag: "mfe-cart" },
];

function loadScript(url: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.type = "module";
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

const loadMiniapp = async (config: MiniappConfig) => {
  const assetManifestUrl = `${config.url}/.vite/manifest.json`;
  const assetManifest: any = await (await fetch(assetManifestUrl)).json();

  const entryUrl = `${config.url}/${assetManifest["index.html"].file}`;

  loadScript(entryUrl);
};

function App() {
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;

    miniappConfigs.forEach(loadMiniapp);
    loaded.current = true;
  }, []);

  return (
    <div>
      <h1>Microfrontend</h1>

      <div className="miniapps">
        {miniappConfigs.map((config) => (
          <config.tag />
        ))}
      </div>
    </div>
  );
}

export default App;
