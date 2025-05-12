import { useEffect, useState } from "react";
const codeSamples = [
    "function initializeSystem(config) {",
    "  console.log('[SYSTEM] Booting in neon mode...');",
    "  for (let i = 0; i < config.modules.length; i++) {",
    "    const status = loadModule(config.modules[i]);",
    "    if (!status.success) throw new Error('Module failed: ' + config.modules[i]);",
    "  }",
    "  console.log('[SYSTEM] All modules loaded.');",
    "}",
    "",
    "while (network.isConnected() && retries < MAX_RETRIES) {",
    "  try {",
    "    sendHeartbeatPacket();",
    "    await delay(1000);",
    "  } catch (err) {",
    "    console.warn('Heartbeat failed, retrying...');",
    "    retries++;",
    "  }",
    "}",
    "",
    "if (auth.isValid(token)) {",
    "  session = createSession(user);",
    "  grantAccess(session);",
    "} else {",
    "  logSecurityEvent('Invalid token: ' + token);",
    "  denyAccess();",
    "}",
    "",
    "const neonUI = await import('@neon/ui-core');",
    "neonUI.mount('#main-display', { theme: 'cyberpunk', animate: true });",
    "",
    "fetch('/api/system/data', { headers: { 'Authorization': token } })",
    "  .then(response => response.json())",
    "  .then(systemData => {",
    "    renderDashboard(systemData);",
    "    console.log('[DATA] Dashboard rendered');",
    "  })",
    "  .catch(error => console.error('[ERROR] Data fetch failed:', error));",
    "",
    ">>> SYSTEM READY <<<",
  ];

const generateCodeLines = (count: number) =>
  Array.from({ length: count }, () => {
    return codeSamples[Math.floor(Math.random() * codeSamples.length)];
  });

const LoadingScreen = () => {
	const [show, setShow] = useState(true);
  const repeatedLines = [...generateCodeLines(40), ...generateCodeLines(40)]; // repeat to fill animation loop
	useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000); // 4秒後移除 loading 畫面

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 font-mono flex flex-col justify-center px-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none pl-[40px]">
        <div className="code-stream animate-marquee h-[200%]">
          <div className="pl-16 text-red-500 neon-red text-left text-2xl font-bold leading-relaxed whitespace-pre">
            {repeatedLines.map((line, i) => (
            <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </div>
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
				<h1 className="neon-red flicker text-[30px] ...">LOADING...</h1>
			</div>
    </div>
  );
};

export default LoadingScreen;