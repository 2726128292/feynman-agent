/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light: '#6366F1',
          dark: '#4338CA',
        },
        accent: '#7C3AED',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        background: '#F7F8FC',
        surface: '#FFFFFF',
        text: {
          primary: '#1F2937',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        border: '#E5E7EB',
      },
      borderRadius: {
        card: '16px',
        button: '10px',
        tag: '14px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
