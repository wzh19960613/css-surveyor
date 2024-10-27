// Generated by dts-bundle-generator v9.5.1

export declare class CssSurveyor {
	#private;
	events: import("mitt").Emitter<{
		widthChanged: number;
		heightChanged: number;
	}>;
	constructor(connectTo?: HTMLElement | string | null);
	connect(elemOrSelector?: HTMLElement | string): void;
	get connected(): HTMLElement | undefined;
	get widthExpr(): string | undefined;
	set widthExpr(value: string | undefined);
	get heightExpr(): string | undefined;
	set heightExpr(value: string | undefined);
	get width(): number;
	get height(): number;
	remeasure(): void;
	cleanup(): void;
	disconnect(): void;
}

export {};
