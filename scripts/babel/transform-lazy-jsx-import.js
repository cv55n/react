'use strict';

module.exports = function replaceJSXImportWithLazy(babel) {
    const {
        types: t
    } = babel;

    function getInlineRequire(moduleName) {
        return t.callExpression(t.identifier('require'), [
            t.stringLiteral(moduleName)
        ]);
    }

    return {
        visitor: {
            CallExpression: function(path, pass) {
                let callee = path.node.callee;

                if (callee.type === 'SequenceExpression') {
                    callee = callee.expressions[callee.expressions.length - 1];
                }

                if (callee.type === 'Identifier') {
                    // às vezes parece que chegamos a esse ponto antes que as importações
                    // sejam transformadas em requisitos e por isso chegamos a esse caso
                    switch (callee.name) {
                        case '_jsxDEV':
                            path.node.callee = t.memberExpression(
                                getInlineRequire('react/jsx-dev-runtime'), t.identifier('jsxDEV')
                            );

                            return;

                        case '_jsx':
                            path.node.callee = t.memberExpression(
                                getInlineRequire('react/jsx-runtime'), t.identifier('jsx')
                            );

                            return;

                        case '_jsxs':
                            path.node.callee = t.memberExpression(
                                getInlineRequire('react/jsx-runtime'), t.identifier('jsxs')
                            );

                            return;
                    }

                    return;
                }

                if (callee.type !== 'MemberExpression') {
                    return;
                }

                if (callee.property.type !== 'Identifier') {
                    // precisa ser um jsx, jsxs, jsxdev

                    return;
                }

                if (callee.object.type !== 'Identifier') {
                    // precisa ser um _reactjsxdevruntime ou _reactjsxruntime

                    return;
                }

                // substitui o identificador armazenado em cache por uma nova chamada require
                switch (callee.object.name) {
                    case '_reactJsxDevRuntime':
                    case '_jsxDevRuntime':
                        callee.object = getInlineRequire('react/jsx-dev-runtime');

                        return;

                    case '_reactJsxRuntime':
                    case '_jsxRuntime':
                        callee.object = getInlineRequire('react/jsx-runtime');

                        return;
                }
            }
        }
    };
};