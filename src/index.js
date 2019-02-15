
require("colors");

const fs = require("fs");
const path = require("path");
const Bale = require("../src/bale");

function help() {
    if(process.argv.includes("-h")) {
        const helpInfo = `
        Options:
            
        -i      Override directory for seeders
        `;
        console.log(`\n\n${helpInfo.trim()}\n`);
        return true;
    }
}

function getSeedersPath() {
    const currentSeederDir = path.join(process.cwd(), "./seeders") ;
    const defaultSeedersDir = path.join(__dirname, "../samples/seeders");
    let argSeederDir;
    const index = process.argv.indexOf("-i");
    if (index >= 0) {
        const valueSeeder = process.argv[index + 1];
        if (!valueSeeder) {
            console.log("Seeder path not found !".red);
            return;
        }
        argSeederDir = path.join(process.cwd(), valueSeeder);
    }
    
    return process.env.NODE_ENV !== "development"? (argSeederDir || currentSeederDir) : defaultSeedersDir;
}

function getOptions() {
    const optionsPath = path.join(process.cwd(), "seeder.config.json");
    try {
        const options = require(optionsPath);
        return options;
    } catch (error) {
        return {};        
    }
}

(function () {

    if (help()) {
        return;
    }

    const seedsPath = getSeedersPath();
    fs.readdir(seedsPath, function (err, files) {
        if (err) {
            console.log("Seeders not found !".red);
            return;
        }
        const bale = new Bale({seedsPath});
        const options = getOptions();
        bale.connect(options)
        .then(function () {
            console.log("conencted")
            for (const file of files) {
                const seeder = require(`${seedsPath}/${file}`);
                bale.use(seeder);
            }
            return bale.run().then(() => console.log('Seeder completed!'.green)).catch(console.log);
        })
        .catch(e => console.log(e.red))
        .then(process.exit)
    });
})()
