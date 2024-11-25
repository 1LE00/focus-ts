type Color = {
    colorName: string;
    value: string;
};

type ProjectAndTagColors = {
    name: string,
    value: string
}
// * List of themes for the app 
const colors: Color[] = [
    { colorName: "focus", value: "#ba4a4a" },
    { colorName: "short", value: "#408bc4" },
    { colorName: "long", value: "#388a53" },
    { colorName: "purple", value: "#a147f05e" },
    { colorName: "gold", value: "#f2af4a99" },
    { colorName: "yellow", value: "#ffd50099" },
    { colorName: "red", value: "#ff634799" },
    { colorName: "blue", value: "#89cfeb99" },
    { colorName: "greens", value: "#80ff8099" },
    { colorName: "pink", value: "#ae66c799" },
    { colorName: "graye", value: "#d4d4d499" },
    { colorName: "peach", value: "#ffdbb899" },
    { colorName: "orange", value: "#ffa77a99" },
    { colorName: "ocean", value: "#4378ad99" },
    { colorName: "teal", value: "#00999999" },
    { colorName: "blackjet", value: "#00999999" },
    { colorName: "charcoal", value: "#00999999" },
    { colorName: "dark", value: "#000000" },
];

const projectAndTagColors: ProjectAndTagColors[] = [
    { name: 'crimsonRed', value: '#f64437' },
    { name: 'cerisePink', value: '#ea1f63' },
    { name: 'indigo', value: '#9e29ae' },
    { name: 'violet', value: '#6539b1' },
    { name: 'denimBlue', value: '#3e50b1' },
    { name: 'dodgerBlue', value: '#1997f0' },
    { name: 'skyBlue', value: '#00a8f0' },
    { name: 'turquoise', value: '#00b9d1' },
    { name: 'seaGreen', value: '#009488' },
    { name: 'forestGreen', value: '#4ab057' },
    { name: 'limeGreen', value: '#8cc256' },
    { name: 'oliveGreen', value: '#cddc4c' },
    { name: 'lemonYellow', value: '#ffea4d' },
    { name: 'amber', value: '#ffc02e' },
    { name: 'burntOrange', value: '#ff961f' },
    { name: 'vermilion', value: '#ff5726' },
    { name: 'copper', value: '#7a5548' },
    { name: 'slateBlue', value: '#607d8a' },
    { name: 'coral', value: '#ff6347' }
];

export { colors, projectAndTagColors }
export type { Color }