import gulp from 'gulp';
import sass from 'sass';
import gulpSassOrig from 'gulp-sass';
const gulpSass = gulpSassOrig(sass);
import { glob, globSync, globStream } from 'glob';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();


function handleError(err) {
    console.error('error:');
    console.error(err.message);
    console.error(err.stack);
    this.emit('end'); // end gulp task and prevend gulp system error
}

// Task for compile above the fold css
gulp.task('base', function() {
    return gulp.src('Scss/base.scss')
        .pipe(gulpSass({
            includePaths: ['./node_modules'], // Fügen Sie den Pfad zu den node_modules hinzu
            outputStyle: 'compressed'
        }).on('error', handleError)) // Verwenden des benutzerdefinierten Fehlerhandlers
        .pipe(gulp.dest('Dist'));
});

// Task for compile above the fold css
gulp.task('default-vars', function() {
    return gulp.src('Scss/default-vars.scss')
        .pipe(gulpSass({
            includePaths: ['./node_modules'], // Fügen Sie den Pfad zu den node_modules hinzu
            outputStyle: 'compressed'
        }).on('error', handleError)) // Verwenden des benutzerdefinierten Fehlerhandlers
        .pipe(gulp.dest('Dist'));
});

// Task for compile the utilities css in one file
gulp.task('utilities', function() {
    return gulp.src('Scss/utilities.scss')
        .pipe(gulpSass({
            includePaths: ['./node_modules'], // Fügen Sie den Pfad zu den node_modules hinzu
            outputStyle: 'compressed'
        }).on('error', handleError)) // Verwenden des benutzerdefinierten Fehlerhandlers
        .pipe(gulp.dest('Dist'));
});

// Task for compile the utilities css in one file
gulp.task('atomic-utilities', function(done) {
    // glob-Pattern for the components
    const componentsPattern = './Scss/utilities/**/*.scss';
    const outputPath = './Dist/utilities';
    const basePath = path.resolve(process.cwd()) + '/Scss';
    // read component files
    glob(componentsPattern, function(err) {
        if (err) {
            console.error(err);
            done();
            return;
        }
    }).then(
        function (files) {
            files.forEach(file => {
                // read content of component file
                const content = fs.readFileSync(file, 'utf8');
                // compile
                const result = sass.compileString( content, {
                    style:"compressed",
                    loadPaths: [basePath]
                });
                // write the css to the output file
                fs.writeFileSync(path.join(outputPath, path.basename(file, '.scss') + '.css').replace('_', ''), result.css);
            });
            done(); // gulp is done
        }
    );
});
// Task for compile the utilities css in one file
gulp.task('plugins', function(done) {
    // glob-Pattern for the components
    const componentsPattern = './Scss/plugins/**/*.scss';
    const outputPath = './Dist/plugins';

    // read component files
    glob(componentsPattern, function(err) {
        if (err) {
            console.error(err);
            done();
            return;
        }
    }).then(
        function (files) {
            files.forEach(file => {
                // read content of component file
                const content = fs.readFileSync(file, 'utf8');
                // compile
                const result = sass.compileString( content, {
                    style:"compressed",
                });
                // write the css to the output file
                fs.writeFileSync(path.join(outputPath, path.basename(file, '.scss') + '.css').replace('_', ''), result.css);
            });
            done(); // gulp is done
        }
    );
});


// Task for compile the utilities css in one file
gulp.task('atomic-utilities-container', function(done) {
    // glob-Pattern for the components
    const componentsPattern = './Scss/utilities-container/**/*.scss';
    const outputPath = './Dist/utilities-container';
    const basePath = path.resolve(process.cwd()) + '/Scss';
    // read component files
    glob(componentsPattern, function(err) {
        if (err) {
            console.error(err);
            done();
            return;
        }
    }).then(
        function (files) {
            files.forEach(file => {
                // read content of component file
                const content = fs.readFileSync(file, 'utf8');
                // compile
                const result = sass.compileString( content, {
                    style:"compressed",
                    loadPaths: [basePath]
                });
                // write the css to the output file
                fs.writeFileSync(path.join(outputPath, path.basename(file, '.scss') + '.css').replace('_', ''), result.css);
            });
            done(); // gulp is done
        }
    );
});

