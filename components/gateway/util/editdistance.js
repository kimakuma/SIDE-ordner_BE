class hooks {
    constructor() {
        if (!(this instanceof hooks)) {
            return new hooks();
        }

        this.root = {
            children: {},
        };
        return this;
    }
    insert(word, value) {
        _insert_node(this.root, word, value);
    }
    lookup(word, maxcost) {
        // lookup edit-distance
        var results = [];

        var crow = [];
        for (var i = 0; i < word.length + 1; i++) {
            crow.push(i);
        }

        // search root trie
        var nodes = [];
        for (var letter in this.root.children) {
            var child = this.root.children[letter];
            child.letter = letter;
            nodes.push(child);
        }

        var stacks = [];
        stacks.push({
            row: crow,
            nodes: nodes,
        });

        while (true) {
            var stack = stacks.shift();
            if (stack === undefined) {
                break;
            }

            for (var i = 0; i < stack.nodes.length; i++) {
                var node = stack.nodes[i];

                var columns = word.length + 1;
                var crow = [stack.row[0] + 1];

                for (var j = 1; j < columns; j++) {
                    var icost = crow[j - 1] + 1;
                    var dcost = stack.row[j] + 1;

                    var rcost = 0;
                    if (word.charAt(j - 1) !== node.letter.charAt(0)) {
                        rcost = stack.row[j - 1] + 1;
                    } else {
                        rcost = stack.row[j - 1];
                    }

                    // console.log(Math.min(icost, dcost, rcost));
                    crow.push(Math.min(icost, dcost, rcost));
                }

                // console.log('last:', crow[crow.length-1]);
                var cost = crow[crow.length - 1];
                if (cost <= maxcost && node.value !== undefined) {
                    // console.log('word:', node.word, ', cost: ', cost);
                    results.push({
                        cost: cost,
                        value: node.value,
                    });
                }

                // console.log('min:', Math.min.apply(null, crow));
                if (Math.min.apply(null, crow) <= maxcost) {
                    var nodes = [];
                    for (var letter in node.children) {
                        var child = node.children[letter];
                        child.letter = letter;
                        nodes.push(child);
                    }
                    stacks.push({
                        row: crow,
                        nodes: nodes,
                    });
                }
            }
        }

        return results;
    }
}

function _insert_node(node, word, value) {
  for (var i = 0; i < word.length; i++) {
    var letter = word[i];
    if (node.children[letter] === undefined) {
      node.children[letter] = {
        children: {},
      };
    }

    node = node.children[letter];
  }

  node.value = value;
}



export default hooks;
