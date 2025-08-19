import { Page } from '@playwright/test';
import AzureDevOps from '../../src/utils/AzureDevOpsHelper';
import * as fs from 'fs';
import { TestReport } from '../../src/interface/TestResults.interface';

import dotenv from 'dotenv';
dotenv.config();


/**
 * Author Testers Talk
 */
export const stringFormat = (str: string, ...args: (string | number)[]): string =>
    str.replace(/{(\d+)}/g, (match, index) => args[index]?.toString() || "");

/**
 * Author Testers Talk
 */
export async function waitUntilAppIdle(page: Page): Promise<void> {
    try {
        // Wait for the function to evaluate in the browser context.
        await page.waitForFunction(() => (window as any).UCWorkBlockTracker?.isAppIdle());
    } catch (e) {
        // Log error with type check for error object
        console.log(`waitUntilIdle failed, ignoring.., error: ${(e as Error).message}`);
    }
}

/**
 * Author Testers Talk
 */
export async function navigateToApps(
    page: Page,
    appId: string | number,
    appName: string
): Promise<void> {
    console.log('Navigate to ' + appName + ' - Start');
    await page.goto(`/main.aspx?appid=${appId.toString()}`);
    await page.getByRole('button', { name: appName }).isVisible();
    console.log('Navigated to ' + appName + ' - Success');
}

/**
 * Author Testers Talk
 */
async function readJsonReport() {
    const azureDevOps = new AzureDevOps();
    const filePath = 'json-test-report.json';

    if (process.env.UPDATE_TEST_PLAN === 'Yes' && process.env.PIPELINE === 'Yes') {

        await waitForFile(filePath);

        try {
            const data: TestReport = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            data.suites.forEach(suite => {
                suite.specs.forEach(spec => {
                    const testCaseTitle = `${spec.title}`;
                    spec.tests.forEach(test => {
                        test.results.forEach(async result => {
                            const testCaseStatus = `${result.status}`;

                            const matches = testCaseTitle.match(/\[(.*?)\]/);
                            const numbersPart = matches?.[1];
                            const numbersArray: number[] = numbersPart?.split(',').map(num => parseInt(num.trim(), 10)) ?? [];

                            for (const testCaseId of numbersArray) {
                                console.log(`Test Case & Status : ${testCaseId} : ${testCaseStatus}`);
                                await azureDevOps.updateTestCaseStatus(String(testCaseId), testCaseStatus);
                            }
                        });
                    });
                });
            });
        } catch (error) {
            console.error('Error while readinf JSON report' + error)
        }
    } else {
        console.log('Update test plan or pipeline conditions not met.');
    }
}


/**
 * Author Testers Talk
 */
async function waitForFile(filePath: string) {
    const fs = require('fs').promises;

    let fileExists = false;
    while (!fileExists) {
        try {
            await fs.access(filePath);
            fileExists = true; // If no error is thrown, the file exists
        } catch (err) {
            // File does not exist yet, wait and try again
            console.log('Waiting for the file to be available...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // Retry every 5 seconds
        }
    }
    console.log(`File ${filePath} is now available!`);
}

export async function updateTestCaseStatusInTestPlan() {
    await readJsonReport();
}