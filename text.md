<!-- @format -->

Next, run npm start to compile your custom build. Three files will be generated:

ii) animate.css: raw build, easy to read and without any optimization iii) animate.css: raw build,
easy to read and without any optimization animate.min.css: minified build ready for production
animate.compat.css: minified build ready for production without class prefix. This should only be
used as an easy path for migrations.

For example, if you'll only use some of the “attention seekers” animations, simply edit the
./source/animate.css file, delete every @import and the ones you want to use.
