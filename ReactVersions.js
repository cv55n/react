'use strict';

// este módulo é a única fonte de verdade para o controle de versão de
// pacotes que publicamos no npm.
//
// os pacotes não serão publicados a menos que sejam adicionados aqui.
//
// o canal @latest utiliza a versão as-is, exemplo:
//
// 19.1.0
//
// o canal @canary acrescenta informações adicionais, com o esquema
// <version>-<label>-<commit_sha>, exemplo:
//
// 19.1.0-canary-a1c2d3e4
//
// o canal @experimental não inclui uma versão, apenas uma data e um
// sha, por exemplo:
//
// 0.0.0-experimental-241c4467e-20200129
const ReactVersion = '19.2.0';

// o rótulo usado pelo canal @canary. representa a estabilidade da próxima
// versão. na maioria das vezes, será "canário", mas podemos
// temporariamente optar por alterá-lo para "alfa", "beta", "rc", etc.
//
// afeta apenas o rótulo usado na string de versão. para personalizar as
// tags npm dist usadas durante a publicação, refira-se para:
//
// `.github/workflows/runtime_prereleases_*.yml`
const canaryChannelLabel = 'canary';

// se canarychannellabel for "rc", o pipeline de compilação o usará para
// compilar uma versão rc dos pacotes.
const rcNumber = 0;

const stablePackages = {
    'eslint-plugin-react-hooks': '6.1.0',
    'jest-react': '0.17.0',
    react: ReactVersion,
    'react-art': ReactVersion,
    'react-dom': ReactVersion,
    'react-server-dom-webpack': ReactVersion,
    'react-server-dom-turbopack': ReactVersion,
    'react-server-dom-parcel': ReactVersion,
    'react-is': ReactVersion,
    'react-reconciler': '0.33.0',
    'react-refresh': '0.18.0',
    'react-test-renderer': ReactVersion,
    'use-subscription': '1.12.0',
    'use-sync-external-store': '1.6.0',
    scheduler: '0.27.0'
};

// esses pacotes não existem no canal @canary ou @latest, apenas no
// @experimental. não usamos o semver, apenas o commit sha, então esta é
// apenas uma lista de nomes de pacotes em vez de um mapa.
const experimentalPackages = ['react-markup'];

module.exports = {
    ReactVersion,
    canaryChannelLabel,
    rcNumber,
    stablePackages,
    experimentalPackages
};