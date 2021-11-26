module.exports = {
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            spacing: {
                650: "500px",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};