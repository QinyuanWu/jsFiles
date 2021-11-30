//run this script at the root folder level

let fs = require("fs");
let path = require("path");

let stats = {
  extension_count: 0,
  cs: {
    direct_dangers: {
      total_count: 0,
      dangers: {
        danger_name: {},
        details: [],
      },
    },
    indirect_dangers: {
      total_count: 0,
      dangers: {
        danger_name: {},
        details: [],
      },
    },
    exfiltration_dangers: {
      total_count: 0,
      dangers: {
        danger_name: {},
        details: [],
      },
    },
  },
  bp: {
    direct_dangers: {
      total_count: 0,
      dangers: {
        danger_name: {},
        details: [],
      },
    },
    indirect_dangers: {
      total_count: 0,
      dangers: {
        danger_name: {},
        details: [],
      },
    },
    exfiltration_dangers: {
      total_count: 0,
      dangers: {
        danger_name: {},
        details: [],
      },
    },
  },
};

function getStats() {
  const folders = fs.readdirSync(__dirname);
  folders.forEach((folder) => {
    if (fs.statSync(path.join(__dirname, folder)).isDirectory()) {
      readFile(folder);
    }
  });
  const output = JSON.stringify(stats, null, 4);
  fs.writeFileSync("stats.json", output);
}

function readFile(dirName) {
  const files = fs.readdirSync(path.join(__dirname, dirName));
  files.forEach((fileName) => {
    if (fileName === "analysis.json") {
      console.log("Update stats for ", dirName);
      const file = fs.readFileSync(
        path.join(__dirname, dirName, fileName),
        "utf-8"
      );
      updateStats(JSON.parse(file));
    }
  });
}

function updateStats(data) {
  stats.extension_count++;
  for (const dangerType in data.cs) {
    if (Object.keys(data.cs[dangerType]).length !== 0) {
      for (const danger in data.cs[dangerType]) {
        processDanger("cs", dangerType, data.cs[dangerType][danger]);
      }
    }
  }
  for (const dangerType in data.bp) {
    if (Object.keys(data.bp[dangerType]).length !== 0) {
      for (const danger in data.bp[dangerType]) {
        processDanger("bp", dangerType, data.bp[dangerType][danger]);
      }
    }
  }
}

function processDanger(script, dangerType, dangerDetails) {
  let dangerStats = stats[script][dangerType];
  let dangerName = dangerDetails.danger;
  dangerStats.total_count++;
  if (dangerStats.dangers.danger_name[dangerName] !== undefined) {
    dangerStats.dangers.danger_name[dangerName]++;
  } else {
    dangerStats.dangers.danger_name[dangerName] = 1;
  }
  dangerStats.dangers.details.push(dangerDetails);
}

getStats();
