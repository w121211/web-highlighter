import React from 'react';
import ReactDOM from 'react-dom';
import {
  makeCreateRangeSelectorMatcher,
  createTextQuoteSelectorMatcher,
  describeTextQuote,
  createTextPositionSelectorMatcher,
  describeTextPosition,
  highlightRange,
} from '@apache-annotator/dom';
import { TextQuoteSelector, makeRefinable } from '@apache-annotator/selector';

const APP_ID = 'conote-app-background';

function App() {
  return <h1>App</h1>;
}

function injectApp(): HTMLElement {
  const app = document.createElement('div');
  app.id = APP_ID;
  // extensionMarker.dataset.platform = getPlatformName();
  // app.style.display = 'none';
  document.body.append(app);
  return app;
}

const app = injectApp();

// // ReactDOM.render(<App />, document.getElementById('root'))
ReactDOM.render(<App />, app);

// const body = document.querySelector<HTMLElement>('body');

// const cleanupFunctions: Array<() => void> = [];

// function cleanup() {
//   // while ((removeHighlight = cleanupFunctions.shift())) {
//   //   removeHighlight();
//   // }
//   let removeHighlight: () => void = cleanupFunctions.shift();
//   while (true) {
//     if (removeHighlight === undefined) {
//       break;
//     }
//     removeHighlight();
//     removeHighlight = cleanupFunctions.shift();
//   }
//   // target.normalize();
//   body.normalize();
//   // info.innerText = '';
// }

// // const createMatcher = makeRefinable((selector) => {
// //   const innerCreateMatcher = {
// //     TextQuoteSelector: createTextQuoteSelectorMatcher,
// //     TextPositionSelector: createTextPositionSelectorMatcher,
// //     RangeSelector: makeCreateRangeSelectorMatcher(createMatcher),
// //   }[selector.type];

// //   if (!innerCreateMatcher) {
// //     throw new Error(`Unsupported selector type: ${selector.type}`);
// //   }

// //   return innerCreateMatcher(selector);
// // })

// async function anchor(selector: TextQuoteSelector) {
//   const scope = document.createRange();
//   scope.selectNodeContents(body);

//   const matchAll = createTextQuoteSelectorMatcher(selector);
//   const ranges = [];

//   /* eslint-disable no-restricted-syntax */
//   for await (const range of matchAll(scope)) {
//     // console.log(range);
//     ranges.push(range);
//   }

//   for (const e of ranges) {
//     const removeHighlight = highlightRange(e, 'mark', { class: 'highlight' });
//     cleanupFunctions.push(removeHighlight);
//   }

//   // info.innerText += `${JSON.stringify(selector, null, 2)}\n\n`;
// }

// async function onMouseUp() {
//   cleanup();
//   console.log('onSelectionChange');

//   const scope = document.createRange();
//   scope.selectNodeContents(body);
//   // console.log(scope);

//   const selection = document.getSelection();
//   // console.log(selection);

//   for (let i = 0; i < selection.rangeCount; i += 1) {
//     const range = selection.getRangeAt(i);
//     // const selector = describeMode === 'TextPosition'
//     //   ? await describeTextPosition(range, scope)
//     //   : await describeTextQuote(range, scope, { minimumQuoteLength: 10 });
//     const selector = await describeTextQuote(range, scope, { minimumQuoteLength: 10 });
//     // console.log(selector);
//     await anchor(selector);
//   }
// }

// // function onSelectorExampleClick(event) {
// //   const exampleNumber = event.target.dataset.runExample;
// //   if (!exampleNumber) return;
// //   const selector = EXAMPLE_SELECTORS[exampleNumber];
// //   cleanup();
// //   anchor(selector);
// //   event.preventDefault();
// // }

// document.addEventListener('mouseup', onMouseUp);
// // document.addEventListener('selectionchange', onSelectionChange);
// // form.addEventListener('change', onSelectionChange);
// // document.addEventListener('click', onSelectorExampleClick);

// if (module.hot) {
//   module.hot.accept();
//   module.hot.dispose(() => {
//     document.addEventListener('mouseup', onMouseUp);
//     // document.removeEventListener('selectionchange', onSelectionChange);
//     // document.removeEventListener('click', onSelectorExampleClick);
//   });
// }
