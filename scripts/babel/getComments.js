'use strict';

function getComments(path) {
    const allComments = path.hub.file.ast.comments;

    if (path.node.leadingComments) {
        // babel ast inclui comentários.

        return path.node.leadingComments;
    }

    // no hermes ast precisamos encontrar os comentários por intervalo.
    const comments = [];

    let line = path.node.loc.start.line;
    let i = allComments.length - 1;

    while (i >= 0 && allComments[i].loc.end.line >= line) {
        i--;
    }

    while (i >= 0 && allComments[i].loc.end.line === line - 1) {
        line = allComments[i].loc.start.line;

        comments.unshift(allComments[i]);

        i--;
    }

    return comments;
}

module.exports = getComments;