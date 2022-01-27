module.exports = {
    'env': {
        'browser': false,
        'node': true,
        'commonjs': true,
        'es2021': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 'latest'
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ]
    },
    'globals': {
        '__dirname': 'readonly',
        '__filename': 'readonly',
        'after': 'readonly',
        'before': 'readonly',
        'beforeEach': 'readonly',
        'describe': 'readonly',
        'ethers': 'readonly',
        'it': 'readonly',
        'network': 'readonly',
        'process': 'readonly',
        'upgrades': 'readonly'
    }
};
