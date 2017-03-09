class Eliza {
    script: Object;
    constructor(_script: Object) {
        this.script = _script;
    }
    getResponse(input: string): string {
        let decompositionRules: string[] = this.getDecompositionRules(input);
        let reassemblyRule: string = this.getReassemblyRule(input, decompositionRules);
        return this.reassemble(input, reassemblyRule);
    }
    getDecompositionRules(input: string): string[] {
        let result: string[];
        for (let word of input) {
            if (this.script[word]) {
                result.push(this.script[word]);
            }
        }
        return result;
    }
    getReassemblyRule(input: string, decompositionRules: string[]): string {}
    reassemble(input: string, reassemblyRule: string): string {}
}