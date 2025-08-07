
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
                    },
                    animation: {
                        float: 'float 20s ease-in-out infinite',
                        floatCard: 'floatCard 3s ease-in-out infinite',
                        slideInLeft: 'slideInLeft 1s ease-out',
                        slideInRight: 'slideInRight 1s ease-out',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-20px)' },
                        },
                        floatCard: {
                            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                            '50%': { transform: 'translateY(-15px) rotate(2deg)' },
                        },
                        slideInLeft: {
                            from: { opacity: '0', transform: 'translateX(-50px)' },
                            to: { opacity: '1', transform: 'translateX(0)' },
                        },
                        slideInRight: {
                            from: { opacity: '0', transform: 'translateX(50px)' },
                            to: { opacity: '1', transform: 'translateX(0)' },
                        },
                    }
                }
            }
        }