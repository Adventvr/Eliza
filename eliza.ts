class Eliza {
    script: Map<string, KeywordData>;
    constructor(keywordData: [string, number, string[]]) {
        this.buildScript(keywordData);
    }
    buildScript(data: [string, number, string[]]): void {
        for (let x = 0; x < data.length; x++) {
            let k = new KeywordData(data[x][0], data[x][1], data[x][2]);
            this.script.set(k.keyword, k);
        }
    }
    getResponse(input: string): string {
        input = this.sanatize(input);
        let decompositionRules: string[][] = this.getDecompositionRules(input);
        let reassemblyRule: string = this.getReassemblyRule(input, decompositionRules);
        if (reassemblyRule == null)
            return this.genericResponse[this.randomNumIncl(0, this.genericResponse.length-1)];
        return this.reassemble(input, reassemblyRule);
    }
    sanatize(input: string): string {
        return input.replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    }
    getDecompositionRules(input: string): string[][] {
        let result: string[][];
        let maxPriority: number = -1;
        for (let word of input) {
            if (this.script[word] && this.script[word].priority > maxPriority) {
                result = this.script[word].rules;
                maxPriority = this.script[word].priority;
            }
        }
        return result;
    }
    getReassemblyRule(input: string, decompositionRules: string[][]): string {
        let reassembRules: string[];
        for (let arr of decompositionRules) {
            let regex: RegExp = this.getRegExp(arr[0]);
            if (regex.test(input)) {
                return arr[this.randomNumIncl(1, arr.length-1)];
            }
        }
        return null;
    }
    getRegExp(input: string): RegExp {
        let transform: string = input.replace("*", ".+");
        return new RegExp(transform);
    }
    randomNumIncl(min: number, max: number): number {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
    reassemble(input: string, reassemblyRule: string): string {
        let regex: RegExp = /\((0-9)\)/;
        let words: string[] = input.split(/\s+/);
        // replace all (n) in input with words[n], where n is a # between 0 and 9
        let result: string = reassemblyRule.replace(regex, (match, p) => words[p[1]]);
        return result;
    }
}

class KeywordData {
    keyword: string;
    priority: number;
    rules: string[][];
    constructor(_keyword, _priority, _rules) {
        this.keyword = _keyword;
        this.priority = _priority;
        this.rules = _rules;
    }
}

/*
keyword input = [[keyword, priority, [[D, R...], ..., [D, R...]], ...]]
transform it to:
script = { KeywordData.keyword: KeywordData, ... }
*/