import type { ModuleMetadata } from "@scodi/common";
import { createJsonReports } from "greenit-cli/cli-core/analysis.js";
import { describe, expect, it, vi } from "vitest";
import { GreenITModule } from "../src/GreenITModule.js";
import { Conf } from "./data/Conf.js";
import SuccessResult from "./data/SuccessResult.json" with { type: "json" };

vi.mock("../src/api/Client.js");
vi.mock("greenit-cli/cli-core/analysis.js");
const mockedCreateJsonReports = vi.mocked(createJsonReports);

describe("Run GreenIT analysis", () => {
	it("should be able to launch a successful analysis without thresholds", async () => {
		mockedCreateJsonReports.mockResolvedValue([
			{
				path: new URL("./data/SuccessResult.json", import.meta.url).pathname,
				name: "1.json",
			},
		]);

		const moduleConfig: ModuleMetadata = {
			id: "1234",
			type: "analysis",
			name: "Green IT",
			service: {
				name: "Green IT",
				logoUrl: "some-logo",
			},
		};

		const module = new GreenITModule(moduleConfig, false);
		const analysisReport = await module.startAnalysis(Conf);

		expect(analysisReport).toHaveProperty("analyzedUrl", SuccessResult.url);
		expect(analysisReport).toHaveProperty("date", new Date(SuccessResult.date));
		expect(analysisReport).toHaveProperty("grade", SuccessResult.grade);
		expect(analysisReport).toHaveProperty(
			"normalizedGrade",
			SuccessResult.ecoIndex,
		);
		expect(analysisReport).toHaveProperty("service", moduleConfig.service);
		expect(analysisReport).toHaveProperty("inputs", { config: Conf });
	});

	it("should be able to handle a failed analysis", async () => {
		mockedCreateJsonReports.mockResolvedValue([
			{
				path: new URL("./data/ErrorResult.json", import.meta.url).pathname,
				name: "1.json",
			},
		]);

		const moduleConfig: ModuleMetadata = {
			id: "1234",
			type: "analysis",
			name: "Green IT",
			service: {
				name: "Green IT",
				logoUrl: "some-logo",
			},
		};

		const errorMessage =
			"Error during GreenIT analysis. Increasing the timeout can be a solution";
		const module = new GreenITModule(moduleConfig, false);

		try {
			await module.startAnalysis(Conf);
		} catch (error) {
			expect(error).toBe(errorMessage);
		}
	});

	it("should be able to launch a successful analysis with thresholds", async () => {
		mockedCreateJsonReports.mockResolvedValue([
			{
				path: new URL("./data/SuccessResult.json", import.meta.url).pathname,
				name: "1.json",
			},
		]);

		const moduleConfig: ModuleMetadata = {
			id: "1234",
			type: "analysis",
			name: "Green IT",
			service: {
				name: "Green IT",
				logoUrl: "some-logo",
			},
		};

		const THRESHOLD = 30;

		const module = new GreenITModule(moduleConfig, false);
		const analysisReport = await module.startAnalysis(Conf, THRESHOLD);

		expect(analysisReport).toHaveProperty("analyzedUrl", SuccessResult.url);
		expect(analysisReport).toHaveProperty("date");
		expect(analysisReport).toHaveProperty("grade", SuccessResult.grade);
		expect(analysisReport).toHaveProperty(
			"normalizedGrade",
			SuccessResult.ecoIndex,
		);
		expect(analysisReport).toHaveProperty("service", moduleConfig.service);
		expect(analysisReport).toHaveProperty("inputs", {
			config: Conf,
			threshold: THRESHOLD,
		});
	});

	it("Should return false when results do not match thresholds objectives", async () => {
		mockedCreateJsonReports.mockResolvedValue([
			{
				path: new URL("./data/SuccessResult.json", import.meta.url).pathname,
				name: "1.json",
			},
		]);

		const moduleConfig: ModuleMetadata = {
			id: "1234",
			type: "analysis",
			name: "Green IT",
			service: {
				name: "Green IT",
				logoUrl: "some-logo",
			},
		};

		const THRESHOLD = 30;

		const module = new GreenITModule(moduleConfig, false);
		const analysisReport = await module.startAnalysis(Conf, THRESHOLD);

		expect(analysisReport).toHaveProperty("analyzedUrl", SuccessResult.url);
		expect(analysisReport).toHaveProperty("date");
		expect(analysisReport).toHaveProperty("grade", SuccessResult.grade);
		expect(analysisReport).toHaveProperty(
			"normalizedGrade",
			SuccessResult.ecoIndex,
		);
		expect(analysisReport).toHaveProperty("service", moduleConfig.service);
		expect(analysisReport).toHaveProperty("inputs", {
			config: Conf,
			threshold: THRESHOLD,
		});
		expect(analysisReport.isThresholdReached()).toStrictEqual(false);
	});
});
