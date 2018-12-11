const _ = require('lodash');

const types = {
  address: 'Address',
  string: 'String',
  bool: 'Boolean',
};

function stringifyType(type) {
  let formattedType = type;
  if (formattedType.startsWith('uint')) {
    const bits = formattedType.split('uint')[1];
    if (bits) {
      return `UInt${bits}`;
    }
    return `UInt`;
  }
  if (formattedType.startsWith('int')) {
    const bits = formattedType.split('int')[1];
    if (bits) {
      return `Int${bits}`;
    }
    return `Int`;
  }
  if (formattedType.startsWith('bytes')) {
    const bytes = formattedType.split('bytes')[1];
    return `Bytes${bytes}`;
  }

  const isArray = _.includes(formattedType, '[]');
  if (isArray) {
    formattedType = formattedType.split('[]')[0];
  }
  const stringifiedType = types[formattedType];
  if (!stringifiedType) {
    throw new Error(`Don't know how to stringify: ${type}.`);
  }

  if (isArray) {
    return `${stringifiedType}[]`;
  }
  return stringifiedType;
}

function abiEntryToString(entry, config) {
  const name = entry.name;
  const methodConfig = config.methods[name];
  // Considered relevant if it is set (even with empty string)
  const description =
    (_.isString(methodConfig) && `// ${methodConfig}\n`) || '';
  const inputs = entry.inputs || [];
  const outputs = entry.outputs || [];
  const isEvent = entry.type === 'event';

  if (!name) {
    return null;
  }

  const args = inputs
    .map((input, idx) => {
      const inputType = stringifyType(input.type);
      const inputName = input.name;

      return `${inputName}: ${inputType}`;
    })
    .join(', ');

  const isTuple = outputs.length > 1;
  let returns = outputs
    .map((output, idx) => {
      const outputName = output.name;
      const outputType = stringifyType(output.type);
      const nameColon = output.name ? ': ' : '';

      return `${outputName}${nameColon}${outputType}`;
    })
    .join(', ');

  if (!returns) {
    returns = 'void';
  }
  if (isTuple) {
    returns = `(${returns})`;
  }

  if (isEvent) {
    return `${description}event ${name}(${args})`;
  }

  return `${description}function ${name}(${args}) => ${returns}`;
}

function stringifyContractAbi(artifact, abiConfig) {
  const contractName = artifact.contractName;
  const abi = artifact.abi;
  const config = {
    methods: {},
    ...abiConfig,
  };

  const relevantMethodsAbi = _.filter(
    abi,
    ({ name }) => !config.methods || !!config.methods[name]
  );
  const otherMethodsAbi = _.filter(abi, ({ name }) => !config.methods[name]);

  let relevantViewMethods = _.filter(
    relevantMethodsAbi,
    ({ stateMutability }) => stateMutability === 'view'
  ).map(abiEntry => abiEntryToString(abiEntry, config));

  let relevantMethods = _.filter(
    relevantMethodsAbi,
    ({ stateMutability }) => stateMutability === 'nonpayable'
  ).map(abiEntry => abiEntryToString(abiEntry, config));

  let events = _.filter(abi, ({ type }) => type === 'event').map(abiEntry =>
    abiEntryToString(abiEntry, config)
  );

  let otherViewMethods = _.filter(
    otherMethodsAbi,
    ({ stateMutability }) => stateMutability === 'view'
  ).map(abiEntry => abiEntryToString(abiEntry, config));

  let otherMethods = _.filter(
    otherMethodsAbi,
    ({ stateMutability }) => stateMutability === 'nonpayable'
  ).map(abiEntry => abiEntryToString(abiEntry, config));

  relevantViewMethods = _.sortBy(_.compact(relevantViewMethods)).join('\n');
  relevantMethods = _.sortBy(_.compact(relevantMethods)).join('\n');
  events = _.sortBy(_.compact(events)).join('\n');
  otherViewMethods = _.sortBy(_.compact(otherViewMethods)).join('\n');
  otherMethods = _.sortBy(_.compact(otherMethods)).join('\n');

  const description = config.description || '*TODO: Add description*';

  return (
    `# ${contractName}\n\n` +
    `${description}\n\n` +
    '## Methods\n\n' +
    '```ts\n' +
    ((relevantViewMethods.length && '/* == Read-Only methods == */\n') || '') +
    `${relevantViewMethods}\n\n` +
    ((relevantMethods.length && '/* == Can mutate state == */\n') || '') +
    `${relevantMethods}\n\n` +
    '```\n\n' +
    '<details><summary>Other methods</summary>\n\n' +
    '```ts\n' +
    ((otherViewMethods.length && '/* == Read-Only methods == */\n') || '') +
    `${otherViewMethods}\n\n` +
    ((otherMethods.length && '/* == Can mutate state == */\n') || '') +
    `${otherMethods}\n\n` +
    '```\n\n' +
    '</details>\n\n' +
    '## Events\n\n' +
    '```ts\n' +
    `${events}\n\n` +
    '```'
  );
}

module.exports = stringifyContractAbi;
