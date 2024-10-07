import config from 'eslint-config-tyler/eslint.config.mjs';
import globals from 'globals';

config[0].ignores = ['docs/', 'temp/', '.parcel-cache/'];
config[1].languageOptions.globals = { ...globals.browser, ...globals.node };

export default config;
