/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Scoreboard {
	player1: {
		name: string;
		prefix: string;
		xID?: string;
		score: number;
		[k: string]: unknown;
	};
	player2: {
		name: string;
		prefix: string;
		xID?: string;
		score: number;
		[k: string]: unknown;
	};
	fullRoundText: string;
}