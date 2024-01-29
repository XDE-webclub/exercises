const fs = require('fs');
const path = require('path');

function parseInputText(inputText) {
    const pattern = /##\s*(.*?)\s*###\s*描述\s*([\s\S]*?)\s*###\s*题解（Python）\s*```python\s*([\s\S]*?)\s*```/sg;
    const matches = inputText.matchAll(pattern);

    return [...matches].map(([fullMatch, title, desc, pythonCode]) => ({
        "标题": title.trim(),
        "描述": desc.trim(),
        "python_code": pythonCode.trim(),
    }));
}

function readAndParseFile(fileName) {
    const level = path.basename(fileName, '.md').split("_")[1];

    try {
        const inputText = fs.readFileSync(fileName, 'utf-8');
        return parseInputText(inputText).map(item => ({
            "title": item["标题"],
            "description": item["描述"],
            "python_code": item["python_code"],
            "level": level,
        }));
    } catch (error) {
        console.error(`Error processing file ${fileName}: ${error.message}`);
        return [];
    }
}

const sourceDataDir = path.join(__dirname, "./source_data");
const files = fs.readdirSync(sourceDataDir).filter(file => file.endsWith('.md'));

const problemsData = files.flatMap(fileName => readAndParseFile(path.join(sourceDataDir, fileName)));

const outputPath = "data_file.json";

fs.writeFileSync(outputPath, JSON.stringify(problemsData, null, 2), 'utf-8');

