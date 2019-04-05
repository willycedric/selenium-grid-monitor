/*
 * Create and export configuration variables
 *
 */

// Container for all environments
let environments = {};

// Staging (default) environment
environments.staging = {
    'androidBackEnd':'fr-auto-002:4000',
    'iosBackEnd':'192.168.3.25:4000',
    'seleniumBackEnd':'win10insulia-02:4444',
};

// Testing environment
environments.testing = {
    'androidBackEnd':'http://fr-auto-002:4000/android',
    'iosBackEnd':'http://192.168.3.25:4000/ios',
    'seleniumBackEnd':'http://win10insulia-02:4444',
};

// Production environment
environments.production = {
    'androidBackEnd':'http://fr-auto-002:4000/android',
    'iosBackEnd':'http://192.168.3.25:4000/ios',
    'seleniumBackEnd':'http://win10insulia-02:4444',
};

// Determine which environment was passed as a command-line argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
