const { SchemaDirectiveVisitor } = require('apollo-server');

class ReplaceCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { replacement } = this.args

    field.resolve = async function (...args) {
      // const result = await resolve.apply(this, args);
      // return result;

      return replacement
    };

  }
}

module.exports = ReplaceCaseDirective