const SVG_DATA_URL_PREFIX = 'data:image/svg+xml';
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const MAX_CACHE_ENTRIES = 128;

const symbolSourceCache = new Map<string, string | null>();

function decodeBase64Utf8(value: string) {
	const decoded = atob(value);
	const bytes = Uint8Array.from(decoded, (character) => character.charCodeAt(0));
	return new TextDecoder().decode(bytes);
}

function decodeSvgDataUrl(assetSrc: string) {
	const commaIndex = assetSrc.indexOf(',');
	if (commaIndex < 0) {
		return null;
	}

	const metadata = assetSrc.slice(0, commaIndex);
	const payload = assetSrc.slice(commaIndex + 1);
	return /;base64(?:;|$)/i.test(metadata) ? decodeBase64Utf8(payload) : decodeURIComponent(payload);
}

function rememberSymbolSource(cacheKey: string, source: string | null): string | null {
	if (symbolSourceCache.size >= MAX_CACHE_ENTRIES) {
		const oldestKey = symbolSourceCache.keys().next().value;
		if (oldestKey !== undefined) {
			symbolSourceCache.delete(oldestKey);
		}
	}

	symbolSourceCache.set(cacheKey, source);
	return source;
}

/**
 * Turns a symbol inside an inlined SVG sprite into a standalone SVG image. Chromium blocks data-URL
 * fragment references in <use>, while the same data URL is safe and supported as an <image>
 * source.
 */
export function resolveEmbeddedSvgSymbolSource(
	assetSrc: string,
	symbolId: string,
): string | null | undefined {
	if (!assetSrc.startsWith(SVG_DATA_URL_PREFIX)) {
		return undefined;
	}

	const cacheKey = `${assetSrc}#${symbolId}`;
	if (symbolSourceCache.has(cacheKey)) {
		return symbolSourceCache.get(cacheKey);
	}

	if (typeof DOMParser === 'undefined' || typeof XMLSerializer === 'undefined') {
		return rememberSymbolSource(cacheKey, null);
	}

	try {
		const markup = decodeSvgDataUrl(assetSrc);
		if (!markup) {
			return rememberSymbolSource(cacheKey, null);
		}

		const document = new DOMParser().parseFromString(markup, 'image/svg+xml');
		if (document.querySelector('parsererror')) {
			return rememberSymbolSource(cacheKey, null);
		}

		const symbol = Array.from(document.getElementsByTagName('symbol')).find(
			(candidate) => candidate.getAttribute('id') === symbolId,
		);
		if (!symbol) {
			return rememberSymbolSource(cacheKey, null);
		}

		const svg = document.createElementNS(SVG_NAMESPACE, 'svg');

		for (const attribute of Array.from(symbol.attributes)) {
			if (attribute.name !== 'id') {
				svg.setAttribute(attribute.name, attribute.value);
			}
		}

		if (!svg.hasAttribute('viewBox')) {
			const rootViewBox = document.documentElement.getAttribute('viewBox');
			if (rootViewBox) {
				svg.setAttribute('viewBox', rootViewBox);
			}
		}

		for (const child of Array.from(document.documentElement.children)) {
			if (child !== symbol && (child.tagName === 'defs' || child.tagName === 'style')) {
				svg.append(child.cloneNode(true));
			}
		}

		for (const child of Array.from(symbol.childNodes)) {
			svg.append(child.cloneNode(true));
		}

		const serialized = new XMLSerializer().serializeToString(svg);
		return rememberSymbolSource(cacheKey, `data:image/svg+xml,${encodeURIComponent(serialized)}`);
	} catch {
		return rememberSymbolSource(cacheKey, null);
	}
}
