'use strict';

const Git = require('nodegit');
const rimraf = require('rimraf');
const ncp = require('ncp').ncp;
const { existsSync } = require('fs');
const exec = require('child_process').exec;
const { join } = require('path');

const reactUrl = 'https://github.com/facebook/react.git';

function cleanDir() {
    return new Promise(_resolve => rimraf('remote-repo', _resolve));
}

function executeCommand(command) {
    return new Promise(_resolve => exec(command, error => {
        if (!error) {
            _resolve();
        } else {
            console.error(error);

            process.exit(1);
        }
    }));
}

function asyncCopyTo(from, to) {
    return new Promise(_resolve => {
        ncp(from, to, error => {
            if (error) {
                console.error(error);

                process.exit(1);
            }

            _resolve();
        });
    });
}

function getDefaultReactPath() {
    return join(__dirname, 'remote-repo');
}

async function buildBenchmark(reactPath = getDefaultReactPath(), benchmark) {
    // obtém o build.js do diretório de benchmark e o executa
    await require(join(__dirname, 'benchmarks', benchmark, 'build.js'))(
        reactPath,
        asyncCopyTo
    );
}

async function getMergeBaseFromLocalGitRepo(localRepo) {
    const repo = await Git.Repository.open(localRepo);

    return await Git.Merge.base(repo, await repo.getHeadCommit(), await repo.getBranchCommit('main'));
}

async function buildBenchmarkBundlesFromGitRepo(commitId, skipBuild, url = reactUrl, clean) {
    let repo;

    const remoteRepoDir = getDefaultReactPath();

    if (!skipBuild) {
        if (clean) {
            // limpa a pasta remote-repo
            await cleanDir(remoteRepoDir);
        }

        // checa se o diretório remote-repo já existe
        if (existsSync(remoteRepoDir)) {
            repo = await Git.Repository.open(remoteRepoDir);

            // busca por todas as últimas alterações remotas
            await repo.fetchAll();
        } else {
            // caso contrário, clona o repositório para a pasta remote-repo
            repo = await Git.Clone(url, remoteRepoDir);
        }

        let commit = await repo.getBranchCommit('main');

        // redefine com força essa head remota
        await Git.Reset.reset(repo, commit, Git.Reset.TYPE.HARD);

        // então verificamos o último chefe principal
        await repo.checkoutBranch('main');

        // certifica de que trazemos as últimas mudanças
        await repo.mergeBranches('main', 'origin/main');

        // então verificamos se precisamos mover a head para a base de mesclagem
        if (commitId && commitId !== 'main') {
            // como o commitId provavelmente veio do nosso repositório local, nós o
            // usamos para procurar o commit correto em nosso repositório remoto
            commit = await Git.Commit.lookup(repo, commitId);

            // então verificamos a base de mesclagem
            await Git.Checkout.tree(repo, commit);
        }

        await buildReactBundles();
    }
}

async function buildReactBundles(reactPath = getDefaultReactPath(), skipBuild) {
    if (!skipBuild) {
        await executeCommand(
            `cd ${reactPath} && yarn && yarn build react/index,react-dom/index --type=UMD_PROD`
        );
    }
}

// caso executado diretamente via o cli
if (require.main === module) {
    buildBenchmarkBundlesFromGitRepo();
}

module.exports = {
    buildReactBundles,
    buildBenchmark,
    buildBenchmarkBundlesFromGitRepo,
    
    getMergeBaseFromLocalGitRepo
};