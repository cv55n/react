'use strict';

/**
 * hack: o compilador do react incorpora o zod em seu artefato de construção.
 * o zod espalha valores passados ​​para .map, o que causa problemas em
 * @babel/plugin-transform-spread no modo flexível, pois resultará em
 * {undefined: undefined} que não consegue analisar.
 * 
 * remover esse hack mais tarde quando movermos o eslint-plugin-react-hooks
 * para o diretório do compilador.
 */

const baseConfig = require('./babel.config-ts');

module.exports = {
    plugins: baseConfig.plugins
};