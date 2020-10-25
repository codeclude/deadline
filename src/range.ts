import {format, formatDistance} from 'date-fns';

const range = {
    0: 'white',
    1: 'yellow',
    2: 'green',
    3: 'blue',
    4: 'red'
}

export const getNavigatorLanguage = () => {
    if (navigator.languages && navigator.languages.length) {
      return navigator.languages[0];
    } else {
      return navigator.language || 'en';
    }
}

export const createDeadlineContainer = () => {
    let deadlineContainer = figma.createComponent();
    deadlineContainer.name = 'Frame Deadline';
    deadlineContainer.resize(320, 60);
    deadlineContainer.x = -320;
    deadlineContainer.constrainProportions = true;
    return deadlineContainer;
} 

export const createDeadlineBackground = () => {
    const deadlineBackground = figma.createRectangle();
    deadlineBackground.name = 'Frame Deadline Background';
    deadlineBackground.resize(320, 60);
    deadlineBackground.fills = [{type: 'SOLID', color: {r: 48/255, g: 245/255, b: 234/255}}];
    deadlineBackground.cornerRadius = 4.0;
    deadlineBackground.topRightRadius = 0;
    deadlineBackground.bottomRightRadius = 0;
    deadlineBackground.constraints = {horizontal: 'MIN', vertical: 'MIN'};
    return deadlineBackground;
}

export const createDeadlineText = ({startDate}) => {
    const deadlineText = figma.createText();
    deadlineText.resize(320, 30);
    deadlineText.textAlignHorizontal = 'CENTER';
    deadlineText.textAlignVertical = 'CENTER';
    deadlineText.textCase = 'UPPER';
    deadlineText.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}];
    deadlineText.fontName = {family: "Roboto", style: "Bold"};
    deadlineText.fontSize = 20;
    deadlineText.constraints = {horizontal: 'MIN', vertical: 'MIN'};
    deadlineText.characters = formatDistance(new Date(`${startDate}`), new Date(), {addSuffix: true});
    deadlineText.strokeWeight = 0.5;
    deadlineText.strokes = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
    deadlineText.name = 'Frame Deadline Text';
    deadlineText.setPluginData("deadline-date", startDate);
    return deadlineText;
}

export const createDeadlineDateText = ({startDate}) => {
    const deadlineDateText = figma.createText();
    deadlineDateText.resize(320, 30);
    deadlineDateText.textAlignHorizontal = 'CENTER';
    deadlineDateText.textAlignVertical = 'CENTER';
    deadlineDateText.textCase = 'UPPER';
    deadlineDateText.fills = [{type: 'SOLID', color: {r: 0, g: 0, b: 0}}];
    deadlineDateText.fontName = {family: "Roboto", style: "Bold"};
    deadlineDateText.fontSize = 20;
    deadlineDateText.strokeWeight = 0.5;
    deadlineDateText.strokes = [{type: 'SOLID', color: {r: 1, g: 1, b: 1}}]
    deadlineDateText.constraints = {horizontal: 'MIN', vertical: 'MIN'};
    deadlineDateText.characters = format(new Date(`${startDate}`), 'Pp');
    deadlineDateText.name = 'Frame Deadline Date Text';
    deadlineDateText.setPluginData("deadline-date", startDate);
    deadlineDateText.y = 30;
    return deadlineDateText;
}

export const generateDeadlineContainer = (savedValue) => {
    const deadlineContainer = createDeadlineContainer();
    const deadlineBackground = createDeadlineBackground();
    const deadlineText = createDeadlineText(savedValue);
    const deadlineDateText = createDeadlineDateText(savedValue);

    const group = figma.group([deadlineBackground, deadlineText, deadlineDateText], deadlineContainer);
    group.name = 'Frame Deadline Status';
    group.resize(320, 60);
    group.x = 0;

    deadlineContainer.insertChild(0, group);
    return deadlineContainer;
}

export const updateDeadlineContainer = (savedValue, nodeId) => {
    //TODO 
}