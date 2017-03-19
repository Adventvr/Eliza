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
            let rules = this.buildRules(data[x][2]);
            let k = new KeywordData(data[x][0], data[x][1], rules);
            this.script.set(k.keyword, k);
        }
    }
    buildRules(rules) {
        let result = [];
        for (let rule of rules) {
            let r = new Rule(rule);
            result.push(r);
        }
        return result;
    }
    getResponse(input) {
        input = this.sanatize(input);
        let decompositionRules = this.getDecompositionRules(input);
        if (decompositionRules == null)
            return genericResponses[this.randomNumIncl(0, genericResponses.length - 1)];
        let decompositionRule = this.getDecompositionRule(input, decompositionRules);
        let reassemblyRule = this.getReassemblyRule(input, decompositionRule);
        if (reassemblyRule == null)
            return genericResponses[this.randomNumIncl(0, genericResponses.length - 1)];
        return this.reassemble(input, reassemblyRule, decompositionRule.decompRule);
    }
    sanatize(input) {
        return input.replace(/[\.,\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
    }
    /* find highest priority keywords and get associated decomp rules */
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
    /* return 1st decomp rule that matches input */
    getDecompositionRule(input, rules) {
        for (let rule of rules) {
            let regex = this.getRegExp(rule.decompRule);
            if (regex.test(input)) {
                return rule;
            }
        }
    }
    getReassemblyRule(input, rule) {
        return rule.reassembRules[this.randomNumIncl(1, rule.reassembRules.length - 1)];
    }
    getRegExp(input) {
        let transform = input.replace(/\*/g, '.*');
        return new RegExp(transform);
    }
    randomNumIncl(min, max) {
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
    reassemble(input, reassembRule, decompRule) {
        // find number (n) in reassemb rule
        let match = /\([0-9]\)/g.exec(reassembRule);
        if (match == null)
            return reassembRule;
        let wordNum = Number(match[0][1]);
        // split decompRule and find nth grouping
        let decompArr = decompRule.split('*').map(x => x.trim());
        decompArr = decompArr.filter(x => x != '');
        let inputArr = input.split(decompArr[0]).map(x => x.trim());
        let replacement = inputArr[wordNum - 1];
        return reassembRule.replace(/\([0-9]\)/g, replacement);
    }
}
class KeywordData {
    constructor(_keyword, _priority, _rules) {
        this.keyword = _keyword;
        this.priority = _priority;
        this.rules = _rules;
    }
}
class Rule {
    constructor(rule) {
        this.decompRule = rule[0];
        this.reassembRules = rule[1];
    }
}
/*
keyword input = [[keyword, priority, [[D, [R...]], ..., [D, [R...]], ...]]
transform it to:
script = { KeywordData.keyword: KeywordData, ... }
*/ 
