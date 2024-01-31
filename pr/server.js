const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const formidable = require("formidable");
const fs = require("fs");
const { spawn } = require("child_process");

var php = require("node-php");
app.use(cors());
app.use(express.json());
app.use(express.static("static"));
app.use("/static", express.static("static"));
app.get("/", (req, res) => {
    console.log(req);
    res.sendFile(path.join(__dirname, `/static/index.html`));
});

app.post("/upload", (req, res) => {
    let form = formidable({});
    form.multiples = true;
    form.uploadDir = __dirname + "/static/upload/"; // folder do zapisu zdjęcia
    form.keepExtensions = true;
    form.on("fileBegin", function (name, file) {
        file.path = form.uploadDir + "/" + file.name;
    });
    form.parse(req, function (err, fields, files) {
        res.sendFile(path.join(__dirname, `/static/index.html`));
    });
});

app.get("/run", (req, res) => {
    let { name } = req.query;

    let process = spawn("C:\\php-8.3.2-Win32-vs16-x64\\php.exe", [path.join(__dirname, `/static/upload/${name}`)]);
    process.stdout.on("data", (data) => {
        res.send(data.toString());
    });
});

app.get("/deleteFile", (req, res) => {
    const { name } = req.query;

    console.log(req.query);
    console.log(path.join(__dirname, `/static/upload/${name}`));
    if (name && fs.existsSync(path.join(__dirname, `/static/upload/${name}`))) {
        fs.unlink(path.join(__dirname, `/static/upload/${name}`), (err) => {
            if (err) {
                fs.rmdir(path.join(__dirname, `/upload/${name}`), { recursive: true }, (err) => {
                    if (err) throw err;
                });
            }
        });
        res.sendFile(path.join(__dirname, `/static/index.html`));
    } else {
        res.sendFile(path.join(__dirname, `/static/index.html`));
    }
});

app.get("/getNames", (req, res) => {
    let filenames = fs.readdirSync(path.join(__dirname, `/static/upload/`));

    res.json({ files: filenames });
});

app.post("/addFile", (req, res) => {
    const { name } = req.query;
    if (name == undefined) {
        res.json({ message: "not a valid name" });
    }

    if (!fs.existsSync(path.join(__dirname, `/upload/${name}`))) {
        fs.writeFile(path.join(__dirname, `/upload/${name}`), "created at " + Date.now(), (err) => {
            if (err) throw err;
            console.log("jest");
        });
    } else {
        fs.writeFile(path.join(__dirname, `/upload/${name + Date.now()}`), "created at " + Date.now(), (err) => {
            if (err) throw err;
            console.log("jest");
        });
    }
});

app.listen(3334, "0.0.0.0", () => {
    console.log("running on 3333");
});
