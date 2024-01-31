window.addEventListener("load", async () => {
    let res = await fetch("/getNames", {
        method: "get",
        headers: {
            "Content-type": "application/json",
        },
    });
    let { files } = await res.json();
    let filesDiv = document.querySelector(".files");
    files.map((name) => {
        let liEl = document.createElement("li");
        let aEl = document.createElement("a");
        aEl.href = "/run?name=" + name;
        // aEl.href = "/run/" + name;
        aEl.innerText = name;

        liEl.append(aEl);
        filesDiv.append(liEl);
    });
});
