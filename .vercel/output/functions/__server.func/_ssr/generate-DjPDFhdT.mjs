import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as TRAITS, i as TEXT_FONTS, m as toSeeds, n as MONO_FONTS } from "./model-DHGwHpx0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-DjPDFhdT.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SYSTEM = `You are the identity director inside Graft, a studio for branching brand systems. You design buildable visual identities: a palette with roles, a type pairing, and guidelines a designer can execute without a follow-up meeting.

Color rules:
- Hex is #RRGGBB.
- Use each role once: canvas (page ground), surface (cards and inputs), ink (primary text), muted (secondary text), line (hairlines), accent (the single action color), onAccent (text on accent fills).
- Contrast: ink on canvas at least 7:1. muted on canvas at least 4.5:1. onAccent on accent at least 4.5:1. line is visible on canvas but quieter than muted.
- canvas and surface are close, not identical.
- One accent hue. Do not invent extra hues in the usage copy.

Type rules:
- displayFont and bodyFont must be different names from the allowed text list.
- monoFont must be from the mono list.
- Prefer a serif with a grotesque, or two grotesques with different voices. Do not pair two high-contrast fashion serifs.

Direction rules:
- Titles are 1 to 3 words and are not the brand name.
- Epithets are under 8 words and name the actual move.
- Rationale is two sentences: the idea, then why the palette and type prove it.
- sampleHeadline, sampleBody, and buttonLabel are in the brand's voice, not commentary about the design. No lorem. No "welcome to".
- Guidelines are concrete. Name sentence length, photographic subject, radius, shadow attitude, motion duration, and how buttons behave.
- dos and donts are three short imperatives each.
- radius must be one of 0px, 2px, 8px, 16px, 24px, 999px and must agree with the shape note.
- density is tight, balanced, or airy.
- Never produce a purple-gradient SaaS look, glassmorphism, or a wordmark that depends on an icon.

