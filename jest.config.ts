import type { Config } from 'jest';

export default async (): Promise<Config> => {
	return {
		preset: 'react-native',
		transform: {
			'^.+\\.jsx$': 'babel-jest',
			'^.+\\.tsx?$': [
				'ts-jest',
				{
					tsconfig: 'tests/tsconfig.json',
				},
			],
		},
		testRegex: '(/tests/.*|\\.(test|spec))\\.(ts|tsx|js)$',
		moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
	};
};
