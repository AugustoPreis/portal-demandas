import { StringConfig, NumberConfig } from '../types/ValidatorConfig';

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isValidString(value: unknown, config?: StringConfig): value is string {
  if (!isString(value)) {
    return false;
  }

  if (!config?.empty && value.trim().length === 0) {
    return false;
  }

  if (config?.minLength && value.length < config.minLength) {
    return false;
  }

  if (config?.maxLength && value.length > config.maxLength) {
    return false;
  }

  if (config?.length && value.length !== config.length) {
    return false;
  }

  return true;
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function isValidNumber(value: unknown, config?: NumberConfig): value is number {
  if (config?.allowString) {
    value = Number(value);
  }

  if (!isNumber(value)) {
    return false;
  }

  if (isNaN(value)) {
    return false;
  }

  if (config?.min && value < config.min) {
    return false;
  }

  if (config?.max && value > config.max) {
    return false;
  }

  return true;
}