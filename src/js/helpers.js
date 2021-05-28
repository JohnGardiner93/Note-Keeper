"use strict";
/**
 * Contains multiple functions and tools used across different views.
 * @module helpers
 */

/**
 * Convert string representation of pixels to a number.
 * @param {String} num - The string representation of the number
 * @returns {Number | undefined} The number of pixels supplied but in Number form.
 */
export const pixelsToNumber = function (num) {
  return Number(num?.replace(`px`, ``));
};

/**
 * Determines the line height (leading) of the requested element by creating en empty element, duplicating the font-family and fontsize of the provided element, then adding a single new line to the created element. The resulting height of the newly created element is the line height of the element provided.
 * @param {Element} el - The element whose line hieght will be calculated.
 * @returns {Number | undefined} - The line height of the provided element.
 */
export const computeLineHeight = function (el) {
  // Create an empty element to manipulate using the characteristics of the provided element
  const temp = generateEmptyElementCopy(el);

  if (!temp) return undefined;
  // Add text (and thus a line) to the temporary element
  temp.textContent = "A";

  // Add the temporary element to the parentNode of the provided element
  el.parentNode.appendChild(temp);
  const lineHeight = temp.clientHeight;

  // Clean up - remove the temporary element from the document
  temp.parentNode.removeChild(temp);

  return lineHeight;
};

/**
 * Determines the scroll position of the cursor based on the cursor's position in the text body of the element provided. Works by removing all text after the caret position from a rough copy of the provided element. The resulting height of the truncated copy is the scroll position/location of the caret.
 * @param {Element} el - The element within which the cursor (caret) is placed
 * @param {Number} caretPosition - The position of the caret within the provided element's text content e.g. the number of characters between the beginning of the element's text content and the caret position.
 * @returns {Number} - The y-coordinate position of the caret in terms of the element's overall height in multiples of the element's line height
 */
export const computeCursorYPosition = function (el, caretPosition) {
  // Create an empty element to manipulate using the characteristics of the provided element
  const temp = generateEmptyElementCopy(el);

  if (!temp) return undefined;

  // Set the text content of the temp element to be all the text up to the caret.
  temp.textContent = el.textContent.slice(0, caretPosition);

  // Add the temporary element to the parentNode of the provided element
  el.parentNode.appendChild(temp);
  const position = pixelsToNumber(window.getComputedStyle(temp).height);

  // Clean up - remove the temporary element from the document
  temp.parentNode.removeChild(temp);

  return position;
};

/**
 * Create a shallow, absolute-positioned copy of the provided element. The element's font family, font size, font weight, and whitespace attribute are duplicated.
 * @param {Element} el -The element to be duplicated.
 * @returns {Element | undefined} - The shallow duplicate of the provided element.
 */
export const generateEmptyElementCopy = function (el) {
  const elementCopy = document.createElement(el?.nodeName);
  if (!elementCopy) return undefined;
  // Set the styling of the temperorary element. The styling must be absolute so that the temperorary element is not affected by the growth or size of the original element. The temporary element is otherwise susceptible to its siblings, as the original and temp element will share a parent.
  const elStyle = window.getComputedStyle(el);
  elementCopy.style.fontFamily = elStyle.fontFamily;
  elementCopy.style.fontSize = elStyle.fontSize;
  elementCopy.style.fontWeight = elStyle.fontWeight;
  elementCopy.style.position = "absolute";
  elementCopy.style.whiteSpace = elStyle.whiteSpace;

  return elementCopy;
};
