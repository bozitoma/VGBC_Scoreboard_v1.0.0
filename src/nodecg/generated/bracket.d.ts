/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

export interface Bracket {
	/**
	 * @minItems 0
	 */
	bracketData: {
		identifier: string;
		fullRoundText: string;
		player1: Bracketscore;
		player2: Bracketscore;
		[k: string]: unknown;
	}[];
	[k: string]: unknown;
}
export interface Bracketscore {
	prefix: string;
	name: string;
	score: number;
	[k: string]: unknown;
}
