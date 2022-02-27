module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty',
        readline: 'empty',
        child_process: 'empty',
        net: 'empty',
        tls: 'empty',
      }
    } else {
      config.node = {
        atob: 'empty',
      }
    }

    return config
  }
}
