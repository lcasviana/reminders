/** @type {import('prettier').Config} */
const prettier = {
  quoteProps: "consistent",
  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  importOrder: ["^(react|react-dom)(/.*)?$", "^(next)(/.*)?$", "<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

export default prettier;
