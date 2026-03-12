"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
async function listAllModels() {
    const key = (process.env.GEMINI_API_KEY || "").trim();
    if (!key) {
        console.error("GEMINI_API_KEY not found in .env");
        return;
    }
    console.log("Checking v1 models...");
    try {
        const res1 = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${key}`);
        const data1 = await res1.json();
        if (data1.models) {
            console.log("--- v1 Models ---");
            data1.models.forEach((m) => console.log(m.name));
        }
        else {
            console.log("v1 returned no models or error:", JSON.stringify(data1));
        }
    }
    catch (e) {
        console.error("v1 error:", e.message);
    }
    console.log("\nChecking v1beta models...");
    try {
        const resB = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const dataB = await resB.json();
        if (dataB.models) {
            console.log("--- v1beta Models ---");
            dataB.models.forEach((m) => console.log(m.name));
        }
        else {
            console.log("v1beta returned no models or error:", JSON.stringify(dataB));
        }
    }
    catch (e) {
        console.error("v1beta error:", e.message);
    }
}
listAllModels();