When drafting several directions, they must differ in hue family, type pairing, and radius. Three tints of one idea are a failure.
When branching, stay recognizably related to the parent by one anchor (metaphor, hue family, typeface, or radius) and change at least two of: field color, accent, type pairing, radius, density. Do not copy the parent's hex values.
When refining, obey the instruction and keep what it does not mention.`;
function clip(value, max) {
	if (typeof value !== "string") return "";
	return value.replace(/\s+/g, " ").trim().slice(0, max);
}
function parseBrief(value) {
	const record = value && typeof value === "object" ? value : {};
	const traits = Array.isArray(record.traits) ? record.traits.map((trait) => clip(trait, 24)).filter((trait) => TRAITS.includes(trait)) : [];
	return {
		name: clip(record.name, 60),
		category: clip(record.category, 200),
		audience: clip(record.audience, 160),
		traits: traits.slice(0, 4),
		avoid: clip(record.avoid, 240),
		notes: clip(record.notes, 500)
	};
}
function parseParent(value) {
	return toSeeds({ directions: [value] })[0];
}
function parseInput(input) {
	const record = input && typeof input === "object" ? input : {};
	const mode = record.mode === "branch" || record.mode === "refine" ? record.mode : "seed";
	const brief = parseBrief(record.brief);
	if (!brief.name || !brief.category) throw new Error("Add a name and what the brand is before drafting.");
	const parent = mode === "seed" ? void 0 : parseParent(record.parent);
	if (mode !== "seed" && !parent) throw new Error("Choose a direction to branch from.");
	const instruction = clip(record.instruction, 400);
	if (mode === "refine" && instruction.length < 3) throw new Error("Write an instruction to refine this direction.");
	return {
		mode,
		brief,
		parent,
		instruction
	};
}
function directionSchema() {
	return {
		type: "object",
		additionalProperties: false,
		required: ["directions"],
		properties: { directions: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				required: [
					"title",
					"epithet",
					"rationale",
					"wordmarkStyle",
					"palette",
					"radius",
					"density",
					"displayFont",
					"bodyFont",
					"monoFont",
					"typeNotes",
					"voice",
					"imagery",
					"shape",
					"motion",
					"spacing",
					"uiNotes",
					"dos",
					"donts",
					"sampleHeadline",
					"sampleBody",
					"buttonLabel"
				],
				properties: {
					title: { type: "string" },
					epithet: { type: "string" },
					rationale: { type: "string" },
					wordmarkStyle: { type: "string" },
					palette: {
						type: "array",
						items: {
							type: "object",
							additionalProperties: false,
							required: [
								"role",
								"name",
								"hex",
								"usage"
							],
							properties: {
								role: {
									type: "string",
									enum: [
										"canvas",
										"surface",
										"ink",
										"muted",
										"line",
										"accent",
										"onAccent"
									]
								},
								name: { type: "string" },
								hex: { type: "string" },
								usage: { type: "string" }
							}
						}
					},
					radius: {
						type: "string",
						enum: [
							"0px",
							"2px",
							"8px",
							"16px",
							"24px",
							"999px"
						]
					},
					density: {
						type: "string",
						enum: [
							"tight",
							"balanced",
							"airy"
						]
					},
					displayFont: {
						type: "string",
						enum: [...TEXT_FONTS]
					},
					bodyFont: {
						type: "string",
						enum: [...TEXT_FONTS]
					},
					monoFont: {
						type: "string",
						enum: [...MONO_FONTS]
					},
					typeNotes: { type: "string" },
					voice: { type: "string" },
					imagery: { type: "string" },
					shape: { type: "string" },
					motion: { type: "string" },
					spacing: { type: "string" },
					uiNotes: { type: "string" },
					dos: {
						type: "array",
						items: { type: "string" }
					},
					donts: {
						type: "array",
						items: { type: "string" }
					},
					sampleHeadline: { type: "string" },
					sampleBody: { type: "string" },
					buttonLabel: { type: "string" }
				}
			}
		} }
	};
}
function userPrompt(input) {
	const count = input.mode === "refine" ? 1 : 3;
	const lines = [
		`Brand name: ${input.brief.name}`,
		`What it is: ${input.brief.category}`,
		input.brief.audience ? `Audience: ${input.brief.audience}` : "",
		input.brief.traits.length ? `Temperament: ${input.brief.traits.join(", ")}` : "",
		input.brief.avoid ? `Avoid: ${input.brief.avoid}` : "",
		input.brief.notes ? `Notes: ${input.brief.notes}` : "",
		`Allowed text fonts: ${TEXT_FONTS.join(", ")}`,
		`Allowed mono fonts: ${MONO_FONTS.join(", ")}`,
		`Mode: ${input.mode}`,
		`Produce exactly ${count} direction${count === 1 ? "" : "s"}.`
	];
	if (input.parent) lines.push(`Parent direction:\n${JSON.stringify(input.parent)}`);
	if (input.instruction) lines.push(`Instruction: ${input.instruction}`);
	else if (input.mode === "branch") lines.push("Choose three different axes yourself. Name each axis in the epithet.");
	return lines.filter(Boolean).join("\n");
}
function messageText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.map((part) => {
		if (typeof part === "string") return part;
		if (part && typeof part === "object" && "text" in part) return String(part.text);
		return "";
	}).join("");
}
var aiAvailable_createServerFn_handler = createServerRpc({
	id: "faa6b852513aa0fa6366ca38bd0e3246aca72570c1b1f49cd77e99b41a08a97d",
	name: "aiAvailable",
	filename: "src/lib/brand/generate.ts"
}, (opts) => aiAvailable.__executeServer(opts));
var aiAvailable = createServerFn({ method: "GET" }).handler(aiAvailable_createServerFn_handler, async () => {
	return { available: Boolean(process.env.XAI_API_KEY) };
});
var generateDirections_createServerFn_handler = createServerRpc({
	id: "0738a3038ac6ca8ec7ceb32cd86b474db197d8cd29db5d386fe1ac91c7de378c",
	name: "generateDirections",
	filename: "src/lib/brand/generate.ts"
}, (opts) => generateDirections.__executeServer(opts));
var generateDirections = createServerFn({ method: "POST" }).validator((input) => parseInput(input)).handler(generateDirections_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI drafting is not available in this session."
	};
	const count = data.mode === "refine" ? 1 : 3;
	try {
		const payload = {
			model: "grok-4.5",
			temperature: data.mode === "refine" ? .4 : .8,
			max_tokens: count === 1 ? 2500 : 5500,
			reasoning_effort: "low",
			response_format: {
				type: "json_schema",
				json_schema: {
					name: "brand_directions",
					strict: true,
					schema: directionSchema()
				}
			},
			messages: [{
				role: "system",
				content: SYSTEM
			}, {
				role: "user",
				content: userPrompt(data)
			}]
		};
		const request = (body) => fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			signal: AbortSignal.timeout(55e3),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
				"x-grok-conv-id": "graft-studio"
			},
			body: JSON.stringify(body)
		});
		let response = await request(payload);
		if (response.status === 400) {
			const { reasoning_effort: _drop, ...rest } = payload;
			response = await request({
				...rest,
				response_format: { type: "json_object" }
			});
		}
		if (!response.ok) return {
			ok: false,
			error: `Drafting failed (${response.status}). Try again.`
		};
		const choice = (await response.json()).choices?.[0];
		if (choice?.finish_reason === "length") return {
			ok: false,
			error: "The draft was cut off. Try again."
		};
		const text = messageText(choice?.message?.content);
		let parsed;
		try {
			parsed = JSON.parse(text);
		} catch {
			return {
				ok: false,
				error: "The draft came back unreadable. Try again."
			};
		}
		const directions = toSeeds(parsed).slice(0, count);
		if (!directions.length) return {
			ok: false,
			error: "The draft didn't include a usable palette. Try again."
		};
		return {
			ok: true,
			directions
		};
	} catch {
		return {
			ok: false,
			error: "Drafting didn't finish. Try again."
		};
	}
});
//#endregion
export { aiAvailable_createServerFn_handler, generateDirections_createServerFn_handler };
