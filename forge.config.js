const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true,
    // Remove unnecessary files
    ignore: [
      /^\/\.git/,
      /^\/\.vscode/,
      /^\/node_modules\/\.cache/,
      /^\/src\/(?!assets|components|contexts|pages|utils|App\.js|index\.js|preload\.js|renderer\.js|tailwind\.css|index\.css|index\.html).+/,
      /\.map$/,
      /^\/\.\w+/
    ],
    // Optimize for production
    executableName: 'devspace',
    // Make sure icon is correctly referenced
    icon: path.resolve(__dirname, 'src/assets/icon'),
  },
  rebuildConfig: {},
  makers: [
    // Use only ZIP maker for Windows
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32'],
    },
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {},
    },
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  // Add hooks for further optimization
  hooks: {
    packageAfterCopy: async (config, buildPath, electronVersion, platform, arch) => {
      // You can add custom cleanup operations here
      console.log('Removing unnecessary files for smaller package size...');
    }
  }
};
