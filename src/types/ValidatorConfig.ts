export interface StringConfig {
  empty?: boolean;
  minLength?: number;
  maxLength?: number;
  length?: number;
}

export interface NumberConfig {
  min?: number;
  max?: number;
  allowString?: boolean;
}