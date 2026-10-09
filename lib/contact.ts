export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 60,
  emailMax: 100,
  messageMin: 10,
  messageMax: 500,
} as const;

const NAME_PATTERN = /^[\p{L}][\p{L}\s.'-]{1,59}$/u;
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export type ContactFields = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactFields, string>>;

export function isValidEmail(email: string): boolean {
  return email.length <= CONTACT_LIMITS.emailMax && EMAIL_PATTERN.test(email);
}

export function validateContact(fields: ContactFields): ContactErrors {
  const errors: ContactErrors = {};
  const name = fields.name.trim();
  const email = fields.email.trim();
  const message = fields.message.trim();

  if (name.length < CONTACT_LIMITS.nameMin) {
    errors.name = `Name must be at least ${CONTACT_LIMITS.nameMin} characters.`;
  } else if (name.length > CONTACT_LIMITS.nameMax) {
    errors.name = `Name must be ${CONTACT_LIMITS.nameMax} characters or fewer.`;
  } else if (!NAME_PATTERN.test(name)) {
    errors.name = "Use letters, spaces, apostrophes, or hyphens only.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!isValidEmail(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (message.length < CONTACT_LIMITS.messageMin) {
    errors.message = `Message must be at least ${CONTACT_LIMITS.messageMin} characters.`;
  } else if (message.length > CONTACT_LIMITS.messageMax) {
    errors.message = `Message must be ${CONTACT_LIMITS.messageMax} characters or fewer.`;
  }

  return errors;
}
