const SITE_TIME_ZONE = "Europe/London";

const monthFormatter = new Intl.DateTimeFormat("en-GB", {
	month: "long",
	timeZone: SITE_TIME_ZONE,
});

const datePartsFormatter = new Intl.DateTimeFormat("en-GB", {
	day: "numeric",
	month: "long",
	timeZone: SITE_TIME_ZONE,
	year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
	hour: "2-digit",
	hour12: false,
	minute: "2-digit",
	timeZone: SITE_TIME_ZONE,
});

export function formatDisplayDate(value: unknown, options: { includeTime?: boolean } = {}) {
	const date = parseDate(value);
	if (!date) return "";

	const parts = Object.fromEntries(
		datePartsFormatter.formatToParts(date).map((part) => [part.type, part.value]),
	);
	const day = Number(parts.day);
	const month = parts.month || monthFormatter.format(date);
	const year = parts.year || String(date.getUTCFullYear());
	const formattedDate = `${day}${ordinalSuffix(day)} ${month} ${year}`;

	if (!options.includeTime) return formattedDate;
	return `${formattedDate}, ${timeFormatter.format(date)}`;
}

export function dateTimeAttribute(value: unknown) {
	const date = parseDate(value);
	return date ? date.toISOString() : undefined;
}

function parseDate(value: unknown) {
	if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
	if (typeof value !== "string" && typeof value !== "number") return null;

	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function ordinalSuffix(day: number) {
	if (day >= 11 && day <= 13) return "th";

	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}
