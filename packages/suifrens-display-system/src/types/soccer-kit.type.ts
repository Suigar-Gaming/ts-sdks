export type SoccerTeamCountryCode =
	| 'GLOBAL'
	| 'AR'
	| 'AT'
	| 'AU'
	| 'BA'
	| 'BE'
	| 'BR'
	| 'CA'
	| 'CD'
	| 'CH'
	| 'CI'
	| 'CO'
	| 'CV'
	| 'CW'
	| 'CZ'
	| 'DE'
	| 'DZ'
	| 'EC'
	| 'EG'
	| 'ES'
	| 'FR'
	| 'GB'
	| 'GH'
	| 'HT'
	| 'HR'
	| 'IQ'
	| 'IR'
	| 'JP'
	| 'JO'
	| 'KR'
	| 'MA'
	| 'MX'
	| 'NL'
	| 'NO'
	| 'NZ'
	| 'PA'
	| 'PY'
	| 'PT'
	| 'QA'
	| 'SA'
	| 'SCT'
	| 'SE'
	| 'SN'
	| 'TN'
	| 'TR'
	| 'US'
	| 'UY'
	| 'UZ'
	| 'ZA';

export type SoccerTeamSide = 'home' | 'away';

export type SoccerTeamPattern =
	| 'vertical'
	| 'horizontal'
	| 'cross'
	| 'diagonal'
	| 'sash'
	| 'quarters'
	| 'hoops'
	| 'canton'
	| 'sun'
	| 'chevron';

export type SoccerTeamKit = {
	code: string;
	primary: string;
	secondary: string;
	accent: string;
	pattern: SoccerTeamPattern;
};
