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
            let rules: Rule[] = this.buildRules(data[x][2]);
            let k = new KeywordData(data[x][0], data[x][1], rules);
            this.script.set(k.keyword, k);
        }
    }
    buildRules(rules: [string, string[]][]): Rule[] {
        let result: Rule[] = [];
        for (let rule of rules) {
            let r: Rule = new Rule(rule);
            result.push(r);
        }
        return result;
    }
    getResponse(input: string): string {
        input = this.sanatize(input);
        let decompositionRules: Rule[] = this.getDecompositionRules(input);
        if (decompositionRules == null)
            return genericResponses[this.randomNumIncl(0, genericResponses.length-1)];
        let decompositionRule = this.getDecompositionRule(input, decompositionRules);
        let reassemblyRule: string = this.getReassemblyRule(input, decompositionRule);
        if (reassemblyRule == null)
            return genericResponses[this.randomNumIncl(0, genericResponses.length-1)];
        return this.reassemble(input, reassemblyRule, decompositionRule.decompRule);
    }
    sanatize(input: string): string {
        return input.replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
    }
    /* find highest priority keywords and get associated decomp rules */
    getDecompositionRules(input: string): Rule[] {
        let result: Rule[];
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
    /* return 1st decomp rule that matches input */
    getDecompositionRule(input: string, rules: Rule[]): Rule {
        for (let rule of rules) {
            let regex: RegExp = this.getRegExp(rule.decompRule);
            if (regex.test(input)) {
                return rule;
            }
        }
    }
    getReassemblyRule(input: string, rule: Rule): string {
        return rule.reassembRules[this.randomNumIncl(1, rule.reassembRules.length-1)];
    }
    getRegExp(input: string): RegExp {
        let transform: string = input.replace(/\*/g, '.*');
        return new RegExp(transform);
    }
    randomNumIncl(min: number, max: number): number {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
    reassemble(input: string, reassembRule: string, decompRule: string): string {
        // find number (n) in reassemb rule
        let match: RegExpExecArray = /\([0-9]\)/g.exec(reassembRule);
        if (match == null)
            return reassembRule;
        
        let wordNum: number = Number(match[0][1]);

        // split decompRule and find nth grouping
        let decompArr: string[] = decompRule.split('*').map(x => x.trim());
        decompArr = decompArr.filter(x => x != '');
       
        let inputArr: string[] = input.split(decompArr[0]).map(x => x.trim());
        let replacement: string = inputArr[wordNum-1];

        return reassembRule.replace(/\([0-9]\)/g, replacement);
    }
}

class KeywordData {
    keyword: string;
    priority: number;
    rules: Rule[];
    constructor(_keyword: string, _priority: number, _rules: Rule[]) {
        this.keyword = _keyword;
        this.priority = _priority;
        this.rules = _rules;
    }
}

class Rule {
    decompRule: string;
    reassembRules: string[];
    constructor(rule: [string, string[]]) {
        this.decompRule = rule[0];
        this.reassembRules = rule[1];
    }
}

/*
keyword input = [[keyword, priority, [[D, [R...]], ..., [D, [R...]], ...]]
transform it to:
script = { KeywordData.keyword: KeywordData, ... }
*/