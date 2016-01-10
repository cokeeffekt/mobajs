exports.config = {
  paths: {
    watched: ['app']
  },
  files: {
    javascripts: {
      defaultExtension: "js",
      joinTo: {
        "javascripts/vendor.js": /^bower_components/,
        "javascripts/app.js": /^app/
      },
      order: {
        before: [
          'bower_components/jquery/dist/jquery.js'
        ]
      }
    },
    stylesheets: {
      defaultExtension: "styl",
      joinTo: "stylesheets/app.css"
    },
    templates: {
      joinTo: {
        'javascripts/tpl.js': /^app\/modules\//
      }
    }
  },
  server: {
    port: 8282,
    run: true
  },
  plugins: {
    html2js: {
      options: {
        base: 'app/modules',
        htmlmin: {
          removeComments: true
        }
      }
    },
    stylus: {
      plugins: ['nib', 'rupture']
    },
  },
  overrides: {
    production: {
      sourceMaps: true
    }
  }
};
