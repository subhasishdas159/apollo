const { SchemaDirectiveVisitor } = require('apollo-server');

class HasScopeCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { scope } = this.args

    field.resolve = async function (...args) {
      // return result;
      const context = args[2]
      const token = context.token

      if(!token) {
      	throw Error("token not found")
      }

      if(token === "54321") {
      	return resolve.apply(this, args);
      } else {
      	throw new Error("auth not okay")
      }

    };

  }
}

module.exports = HasScopeCaseDirective