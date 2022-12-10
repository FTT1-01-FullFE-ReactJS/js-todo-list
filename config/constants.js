export const levelMap = {
    key: {
        small: 1,
        medium: 2,
        hight: 3,
    },
    label: {
        1: 'small',
        2: 'medium',
        3: 'hight'
    }
};

export const colors = {
    yellow: 'yellow',
    red: 'red',
    limeGreen: '#32CD32'
};

export const colorLevel = {
    [levelMap.key.small]: colors.limeGreen, // 1: limeGreen
    [levelMap.key.medium]: colors.yellow,   // 2: yellow
    [levelMap.key.hight]: colors.red        // 3: red
};

// const constants = {
//     levelMap,
//     colors,
// };

// export default constants;

// export { levelMap, colors };