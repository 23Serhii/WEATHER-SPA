/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            backgroundImage: {
                // Теми під погоду
                'sunny': 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)',
                'rainy': 'linear-gradient(135deg, #314755 0%, #26a0da 100%)',
                'snowy': 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
                'cloudy': 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
                'mist': 'linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)',
                'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }
        }
    },
    plugins: []
};
