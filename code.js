// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__, { visible: false });
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.currentPage.setRelaunchData({ edit: 'Crete sample frame', open: '' });
if (figma.command === 'edit') {
    figma.closePlugin();
}
if (figma.command === 'open') {
    console.log('START PLUGIN');
    figma.closePlugin();
}
// TODO refresh all statuses on page
// TODO create dialog for frame deadline
// TODO show dialog for statistics
// 
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    switch (msg.type) {
        case 'open':
            let status = msg.status;
            console.log('START PLUGIN');
            // createDeadlines(status);
            break;
    }
    if (msg.type === 'create-rectangles') {
        const nodes = [];
        for (let i = 0; i < msg.count; i++) {
            const rect = figma.createRectangle();
            rect.x = i * 150;
            rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
const isFrameSelected = () => figma.currentPage.selection[0] &&
    figma.currentPage.selection[0].type === 'FRAME';
figma.on("selectionchange", () => {
    if (isFrameSelected()) {
        figma.currentPage.selection[0].setRelaunchData({ edit: 'Edit this trapezoid with Shaper', open: '' });
    }
});
