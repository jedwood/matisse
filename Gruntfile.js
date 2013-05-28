module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      endpoint: "public"
    },
    source : {
      matissestylus: [
        'mobile/stylus/matisse.styl'
      ]
    },
    stylus: {
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
