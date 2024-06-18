import { vi, expect, it, describe } from "vitest";
import { LighthouseModule } from "../src/LighthouseModule.js";
import type { LighthouseConfig } from "@fabernovel/heart-common";

vi.mock("../src/api/Client.js");
vi.mock("lighthouse");

const CONF: LighthouseConfig = {
	url: "https://heart.fabernovel.com",
	config: {
		extends: "lighthouse:default",
		settings: {
			onlyAudits: [
				"first-meaningful-paint",
				"speed-index",
				"first-cpu-idle",
				"interactive",
			],
		},
	},
};

describe("Starts an analysis", () => {
	const module = new LighthouseModule(
		{
			id: "lighthouse-test",
			type: "analysis",
			name: "Heart Lighthouse Test",
			service: {
				name: "Lighthouse Test",
			},
		},
		false,
	);

	it("should starts an analysis with a valid configuration", async () => {
		const report = await module.startAnalysis(CONF);

		expect(report.analyzedUrl).toStrictEqual(CONF.url);
		expect(report).toHaveProperty("date");
		expect(report).toHaveProperty("grade");
		expect(report).toHaveProperty("normalizedGrade");
	});

	it("should starts an analysis with an invalid configuration", async () => {
		const INVALID_CONF = { ...CONF, url: "" } as LighthouseConfig;

		try {
			await module.startAnalysis(INVALID_CONF);
		} catch (e) {
			expect(e).toHaveProperty("error");
		}
	});

	it("Should return true status when results match thresholds objectives", async () => {
		const THRESHOLD = 80;

		const report = await module.startAnalysis(CONF, THRESHOLD);

		expect(report.isThresholdReached()).toStrictEqual(true);
	});
});
