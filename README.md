ELIZA

A Typescript implementation of the ELIZA chatbot.

## Background

ELIZA was an early natural language processing computer program created by Joseph Weizenbaum
in the 1960s. The program allows users to have a simple conversation with a computer. A user 
enters a statement and the program analyzes that statement and gives a response.

The program analyzes user statements by searching for keywords. When a keyword is found,
the user's statement is transformed according to a rule associated with that keyword.
If no keyword is found, the program returns a general remark or an earlier transformation.
Weizenbaum uses the word "script" to describe a set of keywords and their associated
transformation rules.

Each keyword is given a rank. If a user statement contains multiple keywords, then a the highest
ranked keyword is used for the transformation. Furthermore, the program uses a comma or period 
as a delimiter. As the program scans a user statement from left to right, if it encounters a
delimiter and has already found a keyword, it deletes all text after the delimiter. If no
keyword has been found, then all text before the delimiter is deleted. By doing this, only
single phrases or sentences are transformed.  

Transformations are a combination of keywords, decomposition rules, and reassembly rules.
A decomposition rule is used to break down a user's input and see if it matches certain criteria. 
If the input matches the criteria, an associated reassembly rule is used to create the response.
Only decomposition rules containing keywords present in the user input need to be tried.

Examples:
1.
User input: It seems you hate me
Keywords: YOU, ME
Decomposition rule: (0 YOU 0 ME), where 0 = an indefinite # of words
Reassembly rule: (What makes you think I 3 you), where 3 is a 0 index word 
                                                position in the user input (hate)
Response: What makes you think I hate you

2.
User input: It seems you love and hate me
Keywords: YOU, ME
Decomposition rule: (0 YOU 1 ME), where 1 = one word
Reassembly rule: (What makes you think I 3 you), where 3 is a 0 index word 
                                                position in the user input (hate)
Response: The program would return a generic response or a previous tranformation
Explanation: Since there is more than a single word between YOU and ME in the user input,
             the decomposition rule did not have its criteria met

List Representation:
K = Keyword, Di = i'th Decomposition rule, Rij = j'th Reassembly rule associated with the i'th D
(K  (D1, R11, ... R1m)
    (D2, R11, ... R2m)
    .             .
    .             .
    (Dn, Rn1, ... Rnm))

Practical Representation:
A HashMap stores {K: (Di, Ri1, ..., Rij)} key-value pairs. The keyword is used as the key and the
list is used as the value.