gulp.task('compat', function(done) {
    // glob-Pattern for the components
    const componentsPattern = './T3BoostrapPackage/compat/**/*.scss';
    const outputPath = './Dist/compat';
    const basePath = path.resolve(process.cwd()) + '/Scss';
    const compatPath = path.resolve(process.cwd()) + '/Scss';
    const nodeModulesPath = path.resolve(process.cwd()) + '/node_modules';
    const bsPath = nodeModulesPath + '/bootstrap/scss';
    const templatePath = './Scss/template.scss';

    // read content of template file
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    // read component files
    glob(componentsPattern, function(err) {
        if (err) {
            console.error(err);
            done();
            return;
        }
    }).then(
        function (files) {
            files.forEach(file => {
                console.log(file);
                // read content of component file
                let content = fs.readFileSync(file, 'utf8');
                // add dependencies to the component
                content = templateContent + '\n' + content;
                // compile
                const result = sass.compileString( content, {
                    style:"compressed",
                    loadPaths: [basePath, compatPath, nodeModulesPath, bsPath]
                });
                // write the css to the output file
                try {
                    fs.mkdirSync(outputPath, { recursive: true });
                } catch (err) {
                    if (err) throw err;
                }
                fs.writeFileSync(path.join(outputPath, path.basename(file, '.scss') + '.css').replace('_', ''), result.css);
            });
            done(); // gulp is done
        }
    );
});


// Task for compile the utilities css in one file
gulp.task('vars', function(done) {
    // glob-Pattern for the components
    const componentsPattern = './Scss/vars/**/*.scss';
    const outputPath = './Dist/vars';

    // read component files
    glob(componentsPattern, function(err) {
        if (err) {
            console.error(err);
            done();
            return;
        }
    }).then(
        function (files) {
            files.forEach(file => {
                // read content of component file
                const content = fs.readFileSync(file, 'utf8');
                // compile
                const result = sass.compileString( content, {
                    style:"compressed",
                });
                // write the css to the output file
                fs.writeFileSync(path.join(outputPath, path.basename(file, '.scss') + '.css').replace('_', ''), result.css);
            });
            done(); // gulp is done
        }
    );
});

gulp.task('helpers', function(done) {
    // glob-Pattern for the components
    const componentsPattern = './Scss/helpers/**/*.scss';
    console.log(componentsPattern);
    // paths
    const templatePath = './Scss/template.scss';
    const outputPath = './Dist/helpers';
    const basePath = path.resolve(process.cwd()) + '/Scss';
    const nodeModulesPath = path.resolve(process.cwd()) + '/node_modules';
    const bsPath = nodeModulesPath + '/bootstrap/scss';

    // read content of template file
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    // read component files
    glob(componentsPattern, function(err) {
        if (err) {
            console.error(err);
            done();
            return;
        }
    }).then(
        function (files) {
            files.forEach(file => {
                console.log(file);
                // read content of component file
                const componentContent = fs.readFileSync(file, 'utf8');
                // add dependencies to the component
                const combinedContent = templateContent + '\n' + componentContent;
                // compile the scss to css
                const result = sass.compileString( combinedContent, {
                    style:"compressed",
                    loadPaths: [nodeModulesPath,basePath, bsPath]
                });
                // write the css to the output file
                fs.writeFileSync(path.join(outputPath, path.basename(file, '.scss') + '.css').replace('_', ''), result.css);
            });
            done(); // gulp is done
        }
    );
});
// task for compile the components
gulp.task('components', function(done) {
    // glob-Pattern for the components
    const componentsPattern = process.env.COMPONENT_PATH +'/**/*.scss';
    console.log(componentsPattern);
    // paths
    const templatePath = './Scss/template.scss';
    const outputPath = './Dist/components';
    const basePath = path.resolve(process.cwd()) + '/Scss';
    const nodeModulesPath = path.resolve(process.cwd()) + '/node_modules';
    const bsPath = nodeModulesPath + '/bootstrap/scss';

    // read content of template file
    const templateContent = fs.readFileSync(templatePath, 'utf8');

    // read component files
    glob(componentsPattern, function(err) {
        if (err) {
            console.error(err);
            done();
            return;
        }
    }).then(
        function (files) {
            files.forEach(file => {
                console.log(file);
                // read content of component file
                const componentContent = fs.readFileSync(file, 'utf8');
                // add dependencies to the component
                const combinedContent = templateContent + '\n' + componentContent;
                // compile the scss to css
                const result = sass.compileString( combinedContent, {
                    style:"compressed",
                    loadPaths: [nodeModulesPath,basePath, bsPath]
                });
                // write the css to the output file
                fs.writeFileSync(path.join(outputPath, path.basename(file, '.scss') + '.css').replace('_', ''), result.css);
            });
            done(); // gulp is done
        }
    );
});

// gulp.task('watch', function() {
//     gulp.watch('path/to/scss/**/*.scss', gulp.series('scss-to-css'));
// });

// Standard-Task
gulp.task('default', gulp.series('base','default-vars', 'utilities','atomic-utilities','atomic-utilities-container','helpers','plugins','components', 'compat','vars'));
