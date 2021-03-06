#!/bin/env node
const SERIAL_PORT = process.env.SERIAL_PORT || '/dev/ttyS0';
const BAUDRATE = parseInt(process.env.BAUDRATE) || 9600;
const BYTE_LENGTH = parseInt(process.env.BYTE_LENGTH) || 20;
const SerialPort = require('serialport');
const ByteLength = require('@serialport/parser-byte-length')
const PM = require(__dirname + '/pm1006.js');
const debug = require('debug')('main')
const port = new SerialPort(SERIAL_PORT, {
    baudRate: BAUDRATE
})
const parser = port.pipe(new ByteLength({ length: BYTE_LENGTH }));

parser.on('data', (data) => {
    const result = PM.read(data);
    debug(`received PM2.5 reading: ${result}`)
})
port.on('open', () => {
    console.log('serialport connection open');
})
port.on('close', () => {
    console.log('serialport connection closed');
})

process.on('SIGINT', () => {
    port.close();
    process.exit(0);
})