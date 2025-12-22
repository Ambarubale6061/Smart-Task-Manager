const categoryMap = {
  scheduling: ["meeting", "schedule", "call", "appointment", "deadline"],
  finance: ["payment", "invoice", "bill", "budget", "cost", "expense"],
  technical: ["bug", "fix", "error", "install", "repair", "maintain"],
  safety: ["safety", "hazard", "inspection", "compliance", "ppe"],
};

const priorityMap = {
  high: ["urgent", "asap", "immediately", "today", "critical", "emergency"],
  medium: ["soon", "this week", "important"],
  low: [],
};

const suggestedActions = {
  scheduling: [
    "Block calendar",
    "Send invite",
    "Prepare agenda",
    "Set reminder",
  ],
  finance: [
    "Check budget",
    "Get approval",
    "Generate invoice",
    "Update records",
  ],
  technical: [
    "Diagnose issue",
    "Check resources",
    "Assign technician",
    "Document fix",
  ],
  safety: [
    "Conduct inspection",
    "File report",
    "Notify supervisor",
    "Update checklist",
  ],
  general: [],
};

function classifyTask(title, description) {
  const text = `${title} ${description}`.toLowerCase();

  // Category
  let category = "general";
  for (let key in categoryMap) {
    if (categoryMap[key].some((word) => text.includes(word))) {
      category = key;
      break;
    }
  }

  // Priority
  let priority = "low";
  for (let key in priorityMap) {
    if (priorityMap[key].some((word) => text.includes(word))) {
      priority = key;
      break;
    }
  }

  // Suggested actions
  let actions = suggestedActions[category] || [];

  // Simple entity extraction
  let entities = {};
  const regexDate = /\b(today|tomorrow|\d{1,2}\/\d{1,2}(\/\d{2,4})?)\b/gi;
  const matches = text.match(regexDate);
  if (matches) entities.dates = matches;

  const regexWith = /with (\w+)/gi;
  let names = [];
  let match;
  while ((match = regexWith.exec(text)) !== null) {
    names.push(match[1]);
  }
  if (names.length) entities.persons = names;

  return {
    category,
    priority,
    suggested_actions: actions,
    extracted_entities: entities,
  };
}

module.exports = { classifyTask };
