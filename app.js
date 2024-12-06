// Store grammar rules
let grammar = {};

// Function to add multiple rules to the grammar
function addRule() {
  const input = document.getElementById("grammarInput").value.trim();
  const originalDiv = document.getElementById("originalGrammar");

  if (input === "") {
    alert("Please enter at least one grammar rule!");
    return;
  }

  // Split input into lines and process each line
  const lines = input.split("\n");
  try {
    lines.forEach(line => {
      const [nonTerminal, productions] = line.split("->").map(item => item.trim());
      const productionList = productions.split("|").map(prod => prod.trim());

      if (!grammar[nonTerminal]) {
        grammar[nonTerminal] = [];
      }
      grammar[nonTerminal] = grammar[nonTerminal].concat(productionList);
    });

    // Update display
    originalDiv.textContent = formatGrammar(grammar);
    document.getElementById("grammarInput").value = "";
  } catch (error) {
    alert("Invalid input format! Use 'Non-Terminal -> production1 | production2'");
  }
}

// Function to eliminate left recursion
function eliminateLeftRecursion() {
  const transformedDiv = document.getElementById("transformedGrammar");
  const newGrammar = {};

  for (let nonTerminal in grammar) {
    const productions = grammar[nonTerminal];
    const directRecursion = [];
    const nonRecursive = [];

    productions.forEach(production => {
      if (production.startsWith(nonTerminal)) {
        directRecursion.push(production.slice(nonTerminal.length)); // Get the remainder
      } else {
        nonRecursive.push(production);
      }
    });

    if (directRecursion.length > 0) {
      const newNonTerminal = nonTerminal + "'";
      newGrammar[nonTerminal] = nonRecursive.map(prod => prod + newNonTerminal);
      newGrammar[newNonTerminal] = directRecursion.map(prod => prod + newNonTerminal).concat(["ε"]);
    } else {
      newGrammar[nonTerminal] = productions;
    }
  }

  // Update display
  transformedDiv.textContent = formatGrammar(newGrammar);
}

// Helper function to format grammar for display
function formatGrammar(grammar) {
  return Object.entries(grammar)
    .map(([nonTerminal, productions]) => `${nonTerminal} -> ${productions.join(" | ")}`)
    .join("\n");
}
