class Eliza {
    script: Object;
    constructor(keywordData: Object[]) {
        this.buildScript(keywordData);
    }
    buildScript(data): void {
        for (let x = 0; x < data.length; x++) {
            let k = new KeywordData(data[x][0], data[x][1], data[x][2]);
            this.script[k.keyword] = k;
        }
    }
    getResponse(input: string): string {
        let decompositionRules: string[][] = this.getDecompositionRules(input);
        let reassemblyRule: string = this.getReassemblyRule(input, decompositionRules);
        return this.reassemble(input, reassemblyRule);
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

    }
    reassemble(input: string, reassemblyRule: string): string {}
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
keyword input = [[keyword, priority, [D, R...], ..., [D, R...]], ...]
transform it to:
script = { KeywordData.keyword: KeywordData, ... }
*/