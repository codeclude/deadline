// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
import {formatDistance, isPast, differenceInHours, isToday, isBefore, endOfDay, addDays} from 'date-fns'
import { generateDeadlineContainer } from './range';
figma.loadFontAsync({ family: "Roboto", style: "Regular" })
figma.loadFontAsync({ family: "Roboto", style: "Bold" })
const PLUGIN_DATE = 'deadline-date';
const LAST_UPDATE = 'deadline-update';
// This shows the HTML page in "ui.html".
figma.showUI(__html__, {visible: false});
figma.notify('Select frame or click on right panel Create Sample button')
const isFrameSelected = () => figma.currentPage.selection[0] &&
  figma.currentPage.selection[0].type === 'FRAME';


// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.currentPage.setRelaunchData({ sample: 'Create sample frame', open: '',  refresh: '' })

if (figma.command === 'edit') {
  const frame = figma.createFrame();
  figma.closePlugin();
}

if (figma.command === 'open') {
  console.log('START PLUGIN')
  let allFrames = figma.currentPage.children.filter(el => el.type === 'FRAME');
  if (allFrames.length === 0) {
    let newFrame = figma.createFrame();
    figma.currentPage.appendChild(newFrame)
    allFrames = [newFrame];
  }
  figma.showUI(__html__, {width: 340, height: 385});
  if (isFrameSelected()) {
    figma.ui.postMessage({id: figma.currentPage.selection[0].id, name: figma.currentPage.selection[0].name});
  } else {
    figma.currentPage.selection = [allFrames[0]];
    figma.ui.postMessage({id: allFrames[0].id, name: allFrames[0].name});
  }
  // figma.closePlugin();
}
if (figma.command === 'cancel') {
  console.log('DISABLE WINDOW')
  figma.closePlugin();
}
const loadFonts = async () => {
  await figma.loadFontAsync({ family: "Roboto", style: "Regular" })
  await figma.loadFontAsync({ family: "Roboto", style: "Bold" })
}

const refresh = () => {

  const deadlines = figma.currentPage.findAll((node)=> node.name === "Frame Deadline Text");
  console.log('deadlines', deadlines.map((node:TextNode) => {
    const date = node.getPluginData(PLUGIN_DATE);
    node.characters = formatDistance(new Date(`${date}`), new Date(), {addSuffix: true});
    if (isPast(new Date(`${date}`))) {
      const background = node.parent.findOne(background => background.name === 'Frame Deadline Background')
      if (background.type === 'RECTANGLE') {
        background.fills = [{type: 'SOLID', color: {r: 251/255, g: 132/255, b: 132/255}}];
      }
    }
    return date;
  }));
  figma.currentPage.setPluginData(LAST_UPDATE, new Date().toDateString());

}
// TODO refresh all statuses on page
if (figma.command === 'refresh') {
  loadFonts().then(() => {
    refresh();
  });
}
if (!figma.currentPage.getPluginData(LAST_UPDATE) || differenceInHours(new Date(`${figma.currentPage.getPluginData(LAST_UPDATE)}`), new Date()) > 1){
  loadFonts().then(() => {
    const deadlines = figma.currentPage.findAll((node)=> node.name === "Frame Deadline Text");
    console.log('deadlines', deadlines.map((node:TextNode) => {
      const date = node.getPluginData(PLUGIN_DATE);
      node.characters = formatDistance(new Date(`${date}`), new Date(), {addSuffix: true});
      if (isPast(new Date(`${date}`))) {
        const background = node.parent.findOne(background => background.name === 'Frame Deadline Background')
        if (background.type === 'RECTANGLE') {
          background.fills = [{type: 'SOLID', color: {r: 251/255, g: 132/255, b: 132/255}}];
        }
      }
      return date;
    }));
    console.log('DEADLINES UPDATED');
    figma.currentPage.setPluginData(LAST_UPDATE, new Date().toDateString());
  })
}

const countDeadlines = () => {
  const pastDeadlines = [];
  const todayDeadlines = [];
  const inThreeDaysDeadlines = [];
  const inWeekDeadlines = [];
  const futureDeadlines = [];
  const deadlines = figma.currentPage.findAll((node)=> node.name === "Frame Deadline Text");
  console.log('countDeadlines', deadlines)
  deadlines.forEach((node:TextNode) => {
    const date = node.getPluginData(PLUGIN_DATE);
    if (isPast(new Date(`${date}`))) {
      pastDeadlines.push(date);
    } else if (isToday(new Date(`${date}`))) {
      todayDeadlines.push(date);
    } else if (isBefore(new Date(`${date}`), endOfDay(addDays(new Date(), 3)))) {
      inThreeDaysDeadlines.push(date);
    } else if (isBefore(new Date(`${date}`), endOfDay(addDays(new Date(), 7)))) {
      inWeekDeadlines.push(date);
    } else {
      futureDeadlines.push(date);
    }
  });
    return `
      <div>
        <h3>Past: ${pastDeadlines.length}</h3>
        <h3>Today: ${todayDeadlines.length}</h3>
        <h3>In 3 days: ${inThreeDaysDeadlines.length}</h3>
        <h3>In week: ${inWeekDeadlines.length}</h3>
        <h3>Future: ${futureDeadlines.length}</h3>
      </div>
    `;
}

refresh();

if (figma.command === 'stats') {
  figma.showUI(`<div>
  <h1>Deadlines statistics:</h1>
  ${countDeadlines()}
</div>`, {width: 200, height: 320});
}

figma.ui.onmessage = msg => {
  switch(msg.type){
    case 'save':
      const savedValue = JSON.parse(msg.value);
      figma.notify(`Saved deadline ${formatDistance(new Date(), new Date(`${savedValue.startDate}`))} for frame ${savedValue.frame.name}`)
      const deadlineContainer = generateDeadlineContainer(savedValue);
      figma.currentPage.selection = [figma.currentPage.children.find(el => el.type === 'FRAME' && el.id === savedValue.frame.id)]
      figma.currentPage.selection.map((frame :FrameNode) => {
        frame.clipsContent = false;
        frame.appendChild(deadlineContainer);
      });      
      figma.closePlugin();
      break;
    case 'cancel':
      console.log('DISABLE WINDOW')
      figma.closePlugin();
      break;
  }
  refresh();
};


figma.on("selectionchange", () => {
    if (isFrameSelected()) {
      figma.currentPage.selection[0].setRelaunchData({ sample: 'Create sample frame', open: '', refresh: '', stats: '' })
      figma.showUI(__html__, {width: 340, height: 385});
      figma.ui.postMessage({id: figma.currentPage.selection[0].id, name: figma.currentPage.selection[0].name});

    }
  }
);
