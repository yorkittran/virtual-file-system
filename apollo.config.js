/**
 * Apollo GraphQL extension for VSCode: Realtime code suggestions, run-time,...
 */
module.exports = {
  client: {
    // Files processed by the Apollo GraphQL extension
    includes: ['./src/apollo/**/*'], // ['src/**/*.vue', 'src/**/*.js']
    service: {
      name: 'virtual-file-system',
      url: 'http://localhost:3006/graphql' // config this link pointing to virtual-file-system server
    }
  }
}
