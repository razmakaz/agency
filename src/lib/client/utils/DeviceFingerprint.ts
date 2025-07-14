// Add type definitions for browser APIs
interface NetworkInformation {
	effectiveType?: string;
	downlink?: number;
	rtt?: number;
	saveData?: boolean;
}

interface NavigatorWithNetwork extends Navigator {
	connection?: NetworkInformation;
	mozConnection?: NetworkInformation;
	webkitConnection?: NetworkInformation;
	deviceMemory?: number;
	userLanguage?: string;
}

export class DeviceFingerprint {
	private components: Record<string, unknown>;
	private confidence: number;

	constructor() {
		this.components = {};
		this.confidence = 0;
	}

	async generate() {
		try {
			// Collect all fingerprint components
			await Promise.all([
				this.getScreenInfo(),
				this.getNavigatorInfo(),
				this.getTimezoneInfo(),
				this.getCanvasFingerprint(),
				this.getWebGLFingerprint(),
				this.getAudioFingerprint(),
				this.getFontFingerprint(),
				this.getPluginInfo(),
				this.getStorageInfo(),
				this.getNetworkInfo(),
				this.getHardwareInfo(),
				this.getLanguageInfo()
			]);

			// Calculate confidence score
			this.calculateConfidence();

			// Generate final hash
			const fingerprint = await this.createHash();

			return {
				fingerprint,
				confidence: this.confidence,
				components: this.components,
				timestamp: Date.now()
			};
		} catch (error) {
			console.error('Fingerprint generation failed:', error);
			return {
				fingerprint: this.createFallbackHash(),
				confidence: 10,
				components: this.components,
				timestamp: Date.now(),
				error: error instanceof Error ? error.message : 'Unknown error'
			};
		}
	}

