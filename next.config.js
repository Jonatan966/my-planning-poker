import preparePWA from "next-pwa";

const inDevelopment = process.env.NODE_ENV === "development";

const withPWA = preparePWA({
  dest: "public",
  disable: inDevelopment,
});

export default withPWA();
