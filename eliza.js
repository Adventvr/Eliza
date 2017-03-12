import { elizaKeywords, genericResponses } from './keywords';
export class Eliza {
    constructor(keywordData) {
        this.script = new Map();
        if (!keywordData)
            keywordData = elizaKeywords;
        this.buildScript(keywordData);
    }
    buildScript(data) {
        for (let x = 0; x < data.length; x++) {
            let k = new KeywordData(data[x][0], data[x][1], data[x][2]);
            this.script.set(k.keyword, k);
        }
    }
    getResponse(input) {
        input = this.sanatize(input);
        let decompositionRules = this.getDecompositionRules(input);
        if (decompositionRules == null)
            return genericResponses[this.randomNumIncl(0, genericResponses.length - 1)];
        let reassemblyRule = this.getReassemblyRule(input, decompositionRules);
        if (reassemblyRule == null)
            return genericResponses[this.randomNumIncl(0, genericResponses.length - 1)];
        return this.reassemble(input, reassemblyRule);
    }
    sanatize(input) {
        return input.replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()]/g, '');
    }
    getDecompositionRules(input) {
        let result;
        let maxPriority = -1;
        let words = input.split(' ');
        for (let word of words) {
            if (this.script.get(word) && this.script.get(word).priority > maxPriority) {
                result = this.script.get(word).rules;
                maxPriority = this.script.get(word).priority;
            }
        }
        return result;
    }
    getReassemblyRule(input, decompositionRules) {
        let reassembRules;
        for (let arr of decompositionRules) {
            let regex = this.getRegExp(arr[0]);
            if (regex.test(input)) {
                return arr[1][this.randomNumIncl(1, arr[1].length - 1)];
            }
        }
        return null;
    }
    getRegExp(input) {
        let transform = input.replace('*', '.+');
        return new RegExp(transform);
    }
    randomNumIncl(min, max) {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
    reassemble(input, reassemblyRule) {
        let regex = /\((0-9)\)/;
        let words = input.split(/\s+/);
        // replace all (n) in input with words[n], where n is a # between 0 and 9
        let result = reassemblyRule.replace(regex, (match, p) => words[p[1]]);
        return result;
    }
}
class KeywordData {
    constructor(_keyword, _priority, _rules) {
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
