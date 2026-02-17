import { type ISettingsParam, Logger } from "tslog";
import { IS_PRODUCTION } from "./constants";

export const loggerConfig: ISettingsParam<unknown> = {
  minLevel: parseInt(process.env.NEXT_PUBLIC_LOGGER_LEVEL || "4"),
  maskValuesOfKeys: ["password", "passwordConfirmation", "credentials", "credential"],
  prettyLogTimeZone: IS_PRODUCTION ? "UTC" : "local",
  prettyErrorStackTemplate: "  • {{fileName}}\t{{method}}\n\t{{filePathWithLine}}",
  prettyErrorTemplate: "\n{{errorName}} {{errorMessage}}\nerror stack:\n{{errorStack}}",
  prettyLogTemplate: "{{hh}}:{{MM}}:{{ss}}:{{ms}} [{{logLevelName}}] ",
  stylePrettyLogs: !IS_PRODUCTION,
  prettyLogStyles: {
    name: "yellow",
    dateIsoStr: "blue",
  },
  type: IS_PRODUCTION ? "json" : "pretty",
};

const logger = new Logger(loggerConfig);

export default logger;
