'use strict';

const helperModuleImports = require('@babel/helper-module-imports');

module.exports = function autoImporter(babel) {
    function getAssignIdent(path, file, state) {
        if (state.id) {
            return state.id;
        }

        state.id = helperModuleImports.addDefault(path, 'shared/assign', {
            nameHint: 'assign'
        });

        return state.id;
    }

    return {
        pre: function() {
            // mapa do módulo para o identificador gerado

            this.id = null;
        },

        visitor: {
            CallExpression: function(path, file) {
                if (/shared(\/|\\)assign/.test(file.filename)) {
                    // não substituir o object.assign caso esteja transformando o shared/assign

                    return;
                }

                if (path.get('callee').matchesPattern('Object.assign')) {
                    // gera um identificador e um require caso ainda não tenha um
                    const id = getAssignIdent(path, file, this);

                    path.node.callee = id;
                }
            },

            MemberExpression: function(path, file) {
                if (/shared(\/|\\)assign/.test(file.filename)) {
                    // não substituir o object.assign caso esteja transformando o shared/assign

                    return;
                }

                if (path.matchesPattern('Object.assign')) {
                    const id = getAssignIdent(path, file, this);

                    path.replaceWith(id);
                }
            }
        }
    };
};