import util from "util";

export class Logger {
  constructor(logLevel = "info") {
    this.logLevel = logLevel;
    this.levels = ["error", "warn", "info", "debug"];
    this.colors = {
      error: "\x1b[31m", // Red
      warn: "\x1b[33m", // Yellow
      info: "\x1b[36m", // Cyan
      debug: "\x1b[35m", // Magenta
    };
  }

  setLevel(level) {
    if (this.levels.includes(level)) {
      this.logLevel = level;
    } else {
      throw new Error("Invalid log level");
    }
  }

  log(level, message) {
    if (this.levels.indexOf(level) <= this.levels.indexOf(this.logLevel)) {
      const color = this.colors[level] || "";
      const resetColor = "\x1b[0m";
      console.log(
        util.format(
          "%s[%s]%s %s",
          color,
          level.toUpperCase(),
          resetColor,
          message
        )
      );
    }
  }

  error(message) {
    this.log("error", message);
  }

  warn(message) {
    this.log("warn", message);
  }

  info(message) {
    this.log("info", message);
  }

  debug(message) {
    this.log("debug", message);
  }
}
