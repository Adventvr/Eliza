import { elizaKeywords, genericResponses } from './keywords';

export class Eliza {
    script: Map<string, KeywordData> = new Map();
    constructor(keywordData: [string, number, [string, string[]][]][]) {
        if (!keywordData)
            keywordData = elizaKeywords;
        this.buildScript(keywordData);
    }
    buildScript(data: [string, number, [string, string[]][]][]): void {
        for (let x = 0; x < data.length; x++) {
            let k = new KeywordData(data[x][0], data[x][1], data[x][2]);
            this.script.set(k.keyword, k);
        }
    }
    getResponse(input: string): string {
        input = this.sanatize(input);
        let decompositionRules: [string, string[]][] = this.getDecompositionRules(input);
        if (decompositionRules == null)
            return genericResponses[this.randomNumIncl(0, genericResponses.length-1)];
        let reassemblyRule: string = this.getReassemblyRule(input, decompositionRules);
        if (reassemblyRule == null)
            return genericResponses[this.randomNumIncl(0, genericResponses.length-1)];
        return this.reassemble(input, reassemblyRule);
    }
    sanatize(input: string): string {
        return input.replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    }
    getDecompositionRules(input: string): [string, string[]][] {
        let result: [string, string[]][];
        let maxPriority: number = -1;
        let words: string[] = input.split(' ');
        for (let word of words) {
            if (this.script.get(word) && this.script.get(word).priority > maxPriority) {
                result = this.script.get(word).rules;
                maxPriority = this.script.get(word).priority;
            }
        }
        return result;
    }
    getReassemblyRule(input: string, decompositionRules: [string, string[]][]): string {
        let reassembRules: string[];
        for (let arr of decompositionRules) {
            let regex: RegExp = this.getRegExp(arr[0]);
            if (regex.test(input)) {
                return arr[1][this.randomNumIncl(1, arr[1].length-1)];
            }
        }
        return null;
    }
    getRegExp(input: string): RegExp {
        let transform: string = input.replace('*', '.+');
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
    rules: [string, string[]][];
    constructor(_keyword: string, _priority: number, _rules: [string, string[]][]) {
        this.keyword = _keyword;
        this.priority = _priority;
        this.rules = _rules;
    }
}

/*
keyword input = [[keyword, priority, [[D, [R...]], ..., [D, [R...]], ...]]
transform it to:
script = { KeywordData.keyword: KeywordData, ... }
*/