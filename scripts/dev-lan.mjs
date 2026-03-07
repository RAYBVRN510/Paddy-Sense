// import os from "os";
// import path from "path";
// import net from "net";
// import { spawn } from "child_process";

// const requestedPort = Number.parseInt(process.env.PORT || "3000", 10);

// function findAvailablePort(startPort) {
//   return new Promise((resolve, reject) => {
//     const tryPort = (port) => {
//       if (port > 65535) {
//         reject(new Error("No available TCP ports found in valid range."));
//         return;
//       }
//       const server = net.createServer();
//       server.once("error", (error) => {
//         if (error && error.code === "EADDRINUSE") {
//           tryPort(port + 1);
//           return;
//         }
//         reject(error);
//       });
//       server.once("listening", () => {
//         server.close(() => resolve(port));
//       });
//       server.listen(port, "0.0.0.0");
//     };
//     tryPort(startPort);
//   });
// }

// function getLanCandidates() {
//   let interfaces;
//   try {
//     interfaces = os.networkInterfaces();
//   } catch (error) {
//     const message = error instanceof Error ? error.message : String(error);
//     console.warn(
//       `Could not read network interfaces (${message}). Falling back to localhost.`,
//     );
//     return [];
//   }
//   const rows = [];

//   for (const [name, infos] of Object.entries(interfaces)) {
//     for (const info of infos || []) {
//       if (info.family !== "IPv4" || info.internal) {
//         continue;
//       }
//       rows.push({ name, address: info.address });
//     }
//   }

//   return rows;
// }

// function pickPreferred(candidates) {
//   if (candidates.length === 0) {
//     return null;
//   }

//   const isLikelyPhysical = (iface) =>
//     /(wi-?fi|wlan|ethernet|en0|eth\d+)/i.test(iface.name);
//   const isLikelyVirtual = (iface) =>
//     /(vpn|vmware|virtual|vbox|hyper-v|loopback|proton|tailscale|tun)/i.test(
//       iface.name,
//     );

//   const preferred = candidates.find(
//     (iface) => isLikelyPhysical(iface) && !isLikelyVirtual(iface),
//   );
//   if (preferred) {
//     return preferred;
//   }

//   const nonVirtual = candidates.find((iface) => !isLikelyVirtual(iface));
//   return nonVirtual || candidates[0];
// }

// const candidates = getLanCandidates();
// const preferred = pickPreferred(candidates);
// let port;
// try {
//   port = await findAvailablePort(requestedPort);
// } catch (error) {
//   const message = error instanceof Error ? error.message : String(error);
//   console.error(`Failed to reserve a dev server port: ${message}`);
//   process.exit(1);
// }

// console.log("Starting Next.js for LAN access...");
// if (port !== requestedPort) {
//   console.log(`Port ${requestedPort} is in use. Using ${port} instead.`);
// }
// if (preferred) {
//   console.log(
//     `Use this URL on other devices: http://${preferred.address}:${port}`,
//   );
// } else {
//   console.log("No LAN IPv4 address detected. Use localhost only.");
// }
// if (candidates.length > 1) {
//   console.log(
//     `Other local IPs: ${candidates.map((entry) => entry.address).join(", ")}`,
//   );
// }

// const nextBin = path.join(
//   process.cwd(),
//   "node_modules",
//   "next",
//   "dist",
//   "bin",
//   "next",
// );
// const child = spawn(
//   process.execPath,
//   [nextBin, "dev", "--hostname", "0.0.0.0", "--port", port],
//   {
//     stdio: "inherit",
//     env: process.env,
//   },
// );

// child.on("exit", (code) => {
//   process.exit(code ?? 0);
// });
