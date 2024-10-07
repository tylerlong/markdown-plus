import { run } from 'shell-commands';

const main = async () => {
  // because parcel doesn't support unicode as variable name
  await run(`sed -i '' 's/µ/mu/g' node_modules/d3/d3.js`);
  await run(`sed -i '' 's/σ/sigma/g' node_modules/d3/d3.js`);
};
main();
