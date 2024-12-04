"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;
exports.validateEmail = validateEmail;
exports.validateName = validateName;
exports.validatePassword = validatePassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Hashes user password sent from frontend register form
 * @param {String} password
 * @returns hashed password
 */
function hashPassword(password) {
    const salt = bcryptjs_1.default.genSaltSync(10);
    return bcryptjs_1.default.hashSync(password, salt);
}
/**
 * Checks if hashed password was derived from plain password
 * @param {String} plainPassword
 * @param {String} hashedPassword
 * @returns true if plain password is hashed password
 */
function checkPassword(plainPassword, hashedPassword) {
    return bcryptjs_1.default.compareSync(plainPassword, hashedPassword);
}
/**
 * Validates an email address
 * @param {string} email
 * @returns {boolean} true if email is valid and false if otherwise
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Validates a name
 * @param {string} name
 * @returns {boolean} true if name is valid, false otherwise
 */
function validateName(name) {
    const nameRegex = /^[a-zA-Z0-9 ]{8,}$/;
    return nameRegex.test(name);
}
/**
 * Validates a password
 * @param {string} password
 * @returns {boolean} true if password is valid, false otherwise
 */
function validatePassword(password) {
    const passwordRegex = /^[^\s]{8,}$/;
    return passwordRegex.test(password);
}