	// Screen and display information
	getScreenInfo() {
		try {
			this.components.screen = {
				width: screen.width,
				height: screen.height,
				availWidth: screen.availWidth,
				availHeight: screen.availHeight,
				colorDepth: screen.colorDepth,
				pixelDepth: screen.pixelDepth,
				orientation: screen.orientation?.type || 'unknown',
				devicePixelRatio: window.devicePixelRatio
			};
		} catch (e) {
			this.components.screen = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// Navigator and browser information
	getNavigatorInfo() {
		try {
			this.components.navigator = {
				userAgent: navigator?.userAgent || 'unknown',
				language: navigator?.language || 'unknown',
				languages: navigator?.languages?.join(',') || 'unknown',
				platform: navigator?.platform || 'unknown',
				cookieEnabled: navigator?.cookieEnabled || false,
				doNotTrack: navigator?.doNotTrack || 'unknown',
				hardwareConcurrency: navigator?.hardwareConcurrency || 'unknown',
				maxTouchPoints: navigator?.maxTouchPoints || 'unknown',
				vendor: navigator?.vendor || 'unknown',
				productSub: navigator?.productSub || 'unknown'
			};
		} catch (e) {
			this.components.navigator = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// Timezone and locale information
	getTimezoneInfo() {
		try {
			const now = new Date();
			this.components.timezone = {
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				timezoneOffset: now.getTimezoneOffset(),
				locale: Intl.DateTimeFormat().resolvedOptions().locale,
				calendar: Intl.DateTimeFormat().resolvedOptions().calendar || 'unknown',
				numberingSystem: Intl.DateTimeFormat().resolvedOptions().numberingSystem || 'unknown'
			};
		} catch (e) {
			this.components.timezone = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// Canvas fingerprinting
	async getCanvasFingerprint() {
		try {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

			canvas.width = 200;
			canvas.height = 50;

			// Draw text with different properties
			ctx.textBaseline = 'top';
			ctx.font = '14px Arial';
			ctx.fillStyle = '#f60';
			ctx.fillRect(125, 1, 62, 20);
			ctx.fillStyle = '#069';
			ctx.fillText('Device Fingerprint 🔒', 2, 15);
			ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
			ctx.fillText('Security Check', 4, 35);

			// Draw some shapes
			ctx.globalCompositeOperation = 'multiply';
			ctx.fillStyle = 'rgb(255,0,255)';
			ctx.beginPath();
			ctx.arc(50, 25, 20, 0, Math.PI * 2, true);
			ctx.closePath();
			ctx.fill();

			this.components.canvas = {
				hash: await this.hashString(canvas.toDataURL()),
				dataURL: canvas.toDataURL().substring(0, 100) // First 100 chars for debugging
			};
		} catch (e) {
			this.components.canvas = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// WebGL fingerprinting
	getWebGLFingerprint() {
		try {
			const canvas = document.createElement('canvas');
			const gl =
				canvas.getContext('webgl') ||
				(canvas.getContext('experimental-webgl') as WebGLRenderingContext);

			if (!gl) {
				this.components.webgl = { error: 'WebGL not supported' };
				return;
			}

			this.components.webgl = {
				vendor: gl.getParameter(gl.VENDOR),
				renderer: gl.getParameter(gl.RENDERER),
				version: gl.getParameter(gl.VERSION),
				shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
				maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
				maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS)?.join('x') || 'unknown',
				extensions: gl.getSupportedExtensions()?.sort().join(',') || ''
			};
		} catch (e) {
			this.components.webgl = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// Audio context fingerprinting
	async getAudioFingerprint() {
		try {
			const audioCtx = new window.AudioContext();

			// Create oscillator for unique audio signature
			const oscillator = audioCtx.createOscillator();
			const analyser = audioCtx.createAnalyser();
			const gainNode = audioCtx.createGain();

			// Create and load audio worklet
			await audioCtx.audioWorklet.addModule(
				URL.createObjectURL(
					new Blob(
						[
							`
          class AudioProcessor extends AudioWorkletProcessor {
            process(inputs) {
              const input = inputs[0];
              if (input && input[0]) {
                this.port.postMessage(input[0].reduce((a, b) => a + Math.abs(b), 0));
              }
              return true;
            }
          }
          registerProcessor('audio-processor', AudioProcessor);
        `
						],
						{ type: 'text/javascript' }
					)
				)
			);

			const workletNode = new AudioWorkletNode(audioCtx, 'audio-processor');

			oscillator.type = 'triangle';
			oscillator.frequency.value = 10000;
			gainNode.gain.value = 0.05;

			oscillator.connect(analyser);
			analyser.connect(workletNode);
			workletNode.connect(gainNode);
			gainNode.connect(audioCtx.destination);

			oscillator.start(0);

			const audioData = await new Promise((resolve) => {
				workletNode.port.onmessage = (e) => {
					oscillator.stop();
					audioCtx.close().catch(() => {});
					resolve(e.data.toString());
				};
			});

			this.components.audio = {
				sampleRate: audioCtx.sampleRate,
				maxChannelCount: audioCtx.destination.maxChannelCount,
				signature: await this.hashString(audioData as string)
			};
		} catch (e) {
			this.components.audio = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// Font detection
	getFontFingerprint() {
		try {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				this.components.fonts = { error: 'Canvas context not supported' };
				return;
			}

			const baseFonts = ['serif', 'sans-serif', 'monospace'];
			const testFonts = [
				'Arial',
				'Helvetica',
				'Times New Roman',
				'Courier New',
				'Verdana',
				'Georgia',
				'Palatino',
				'Garamond',
				'Bookman',
				'Comic Sans MS',
				'Trebuchet MS',
				'Arial Black',
				'Impact',
				'Lucida Sans Unicode',
				'Tahoma',
				'Geneva',
				'Lucida Console',
				'Monaco',
				'Courier',
				'Consolas',
				'Calibri',
				'Cambria',
				'Franklin Gothic Medium'
			];

			const detectedFonts: string[] = [];
			const testString = 'mmmmmmmmmmlli';
			const testSize = '72px';

			// Measure baseline fonts
			const baseSizes: Record<string, number> = {};
			baseFonts.forEach((font) => {
				ctx.font = `${testSize} ${font}`;
				baseSizes[font] = ctx.measureText(testString).width;
			});

			// Test each font
			testFonts.forEach((font) => {
				const detected = baseFonts.some((baseFont) => {
					ctx.font = `${testSize} "${font}", ${baseFont}`;
					const width = ctx.measureText(testString).width;
					return width !== baseSizes[baseFont];
				});

				if (detected) {
					detectedFonts.push(font);
				}
			});

			this.components.fonts = {
				detected: detectedFonts.sort().join(','),
				count: detectedFonts.length
			};
		} catch (e) {
			this.components.fonts = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// Plugin information
	getPluginInfo() {
		try {
			const plugins: string[] = [];
			for (let i = 0; i < navigator.plugins.length; i++) {
				const plugin = navigator.plugins[i];
				plugins.push(`${plugin.name}:${plugin.description || 'unknown'}`);
			}

			this.components.plugins = {
				list: plugins.sort().join(','),
				count: plugins.length
			};
		} catch (e) {
			this.components.plugins = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// Storage capabilities
	getStorageInfo() {
		try {
			this.components.storage = {
				localStorage: !!window.localStorage,
				sessionStorage: !!window.sessionStorage,
				indexedDB: !!window.indexedDB,
				webSQL: false, // Removed deprecated webSQL check
				cookieEnabled: navigator.cookieEnabled
			};
		} catch (e) {
			this.components.storage = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// Network information
	getNetworkInfo() {
		try {
			// Use NetworkInformation API if available
			const nav = navigator as NavigatorWithNetwork;
			const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

			this.components.network = {
				effectiveType: connection?.effectiveType || 'unknown',
				downlink: connection?.downlink || 'unknown',
				rtt: connection?.rtt || 'unknown',
				saveData: connection?.saveData || false,
				onLine: navigator.onLine
			};
		} catch (e) {
			this.components.network = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// Hardware information
	getHardwareInfo() {
		try {
			const nav = navigator as NavigatorWithNetwork;
			this.components.hardware = {
				memory: nav.deviceMemory || 'unknown',
				cores: navigator.hardwareConcurrency || 'unknown',
				platform: navigator.platform,
				maxTouchPoints: navigator.maxTouchPoints || 0
			};
		} catch (e) {
			this.components.hardware = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// Language and locale information
	getLanguageInfo() {
		try {
			const nav = navigator as NavigatorWithNetwork;
			this.components.language = {
				primary: navigator.language,
				all: navigator.languages?.join(',') || '',
				userLanguage: nav.userLanguage || 'unknown'
			};
		} catch (e) {
			this.components.language = { error: e instanceof Error ? e.message : 'Unknown error' };
		}
	}

	// Calculate confidence score based on available components
	calculateConfidence() {
		const weights: Record<string, number> = {
			screen: 15,
			navigator: 20,
			canvas: 25,
			webgl: 20,
			audio: 15,
			fonts: 10,
			timezone: 10,
			plugins: 5,
			storage: 5,
			network: 5,
			hardware: 10,
			language: 5
		};

		let totalWeight = 0;
		let availableWeight = 0;

		Object.keys(weights).forEach((component) => {
			totalWeight += weights[component];
			const componentData = this.components[component] as { error?: string } | undefined;
			if (componentData && !componentData.error) {
				availableWeight += weights[component];
			}
		});

		this.confidence = Math.round((availableWeight / totalWeight) * 100);
	}

	// Create final hash from all components
	async createHash() {
		const componentString = JSON.stringify(this.components, Object.keys(this.components).sort());
		return await this.hashString(componentString as string);
	}

	// Fallback hash if main process fails
	createFallbackHash() {
		const fallbackData = [
			navigator.userAgent,
			screen.width + 'x' + screen.height,
			navigator.language,
			new Date().getTimezoneOffset(),
			navigator.platform
		].join('|');

		return btoa(fallbackData)
			.replace(/[^a-zA-Z0-9]/g, '')
			.substring(0, 32);
	}

	// Hash function using Web Crypto API
	async hashString(str: string) {
		try {
			const encoder = new TextEncoder();
			const data = encoder.encode(str);
			const hashBuffer = await crypto.subtle.digest('SHA-256', data);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			return hashArray
				.map((b) => b.toString(16).padStart(2, '0'))
				.join('')
				.substring(0, 32);
		} catch {
			// Fallback to simple hash if crypto API not available
			let hash = 0;
			for (let i = 0; i < str.length; i++) {
				const char = str.charCodeAt(i);
				hash = (hash << 5) - hash + char;
				hash = hash & hash; // Convert to 32-bit integer
			}
			return Math.abs(hash).toString(16).padStart(8, '0');
		}
	}
}

export const generateDeviceFingerprint = async () => {
	const fingerprinter = new DeviceFingerprint();
	const result = await fingerprinter.generate();
	return {
		device_fingerprint: result.fingerprint,
		confidence: result.confidence,
		components: result.components,
		timestamp: result.timestamp
	};
};
