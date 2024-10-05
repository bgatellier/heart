import { readFileSync } from "node:fs";
import type { GreenITConfig, GreenITReport } from "@scodi/common";
import {
	type Options,
	type Report,
	createJsonReports,
} from "greenit-cli/cli-core/analysis.js";
import { translator } from "greenit-cli/cli-core/translator.js";
import puppeteer from "puppeteer";

const DEFAULT_OPTIONS: Options = {
	ci: true,
	device: "desktop",
	language: "en",
	max_tab: 40,
	retry: 2,
	timeout: 180000,
};

/**
 * @see {@link https://github.com/GoogleChrome/lighthouse/blob/main/docs/puppeteer.md#option-2-launch-chrome-with-lighthousechrome-launcher-and-handoff-to-puppeteer}
 */
export async function requestResult(
	config: GreenITConfig,
): Promise<GreenITReport["result"]> {
	const browser = await puppeteer.launch({
		// https://www.howtogeek.com/devops/how-to-run-puppeteer-and-headless-chrome-in-a-docker-container/#using-puppeteer-in-docker
		args: [
			"--disable-gpu",
			"--disable-dev-shm-usage",
			"--disable-setuid-sandbox",
			"--no-sandbox",
		],
		defaultViewport: null,
		// https://developer.chrome.com/articles/new-headless/
		headless: true,
	});

	const options: Options = {
		ci: true,
		device: config.device ?? DEFAULT_OPTIONS.device,
		language: config.language ?? DEFAULT_OPTIONS.language,
		max_tab: DEFAULT_OPTIONS.max_tab,
		retry: config.retry ?? DEFAULT_OPTIONS.retry,
		timeout: config.timeout ?? DEFAULT_OPTIONS.timeout,
	};

	const reports = new Array<Report>();

	// As the createJsonReports use console.* functions to display progress info and errors and do not send back these information,
	// so we need to disable the console.* functions during this operation to handle the output ourselves.
	const consoleLog = console.log;
	const consoleError = console.error;

	try {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		console.log = () => {};
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		console.error = () => {};

		const r = await createJsonReports(
			browser,
			[{ url: config.url }],
			options,
			{},
			undefined,
			translator,
		);

		reports.push(...r);
	} catch (error) {
		return Promise.reject(error);
	} finally {
		console.log = consoleLog;
		console.error = consoleError;
		await browser.close();
	}

	if (0 === reports.length) {
		return Promise.reject("No report has been generated");
	}

	const result = JSON.parse(
		readFileSync(reports[0].path, { encoding: "utf-8" }),
	) as GreenITReport["result"];

	return result.success
		? result
		: Promise.reject(
				"Error during GreenIT analysis. Increasing the timeout can be a solution",
			);
}
