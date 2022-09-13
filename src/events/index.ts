import { EventEmitter2 } from "eventemitter2";
import { confirmUserEmailEvent, CONFIRM_USER_EMAIL } from "./mail.event";

export const emitter = new EventEmitter2();

export function initEvents() {
  emitter.on(CONFIRM_USER_EMAIL, confirmUserEmailEvent);
}
