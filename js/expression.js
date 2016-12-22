(function ($) {

	if (typeof $.esmool == 'undefined')
		$.esmool = {};

	$.esmool.expression = {};

	var SPACES = /[\s\r\n]/;

	var CHARS = /[A-Za-z\d_]/;

	var OPS = {
		'+' : { PRV: 0, args: 2 },
		'*' : { PRV: 1, args: 2 },
		'!' : { PRV: 2, args: 1 }
	};

	var OP_TEMPLATE = {
		'+' : { type: 'op', OP: '+', children: [] },
		'*' : { type: 'op', OP: '*', children: [] },
		'!' : { type: 'op', OP: '!', children: [] }
	};

	var CHR_TEMPLATE = {
		type: 'chr',
		char: null
	};

	var DELIMITERS = {
		'(' : 10,
		')' : -10
	};

	var isOP = function (c) {
		return !!OPS[c];
	};

	var isSPACE = function (c) {
		return SPACES.test(c);
	};

	var isChar = function (c) {
		return CHARS.test(c);
	};

	var isDELIMITER = function (c) {
		return c == '(' || c == ')';
	};

	var getOPNode = function (op) {
		var template = OP_TEMPLATE[op];
		var json = JSON.stringify(template);
		var node = JSON.parse(json);
		return node;
	};

	var getCharNode = function (c) {
		var json = JSON.stringify(CHR_TEMPLATE);
		var node = JSON.parse(json);
		node.char = c;
		return node;
	};

	var getOPElement = function (op, prv) {
		return {
			op: op,
			PRV: prv
		};
	};

	var handleOP = function (nodeStack, op) {
		var OP = OPS[op];
		var node = getOPNode(op);

		var tmp = [];
		for (var i=0; i<OP.args; i++) {
			var c = nodeStack.pop();
			tmp.push(c);
		}

		for (var i=0; i<OP.args; i++)
			node.children.push(tmp.pop());

		nodeStack.push(node);
	};

	var pushOP = function (nodeStack, opStack, opElement) {
		if (opStack.length == 0) {
			opStack.push(opElement);
			return;
		}

		var topElement = opStack[opStack.length-1];
		if (topElement.PRV <= opElement.PRV) {
			opStack.push(opElement);
			return;
		}

		topElement = opStack.pop();
		handleOP(nodeStack, topElement.op);
		pushOP(nodeStack, opStack, opElement);
	};

	$.esmool.expression.parse = function (expr) {
		var nodeStack = [];
		var opStack = [];
		var prePRV = 0;

		for (var i=0; i<expr.length; i++) {
			var c = expr.charAt(i);

			if (isSPACE(c))
				continue;

			if (isChar(c)) {
				nodeStack.push(getCharNode(c));
				continue;
			}

			if (isOP(c)) {
				var OP = OPS[c];
				var opElement = getOPElement(c, prePRV + OP.PRV);
				pushOP(nodeStack, opStack, opElement);
				continue;
			}

			if (isDELIMITER(c)) {
				prePRV += DELIMITERS[c];
				continue;
			}

			throw new Error('Unkown charactor: ' + c);
		}

		while (!!opStack.length) {
			var topElement = opStack.pop();
			handleOP(nodeStack, topElement.op);
		}

		if (nodeStack.length != 1)
			throw new Error('Syntax error in expression: ' + expr);

		return nodeStack[0];
	};

	$.esmool.expression.evaluate = function (expr, operations) {
		var tree = $.esmool.expression.parse(expr);

		var evaluator = function (node) {
			if (node.type == 'chr')
				return operations[node.char]();

			return operations[node.OP](node.children, evaluator);
		};

		return evaluator(tree);
	};

})(jQuery);