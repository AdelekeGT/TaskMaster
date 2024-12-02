import bcrypt from 'bcryptjs';

/**
 * Hashes user password sent from frontend register form
 * @param {String} password
 * @returns hashed password
 */
function hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

/**
 * Checks if hashed password was derived from plain password
 * @param {String} plainPassword
 * @param {String} hashedPassword
 * @returns true if plain password is hashed password
 */
function checkPassword(plainPassword: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, hashedPassword);
}

/**
 * Validates an email address
 * @param {string} email
 * @returns {boolean} true if email is valid and false if otherwise
 */
function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates a name
 * @param {string} name
 * @returns {boolean} true if name is valid, false otherwise
 */
function validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z0-9 ]{8,}$/;
    return nameRegex.test(name);
}

/**
 * Validates a password
 * @param {string} password
 * @returns {boolean} true if password is valid, false otherwise
 */
function validatePassword(password: string): boolean {
    const passwordRegex = /^[^\s]{8,}$/;
    return passwordRegex.test(password);
}

export {
    hashPassword,
    checkPassword,
    validateEmail,
    validateName,
    validatePassword,
};
