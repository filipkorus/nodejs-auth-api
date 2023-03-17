import dayjs from "dayjs";
import chalk from "chalk";

function color(s: string, c: string) {
	if (process.stdout.isTTY) {
		return "\x1B[" + c + "m" + s + "\x1B[0m";
	}
	return s;
}
const deepGrey = "30;1";

export const logInfo = (mess: string) => {
	if (process.env.NODE_ENV !== "test" || process.env.FORCE_LOG === "true") {
		console.log(`[${chalk.cyan("INFO")}] ${color(dayjs().format("HH:mm:ss"), deepGrey)} ${chalk.green(mess)}`);
	}
};

export const logError = (mess: unknown) => {
	console.log(`[${chalk.red("ERROR")}] ${color(dayjs().format("HH:mm:ss"), deepGrey)}: ${chalk.red(mess)}`);
};
