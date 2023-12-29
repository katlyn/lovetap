/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/index.html",
    "./src/**/*.{vue,ts}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          peach: "#efc4df",
          strawberry: "#e5a0a0",
          cantaloupe: "#f9b28c",
          banana: "#f0cf9f",
          watermelon: "#b0d2b0",
          mint: "#95fecc",
          water: "#80bbdb",
          ube: "#a99dbd",
          tapioca: "#c1c1c1",
          dark: "#111",
          light: "#EEE"
        }
      }
    }
  }
}
