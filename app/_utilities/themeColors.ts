type ThemeColors = {
    bgColor: {
        [x: string]: string;
    },
    color: {
        [x: string]: string;
    },
    itemHover: {
        [x: string]: string;
    }
}

const themeColors: ThemeColors = {
    bgColor: {
        dark: '#1b1736',
        light: '#fff',
        system: '#fff'
    },
    color: {
        dark: '#fff',
        light: '#000',
        system: '#000'
    },
    itemHover: {
        dark: '#03020f',
        light: '#dbdbdb',
        system: '#dbdbdb'
    }
}

export default themeColors;