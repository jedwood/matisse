module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      endpoint: "public"
    },
    source : {
      lungostylus: [
        'mobile/stylus/lungo.base.styl',
        'mobile/stylus/lungo.layout.styl',
        'mobile/stylus/lungo.layout.*.styl',
        'mobile/stylus/lungo.widget.styl',
        'mobile/stylus/lungo.widget.*.styl',
        'mobile/stylus/lungo.media.*.styl',
        'mobile/stylus/theme/theme.*.styl',
        'mobile/stylus/lungo.icon**.styl'
      ],
      matissestylus: [
        'mobile/stylus/matisse.styl'
      ]
    },
    stylus: {
      lungo: {
        options: { compress: true, import: [ '__init']},
        files: {'<%=meta.endpoint%>/css/lungo.css': '<%=source.lungostylus%>'}
      },
      matisse: {
        options: {compress: false},
        files: {'<%=meta.endpoint%>/css/matisse.css': '<%=source.matissestylus%>'}
      }
    },
    jade: {
      compile: {
        options: {
          pretty: true
        },
        files: {
          "<%=meta.endpoint%>/index.html": ["mobile/jade/index.jade"]
        }
      }
    },
    watch: {
      html: {
        files: '**/*.jade',
        tasks: ['jade'],
        options: {
          interrupt: true
        }
      },
      lungocss: {
        files: ['<%= source.lungostylus %>', 'mobile/stylus/theme/__init.styl', 'mobile/stylus/__init.styl'],
        tasks: ["stylus:lungo"],
        options: {
          interrupt: true
        }
      },
      matissecss: {
        files: ['<%= source.matissestylus %>'],
        tasks: ['stylus:matisse'],
        options: {
          interrupt: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jade', 'stylus']);

};
