declare var global: any;
declare var require: any;

(window as any).global = window;
global.Buffer = global.Buffer || require('buffer').Buffer;
global.process = require('process');