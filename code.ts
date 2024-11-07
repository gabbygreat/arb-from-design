function toCamelCase(str: string) {
  // Remove special characters and split the string into words
  const cleanedStr = str.replace(/[^a-zA-Z0-9\s]/g, '');
  
  // Split the string into words
  const words = cleanedStr.split(/\s+/);

  // Take the first 4 words
  const firstFourWords = words.slice(0, 4);

  // Join them into a camelCase string
  const camelCaseKey = firstFourWords
    .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  return camelCaseKey;
}

function generateArbEntry(str: string) {
  const camelCaseKey = toCamelCase(str);
  return `"${camelCaseKey}": "${str}"`;
}

// Function to check if a string is a date/time format
function isDateOrTime(str: string): boolean {
  const timeRegex = /^(?:[0-1]?[0-9]|2[0-3]):[0-5][0-9](?:\s?[APap][Mm])?$/;
  const dateRegex = /^(?:\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}-\d{2}-\d{2})$/;
  return timeRegex.test(str) || dateRegex.test(str);
}

figma.codegen.on('generate', (event) => {
  const selectedNode = figma.currentPage.selection[0];

  const textNodes: TextNode[] = [];

  const findTextNodes = (node: SceneNode) => {
    if (node.type === 'TEXT' && !isDateOrTime(node.characters)) {
      textNodes.push(node);  // Add TextNode to the list if it is not a date or time
    }

    if ('children' in node) {
      node.children.forEach(findTextNodes);  // Recursively search children
    }
  };

  // Start the recursive search from the selected node
  findTextNodes(selectedNode);

  // Create ARB entries with text values side by side
  const arbList = textNodes.map((node) => generateArbEntry(node.characters)).join(',\n');
  
  // Create a code format that displays each ARB entry next to each other
  const code = `${arbList}`;

  return [
    {
      language: 'PLAINTEXT',
      code: code,
      title: 'ARBFromDesign Plugin',
    },
  ];
});
