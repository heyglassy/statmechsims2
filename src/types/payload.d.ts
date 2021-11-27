import { dashboard } from "./dashboard";
import type { settings } from "./settings";

export = Payload;
export as namespace Payload;
declare namespace Payload {
  type payload = {
    settings: settings;
    data: dashboard;
    frames: string;
  };
  type payloads = Array<payload>;
}
