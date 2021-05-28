"use strict";

export const pixelsToNumber = function (num) {
  return Number(num.replace(`px`, ``));
};

// Determines the line height (leading) of the requested element by creating en empty element, duplicating the font-family and fontsize of the provided element, then adding a single new line to the created element. The resulting height of the newly created element is the line height of the element provided.
export const computeLineHeight = function (el) {
  const temp = generateEmptyElementCopy(el);

  // Add text (and thus a line) to the temporary element
  temp.textContent = "A";

  // Add the temporary element to the parentNode of the provided element
  el.parentNode.appendChild(temp);
  const lineHeight = temp.clientHeight;

  // Clean up - remove the temporary element from the document
  temp.parentNode.removeChild(temp);

  return lineHeight;
};

// Determines the scroll position of the cursor based on the cursor's position in the text body of the element provided. Works by removing all text after the caret position from a rough copy of the provided element. The resulting height of the truncated copy is the scroll position/location of the caret.
export const computeScrollPosition = function (el, caretPosition) {
  const temp = generateEmptyElementCopy(el);

  // Set the text content of the temp element to be all the text up to the caret.
  temp.textContent = el.textContent.slice(0, caretPosition);

  // Add the temporary element to the parentNode of the provided element
  el.parentNode.appendChild(temp);
  const position = pixelsToNumber(window.getComputedStyle(temp).height);

  // Clean up - remove the temporary element from the document
  temp.parentNode.removeChild(temp);

  return position;
};

export const generateEmptyElementCopy = function (el) {
  const elementCopy = document.createElement(el.nodeName);

  // Set the styling of the temperorary element. The styling must be absolute so that the temperorary element is not affected by the growth or size of the original element. The temporary element is otherwise susceptible to its siblings, as the original and temp element will share a parent.
  const elStyle = window.getComputedStyle(el);
  elementCopy.style.fontFamily = elStyle.fontFamily;
  elementCopy.style.fontSize = elStyle.fontSize;
  elementCopy.style.fontWeight = elStyle.fontWeight;
  elementCopy.style.position = "absolute";
  elementCopy.style.whiteSpace = elStyle.whiteSpace;

  return elementCopy;
};
