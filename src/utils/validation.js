/**
 * Sanitizes a string input by removing HTML tags and trimming leading/trailing whitespace.
 * Prevents basic XSS payloads from being stored or rendered.
 * @param {string} val
 * @returns {string}
 */
export const sanitizeInput = (val) => {
  if (typeof val !== 'string') return val;
  return val.replace(/<[^>]*>/g, '').trim();
};

/**
 * Validates whether the given string is a correctly formatted email address.
 * @param {string} email
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  if (typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates workspace registration form data.
 * @param {object} data
 * @returns {string|null} Error message if invalid, or null if valid.
 */
export const validateRegisterForm = (data) => {
  const { workspaceName, admin, name, email, password } = data;

  if (!workspaceName || sanitizeInput(workspaceName).length < 3) {
    return 'Workspace name must be at least 3 characters long.';
  }
  if (!admin || sanitizeInput(admin).length < 2) {
    return 'Administrator name must be at least 2 characters long.';
  }
  if (!name || sanitizeInput(name).length < 2) {
    return 'Your name must be at least 2 characters long.';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address.';
  }
  if (!password || password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  return null;
};

/**
 * Validates project creation form data.
 * @param {object} data
 * @returns {string|null} Error message if invalid, or null if valid.
 */
export const validateProjectForm = (data) => {
  const { name, type, timeline } = data;

  if (!name || sanitizeInput(name).length < 3) {
    return 'Project name must be at least 3 characters long.';
  }
  if (!type) {
    return 'Please select a valid project type.';
  }
  if (timeline) {
    const start = new Date(timeline.start);
    const end = new Date(timeline.end);
    if (isNaN(start.getTime())) {
      return 'Please enter a valid start date.';
    }
    if (isNaN(end.getTime())) {
      return 'Please enter a valid end date.';
    }
    if (end < start) {
      return 'End date cannot be earlier than the start date.';
    }
  }

  return null;
};

/**
 * Validates a list of team member invitations.
 * @param {Array} invites
 * @returns {string|null} Error message if invalid, or null if valid.
 */
export const validateInviteForm = (invites) => {
  if (!Array.isArray(invites) || invites.length === 0) {
    return 'At least one invitation is required.';
  }

  for (let i = 0; i < invites.length; i++) {
    const inv = invites[i];
    const name = sanitizeInput(inv.name);
    const email = inv.email?.trim();

    if (!name || name.length < 2) {
      return `Row ${i + 1}: Name must be at least 2 characters long.`;
    }
    if (!validateEmail(email)) {
      return `Row ${i + 1}: Please enter a valid email address.`;
    }
    if (!inv.role) {
      return `Row ${i + 1}: Role assignment is required.`;
    }
  }

  return null;
};
